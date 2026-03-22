-- ============================================================
-- AutoCart — Supabase Database Schema
-- Run this in your Supabase SQL editor to set up the database.
-- All tables use UUID primary keys and include created_at / updated_at.
-- Row-Level Security (RLS) policies are included below each table.
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── profiles ──────────────────────────────────────────────────
-- One profile per user (extends Supabase auth.users)
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL,
  display_name  TEXT NOT NULL,
  bio           TEXT,
  avatar_url    TEXT,
  is_public     BOOLEAN DEFAULT TRUE,
  user_type     TEXT NOT NULL DEFAULT 'user' CHECK (user_type IN ('user', 'creator', 'admin')),
  social_instagram  TEXT,
  social_tiktok     TEXT,
  social_youtube    TEXT,
  social_twitter    TEXT,
  social_website    TEXT,
  follower_count    INTEGER DEFAULT 0,
  following_count   INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: Public profiles are readable by all; users can only edit their own
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable" ON profiles FOR SELECT USING (is_public = TRUE OR auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'New User'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── autocarts ─────────────────────────────────────────────────
CREATE TABLE autocarts (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id          UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  description         TEXT,
  cover_image         TEXT,
  category            TEXT NOT NULL DEFAULT 'meal-prep',
  visibility          TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
  tags                TEXT[] DEFAULT '{}',
  dietary_labels      TEXT[] DEFAULT '{}',
  prep_goal           TEXT NOT NULL DEFAULT 'general',
  servings            INTEGER DEFAULT 1,
  prep_days           INTEGER,
  estimated_total_cost DECIMAL(10,2) DEFAULT 0,
  estimated_cost_per_meal DECIMAL(10,2),
  notes               TEXT,
  likes_count         INTEGER DEFAULT 0,
  saves_count         INTEGER DEFAULT 0,
  views_count         INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER autocarts_updated_at BEFORE UPDATE ON autocarts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Indexes for common query patterns
CREATE INDEX idx_autocarts_creator ON autocarts(creator_id);
CREATE INDEX idx_autocarts_visibility ON autocarts(visibility);
CREATE INDEX idx_autocarts_category ON autocarts(category);
CREATE INDEX idx_autocarts_created_at ON autocarts(created_at DESC);
CREATE INDEX idx_autocarts_likes ON autocarts(likes_count DESC);

-- RLS
ALTER TABLE autocarts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public carts viewable by all" ON autocarts FOR SELECT USING (visibility = 'public' OR auth.uid() = creator_id);
CREATE POLICY "Users create own carts" ON autocarts FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "Users update own carts" ON autocarts FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "Users delete own carts" ON autocarts FOR DELETE USING (auth.uid() = creator_id);

-- ─── cart_items ─────────────────────────────────────────────────
CREATE TABLE cart_items (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id             UUID NOT NULL REFERENCES autocarts(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  quantity            DECIMAL(10,3) NOT NULL DEFAULT 1,
  unit                TEXT NOT NULL DEFAULT 'count',
  category            TEXT NOT NULL DEFAULT 'pantry',
  estimated_price     DECIMAL(10,2) NOT NULL DEFAULT 0,
  preferred_brand     TEXT,
  acceptable_substitutions TEXT[] DEFAULT '{}',
  notes               TEXT,
  -- Nutrition (per serving)
  calories            INTEGER,
  protein_g           DECIMAL(6,2),
  carbs_g             DECIMAL(6,2),
  fat_g               DECIMAL(6,2),
  fiber_g             DECIMAL(6,2),
  sort_order          INTEGER DEFAULT 0,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
-- Inherit visibility from parent cart
CREATE POLICY "Cart items follow cart visibility" ON cart_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM autocarts WHERE autocarts.id = cart_id AND (autocarts.visibility = 'public' OR autocarts.creator_id = auth.uid())));
CREATE POLICY "Cart owners manage items" ON cart_items FOR ALL
  USING (EXISTS (SELECT 1 FROM autocarts WHERE autocarts.id = cart_id AND autocarts.creator_id = auth.uid()));

-- ─── retailer_skus ──────────────────────────────────────────────
-- Retailer-specific product mappings per cart item
CREATE TABLE retailer_skus (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_item_id    UUID NOT NULL REFERENCES cart_items(id) ON DELETE CASCADE,
  retailer_id     TEXT NOT NULL,
  sku             TEXT NOT NULL,
  product_name    TEXT,
  product_url     TEXT,
  image_url       TEXT,
  current_price   DECIMAL(10,2),
  in_stock        BOOLEAN DEFAULT TRUE,
  last_checked    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_item_id, retailer_id)
);

-- ─── substitution_rules ──────────────────────────────────────────
CREATE TABLE substitution_rules (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id     UUID NOT NULL REFERENCES autocarts(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,   -- dietary label triggering this rule
  active      BOOLEAN DEFAULT FALSE,
  replacements JSONB DEFAULT '[]',  -- [{originalItem, substituteItem, notes}]
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── favorites ───────────────────────────────────────────────────
CREATE TABLE favorites (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cart_id     UUID NOT NULL REFERENCES autocarts(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, cart_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own favorites" ON favorites FOR ALL USING (auth.uid() = user_id);

-- ─── likes ───────────────────────────────────────────────────────
CREATE TABLE likes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cart_id     UUID NOT NULL REFERENCES autocarts(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, cart_id)
);

ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own likes" ON likes FOR ALL USING (auth.uid() = user_id);

-- Auto-update likes_count on autocarts when likes changes
CREATE OR REPLACE FUNCTION sync_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE autocarts SET likes_count = likes_count + 1 WHERE id = NEW.cart_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE autocarts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.cart_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_likes_count AFTER INSERT OR DELETE ON likes
  FOR EACH ROW EXECUTE FUNCTION sync_likes_count();

-- Same for saves
CREATE OR REPLACE FUNCTION sync_saves_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE autocarts SET saves_count = saves_count + 1 WHERE id = NEW.cart_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE autocarts SET saves_count = GREATEST(0, saves_count - 1) WHERE id = OLD.cart_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_saves_count AFTER INSERT OR DELETE ON favorites
  FOR EACH ROW EXECUTE FUNCTION sync_saves_count();

-- ─── retailer_products ────────────────────────────────────────────
-- Product catalog for future retailer API integrations
CREATE TABLE retailer_products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  retailer_id   TEXT NOT NULL,
  sku           TEXT NOT NULL,
  name          TEXT NOT NULL,
  brand         TEXT,
  category      TEXT,
  price         DECIMAL(10,2),
  unit          TEXT,
  image_url     TEXT,
  in_stock      BOOLEAN DEFAULT TRUE,
  upc           TEXT,
  calories      INTEGER,
  protein_g     DECIMAL(6,2),
  carbs_g       DECIMAL(6,2),
  fat_g         DECIMAL(6,2),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(retailer_id, sku)
);

CREATE INDEX idx_retailer_products_search ON retailer_products USING gin(to_tsvector('english', name));
CREATE INDEX idx_retailer_products_retailer ON retailer_products(retailer_id);

-- ─── cart_generations ─────────────────────────────────────────────
-- Log of every time a user generates a grocery cart
CREATE TABLE cart_generations (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID REFERENCES profiles(id) ON DELETE SET NULL,
  cart_id           UUID NOT NULL REFERENCES autocarts(id) ON DELETE CASCADE,
  retailer_id       TEXT NOT NULL,
  payload           JSONB,   -- GenerateCartPayload
  result            JSONB,   -- GeneratedCartResult
  retailer_cart_url TEXT,
  estimated_total   DECIMAL(10,2),
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── follows ──────────────────────────────────────────────────────
-- Future follower system (schema-ready but not fully featured yet)
CREATE TABLE follows (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id   UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own follows" ON follows FOR ALL USING (auth.uid() = follower_id);

-- Auto-sync follower counts
CREATE OR REPLACE FUNCTION sync_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET follower_count = follower_count + 1 WHERE id = NEW.following_id;
    UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET follower_count = GREATEST(0, follower_count - 1) WHERE id = OLD.following_id;
    UPDATE profiles SET following_count = GREATEST(0, following_count - 1) WHERE id = OLD.follower_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_follow_counts AFTER INSERT OR DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION sync_follow_counts();

-- ─── Increment views RPC ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION increment_cart_views(cart_id UUID)
RETURNS VOID AS $$
  UPDATE autocarts SET views_count = views_count + 1 WHERE id = cart_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ─── Full-text search on carts ────────────────────────────────────
ALTER TABLE autocarts ADD COLUMN IF NOT EXISTS search_vector TSVECTOR;

CREATE OR REPLACE FUNCTION update_cart_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector = to_tsvector('english', COALESCE(NEW.title, '') || ' ' || COALESCE(NEW.description, '') || ' ' || COALESCE(array_to_string(NEW.tags, ' '), ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cart_search BEFORE INSERT OR UPDATE ON autocarts
  FOR EACH ROW EXECUTE FUNCTION update_cart_search_vector();

CREATE INDEX idx_autocarts_search ON autocarts USING gin(search_vector);
