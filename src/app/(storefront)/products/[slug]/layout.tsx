import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

interface Props {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { slug } = await params

  // Try DB first, fall back to slug-based title
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { title: true, description: true, images: true },
  }).catch(() => null)

  const title = product?.title ?? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  const description = product?.description?.slice(0, 160) ?? 'Plant-based hair care by CELLAVIVA. Clinically proven results.'

  return {
    title: `${title} | CELLAVIVA`,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: product?.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  }
}

export default function ProductLayout({ children }: Props) {
  return children
}
