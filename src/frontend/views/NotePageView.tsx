import { getNote, getBacklinks, getGraphData } from '@/backend/notes'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import { FiLink, FiCornerDownRight, FiShare2, FiHash } from 'react-icons/fi'
import { MiniGraph } from '@/frontend/components/MiniGraph'
import { TableOfContents } from '@/frontend/components/TableOfContents'
import { CodeBlockEnhancer } from '@/frontend/components/CodeBlockEnhancer'

export default async function NotePageView({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const currentPath = decodeURIComponent(slug.join('/'))
  const note = getNote(currentPath)

  if (!note) notFound()

  const backlinks = getBacklinks(note)
  const graphData = getGraphData(note)

  return (
    <div className="w-full flex justify-center py-[10vh] px-[6vw]">
      <div className="w-full max-w-5xl flex gap-12">
        <article className="w-full max-w-3xl min-w-0">
        <nav className="flex items-center gap-2 mb-12 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
          <Link href="/writing" className="hover:text-zinc-200 transition-colors">
            Garden
          </Link>
          <span>/</span>
          {slug.map((segment, index) => {
            const isLast = index === slug.length - 1
            return (
              <React.Fragment key={index}>
                <span className={`${isLast ? 'text-zinc-600 cursor-default' : 'text-zinc-500'}`}>
                  {decodeURIComponent(segment)}
                </span>
                {!isLast && <span className="text-zinc-800">/</span>}
              </React.Fragment>
            )
          })}
        </nav>

        <header className="mb-16 border-b border-zinc-900 pb-12">
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-mono uppercase tracking-[0.2em]">
              {note.category}
            </span>
            <div className="h-px w-8 bg-zinc-800" />
            <span className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest">
              Fragment_{note.slug.split('/').pop()}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-8 leading-[1.1]">
            {note.title}
          </h1>

          <div className="flex items-center gap-8 text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex-wrap">
            <div className="flex flex-col">
              <span className="text-zinc-700">Modified</span>
              <span className="text-zinc-300 mt-1">{new Date(note.lastModified).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-zinc-700">Word Count</span>
              <span className="text-zinc-300 mt-1">{note.wordCount} Words</span>
            </div>
          </div>

          {note.tags && note.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-6 flex-wrap">
              <FiHash className="text-purple-500/50 w-3 h-3" />
              {note.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/writing/tags/${encodeURIComponent(tag)}`}
                  className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-mono hover:bg-purple-500/20 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </header>

        <div
          className="prose prose-invert prose-zinc max-w-none
          prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-white
          prose-h3:text-xl prose-h3:font-semibold prose-h3:tracking-tight prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-zinc-400 prose-p:leading-[1.8] prose-p:mb-6 prose-p:text-[1.05rem]
          prose-li:text-zinc-400 prose-li:my-2
          prose-strong:text-zinc-100 prose-strong:font-semibold
          prose-blockquote:border-l-2 prose-blockquote:border-zinc-800 prose-blockquote:italic prose-blockquote:text-zinc-500
          prose-code:text-zinc-300 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
        <CodeBlockEnhancer />

        {backlinks.length > 0 && (
          <section className="mt-24 pt-12 border-t border-zinc-900">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 mb-8 flex items-center gap-2">
              <FiLink className="rotate-45 text-blue-500/50" /> Linked Here
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {backlinks.map((link) => (
                <Link
                  key={link.slug}
                  href={`/writing/${link.slug}`}
                  className="group p-5 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 hover:bg-zinc-900/50 transition-all backdrop-blur-sm"
                >
                  <div className="text-sm font-bold text-zinc-300 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                    <FiCornerDownRight className="opacity-30 group-hover:opacity-100 transition-opacity" />
                    {link.title}
                  </div>
                  {link.excerpt && (
                    <p className="text-[11px] text-zinc-500 mt-2 line-clamp-2 italic leading-relaxed font-light">
                      {link.excerpt}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {graphData.links.length > 0 && (
          <section className="mt-20 pt-12 border-t border-zinc-900">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-600 mb-8 flex items-center gap-2">
              <FiShare2 className="text-blue-500/50" /> Connection Map
            </h2>
            <div className="rounded-2xl bg-zinc-900/20 border border-white/5 overflow-hidden">
              <MiniGraph data={graphData} />
            </div>
          </section>
        )}

        <footer className="mt-24 pt-12 border-t border-zinc-900 flex flex-col items-center gap-8">
          <Link href="/writing" className="text-[10px] text-zinc-600 hover:text-white transition-colors font-mono uppercase tracking-[0.3em]">
            ← Back to Digital Garden
          </Link>
          <div className="text-[10px] font-mono text-zinc-800 uppercase tracking-widest">
            End of Fragment
          </div>
        </footer>
        </article>

        {note.toc && note.toc.length > 0 && (
          <TableOfContents items={note.toc} />
        )}
      </div>
    </div>
  )
}
