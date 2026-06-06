import type { StoreSettings } from '@/types'

export const DEFAULT_SETTINGS: StoreSettings = {
  // ── Branding ────────────────────────────────────────────────────────────
  primaryColor: '#2E5B41',
  accentColor: '#98CBB0',
  backgroundColor: '#E7EFE4',
  textColor: '#142718',

  // ── Storefront design tokens — Nature Eco Palette ────────────────────────
  sfPrimary:        '#2E5B41',  // Forest Green
  sfPrimaryDark:    '#142718',  // Deep Forest
  sfAccentLight:    '#98CBB0',  // Sage Mint
  sfText:           '#142718',  // Deep Forest (text)
  sfTextMuted:      '#2E5B41',  // Forest Green (muted text)
  sfBg:             '#E7EFE4',  // Light Mint Cream (background)
  sfBorder:         '#98CBB0',  // Sage Mint (borders)
  sfDarkBg:         '#142718',  // Deep Forest (footer)
  sfDarkSection:    '#2E5B41',  // Forest Green (dark sections)
  sfIconSize:       'md',
  sfRadiusBtn:      'pill',
  sfRadiusCard:     'xl',
  sfSpacing:        'default',
  sfIconGuarantee1: 'Shield',
  sfIconGuarantee2: 'RefreshCw',
  sfIconGuarantee3: 'Headphones',
  sfIconFaq:        'HelpCircle',
  sfIconCart:       'ShoppingBag',

  // ── Announcement bar ────────────────────────────────────────────────────
  announcementText: '100% Nature • Free Worldwide Shipping on Orders Over $50 • 30-Day Hassle-Free Returns',

  // ── Marquee strip ───────────────────────────────────────────────────────
  marqueeItems: [
    '100% Plant-Based Formula',
    'Clinically Proven Results',
    'Sulfate & Paraben Free',
    'Free Shipping on $50+',
    '30-Day Money-Back Guarantee',
    'Vegan & Cruelty-Free',
    '12,000+ Happy Customers',
    '4.9★ Average Rating',
  ],

  // ── Hero ────────────────────────────────────────────────────────────────
  heroImage: '/images/hero-bg.jpg',
  heroVideo: '',
  heroElemBg:     0,
  heroElemText:   10,
  heroElemCard:   10,
  heroElemBadge1: 20,
  heroElemBadge2: 20,
  heroElemScroll: 10,
  heroHeading: "Your Scalp's New Favorite Routine",
  heroSubtext: 'Powered by nature, backed by science. The plant-based hair care system your scalp has been waiting for.',
  heroBadgeText: 'Clinically Proven · Plant-Based',
  heroPrimaryBtnText: 'Shop the Routine',
  heroPrimaryBtnHref: '/products/stemuvita',
  heroSecondaryBtnText: 'Take the Quiz',
  heroSecondaryBtnHref: '/quiz',

  // ── Navigation ──────────────────────────────────────────────────────────
  navLinks: [
    { href: '/products', label: 'Shop All' },
    { href: '/science', label: 'The Science' },
    { href: '/subscribe', label: 'Subscribe & Save' },
    { href: '/quiz', label: 'Take the Quiz' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],

  // ── Press ────────────────────────────────────────────────────────────────
  pressItems: [
    { name: 'Vogue', style: 'font-serif font-bold tracking-wider text-2xl' },
    { name: 'ELLE', style: 'font-black tracking-widest text-2xl' },
    { name: 'Forbes', style: 'font-serif italic font-bold text-2xl' },
    { name: 'Allure', style: 'font-serif tracking-wider text-xl' },
    { name: "Women's Health", style: 'font-bold text-base tracking-wide uppercase' },
    { name: 'Byrdie', style: 'font-black text-xl tracking-tight' },
  ],

  // ── Testimonials ─────────────────────────────────────────────────────────
  testimonials: [
    {
      id: '1',
      name: 'Sarah M.',
      rating: 5,
      text: "I've tried everything for my dry, flaky scalp. After just 3 weeks with Stemuvita, I finally have a healthy scalp and my hair has never looked better. Absolutely incredible.",
      verified: true,
      date: '2 weeks ago',
    },
    {
      id: '2',
      name: 'James T.',
      rating: 5,
      text: 'The serum is a game changer. My hair feels thicker and looks fuller. My barber even asked what I was using. 100% recommend to anyone struggling with hair thinning.',
      verified: true,
      date: '1 month ago',
    },
    {
      id: '3',
      name: 'Amara L.',
      rating: 5,
      text: "As someone with color-treated hair, I was nervous about trying something new. Cellaviva is gentle, effective, and my color lasts so much longer now. This is my permanent routine.",
      verified: true,
      date: '3 weeks ago',
    },
    {
      id: '4',
      name: 'Priya K.',
      rating: 5,
      text: 'My hair was shedding so badly after pregnancy. A friend recommended Stemuvita and within 6 weeks the shedding reduced dramatically. I cried happy tears!',
      verified: true,
      date: '1 week ago',
    },
    {
      id: '5',
      name: 'David R.',
      rating: 5,
      text: 'Skeptical at first but the science made sense. After a month my scalp is clear, hair is growing back in the temples. Real results, not marketing fluff.',
      verified: true,
      date: '2 months ago',
    },
    {
      id: '6',
      name: 'Elena V.',
      rating: 5,
      text: "Love that it's plant-based and still outperforms every chemical product I've tried. The smell is divine too — like a forest spa. I'm obsessed.",
      verified: true,
      date: '5 days ago',
    },
  ],

  // ── Clinical metrics ─────────────────────────────────────────────────────
  metrics: [
    { value: 94, label: 'reported less scalp irritation after 4 weeks' },
    { value: 91, label: 'noticed visibly reduced hair shedding' },
    { value: 88, label: 'said hair felt stronger and thicker overall' },
  ],

  // ── Results timeline ─────────────────────────────────────────────────────
  timeline: [
    {
      id: '1',
      week: 'Week 1–2',
      icon: '🌱',
      title: 'Scalp Reset',
      body: 'Excess sebum and product buildup are gently cleared. Scalp inflammation starts to calm. Most users report their scalp feeling lighter and cleaner.',
    },
    {
      id: '2',
      week: 'Week 3–4',
      icon: '💧',
      title: 'Reduced Shedding',
      body: 'Plant stem cell actives penetrate the dermal papilla. The anagen (growth) phase is re-triggered. Users typically notice significantly less hair in the drain.',
    },
    {
      id: '3',
      week: 'Week 5–8',
      icon: '✨',
      title: 'Visible Regrowth',
      body: '91% of clinical participants reported visibly reduced shedding at this stage. New baby hairs appear along the hairline and crown. Hair feels thicker, stronger.',
    },
    {
      id: '4',
      week: 'Week 9–12',
      icon: '🌿',
      title: 'Full Transformation',
      body: 'Continued use locks in results and strengthens the scalp microbiome. Hair density increases measurably. Users report the best hair health of their adult lives.',
    },
  ],

  // ── Ingredients ──────────────────────────────────────────────────────────
  ingredients: [
    {
      id: '1',
      name: 'Plant Stem Cell Complex',
      source: 'Malus Domestica (Swiss Apple)',
      role: 'Follicle Regeneration',
      icon: '🍎',
      description: 'Extracted from rare Swiss apple stem cells, this proprietary complex activates dormant follicles and extends the anagen (growth) phase.',
      highlight: true,
    },
    {
      id: '2',
      name: 'Phytol',
      source: 'Green Tea Chlorophyll',
      role: 'Scalp Anti-Inflammatory',
      icon: '🍵',
      description: 'A diterpene alcohol derived from green tea. Clinically shown to suppress DHT-driven scalp inflammation — the #1 cause of androgenic hair loss.',
      highlight: false,
    },
    {
      id: '3',
      name: 'Biotin Complex',
      source: 'Vitamin B7 — Fermented',
      role: 'Structural Protein Support',
      icon: '🧬',
      description: 'Our biofermented biotin has 3× higher dermal absorption than synthetic alternatives. Directly supports keratin production and strengthens the hair shaft.',
      highlight: false,
    },
    {
      id: '4',
      name: 'Caffeine Extract',
      source: 'Arabica Coffee Bean',
      role: 'DHT Blocker',
      icon: '☕',
      description: 'Topical caffeine penetrates the follicle within minutes, directly counteracting DHT — the hormone responsible for miniaturisation of the hair follicle.',
      highlight: false,
    },
    {
      id: '5',
      name: 'Saw Palmetto Extract',
      source: 'Serenoa Repens Fruit',
      role: '5α-Reductase Inhibitor',
      icon: '🌿',
      description: 'A natural 5α-reductase inhibitor that blocks the conversion of testosterone to DHT at the scalp level, without systemic side effects.',
      highlight: false,
    },
    {
      id: '6',
      name: 'Niacinamide (B3)',
      source: 'Vitamin B3 — Pharmaceutical Grade',
      role: 'Scalp Circulation Booster',
      icon: '⚡',
      description: 'Improves microcirculation in the dermal papilla, ensuring follicles receive adequate oxygen and nutrients. Also reduces scalp pigmentation.',
      highlight: false,
    },
  ],

  // ── Subscription perks ───────────────────────────────────────────────────
  subscriptionPerks: [
    'Save 15% on every order, forever',
    'Free priority shipping on all subscriptions',
    'Pause, skip or cancel anytime — no penalty',
    'Exclusive subscriber-only product access',
    'Loyalty points on every delivery',
    'Early access to new formulas',
  ],

  // ── FAQ ──────────────────────────────────────────────────────────────────
  faqItems: [
    {
      id: '1',
      question: 'What makes Stemuvita™ different from other hair products?',
      answer: 'Stemuvita™ uses 100% plant-derived stem cell technology with zero harsh sulfates, parabens, or silicones. Our formula is clinically tested and proven to show results in as little as 4 weeks.',
    },
    {
      id: '2',
      question: 'How long before I see results?',
      answer: 'Most customers report visible improvements within 2–4 weeks of consistent use. For best results, use the full Stemuvita™ routine — cleanse + serum — daily.',
    },
    {
      id: '3',
      question: 'Is it suitable for all hair types?',
      answer: 'Yes. Stemuvita™ is formulated for all hair types including oily, dry, curly, straight, color-treated, and chemically processed hair.',
    },
    {
      id: '4',
      question: 'Do you offer free shipping?',
      answer: 'We offer free worldwide shipping on all orders over $50. Standard delivery takes 3–7 business days depending on your location.',
    },
    {
      id: '5',
      question: 'What is your return policy?',
      answer: "We offer a 30-day hassle-free return policy. If you're not completely satisfied, simply contact our support team and we'll arrange a full refund.",
    },
  ],

  // ── Before/After cases ───────────────────────────────────────────────────
  beforeAfterCases: [
    {
      id: '1',
      name: 'Sarah M.',
      age: 34,
      duration: '8 Weeks',
      concern: 'Severe shedding & thinning crown',
      result: '91% reduction in daily hair fall',
      stars: 5,
      quote: "I was losing handfuls in the shower every day. After 8 weeks on Stemuvita, my drain is almost completely clear. I genuinely can't believe the difference.",
      beforeLabel: 'Before',
      afterLabel: '8 Weeks',
    },
    {
      id: '2',
      name: 'James T.',
      age: 41,
      duration: '12 Weeks',
      concern: 'Receding hairline & scalp inflammation',
      result: 'Visible regrowth along hairline',
      stars: 5,
      quote: 'The scalp inflammation was the first thing to go — within 2 weeks. By week 12, my hairline had actually moved forward. My barber noticed before I even said anything.',
      beforeLabel: 'Before',
      afterLabel: '12 Weeks',
    },
    {
      id: '3',
      name: 'Amara L.',
      age: 29,
      duration: '6 Weeks',
      concern: 'Postpartum hair loss',
      result: 'Shedding stopped, new baby hairs visible',
      stars: 5,
      quote: 'Postpartum shedding was destroying my confidence. My doctor said to wait it out but I tried Stemuvita and within 6 weeks the shedding had basically stopped. New growth everywhere.',
      beforeLabel: 'Before',
      afterLabel: '6 Weeks',
    },
  ],

  // ── Comparison table ─────────────────────────────────────────────────────
  comparisonRows: [
    { id: '1', feature: '100% Plant-Based Ingredients', us: true, them: false },
    { id: '2', feature: 'Sulfate-Free Formula', us: true, them: false },
    { id: '3', feature: 'Paraben-Free', us: true, them: false },
    { id: '4', feature: 'Clinically Tested', us: true, them: false },
    { id: '5', feature: 'Suitable for Color-Treated Hair', us: true, them: false },
    { id: '6', feature: 'No Harsh Chemicals', us: true, them: false },
    { id: '7', feature: 'Cruelty-Free & Vegan', us: true, them: false },
    { id: '8', feature: 'Visible Results in 4 Weeks', us: true, them: false },
  ],

  // ── Guarantee cards ──────────────────────────────────────────────────────
  guaranteeCards: [
    {
      id: '1',
      title: '30-Day Money-Back Guarantee',
      body: "Try Stemuvita™ completely risk-free for 30 days. If you don't see a meaningful reduction in shedding, we'll refund you in full — no questions, no hoops, no return shipping required.",
    },
    {
      id: '2',
      title: 'Easy Returns',
      body: 'Changed your mind? Return any unopened product within 90 days of purchase for a full refund. Products at least 50% unused qualify for a partial refund under our satisfaction guarantee.',
    },
    {
      id: '3',
      title: '7-Day Customer Support',
      body: 'Our hair care specialists are available 7 days a week via live chat, email, and phone. Average response time under 2 hours. Real humans — no bots, no scripts.',
    },
  ],

  // ── Store info ───────────────────────────────────────────────────────────
  storeName: 'CELLAVIVA',
  storeTagline: 'Powered by nature, backed by science. Plant-based hair care for a healthier scalp and visible regrowth — clinically proven in 8 weeks.',
  storeEmail: 'hello@cellaviva.com',
  storePhone: '+353 1 234 5678',
  storeWhatsapp: '',
  storeVat: '',
  storeAddress: 'Beirut, Lebanon',
  checkoutShowCountry: 'true',
  socialInstagram: 'https://instagram.com/cellaviva',
  socialFacebook: 'https://facebook.com/cellaviva',
  socialTikTok: 'https://tiktok.com/@cellaviva',
  socialTwitter: '',
  footerTagline: 'Powered by nature, backed by science.',
  copyrightText: '© 2026 CELLAVIVA LAB. All rights reserved. Registered in Ireland.',

  // ── Before/After drag slider ─────────────────────────────────────────────
  sliderTitle: 'See The Difference',
  sliderSubtitle: 'Drag the slider to compare before and after results.',
  sliderBeforeImage: '',
  sliderAfterImage: '',
  sliderBeforeLabel: 'Before',
  sliderAfterLabel: 'After',

  // ── Page section order & visibility ─────────────────────────────────────
  pageSections: [
    { id: 'hero',                 label: 'Hero',               visible: true },
    { id: 'press',                label: 'Press / As Seen In', visible: true },
    { id: 'testimonials',         label: 'Customer Reviews',   visible: true },
    { id: 'beforeafter',          label: 'Before & After',     visible: true },
    { id: 'before-after-slider',  label: 'Before/After Slider',visible: false },
    { id: 'timeline',             label: 'Results Timeline',   visible: true },
    { id: 'metrics',          label: 'Stats & Metrics',    visible: true },
    { id: 'ingredients',      label: 'Ingredients',        visible: true },
    { id: 'featured-product', label: 'Featured Product',   visible: true },
    { id: 'subscription',     label: 'Subscribe & Save',   visible: true },
    { id: 'guarantee',        label: 'Guarantee',          visible: true },
    { id: 'comparison',       label: 'Comparison Table',   visible: true },
    { id: 'faq',              label: 'FAQ',                visible: true },
  ],
}
