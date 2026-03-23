import { DEMO_USERS } from '@/lib/seed-data'
import ProfileClient from './ProfileClient'

export function generateStaticParams() {
  return DEMO_USERS.map(user => ({ username: user.username }))
}

export default function ProfilePage({ params }: { params: { username: string } }) {
  return <ProfileClient params={params} />
}
