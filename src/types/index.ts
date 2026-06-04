export type FulfillmentStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'PAID' | 'REFUNDED' | 'FAILED'

export interface Product {
  id: string
  slug: string
  title: string
  description: string
  price: number
  salePrice?: number | null
  stock: number
  images: string[]
  featured: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product?: Product
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone?: string | null
  shippingAddress: ShippingAddress
  lineItems: OrderItem[]
  status: FulfillmentStatus
  paymentStatus: PaymentStatus
  stripePaymentId?: string | null
  total: number
  createdAt: string
  updatedAt: string
}

export interface ShippingAddress {
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface ContactInquiry {
  id: string
  name: string
  email: string
  phone?: string | null
  message: string
  createdAt: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface Testimonial {
  id: string
  name: string
  rating: number
  text: string
  verified: boolean
  date: string
}

export interface NavLink {
  href: string
  label: string
}

export interface PressItem {
  name: string
  style: string
}

export interface MetricItem {
  value: number
  label: string
}

export interface TimelineStep {
  id: string
  week: string
  icon: string
  title: string
  body: string
}

export interface IngredientItem {
  id: string
  name: string
  source: string
  role: string
  icon: string
  description: string
  highlight: boolean
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface BeforeAfterCase {
  id: string
  name: string
  age: number
  duration: string
  concern: string
  result: string
  stars: number
  quote: string
  beforeLabel: string
  afterLabel: string
}

export interface ComparisonRow {
  id: string
  feature: string
  us: boolean
  them: boolean
}

export interface GuaranteeCard {
  id: string
  title: string
  body: string
}

export interface Plugin {
  id: string
  name: string
  description: string
  icon: string
  enabled: boolean
  settings: Record<string, string>
}

export interface CustomSection {
  id: string
  name: string
  category: string
  html: string
  visible: boolean
  order: number
}

export interface PageSection {
  id: string
  label: string
  visible: boolean
  zIndex?: number
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  body: string
  coverEmoji: string
  category: string
  published: boolean
  createdAt: string
  updatedAt: string
}

export interface StoreSettings {
  // Branding
  primaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string

  // ── Storefront design tokens (CSS variable system) ──────────────────────
  sfPrimary: string
  sfPrimaryDark: string
  sfAccentLight: string
  sfText: string
  sfTextMuted: string
  sfBg: string
  sfBorder: string
  sfDarkBg: string
  sfDarkSection: string
  sfIconSize: 'sm' | 'md' | 'lg'
  sfRadiusBtn: 'pill' | 'lg' | 'md' | 'sm' | 'none'
  sfRadiusCard: 'xl' | 'lg' | 'md' | 'sm' | 'none'
  sfSpacing: 'compact' | 'default' | 'comfortable'
  sfIconGuarantee1: string
  sfIconGuarantee2: string
  sfIconGuarantee3: string
  sfIconFaq: string
  sfIconCart: string

  // Announcement bar
  announcementText: string

  // Scrolling marquee strip
  marqueeItems: string[]

  // Hero section
  heroImage: string
  heroVideo: string
  heroElemBg: number
  heroElemText: number
  heroElemCard: number
  heroElemBadge1: number
  heroElemBadge2: number
  heroElemScroll: number
  heroHeading: string
  heroSubtext: string
  heroBadgeText: string
  heroPrimaryBtnText: string
  heroPrimaryBtnHref: string
  heroSecondaryBtnText: string
  heroSecondaryBtnHref: string

  // Header navigation
  navLinks: NavLink[]

  // Press logos
  pressItems: PressItem[]

  // Testimonials
  testimonials: Testimonial[]

  // Clinical metrics
  metrics: MetricItem[]

  // Results timeline
  timeline: TimelineStep[]

  // Ingredients
  ingredients: IngredientItem[]

  // Subscription perks
  subscriptionPerks: string[]

  // FAQ
  faqItems: FAQItem[]

  // Before/After section
  beforeAfterCases: BeforeAfterCase[]

  // Comparison table
  comparisonRows: ComparisonRow[]

  // Guarantee cards
  guaranteeCards: GuaranteeCard[]

  // Store info & social
  storeName: string
  storeTagline: string
  storeEmail: string
  storePhone: string
  storeWhatsapp: string
  storeVat: string
  storeAddress: string
  checkoutShowCountry: string
  socialInstagram: string
  socialFacebook: string
  socialTikTok: string
  socialTwitter: string
  footerTagline: string
  copyrightText: string

  // Before/After drag slider
  sliderTitle: string
  sliderSubtitle: string
  sliderBeforeImage: string
  sliderAfterImage: string
  sliderBeforeLabel: string
  sliderAfterLabel: string

  // Page section order + visibility
  pageSections: PageSection[]
}
