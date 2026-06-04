import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | CELLAVIVA',
  description: 'Learn how CELLAVIVA collects, uses, and protects your personal data in compliance with GDPR.',
}

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      body: `We collect information you provide directly to us, such as your name, email address, shipping address, and payment information when you make a purchase. We also automatically collect certain information when you visit our website, including IP address, browser type, pages viewed, and time spent on pages.`,
    },
    {
      title: '2. How We Use Your Information',
      body: `We use the information we collect to process and fulfill your orders, send you order confirmations and shipping updates, respond to your comments and questions, send you marketing communications (with your consent), and improve our website and products.`,
    },
    {
      title: '3. Sharing of Information',
      body: `We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you — so long as those parties agree to keep this information confidential.`,
    },
    {
      title: '4. Cookies',
      body: `We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. If you do not accept cookies, you may not be able to use some portions of our website.`,
    },
    {
      title: '5. Data Retention',
      body: `We retain your personal data for as long as necessary to fulfil the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements. Typically this means we retain order data for 7 years for tax purposes.`,
    },
    {
      title: '6. Your Rights (GDPR)',
      body: `If you are located in the European Economic Area, you have certain rights under the General Data Protection Regulation (GDPR), including the right to access, correct, or delete your personal data, and the right to data portability. To exercise these rights, please contact us at privacy@cellaviva.com.`,
    },
    {
      title: '7. Security',
      body: `We take the security of your data seriously and use industry-standard SSL encryption to protect your information during transmission. However, no method of transmission over the internet or method of electronic storage is 100% secure.`,
    },
    {
      title: '8. Contact Us',
      body: `If you have any questions about this Privacy Policy, please contact us at privacy@cellaviva.com or write to us at CELLAVIVA Ltd, 12 Innovation House, Dublin 2, Ireland.`,
    },
  ]

  return (
    <main className="bg-[var(--sf-bg)] min-h-screen">
      <section className="bg-[var(--sf-dark-bg)] text-white py-20 px-4 text-center">
        <p className="text-[var(--sf-primary)] font-semibold text-sm uppercase tracking-widest mb-3">Legal</p>
        <h1 className="text-4xl sm:text-5xl font-light" style={{ fontFamily: 'var(--sf-font-display)' }}>Privacy Policy</h1>
        <p className="text-white/50 text-sm mt-3">Last updated: January 1, 2026</p>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-[var(--sf-text-muted)] leading-relaxed mb-10">
          CELLAVIVA Ltd ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you visit our website or make a purchase.
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
