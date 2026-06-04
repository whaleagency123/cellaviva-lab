'use client'
import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  // Contact info from admin settings
  const [contactEmail,    setContactEmail]    = useState('hello@cellaviva.com')
  const [contactPhone,    setContactPhone]    = useState('+353 1 234 5678')
  const [contactWhatsapp, setContactWhatsapp] = useState('')
  const [contactAddress,  setContactAddress]  = useState('Dublin, Ireland')

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then((d: any) => {
        if (d.storeEmail)    setContactEmail(d.storeEmail)
        if (d.storePhone)    setContactPhone(d.storePhone)
        if (d.storeWhatsapp) setContactWhatsapp(d.storeWhatsapp)
        if (d.storeAddress)  setContactAddress(d.storeAddress)
      })
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const waUrl = contactWhatsapp
    ? `https://wa.me/${contactWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hello CELLAVIVA, I have a question...')}`
    : null

  return (
    <div className="min-h-screen bg-[#f8f9f4] py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ── Left info panel ── */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <p className="text-[#52b788] font-semibold text-sm uppercase tracking-widest mb-3">
                Get in Touch
              </p>
              <h1 className="text-4xl font-black text-[#1b1b1b]">
                We'd Love to Hear From You
              </h1>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Have a question about our products, your order, or just want to say hello? Our team
                typically responds within 24 hours.
              </p>
            </div>

            {/* Contact info items */}
            <div className="space-y-4">
              {/* Email */}
              <a href={`mailto:${contactEmail}`}
                className="flex items-start gap-4 group hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-[#d8f3dc] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#2d6a4f]" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Email</p>
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-[#2d6a4f] transition-colors">
                    {contactEmail}
                  </p>
                </div>
              </a>

              {/* Phone */}
              {contactPhone && (
                <a href={`tel:${contactPhone.replace(/\s/g, '')}`}
                  className="flex items-start gap-4 group hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 bg-[#d8f3dc] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#2d6a4f]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Phone</p>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-[#2d6a4f] transition-colors">
                      {contactPhone}
                    </p>
                  </div>
                </a>
              )}

              {/* Address */}
              {contactAddress && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#d8f3dc] rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#2d6a4f]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Address</p>
                    <p className="text-sm font-semibold text-gray-800">{contactAddress}</p>
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp button */}
            {waUrl && (
              <a href={waUrl} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-white text-sm transition-all hover:opacity-90 shadow-sm"
                style={{ background: '#25D366' }}>
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
            )}
          </div>

          {/* ── Right form ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-sm p-8 sm:p-10">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle className="w-16 h-16 text-[#52b788] mb-4" />
                  <h3 className="text-2xl font-black text-[#1b1b1b] mb-2">Message Sent!</h3>
                  <p className="text-gray-600">
                    Thanks for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button onClick={() => setStatus('idle')} className="mt-6 text-sm text-[#2d6a4f] underline">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Full Name <span className="text-red-400">*</span>
                      </label>
                      <input type="text" required value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Jane Smith"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:border-transparent transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Email Address <span className="text-red-400">*</span>
                      </label>
                      <input type="email" required value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="jane@example.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:border-transparent transition" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Phone Number <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input type="tel" value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:border-transparent transition" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea required rows={6} value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#52b788] focus:border-transparent transition resize-none" />
                  </div>

                  {status === 'error' && (
                    <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
                  )}

                  <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
                    <Send className="w-4 h-4" />
                    {status === 'loading' ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
