import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getRoleFromCookies } from '@/lib/auth'
import { AdminFactsClient } from './AdminFactsClient'

export default async function AdminFactsPage() {
  const cookieStore = await cookies()
  const role = await getRoleFromCookies(cookieStore)

  if (role !== 'owner') {
    redirect('/admin/login')
  }

  return <AdminFactsClient />
}
