import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getRoleFromCookies } from '@/lib/auth'
import { AdminMigratedEntriesClient } from './AdminMigratedEntriesClient'

export default async function AdminMigratedEntriesPage() {
  const cookieStore = await cookies()
  const role = await getRoleFromCookies(cookieStore)

  if (role !== 'owner') {
    redirect('/admin/login')
  }

  return <AdminMigratedEntriesClient />
}
