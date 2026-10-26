import { FiGitMerge } from 'react-icons/fi'
import { AdminPageShell } from '@/frontend/components/admin/AdminPageShell'
import { MergeProposalsClient } from '@/frontend/views/MergeProposalsClient'

export default function MergeProposalsPage() {
  return (
    <AdminPageShell icon={FiGitMerge} title="合并提案" subtitle="Merge Proposals">
      <MergeProposalsClient />
    </AdminPageShell>
  )
}
