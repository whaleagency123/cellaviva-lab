import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | CELLAVIVA',
  description: 'Read the terms and conditions governing use of the CELLAVIVA website and purchase of our products.',
}

export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      body: `By accessing and using the CELLAVIVA website and placing orders, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our website.`,
    },
    {
      title: '2. Products and Pricing',
      body: `All prices are displayed in Euros ($) and include applicable VAT. We reserve the right to change prices at any time without notice. Product descriptions and images are for informational purposes; we make every effort to display colours accurately but cannot guarantee exact colour match on your screen.`,
    },
    {
      title: '3. Orders and Payment',
      body: `When you place an order, you are making an offer to purchase. We reserve the right to accept or decline your order. Payment must be made in full at time of order. We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay. All transactions are processed securely via Stripe.`,
    },
    {
      title: '4. Shipping and Delivery',
      body: `We ship worldwide. Standard delivery within Ireland and the EU takes 3–5 business days. International orders may take 5–10 business days. Free shipping is available on orders over $50. We are not responsible for delays caused by customs or third-party carriers.`,
    },
    {
      title: '5. Returns and Refunds',
      body: `We offer a 30-day money-back guarantee on all products. If you are not satisfied, contact us within 30 days of delivery at support@cellaviva.com. Returned items must be in original condition. Refunds are processed within 5–10 business days to your original payment method.`,
    },
    {
      title: '6. Intellectual Property',
      body: `All content on this website including text, graphics, logos, and product descriptions is the property of CELLAVIVA Ltd and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.`,
    },
    {
      title: '7. Disclaimer of Warranties',
      body: `Our products are designed to support hair health and are not intended to diagnose, treat, cure, or prevent any disease. Individual results may vary. We make no warranties, express or implied, regarding the fitness of our products for any particular purpose.`,
    },
    {
      title: '8. Governing Law',
      body: `These Terms of Service shall be governed by and construed in accordance with the laws of Ireland. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the Irish courts.`,
    },
    {
      title: '9. Contact',
      body: `For any questions regarding these Terms, please contact us at legal@cellaviva.com or write to CELLAVIVA Ltd, 12 Innovation House, Dublin 2, Ireland.`,
    },
  ]

  return (
    <main className="bg-[var(--sf-bg)] min-h-screen">
      <section className="bg-[var(--sf-dark-bg)] text-white py-20 px-4 text-center">
        <p className="text-[var(--sf-primary)] font-semibold text-sm uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-4xl sm:text-5xl font-light" style={{ fontFamily: 'var(--sf-font-display)' }}>Terms of Service</h1>
        <p className="text-white/50 text-sm mt-3">Last updated: January 1, 2026</p>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-[var(--sf-text-muted)] leading-relaxed mb-10">
          Please read these Terms of Service carefully before using the CELLAVIVA website. These terms govern your use of our website and the purchase of products from us.
        </p>
        <div className="space-y-10">
          {sections.map(s => (
            <div key={s.title}>
              <h2 className="text-lg font-bold text-[var(--sf-text)] mb-3">{s.title}</h2>
              <p className="text-[var(--sf-text-muted)] leading-relaxed text-sm">{s.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
