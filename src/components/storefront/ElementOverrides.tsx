import { prisma } from '@/lib/prisma'

export async function ElementOverrides() {
  let overrides: Record<string, { x: number; y: number; w?: number; h?: number }> = {}
  try {
    const row = await prisma.storeSettings.findUnique({ where: { key: 'elementOverrides' } })
    if (row?.value) overrides = JSON.parse(row.value)
  } catch {}

  const entries = Object.entries(overrides)
  if (entries.length === 0) return null

  const css = entries
    .map(([selector, t]) => {
      const transform = `translate(${t.x ?? 0}px, ${t.y ?? 0}px)`
      const w = t.w != null ? `width:${t.w}px !important;` : ''
      const h = t.h != null ? `height:${t.h}px !important;` : ''
      return `${selector}{position:relative;transform:${transform};${w}${h}z-index:10;}`
    })
    .join('\n')

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
