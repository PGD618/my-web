import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getRoleFromCookies } from '@/lib/auth'
import { AdminDashboardClient } from './AdminDashboardClient'

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const role = await getRoleFromCookies(cookieStore)

  if (role !== 'owner') {
    redirect('/admin/login')
  }

  return <AdminDashboardClient />
}
