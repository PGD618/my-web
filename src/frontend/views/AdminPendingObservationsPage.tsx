import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getRoleFromCookies } from '@/lib/auth'
import { AdminPendingObservationsClient } from './AdminPendingObservationsClient'

export default async function AdminPendingObservationsPage() {
  const cookieStore = await cookies()
  const role = await getRoleFromCookies(cookieStore)

  if (role !== 'owner') {
    redirect('/admin/login')
  }

  return <AdminPendingObservationsClient />
}
