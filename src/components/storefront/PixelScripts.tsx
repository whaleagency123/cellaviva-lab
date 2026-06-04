import { prisma } from '@/lib/prisma'
import { PixelScriptsClient } from './PixelScriptsClient'

async function getPixelIds() {
  try {
    const rows = await prisma.storeSettings.findMany({
      where: { key: { in: ['meta_pixel_id', 'gtm_id', 'tiktok_pixel_id', 'pinterest_tag_id', 'snapchat_pixel_id'] } },
    })
    const db: Record<string, string> = {}
    for (const r of rows) db[r.key] = r.value

    return {
      metaId:      db.meta_pixel_id      || process.env.NEXT_PUBLIC_META_PIXEL_ID      || '',
      gtmId:       db.gtm_id             || process.env.NEXT_PUBLIC_GTM_ID             || '',
      tiktokId:    db.tiktok_pixel_id    || process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID    || '',
      pinterestId: db.pinterest_tag_id   || process.env.NEXT_PUBLIC_PINTEREST_TAG_ID   || '',
      snapchatId:  db.snapchat_pixel_id  || process.env.NEXT_PUBLIC_SNAPCHAT_PIXEL_ID  || '',
    }
  } catch {
    return {
      metaId:      process.env.NEXT_PUBLIC_META_PIXEL_ID      || '',
      gtmId:       process.env.NEXT_PUBLIC_GTM_ID             || '',
      tiktokId:    process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID    || '',
      pinterestId: process.env.NEXT_PUBLIC_PINTEREST_TAG_ID   || '',
      snapchatId:  process.env.NEXT_PUBLIC_SNAPCHAT_PIXEL_ID  || '',
    }
  }
}

export async function PixelScripts() {
  const ids = await getPixelIds()
  return <PixelScriptsClient {...ids} />
}
