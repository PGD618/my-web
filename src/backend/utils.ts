export interface FileTreeNode {
  name: string
  isFolder: boolean
  children: Record<string, FileTreeNode>
  slug: string | null
}

export function buildFileTree(notes: { slug: string }[]): Record<string, FileTreeNode> {
  const tree: Record<string, FileTreeNode> = {}
  notes.forEach((note) => {
    const parts = note.slug.replace(/\\/g, '/').split('/')
    let current = tree

    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = {
          name: part,
          isFolder: index !== parts.length - 1,
          children: {},
          slug: index === parts.length - 1 ? note.slug : null,
        }
      }
      current = current[part].children
    })
  })
  return tree
}
