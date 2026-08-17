#!/usr/bin/env node

/**
 * Obsidian 笔记向量化脚本
 * 用于 GitHub Actions 自动化
 *
 * 功能:
 * 1. 读取 content/ 目录下的所有 markdown 文件
 * 2. 调用阿里云百炼生成 embedding
 * 3. 使用 LanceDB 存储向量数据
 * 4. 上传到 Cloudflare R2
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 配置
const CONTENT_DIR = path.join(__dirname, '../content')
const OUTPUT_DIR = path.join(__dirname, '../vectors')
const CHUNK_SIZE = 1000 // 文本分块大小

/**
 * 阿里云百炼 Embedding 客户端
 */
class EmbeddingClient {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.baseURL = 'https://dashscope.aliyuncs.com/api/v1'
    this.model = 'text-embedding-v3'
  }

  async embed(text) {
    const response = await fetch(
      `${this.baseURL}/services/embeddings/text-embedding/text-embedding`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          input: {
            texts: [text]
          },
          parameters: {
            text_type: 'document'
          }
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Embedding API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    return data.output?.embeddings?.[0]?.embedding
  }

  async embedBatch(texts) {
    const batchSize = 10 // 阿里云百炼限制：批次大小不能超过 10
    const results = []

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize)
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)}`)

      const response = await fetch(
        `${this.baseURL}/services/embeddings/text-embedding/text-embedding`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            input: {
              texts: batch
            },
            parameters: {
              text_type: 'document'
            }
          }),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Batch ${i / batchSize + 1} failed:`, errorText)
        throw new Error(`Embedding API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      const embeddings = data.output?.embeddings?.map(e => e.embedding) || []
      results.push(...embeddings)

      // 避免频率限制
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    return results
  }
}

/**
 * 递归读取目录下的所有 markdown 文件
 */
async function getAllMarkdownFiles(dir) {
  const files = []

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name)

      if (entry.isDirectory()) {
        await walk(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath)
      }
    }
  }

  await walk(dir)
  return files
}

/**
 * 文本分块
 */
function chunkText(text, chunkSize) {
  const chunks = []
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize))
  }
  return chunks
}

/**
 * 解析 markdown 文件
 */
async function parseMarkdownFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8')
  const { data: frontmatter, content: body } = matter(content)

  const relativePath = path.relative(CONTENT_DIR, filePath)
  const slug = relativePath.replace(/\.md$/, '').replace(/\\/g, '/')

  return {
    slug,
    title: frontmatter.title || path.basename(filePath, '.md'),
    category: frontmatter.category,
    tags: frontmatter.tags || [],
    content: body,
    file_path: relativePath,
    updated_at: new Date().toISOString(),
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 Starting vector generation...')

  // 检查环境变量
  const apiKey = process.env.ALIBABA_EMBEDDING_API_KEY
  if (!apiKey) {
    throw new Error('Missing ALIBABA_EMBEDDING_API_KEY')
  }

  const embeddingClient = new EmbeddingClient(apiKey)

  // 1. 读取所有 markdown 文件
  console.log('📂 Reading markdown files...')
  const files = await getAllMarkdownFiles(CONTENT_DIR)
  console.log(`Found ${files.length} markdown files`)

  // 2. 解析文件并准备数据
  console.log('📝 Parsing files...')
  const documents = []

  for (const file of files) {
    try {
      const doc = await parseMarkdownFile(file)

      // 跳过内容过短的文件
      if (doc.content.length < 50) {
        console.log(`Skipping ${doc.slug} (too short)`)
        continue
      }

      // 文本分块
      const chunks = chunkText(doc.content, CHUNK_SIZE)

      for (let i = 0; i < chunks.length; i++) {
        documents.push({
          id: `${doc.slug}_chunk_${i}`,
          content: chunks[i],
          metadata: {
            title: doc.title,
            slug: doc.slug,
            category: doc.category,
            tags: doc.tags,
            file_path: doc.file_path,
            chunk_index: i,
            total_chunks: chunks.length,
            updated_at: doc.updated_at,
          },
        })
      }
    } catch (error) {
      console.error(`Error parsing ${file}:`, error.message)
    }
  }

  console.log(`Prepared ${documents.length} document chunks`)

  // 3. 生成 embeddings
  console.log('🔮 Generating embeddings...')
  const texts = documents.map(doc => doc.content)
  const embeddings = await embeddingClient.embedBatch(texts)

  // 4. 组合数据
  const records = documents.map((doc, idx) => ({
    ...doc,
    vector: embeddings[idx],
  }))

  // 5. 保存为 JSON (临时方案，后续换成 LanceDB 格式)
  console.log('💾 Saving vectors...')
  await fs.mkdir(OUTPUT_DIR, { recursive: true })
  await fs.writeFile(
    path.join(OUTPUT_DIR, 'vectors.json'),
    JSON.stringify(records, null, 2)
  )

  console.log('✅ Vector generation complete!')
  console.log(`Output: ${OUTPUT_DIR}/vectors.json`)
}

main().catch(error => {
  console.error('❌ Error:', error)
  process.exit(1)
})
