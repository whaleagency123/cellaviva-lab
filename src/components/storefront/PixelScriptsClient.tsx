'use client'
import Script from 'next/script'

interface Props {
  metaId: string; gtmId: string; tiktokId: string; pinterestId: string; snapchatId: string
}

export function PixelScriptsClient({ metaId, gtmId, tiktokId, pinterestId, snapchatId }: Props) {
  return (
    <>
      {metaId && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${metaId}');fbq('track','PageView');
          `}</Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img height="1" width="1" style={{ display: 'none' }}
              src={`https://www.facebook.com/tr?id=${metaId}&ev=PageView&noscript=1`} alt="" />
          </noscript>
        </>
      )}

      {gtmId && (
        <>
          <Script id="gtm" strategy="afterInteractive">{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `}</Script>
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
          </noscript>
        </>
      )}

      {tiktokId && (
        <Script id="tiktok-pixel" strategy="afterInteractive">{`
          !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
          ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
          ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
          for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
          ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
          ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._n=ttq._n||{};ttq._n[e]=!0;
          var o=document.createElement("script");o.async=!0;
          o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];
          a.parentNode.insertBefore(o,a)};ttq.load('${tiktokId}');ttq.page();
          }(window,document,'ttq');
        `}</Script>
      )}

      {pinterestId && (
        <Script id="pinterest-tag" strategy="afterInteractive">{`
          !function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};
          var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");
          t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}
          ("https://s.pinimg.com/ct/core.js");pintrk('load','${pinterestId}');pintrk('page');
        `}</Script>
      )}

      {snapchatId && (
        <Script id="snapchat-pixel" strategy="afterInteractive">{`
          (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){a.handleRequest?
          a.handleRequest.apply(a,arguments):a.queue.push(arguments)};a.queue=[];
          var s='script';r=t.createElement(s);r.async=!0;r.src=n;
          var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);
          })(window,document,'https://sc-static.net/scevent.min.js');
          snaptr('init','${snapchatId}');snaptr('track','PAGE_VIEW');
        `}</Script>
      )}
    </>
  )
}
