export function buildFileTree(notes: any[]) {
  const tree: any = {}
  notes.forEach((note) => {
    const parts = note.slug.replace(/\\/g, '/').split('/')
    let current = tree

    parts.forEach((part: string, index: number) => {
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
