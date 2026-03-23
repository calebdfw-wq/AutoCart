import { DEMO_CARTS } from '@/lib/seed-data'
import CartDetailClient from './CartDetailClient'

export function generateStaticParams() {
  return DEMO_CARTS.map(cart => ({ id: cart.id }))
}

export default function CartDetailPage({ params }: { params: { id: string } }) {
  return <CartDetailClient params={params} />
}
