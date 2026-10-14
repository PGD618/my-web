import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getRoleFromCookies } from '@/lib/auth'
import { AdminDisputedFactsClient } from './AdminDisputedFactsClient'

export default async function AdminDisputedFactsPage() {
  const cookieStore = await cookies()
  const role = await getRoleFromCookies(cookieStore)

  if (role !== 'owner') {
    redirect('/admin/login')
  }

  return <AdminDisputedFactsClient />
}
