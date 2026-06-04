import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join, extname } from 'path'
import { cookies } from 'next/headers'

async function isAdmin() {
  const jar = await cookies()
  return !!(jar.get('admin_session')?.value)
}

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif'])
const VIDEO_EXTS = new Set(['.mp4', '.webm', '.mov', '.avi', '.mkv', '.ogv'])
const ALLOWED    = new Set([...IMAGE_EXTS, ...VIDEO_EXTS, '.svg'])
const MAX_BYTES  = 200 * 1024 * 1024

export async function POST(req: NextRequest) {
  if (!await isAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const ext = extname(file.name).toLowerCase()
  if (!ALLOWED.has(ext)) return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'File too large' }, { status: 400 })

  const buffer     = Buffer.from(await file.arrayBuffer())
  const uploadDir  = join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadDir, { recursive: true })

  // ── Auto-compress images with Sharp ─────────────────────────────────────────
  let finalBuffer: Buffer = buffer
  let finalExt     = ext
  let finalSize    = buffer.length

  if (IMAGE_EXTS.has(ext) && ext !== '.svg' && ext !== '.gif') {
    try {
      const sharp = (await import('sharp')).default
      const compressed = await sharp(buffer)
        .resize({ width: 2400, withoutEnlargement: true })  // max 2400px wide
        .webp({ quality: 82 })                               // convert to WebP
        .toBuffer()

      // Only use compressed if smaller
      if (compressed.length < buffer.length) {
        finalBuffer = Buffer.from(compressed)
        finalExt    = '.webp'
        finalSize   = compressed.length
        console.log(`[Upload] ${file.name}: ${Math.round(buffer.length/1024)}KB → ${Math.round(finalSize/1024)}KB WebP (${Math.round((1-finalSize/buffer.length)*100)}% saved)`)
      }
    } catch {
      // Sharp failed — use original
    }
  }

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${finalExt}`
  await writeFile(join(uploadDir, filename), finalBuffer)

  return NextResponse.json({
    url:              `/uploads/${filename}`,
    originalSizeKB:   Math.round(buffer.length / 1024),
    compressedSizeKB: Math.round(finalSize / 1024),
    format:           finalExt.slice(1),
  })
}
