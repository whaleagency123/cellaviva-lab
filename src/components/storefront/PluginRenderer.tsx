'use client'
import { useEffect, useState } from 'react'
import Script from 'next/script'
import type { Plugin } from '@/types'

interface Props {
  plugins: Plugin[]
}

export function PluginRenderer({ plugins }: Props) {
  const enabled = plugins.filter(p => p.enabled)
  const byId = (id: string) => enabled.find(p => p.id === id)

  const ga      = byId('google_analytics')
  const fb      = byId('facebook_pixel')
  const wa      = byId('whatsapp_chat')
  const cookie  = byId('cookie_banner')
  const popup   = byId('exit_popup')
  const tawk    = byId('tawkto')
  const crisp   = byId('crisp_chat')
  const tidio   = byId('tidio')
  const hotjar  = byId('hotjar')
  const clarity = byId('microsoft_clarity')
  const klaviyo = byId('klaviyo')
  const custom  = enabled.filter(p => p.id === 'custom_code' || p.id.startsWith('custom_'))

  return (
    <>
      {/* Google Analytics 4 */}
      {ga?.settings.measurementId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga.settings.measurementId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">{`
            window.dataLayer=window.dataLayer||[];
            function gtag(){dataLayer.push(arguments);}
            gtag('js',new Date());
            gtag('config','${ga.settings.measurementId}');
          `}</Script>
        </>
      )}

      {/* Facebook Pixel */}
      {fb?.settings.pixelId && (
        <Script id="fb-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init','${fb.settings.pixelId}');fbq('track','PageView');
        `}</Script>
      )}

      {/* Hotjar */}
      {hotjar?.settings.siteId && (
        <Script id="hotjar" strategy="afterInteractive">{`
          (function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${hotjar.settings.siteId},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}</Script>
      )}

      {/* Microsoft Clarity */}
      {clarity?.settings.projectId && (
        <Script id="ms-clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarity.settings.projectId}");
        `}</Script>
      )}

      {/* Tawk.to */}
      {tawk?.settings.propertyId && (
        <Script id="tawkto" strategy="afterInteractive">{`
          var Tawk_API=Tawk_API||{},Tawk_LoadStart=new Date();
          (function(){var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];s1.async=true;s1.src='https://embed.tawk.to/${tawk.settings.propertyId}/${tawk.settings.widgetId||'default'}';s1.charset='UTF-8';s1.setAttribute('crossorigin','*');s0.parentNode.insertBefore(s1,s0);})();
        `}</Script>
      )}

      {/* Crisp Chat */}
      {crisp?.settings.websiteId && (
        <Script id="crisp-chat" strategy="afterInteractive">{`
          window.$crisp=[];window.CRISP_WEBSITE_ID="${crisp.settings.websiteId}";
          (function(){var d=document;var s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
        `}</Script>
      )}

      {/* Tidio */}
      {tidio?.settings.publicKey && (
        <Script src={`//code.tidio.co/${tidio.settings.publicKey}.js`} strategy="afterInteractive" />
      )}

      {/* Klaviyo */}
      {klaviyo?.settings.companyId && (
        <Script src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${klaviyo.settings.companyId}`} strategy="afterInteractive" />
      )}

      {/* WhatsApp Chat */}
      {wa?.settings.phoneNumber && <WhatsAppButton plugin={wa} />}

      {/* Cookie Banner */}
      {cookie && <CookieBanner plugin={cookie} />}

      {/* Exit Intent Popup */}
      {popup && <ExitIntentPopup plugin={popup} />}

      {/* Custom Code blocks */}
      {custom.map(p => p.settings.code ? <CustomCode key={p.id} plugin={p} /> : null)}
    </>
  )
}

function WhatsAppButton({ plugin }: { plugin: Plugin }) {
  const { phoneNumber, greeting, position } = plugin.settings
  const href = `https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(greeting ?? '')}`
  const side = position === 'left' ? 'left-5' : 'right-5'
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 ${side} z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  )
}

function CookieBanner({ plugin }: { plugin: Plugin }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) setVisible(true)
  }, [])
  if (!visible) return null
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1e2b] border-t border-white/10 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
      <p className="text-sm text-white/70 flex-1">{plugin.settings.message}</p>
      <div className="flex gap-3 flex-shrink-0">
        <button
          onClick={() => { localStorage.setItem('cookie_consent', 'declined'); setVisible(false) }}
          className="px-4 py-2 rounded-xl text-sm text-white/50 bg-white/8 hover:bg-white/12 transition-colors"
        >
          {plugin.settings.declineText || 'Decline'}
        </button>
        <button
          onClick={() => { localStorage.setItem('cookie_consent', 'accepted'); setVisible(false) }}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#4ade80] text-[#0b0d13] hover:bg-[#22c55e] transition-colors"
        >
          {plugin.settings.acceptText || 'Accept All'}
        </button>
      </div>
    </div>
  )
}

function CustomCode({ plugin }: { plugin: Plugin }) {
  useEffect(() => {
    const code = plugin.settings.code
    if (!code) return
    const container = document.createElement('div')
    container.innerHTML = code
    // Execute any <script> tags
    container.querySelectorAll('script').forEach(old => {
      const s = document.createElement('script')
      Array.from(old.attributes).forEach(a => s.setAttribute(a.name, a.value))
      s.textContent = old.textContent
      document.body.appendChild(s)
    })
    // Inject <style> and <link> into head
    container.querySelectorAll('style, link').forEach(el => {
      document.head.appendChild(el.cloneNode(true))
    })
    // Inject remaining non-script/non-style elements into body
    container.querySelectorAll(':not(script):not(style):not(link)').forEach(el => {
      document.body.appendChild(el.cloneNode(true))
    })
  }, [plugin.settings.code])
  return null
}

function ExitIntentPopup({ plugin }: { plugin: Plugin }) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('popup_shown') || dismissed) return
    const delay = Number(plugin.settings.delaySeconds ?? 3) * 1000
    const timer = setTimeout(() => {
      const handler = () => {
        if (window.event && (window.event as MouseEvent).clientY <= 10) {
          setVisible(true)
          sessionStorage.setItem('popup_shown', '1')
          document.removeEventListener('mousemove', handler)
        }
      }
      document.addEventListener('mousemove', handler)
    }, delay)
    return () => clearTimeout(timer)
  }, [plugin.settings.delaySeconds, dismissed])

  if (!visible || dismissed) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" onClick={() => setDismissed(true)}>
      <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
        <p className="text-3xl mb-1">🎁</p>
        <h2 className="text-2xl font-black text-gray-900 mt-3 mb-2">{plugin.settings.headline}</h2>
        <p className="text-gray-500 text-sm mb-6">{plugin.settings.body}</p>
        {plugin.settings.discountCode && (
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl px-5 py-3 mb-6 font-mono font-bold text-lg text-gray-700 tracking-widest">
            {plugin.settings.discountCode}
          </div>
        )}
        <a
          href="/products"
          className="block w-full bg-[#3a79a9] text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-[#2d6089] transition-colors mb-3"
        >
          {plugin.settings.buttonText || 'Shop Now'}
        </a>
        <button onClick={() => setDismissed(true)} className="text-xs text-gray-400 hover:text-gray-600">
          No thanks, I'll pay full price
        </button>
      </div>
    </div>
  )
}
