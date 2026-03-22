'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Instagram, Youtube, Globe, Twitter, TrendingUp, Heart,
  Bookmark, Eye, ArrowLeft, Share2, UserPlus, Edit
} from 'lucide-react'
import { DEMO_USERS, DEMO_CARTS } from '@/lib/seed-data'
import { useAuth } from '@/contexts/AuthContext'
import CartCard from '@/components/autocart/CartCard'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatNumber, getAvatarUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

interface PageProps { params: { username: string } }

export default function ProfilePage({ params }: PageProps) {
  const { username } = params
  const { user: currentUser } = useAuth()

  const profileUser = DEMO_USERS.find(u => u.username === username)
  const [isFollowing, setIsFollowing] = useState(false)
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [likedIds, setLikedIds] = useState<string[]>([])

  if (!profileUser) {
    return (
      <div className="p-8 text-center">
        <p className="text-4xl mb-4">👤</p>
        <h2 className="font-display font-bold text-xl text-white mb-2">User not found</h2>
        <p className="text-zinc-500 mb-4">@{username} doesn't exist.</p>
        <Link href="/browse"><Button size="sm">Browse Carts</Button></Link>
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === profileUser.id || currentUser?.username === username

  const userCarts = DEMO_CARTS.filter(c =>
    c.creatorId === profileUser.id && c.visibility === 'public'
  )

  const totalLikes = userCarts.reduce((sum, c) => sum + c.likesCount, 0)
  const totalSaves = userCarts.reduce((sum, c) => sum + c.savesCount, 0)
  const totalViews = userCarts.reduce((sum, c) => sum + c.viewsCount, 0)

  const socialLinks = [
    { icon: Instagram, url: profileUser.socialLinks?.instagram, label: 'Instagram', prefix: 'instagram.com/' },
    { icon: Youtube, url: profileUser.socialLinks?.youtube, label: 'YouTube', prefix: 'youtube.com/@' },
    { icon: Twitter, url: profileUser.socialLinks?.twitter, label: 'Twitter/X', prefix: 'x.com/' },
    { icon: Globe, url: profileUser.socialLinks?.website, label: 'Website', prefix: '' },
  ].filter(s => s.url)

  const toggleSave = (cartId: string) => setSavedIds(p => p.includes(cartId) ? p.filter(id => id !== cartId) : [...p, cartId])
  const toggleLike = (cartId: string) => setLikedIds(p => p.includes(cartId) ? p.filter(id => id !== cartId) : [...p, cartId])

  const handleFollow = () => {
    setIsFollowing(prev => !prev)
    toast.success(isFollowing ? 'Unfollowed' : `Following @${profileUser.username}!`)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Profile link copied!')
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Back */}
      <Link href="/browse" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors mb-6 group">
        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        Back
      </Link>

      {/* Profile header */}
      <div className="bg-surface-800 rounded-2xl border border-white/8 overflow-hidden mb-6">
        {/* Cover gradient */}
        <div className="h-28 bg-gradient-to-br from-brand-500/15 via-surface-700 to-accent-500/10 relative">
          <div className="absolute inset-0 mesh-bg opacity-80" />
        </div>

        <div className="px-5 sm:px-7 pb-6">
          {/* Avatar row */}
          <div className="flex items-end justify-between gap-4 -mt-10 mb-4">
            <img
              src={profileUser.avatarUrl ?? getAvatarUrl(profileUser.username, 80)}
              alt={profileUser.displayName}
              className="w-20 h-20 rounded-2xl ring-4 ring-surface-800 object-cover bg-surface-700"
            />
            <div className="flex gap-2 pb-1">
              {isOwnProfile ? (
                <Link href="/settings">
                  <Button variant="secondary" size="sm" icon={<Edit size={14} />}>Edit Profile</Button>
                </Link>
              ) : (
                <>
                  <Button
                    variant={isFollowing ? 'secondary' : 'primary'}
                    size="sm"
                    icon={<UserPlus size={14} />}
                    onClick={handleFollow}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button variant="secondary" size="sm" icon={<Share2 size={14} />} onClick={handleShare} />
                </>
              )}
            </div>
          </div>

          {/* Name + badges */}
          <div className="mb-3">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="font-display font-extrabold text-xl text-white">{profileUser.displayName}</h1>
              {profileUser.userType === 'creator' && (
                <Badge variant="green" dot>Creator</Badge>
              )}
              {profileUser.userType === 'admin' && (
                <Badge variant="orange" dot>Admin</Badge>
              )}
            </div>
            <p className="text-sm text-zinc-500">@{profileUser.username}</p>
          </div>

          {/* Bio */}
          {profileUser.bio && (
            <p className="text-sm text-zinc-400 leading-relaxed mb-4 max-w-xl">{profileUser.bio}</p>
          )}

          {/* Social links */}
          {socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {socialLinks.map(link => (
                <a
                  key={link.label}
                  href={link.url!.startsWith('http') ? link.url : `https://${link.prefix}${link.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors"
                >
                  <link.icon size={13} />
                  {link.url}
                </a>
              ))}
            </div>
          )}

          {/* Stats row */}
          <div className="flex gap-5 text-sm">
            <div>
              <span className="font-display font-bold text-white">{formatNumber(profileUser.followerCount ?? 0)}</span>
              <span className="text-zinc-500 ml-1.5">followers</span>
            </div>
            <div>
              <span className="font-display font-bold text-white">{formatNumber(profileUser.followingCount ?? 0)}</span>
              <span className="text-zinc-500 ml-1.5">following</span>
            </div>
            <div>
              <span className="font-display font-bold text-white">{userCarts.length}</span>
              <span className="text-zinc-500 ml-1.5">carts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Creator analytics (own profile only) */}
      {isOwnProfile && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Likes', value: formatNumber(totalLikes), icon: Heart, color: 'text-red-400 bg-red-500/10' },
            { label: 'Total Saves', value: formatNumber(totalSaves), icon: Bookmark, color: 'text-brand-400 bg-brand-500/10' },
            { label: 'Total Views', value: formatNumber(totalViews), icon: Eye, color: 'text-blue-400 bg-blue-500/10' },
          ].map(stat => (
            <div key={stat.label} className="p-4 rounded-2xl bg-surface-800 border border-white/8 text-center">
              <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                <stat.icon size={17} />
              </div>
              <p className="font-display font-extrabold text-xl text-white">{stat.value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Carts section */}
      <div>
        <h2 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-brand-400" />
          Published AutoCarts ({userCarts.length})
        </h2>

        {userCarts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {userCarts.map(cart => (
              <CartCard
                key={cart.id}
                cart={cart}
                isSaved={savedIds.includes(cart.id)}
                isLiked={likedIds.includes(cart.id)}
                onSave={toggleSave}
                onLike={toggleLike}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center rounded-2xl border border-dashed border-white/10">
            <p className="text-4xl mb-3">🛒</p>
            <p className="text-white font-medium mb-1">No public carts yet</p>
            <p className="text-sm text-zinc-500">
              {isOwnProfile ? 'Create your first AutoCart to share with the world!' : `@${profileUser.username} hasn't published any carts yet.`}
            </p>
            {isOwnProfile && (
              <Link href="/create" className="inline-block mt-4">
                <Button size="sm">Create My First Cart</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
