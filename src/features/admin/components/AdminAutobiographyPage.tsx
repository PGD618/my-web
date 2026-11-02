import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getRoleFromCookies } from '@/server/auth'
import { AdminAutobiographyClient } from './AdminAutobiographyClient'

export default async function AdminAutobiographyPage() {
  const cookieStore = await cookies()
  const role = await getRoleFromCookies(cookieStore)

  if (role !== 'owner') {
    redirect('/admin/login')
  }

  return <AdminAutobiographyClient />
}
