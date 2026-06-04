'use client'
import { useState, useEffect, useCallback } from 'react'
import { Save, Plus, Trash2, Eye, EyeOff, Code2, BookOpen, Check, Pencil, X, GripVertical } from 'lucide-react'
import type { CustomSection } from '@/types'

// ── section templates ────────────────────────────────────────────────────────

interface Template {
  id: string
  name: string
  category: string
  description: string
  html: string
}

const TEMPLATES: Template[] = [
  // ── Hero / Banner ─────────────────────────────────────────────────────────
  {
    id: 'tpl_hero_dark',
    name: 'Dark Centered Hero',
    category: 'Hero',
    description: 'Full-width dark hero with headline, subtitle, and two CTA buttons.',
    html: `<section style="background:linear-gradient(135deg,#0f1117 0%,#1a1f35 100%);padding:100px 24px;text-align:center;">
  <div style="max-width:820px;margin:0 auto;">
    <p style="color:var(--sf-primary,#3a79a9);font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;margin-bottom:16px;">🌿 New Collection</p>
    <h1 style="font-family:var(--sf-font-display,Georgia,serif);font-size:clamp(2.2rem,5vw,4rem);font-weight:700;color:#fff;line-height:1.1;margin-bottom:24px;">Transform Your Hair in Just 4 Weeks</h1>
    <p style="font-size:1.1rem;color:rgba(255,255,255,.6);max-width:580px;margin:0 auto 40px;line-height:1.75;">Plant-based technology meets clinical science. Trusted by 12,000+ customers worldwide.</p>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
      <a href="/products" style="display:inline-block;background:var(--sf-primary,#3a79a9);color:#fff;padding:14px 36px;border-radius:999px;font-weight:700;font-size:15px;text-decoration:none;">Shop Now</a>
      <a href="/quiz" style="display:inline-block;background:rgba(255,255,255,.08);color:#fff;padding:14px 36px;border-radius:999px;font-weight:600;font-size:15px;text-decoration:none;border:1px solid rgba(255,255,255,.2);">Take the Quiz →</a>
    </div>
  </div>
</section>`,
  },
  {
    id: 'tpl_hero_light',
    name: 'Light Split Hero',
    category: 'Hero',
    description: 'Two-column hero — headline & text on the left, product image on the right.',
    html: `<section style="background:var(--sf-bg,#f6f5f3);padding:80px 24px;">
  <div style="max-width:1120px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;">
    <div>
      <span style="display:inline-block;background:var(--sf-primary,#3a79a9);color:#fff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;padding:4px 14px;border-radius:999px;margin-bottom:20px;">Best Seller</span>
      <h1 style="font-family:var(--sf-font-display,Georgia,serif);font-size:clamp(2rem,4vw,3.25rem);font-weight:700;color:var(--sf-text,#222);line-height:1.15;margin-bottom:20px;">Nature's Answer to Hair Loss</h1>
      <p style="font-size:1rem;color:#666;line-height:1.75;margin-bottom:32px;">Stemuvita™ blends 11 plant-derived actives to nourish your scalp, reduce shedding, and restore shine — without a single harsh chemical.</p>
      <a href="/products" style="display:inline-block;background:var(--sf-primary,#3a79a9);color:#fff;padding:14px 36px;border-radius:999px;font-weight:700;font-size:15px;text-decoration:none;">Shop the Routine</a>
    </div>
    <div style="background:linear-gradient(135deg,var(--sf-primary,#3a79a9)22,#e8f4f8);border-radius:32px;height:380px;display:flex;align-items:center;justify-content:center;font-size:64px;">🌿</div>
  </div>
</section>`,
  },
  {
    id: 'tpl_announcement',
    name: 'Sale Announcement Strip',
    category: 'Hero',
    description: 'Full-width colored strip with a sale/promotion message and CTA.',
    html: `<section style="background:var(--sf-primary,#3a79a9);padding:20px 24px;text-align:center;">
  <p style="color:#fff;font-size:1rem;font-weight:600;margin:0;">🎉 Limited Offer: Get <strong>20% off</strong> your first order — Use code <code style="background:rgba(255,255,255,.2);padding:2px 8px;border-radius:6px;">WELCOME20</code> at checkout &nbsp;<a href="/products" style="color:#fff;font-weight:700;text-decoration:underline;white-space:nowrap;">Shop Now →</a></p>
</section>`,
  },

  // ── Features ──────────────────────────────────────────────────────────────
  {
    id: 'tpl_features_3col',
    name: '3-Column Features',
    category: 'Features',
    description: 'Three feature cards with emoji icon, heading, and description.',
    html: `<section style="background:var(--sf-bg,#f6f5f3);padding:80px 24px;">
  <div style="max-width:1120px;margin:0 auto;text-align:center;">
    <h2 style="font-family:var(--sf-font-display,Georgia,serif);font-size:clamp(1.75rem,4vw,2.75rem);font-weight:700;color:var(--sf-text,#222);margin-bottom:16px;">Why Stemuvita™ Works</h2>
    <p style="color:#666;max-width:560px;margin:0 auto 56px;line-height:1.75;">Three core pillars behind every drop.</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:28px;">
      <div style="background:#fff;border-radius:24px;padding:40px 32px;box-shadow:0 2px 24px rgba(0,0,0,.06);">
        <div style="font-size:2.5rem;margin-bottom:20px;">🌱</div>
        <h3 style="font-size:1.2rem;font-weight:700;color:var(--sf-text,#222);margin-bottom:12px;">100% Plant-Based</h3>
        <p style="color:#666;line-height:1.7;font-size:.95rem;">Zero sulfates, parabens, or silicones. Every ingredient is clean, vegan, and cruelty-free.</p>
      </div>
      <div style="background:#fff;border-radius:24px;padding:40px 32px;box-shadow:0 2px 24px rgba(0,0,0,.06);">
        <div style="font-size:2.5rem;margin-bottom:20px;">🔬</div>
        <h3 style="font-size:1.2rem;font-weight:700;color:var(--sf-text,#222);margin-bottom:12px;">Clinically Tested</h3>
        <p style="color:#666;line-height:1.7;font-size:.95rem;">Proven in double-blind trials. 91% of users report reduced shedding within 8 weeks.</p>
      </div>
      <div style="background:#fff;border-radius:24px;padding:40px 32px;box-shadow:0 2px 24px rgba(0,0,0,.06);">
        <div style="font-size:2.5rem;margin-bottom:20px;">⚡</div>
        <h3 style="font-size:1.2rem;font-weight:700;color:var(--sf-text,#222);margin-bottom:12px;">Fast Results</h3>
        <p style="color:#666;line-height:1.7;font-size:.95rem;">Visible improvements in as little as 4 weeks when used as part of a consistent daily routine.</p>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'tpl_features_icons',
    name: '4-Icon Benefit Grid',
    category: 'Features',
    description: 'A 2×2 grid of benefit tiles — clean and compact.',
    html: `<section style="background:#fff;padding:72px 24px;">
  <div style="max-width:960px;margin:0 auto;">
    <h2 style="font-family:var(--sf-font-display,Georgia,serif);font-size:clamp(1.6rem,3.5vw,2.5rem);font-weight:700;color:var(--sf-text,#222);text-align:center;margin-bottom:48px;">Everything You Need, Nothing You Don't</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
      <div style="display:flex;gap:20px;align-items:flex-start;background:var(--sf-bg,#f6f5f3);border-radius:20px;padding:28px;">
        <span style="font-size:2rem;flex-shrink:0;">💧</span>
        <div><h4 style="font-weight:700;color:var(--sf-text,#222);margin-bottom:8px;">Deep Hydration</h4><p style="color:#666;font-size:.9rem;line-height:1.65;">Locks in moisture from root to tip, preventing breakage and dryness.</p></div>
      </div>
      <div style="display:flex;gap:20px;align-items:flex-start;background:var(--sf-bg,#f6f5f3);border-radius:20px;padding:28px;">
        <span style="font-size:2rem;flex-shrink:0;">🛡️</span>
        <div><h4 style="font-weight:700;color:var(--sf-text,#222);margin-bottom:8px;">Scalp Protection</h4><p style="color:#666;font-size:.9rem;line-height:1.65;">Anti-inflammatory actives calm irritation and reduce flaking.</p></div>
      </div>
      <div style="display:flex;gap:20px;align-items:flex-start;background:var(--sf-bg,#f6f5f3);border-radius:20px;padding:28px;">
        <span style="font-size:2rem;flex-shrink:0;">✨</span>
        <div><h4 style="font-weight:700;color:var(--sf-text,#222);margin-bottom:8px;">Shine & Softness</h4><p style="color:#666;font-size:.9rem;line-height:1.65;">Lightweight formula adds mirror-like shine without greasiness.</p></div>
      </div>
      <div style="display:flex;gap:20px;align-items:flex-start;background:var(--sf-bg,#f6f5f3);border-radius:20px;padding:28px;">
        <span style="font-size:2rem;flex-shrink:0;">🌿</span>
        <div><h4 style="font-weight:700;color:var(--sf-text,#222);margin-bottom:8px;">Eco Packaging</h4><p style="color:#666;font-size:.9rem;line-height:1.65;">100% recyclable bottles. Our carbon footprint is offset every quarter.</p></div>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'tpl_features_alt',
    name: 'Alternating Image + Text',
    category: 'Features',
    description: 'Two-row alternating layout — image/icon block beside descriptive text.',
    html: `<section style="background:var(--sf-bg,#f6f5f3);padding:80px 24px;">
  <div style="max-width:960px;margin:0 auto;display:flex;flex-direction:column;gap:64px;">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;">
      <div style="background:linear-gradient(135deg,#e8f4f8,#d1e9f3);border-radius:28px;height:280px;display:flex;align-items:center;justify-content:center;font-size:72px;">🔬</div>
      <div>
        <p style="color:var(--sf-primary,#3a79a9);font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Step 01</p>
        <h3 style="font-family:var(--sf-font-display,Georgia,serif);font-size:1.75rem;font-weight:700;color:var(--sf-text,#222);margin-bottom:16px;">The Science of Stem Cells</h3>
        <p style="color:#666;line-height:1.75;">Our patented plant stem cell technology targets follicles at the root level, reactivating dormant growth cycles and extending the anagen phase.</p>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;">
      <div>
        <p style="color:var(--sf-primary,#3a79a9);font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;">Step 02</p>
        <h3 style="font-family:var(--sf-font-display,Georgia,serif);font-size:1.75rem;font-weight:700;color:var(--sf-text,#222);margin-bottom:16px;">Daily Ritual, Lasting Results</h3>
        <p style="color:#666;line-height:1.75;">Two minutes a day with Stemuvita™ — apply, massage, and let the formula work overnight. No rinsing required for the serum.</p>
      </div>
      <div style="background:linear-gradient(135deg,#f0ebe4,#e8e0d8);border-radius:28px;height:280px;display:flex;align-items:center;justify-content:center;font-size:72px;">🌿</div>
    </div>
  </div>
</section>`,
  },

  // ── Social Proof ──────────────────────────────────────────────────────────
  {
    id: 'tpl_stats',
    name: 'Stats / Metrics Row',
    category: 'Social Proof',
    description: 'Four bold statistics displayed horizontally — great for trust-building.',
    html: `<section style="background:var(--sf-dark-bg,#111);padding:64px 24px;">
  <div style="max-width:1000px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:32px;text-align:center;">
    <div><p style="font-family:var(--sf-font-display,Georgia,serif);font-size:3rem;font-weight:700;color:var(--sf-primary,#3a79a9);line-height:1;">12K+</p><p style="color:rgba(255,255,255,.5);font-size:.85rem;margin-top:8px;text-transform:uppercase;letter-spacing:.08em;">Happy Customers</p></div>
    <div><p style="font-family:var(--sf-font-display,Georgia,serif);font-size:3rem;font-weight:700;color:var(--sf-primary,#3a79a9);line-height:1;">4.9★</p><p style="color:rgba(255,255,255,.5);font-size:.85rem;margin-top:8px;text-transform:uppercase;letter-spacing:.08em;">Average Rating</p></div>
    <div><p style="font-family:var(--sf-font-display,Georgia,serif);font-size:3rem;font-weight:700;color:var(--sf-primary,#3a79a9);line-height:1;">91%</p><p style="color:rgba(255,255,255,.5);font-size:.85rem;margin-top:8px;text-transform:uppercase;letter-spacing:.08em;">Reduced Shedding</p></div>
    <div><p style="font-family:var(--sf-font-display,Georgia,serif);font-size:3rem;font-weight:700;color:var(--sf-primary,#3a79a9);line-height:1;">4 wks</p><p style="color:rgba(255,255,255,.5);font-size:.85rem;margin-top:8px;text-transform:uppercase;letter-spacing:.08em;">To First Results</p></div>
  </div>
</section>`,
  },
  {
    id: 'tpl_testimonial_spotlight',
    name: 'Testimonial Spotlight',
    category: 'Social Proof',
    description: 'One large featured testimonial with star rating, quote, and attribution.',
    html: `<section style="background:#fff;padding:80px 24px;text-align:center;">
  <div style="max-width:720px;margin:0 auto;">
    <div style="font-size:1.25rem;color:#f59e0b;letter-spacing:.1em;margin-bottom:28px;">★★★★★</div>
    <blockquote style="font-family:var(--sf-font-display,Georgia,serif);font-size:clamp(1.35rem,3vw,2rem);font-weight:500;color:var(--sf-text,#222);line-height:1.55;margin:0 0 32px;font-style:italic;">"I was losing handfuls of hair every shower. After 6 weeks with Stemuvita, my drain is nearly clear. I genuinely didn't think anything would work — this did."</blockquote>
    <div style="display:inline-flex;align-items:center;gap:14px;background:var(--sf-bg,#f6f5f3);border-radius:999px;padding:10px 24px;">
      <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--sf-primary,#3a79a9),#64b3d9);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;">S</div>
      <div style="text-align:left;"><p style="font-weight:700;color:var(--sf-text,#222);font-size:.9rem;">Sarah M., 34</p><p style="color:#999;font-size:.8rem;">Verified Buyer · Dublin, IE</p></div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'tpl_logo_bar',
    name: 'Press / Logo Bar',
    category: 'Social Proof',
    description: '"As featured in" press mention bar with publication names.',
    html: `<section style="background:var(--sf-bg,#f6f5f3);padding:48px 24px;border-top:1px solid rgba(0,0,0,.07);border-bottom:1px solid rgba(0,0,0,.07);">
  <div style="max-width:960px;margin:0 auto;text-align:center;">
    <p style="text-transform:uppercase;font-size:11px;letter-spacing:.18em;color:#999;font-weight:700;margin-bottom:28px;">As Seen In</p>
    <div style="display:flex;align-items:center;justify-content:center;gap:40px;flex-wrap:wrap;">
      <span style="font-family:Georgia,serif;font-weight:700;font-size:1.5rem;color:#bbb;letter-spacing:.05em;">Vogue</span>
      <span style="font-weight:900;font-size:1.3rem;color:#bbb;letter-spacing:.25em;">ELLE</span>
      <span style="font-family:Georgia,serif;font-style:italic;font-weight:700;font-size:1.4rem;color:#bbb;">Forbes</span>
      <span style="font-family:Georgia,serif;letter-spacing:.12em;font-size:1.2rem;color:#bbb;">Allure</span>
      <span style="font-weight:700;font-size:.9rem;letter-spacing:.1em;text-transform:uppercase;color:#bbb;">Women's Health</span>
    </div>
  </div>
</section>`,
  },

  // ── CTA ────────────────────────────────────────────────────────────────────
  {
    id: 'tpl_cta_center',
    name: 'Simple Centered CTA',
    category: 'CTA',
    description: 'Clean full-width call-to-action section with heading and a single button.',
    html: `<section style="background:var(--sf-primary,#3a79a9);padding:80px 24px;text-align:center;">
  <div style="max-width:640px;margin:0 auto;">
    <h2 style="font-family:var(--sf-font-display,Georgia,serif);font-size:clamp(1.75rem,4vw,2.75rem);font-weight:700;color:#fff;margin-bottom:20px;">Ready to Transform Your Hair?</h2>
    <p style="color:rgba(255,255,255,.75);font-size:1.05rem;line-height:1.7;margin-bottom:36px;">Join 12,000+ customers who've made Stemuvita™ part of their daily routine. Free shipping on orders €50+.</p>
    <a href="/products" style="display:inline-block;background:#fff;color:var(--sf-primary,#3a79a9);padding:15px 44px;border-radius:999px;font-weight:800;font-size:15px;text-decoration:none;">Shop Now — Free Shipping</a>
  </div>
</section>`,
  },
  {
    id: 'tpl_email_signup',
    name: 'Email Sign-Up Section',
    category: 'CTA',
    description: 'Newsletter subscribe block — discount offer, input field, and submit button.',
    html: `<section style="background:var(--sf-dark-bg,#111);padding:80px 24px;text-align:center;">
  <div style="max-width:600px;margin:0 auto;">
    <p style="font-size:2.5rem;margin-bottom:16px;">💌</p>
    <h2 style="font-family:var(--sf-font-display,Georgia,serif);font-size:clamp(1.5rem,3.5vw,2.25rem);font-weight:700;color:#fff;margin-bottom:12px;">Get 10% Off Your First Order</h2>
    <p style="color:rgba(255,255,255,.5);line-height:1.7;margin-bottom:32px;">Join 12,000+ subscribers for exclusive deals, hair care tips, and early access.</p>
    <div style="display:flex;gap:8px;max-width:440px;margin:0 auto;">
      <input type="email" placeholder="your@email.com" style="flex:1;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.15);border-radius:999px;padding:13px 20px;color:#fff;font-size:14px;outline:none;" />
      <button style="background:var(--sf-primary,#3a79a9);color:#fff;padding:13px 24px;border-radius:999px;font-weight:700;font-size:14px;border:none;cursor:pointer;white-space:nowrap;">Get 10% Off</button>
    </div>
    <p style="color:rgba(255,255,255,.25);font-size:12px;margin-top:16px;">Unsubscribe anytime. No spam, ever.</p>
  </div>
</section>`,
  },
  {
    id: 'tpl_urgency',
    name: 'Urgency / Flash Sale Strip',
    category: 'CTA',
    description: 'Eye-catching coloured strip with a limited-time offer message.',
    html: `<section style="background:linear-gradient(90deg,#dc2626,#b91c1c);padding:18px 24px;text-align:center;">
  <p style="color:#fff;font-size:15px;font-weight:600;margin:0;">⚡ Flash Sale — <strong>30% OFF everything</strong> today only · Ends at midnight · <a href="/products" style="color:#fff;text-decoration:underline;font-weight:700;">Claim Your Discount →</a></p>
</section>`,
  },

  // ── Content ────────────────────────────────────────────────────────────────
  {
    id: 'tpl_process_steps',
    name: 'Process / Steps',
    category: 'Content',
    description: 'Numbered step-by-step guide — ideal for "how it works" sections.',
    html: `<section style="background:#fff;padding:80px 24px;">
  <div style="max-width:960px;margin:0 auto;">
    <h2 style="font-family:var(--sf-font-display,Georgia,serif);font-size:clamp(1.75rem,4vw,2.75rem);font-weight:700;color:var(--sf-text,#222);text-align:center;margin-bottom:56px;">How It Works</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:32px;">
      <div style="text-align:center;">
        <div style="width:56px;height:56px;border-radius:50%;background:var(--sf-primary,#3a79a9);color:#fff;font-size:1.25rem;font-weight:800;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">1</div>
        <h4 style="font-weight:700;color:var(--sf-text,#222);margin-bottom:10px;font-size:1.05rem;">Cleanse</h4>
        <p style="color:#888;font-size:.9rem;line-height:1.7;">Apply the Stemuvita™ Cleanser to wet hair. Massage gently for 60 seconds.</p>
      </div>
      <div style="text-align:center;">
        <div style="width:56px;height:56px;border-radius:50%;background:var(--sf-primary,#3a79a9);color:#fff;font-size:1.25rem;font-weight:800;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">2</div>
        <h4 style="font-weight:700;color:var(--sf-text,#222);margin-bottom:10px;font-size:1.05rem;">Apply Serum</h4>
        <p style="color:#888;font-size:.9rem;line-height:1.7;">Section towel-dried hair and apply 5–7 drops of Serum directly to the scalp.</p>
      </div>
      <div style="text-align:center;">
        <div style="width:56px;height:56px;border-radius:50%;background:var(--sf-primary,#3a79a9);color:#fff;font-size:1.25rem;font-weight:800;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">3</div>
        <h4 style="font-weight:700;color:var(--sf-text,#222);margin-bottom:10px;font-size:1.05rem;">Massage</h4>
        <p style="color:#888;font-size:.9rem;line-height:1.7;">Use fingertips to massage for 2 minutes — boosts circulation and absorption.</p>
      </div>
      <div style="text-align:center;">
        <div style="width:56px;height:56px;border-radius:50%;background:var(--sf-primary,#3a79a9);color:#fff;font-size:1.25rem;font-weight:800;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;">4</div>
        <h4 style="font-weight:700;color:var(--sf-text,#222);margin-bottom:10px;font-size:1.05rem;">See Results</h4>
        <p style="color:#888;font-size:.9rem;line-height:1.7;">Repeat daily. Most users notice visible improvement within 2–4 weeks.</p>
      </div>
    </div>
  </div>
</section>`,
  },
  {
    id: 'tpl_shipping_strip',
    name: 'Shipping Info Strip',
    category: 'Content',
    description: 'Four trust/shipping icons in a horizontal band — placed above or below sections.',
    html: `<section style="background:#fff;border-top:1px solid rgba(0,0,0,.07);border-bottom:1px solid rgba(0,0,0,.07);padding:28px 24px;">
  <div style="max-width:1000px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:24px;text-align:center;">
    <div><p style="font-size:1.5rem;margin-bottom:8px;">🚚</p><p style="font-size:.8rem;font-weight:700;color:var(--sf-text,#222);">Free Shipping</p><p style="font-size:.75rem;color:#999;">On orders €50+</p></div>
    <div><p style="font-size:1.5rem;margin-bottom:8px;">↩️</p><p style="font-size:.8rem;font-weight:700;color:var(--sf-text,#222);">30-Day Returns</p><p style="font-size:.75rem;color:#999;">No questions asked</p></div>
    <div><p style="font-size:1.5rem;margin-bottom:8px;">🔒</p><p style="font-size:.8rem;font-weight:700;color:var(--sf-text,#222);">Secure Checkout</p><p style="font-size:.75rem;color:#999;">SSL encrypted</p></div>
    <div><p style="font-size:1.5rem;margin-bottom:8px;">🌿</p><p style="font-size:.8rem;font-weight:700;color:var(--sf-text,#222);">100% Natural</p><p style="font-size:.75rem;color:#999;">No harsh chemicals</p></div>
  </div>
</section>`,
  },
  {
    id: 'tpl_about',
    name: 'About / Brand Story',
    category: 'Content',
    description: 'Centred brand story section with tagline, paragraph text, and a link.',
    html: `<section style="background:var(--sf-bg,#f6f5f3);padding:88px 24px;text-align:center;">
  <div style="max-width:720px;margin:0 auto;">
    <p style="text-transform:uppercase;font-size:12px;letter-spacing:.18em;color:var(--sf-primary,#3a79a9);font-weight:700;margin-bottom:20px;">Our Story</p>
    <h2 style="font-family:var(--sf-font-display,Georgia,serif);font-size:clamp(1.75rem,4vw,2.75rem);font-weight:700;color:var(--sf-text,#222);line-height:1.25;margin-bottom:28px;">Born From Frustration.<br>Built on Science.</h2>
    <p style="color:#666;line-height:1.85;font-size:1.05rem;margin-bottom:36px;">CELLAVIVA started when our founder watched her mother struggle with postpartum hair loss for years. After finding nothing that worked — only expensive products full of chemicals — she partnered with trichologists to create a genuinely effective, clean formula. Stemuvita™ was born.</p>
    <a href="/about" style="color:var(--sf-primary,#3a79a9);font-weight:700;text-decoration:none;font-size:.95rem;border-bottom:2px solid var(--sf-primary,#3a79a9);padding-bottom:2px;">Read the full story →</a>
  </div>
</section>`,
  },

  // ── Before / After ────────────────────────────────────────────────────────
  {
    id: 'tpl_before_after_slider',
    name: 'Before / After Slider',
    category: 'Social Proof',
    description: 'Interactive drag-to-compare image slider. Replace the placeholder gradients with real before/after photos.',
    html: `<section style="padding:80px 24px;background:var(--sf-bg,#f6f5f3)">
  <div style="max-width:900px;margin:0 auto;text-align:center">
    <h2 style="font-family:var(--sf-font-display,Georgia,serif);font-size:clamp(1.75rem,4vw,2.5rem);font-weight:700;color:var(--sf-text,#222);margin-bottom:12px">See The Difference</h2>
    <p style="color:#666;margin-bottom:40px;font-size:1rem;line-height:1.75">Drag the slider left or right to compare before and after results.</p>
    <div style="position:relative;border-radius:24px;overflow:hidden;aspect-ratio:16/9;cursor:col-resize;box-shadow:0 8px 40px rgba(0,0,0,.12)">
      <div style="position:absolute;inset:0;background:linear-gradient(135deg,#4ade80,#3a79a9);display:flex;align-items:center;justify-content:center">
        <span style="font-size:80px;opacity:.45">✨</span>
      </div>
      <span style="position:absolute;top:16px;right:16px;z-index:10;background:rgba(0,0,0,.5);color:#fff;font-size:12px;font-weight:700;padding:6px 14px;border-radius:999px">After</span>
      <div class="ba-b" style="position:absolute;inset:0;clip-path:inset(0 50% 0 0);background:linear-gradient(135deg,#8b9cc0,#c4b5a0);display:flex;align-items:center;justify-content:center">
        <span style="font-size:80px;opacity:.45">😔</span>
      </div>
      <span style="position:absolute;top:16px;left:16px;z-index:10;background:rgba(0,0,0,.5);color:#fff;font-size:12px;font-weight:700;padding:6px 14px;border-radius:999px">Before</span>
      <div class="ba-l" style="position:absolute;inset-block:0;left:50%;width:2px;background:#fff;z-index:20;pointer-events:none;transform:translateX(-50%)"></div>
      <div class="ba-h" style="position:absolute;top:50%;left:50%;z-index:25;width:40px;height:40px;border-radius:50%;background:#fff;box-shadow:0 2px 16px rgba(0,0,0,.2);display:flex;align-items:center;justify-content:center;transform:translate(-50%,-50%);pointer-events:none">
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none"><path d="M7 1L1 6L7 11" stroke="#374151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 1L19 6L13 11" stroke="#374151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <input type="range" min="0" max="100" value="50" oninput="var p=this.value,c=this.parentElement;c.querySelector('.ba-b').style.clipPath='inset(0 '+(100-p)+'% 0 0)';c.querySelector('.ba-l').style.left=p+'%';c.querySelector('.ba-h').style.left=p+'%'" style="position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:col-resize;z-index:30;margin:0;padding:0">
      <div style="position:absolute;bottom:16px;left:50%;transform:translateX(-50%);z-index:10;background:rgba(0,0,0,.5);color:#fff;font-size:12px;font-weight:500;padding:6px 14px;border-radius:999px;pointer-events:none;white-space:nowrap">← Drag to compare →</div>
    </div>
  </div>
</section>`,
  },

  // ── Misc ───────────────────────────────────────────────────────────────────
  {
    id: 'tpl_trust_badges',
    name: 'Trust Badges Row',
    category: 'Misc',
    description: 'Certification/trust badge strip — vegan, cruelty-free, pH balanced, etc.',
    html: `<section style="background:var(--sf-dark-bg,#111);padding:40px 24px;">
  <div style="max-width:800px;margin:0 auto;display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:20px;">
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px;background:rgba(255,255,255,.05);border-radius:16px;padding:16px 24px;"><span style="font-size:1.5rem;">🌱</span><span style="color:rgba(255,255,255,.6);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Vegan</span></div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px;background:rgba(255,255,255,.05);border-radius:16px;padding:16px 24px;"><span style="font-size:1.5rem;">🐰</span><span style="color:rgba(255,255,255,.6);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Cruelty-Free</span></div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px;background:rgba(255,255,255,.05);border-radius:16px;padding:16px 24px;"><span style="font-size:1.5rem;">⚗️</span><span style="color:rgba(255,255,255,.6);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">pH Balanced</span></div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px;background:rgba(255,255,255,.05);border-radius:16px;padding:16px 24px;"><span style="font-size:1.5rem;">♻️</span><span style="color:rgba(255,255,255,.6);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Eco Packaging</span></div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px;background:rgba(255,255,255,.05);border-radius:16px;padding:16px 24px;"><span style="font-size:1.5rem;">🔬</span><span style="color:rgba(255,255,255,.6);font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;">Clinically Tested</span></div>
  </div>
</section>`,
  },
  {
    id: 'tpl_faq_simple',
    name: 'Simple FAQ Block',
    category: 'Misc',
    description: 'Clean list of Q&A pairs in a two-column grid layout.',
    html: `<section style="background:#fff;padding:80px 24px;">
  <div style="max-width:960px;margin:0 auto;">
    <h2 style="font-family:var(--sf-font-display,Georgia,serif);font-size:clamp(1.75rem,4vw,2.5rem);font-weight:700;color:var(--sf-text,#222);text-align:center;margin-bottom:48px;">Frequently Asked Questions</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;">
      <div style="background:var(--sf-bg,#f6f5f3);border-radius:20px;padding:28px;"><h4 style="font-weight:700;color:var(--sf-text,#222);margin-bottom:10px;">Is it safe for colour-treated hair?</h4><p style="color:#666;font-size:.9rem;line-height:1.7;">Yes — Stemuvita™ is sulfate-free and safe for all hair types including colour-treated, bleached, and keratin-treated hair.</p></div>
      <div style="background:var(--sf-bg,#f6f5f3);border-radius:20px;padding:28px;"><h4 style="font-weight:700;color:var(--sf-text,#222);margin-bottom:10px;">How long before I see results?</h4><p style="color:#666;font-size:.9rem;line-height:1.7;">Most customers notice reduced shedding within 2–3 weeks and visible regrowth by week 6–8 with daily use.</p></div>
      <div style="background:var(--sf-bg,#f6f5f3);border-radius:20px;padding:28px;"><h4 style="font-weight:700;color:var(--sf-text,#222);margin-bottom:10px;">Do you offer a guarantee?</h4><p style="color:#666;font-size:.9rem;line-height:1.7;">Absolutely. We offer a 30-day hassle-free money-back guarantee. If you're not satisfied, we'll refund in full — no questions asked.</p></div>
      <div style="background:var(--sf-bg,#f6f5f3);border-radius:20px;padding:28px;"><h4 style="font-weight:700;color:var(--sf-text,#222);margin-bottom:10px;">Can I use it every day?</h4><p style="color:#666;font-size:.9rem;line-height:1.7;">Yes — daily use is recommended for best results. The cleanser can be used 3–5× per week; the serum is designed for daily application.</p></div>
    </div>
  </div>
</section>`,
  },
]

// ── category list ────────────────────────────────────────────────────────────
const CATEGORIES = ['All', ...Array.from(new Set(TEMPLATES.map(t => t.category)))]

// ── helpers ──────────────────────────────────────────────────────────────────
function uid() { return `cs_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` }

// ── main component ────────────────────────────────────────────────────────────
type Tab = 'templates' | 'mysections'

export default function LibraryPage() {
  const [tab, setTab]           = useState<Tab>('templates')
  const [category, setCategory] = useState('All')
  const [sections, setSections] = useState<CustomSection[]>([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [addedIds, setAddedIds]   = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/admin/custom-sections')
      .then(r => r.json())
      .then((data: CustomSection[]) => {
        setSections(data)
        setAddedIds(new Set(data.map(s => s.id.split('_copy_')[0]).concat(data.map(s => s.id))))
      })
      .finally(() => setLoading(false))
  }, [])

  async function save(updated = sections) {
    setSaving(true)
    await fetch('/api/admin/custom-sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function addFromTemplate(tpl: Template) {
    const newSection: CustomSection = {
      id: uid(),
      name: tpl.name,
      category: tpl.category,
      html: tpl.html,
      visible: true,
      order: sections.length,
    }
    const updated = [...sections, newSection]
    setSections(updated)
    setAddedIds(prev => new Set([...prev, tpl.id]))
    save(updated)
    setTab('mysections')
  }

  function addBlank() {
    const newSection: CustomSection = {
      id: uid(),
      name: 'Custom Section',
      category: 'Custom',
      html: `<section style="background:var(--sf-bg,#f6f5f3);padding:80px 24px;text-align:center;">\n  <div style="max-width:800px;margin:0 auto;">\n    <h2 style="font-family:var(--sf-font-display,serif);font-size:2rem;font-weight:700;color:var(--sf-text,#222);">Your Section Title</h2>\n    <p style="color:#666;margin-top:16px;line-height:1.75;">Edit this HTML to create your custom section.</p>\n  </div>\n</section>`,
      visible: true,
      order: sections.length,
    }
    const updated = [...sections, newSection]
    setSections(updated)
    setEditingId(newSection.id)
    save(updated)
    setTab('mysections')
  }

  function updateSection(id: string, patch: Partial<CustomSection>) {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }

  function removeSection(id: string) {
    const updated = sections.filter(s => s.id !== id)
    setSections(updated)
    if (editingId === id) setEditingId(null)
    save(updated)
  }

  function toggleVisible(id: string) {
    const updated = sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s)
    setSections(updated)
    save(updated)
  }

  const filtered = category === 'All' ? TEMPLATES : TEMPLATES.filter(t => t.category === category)
  const editingSection = sections.find(s => s.id === editingId)

  return (
    <div className="p-8 space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#4ade80]" /> Section Library
          </h1>
          <p className="text-white/40 mt-1 text-sm">
            Browse 16+ pre-built sections. Add to your page in one click — no code required.
          </p>
        </div>
        {tab === 'mysections' && (
          <button
            onClick={() => save()}
            disabled={saving}
            className="flex items-center gap-2 bg-[#4ade80] text-[#0b0d13] font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-[#22c55e] transition-colors disabled:opacity-60 flex-shrink-0"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
        {([
          { id: 'templates',  label: 'Browse Templates', icon: BookOpen },
          { id: 'mysections', label: `My Sections (${sections.length})`, icon: Layers },
        ] as const).map(t => {
          const Icon = t.icon
          return (
            <button key={t.id} onClick={() => setTab(t.id as Tab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.id ? 'bg-white/12 text-white' : 'text-white/40 hover:text-white/70'}`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          )
        })}
      </div>

      {/* ── Templates tab ──────────────────────────────────────────────── */}
      {tab === 'templates' && (
        <>
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all ${category === cat ? 'bg-[#4ade80] text-[#0b0d13]' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(tpl => {
              const isAdded = addedIds.has(tpl.id)
              return (
                <div key={tpl.id} className="bg-[#13161f] border border-white/5 rounded-2xl overflow-hidden hover:border-white/15 transition-all group">
                  {/* Scaled HTML preview */}
                  <div className="relative h-44 bg-white overflow-hidden">
                    <div
                      style={{ transform: 'scale(0.22)', transformOrigin: 'top left', width: '455%', height: '455%', pointerEvents: 'none' }}
                      dangerouslySetInnerHTML={{ __html: tpl.html }}
                    />
                    {/* overlay hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
                      <button
                        onClick={() => addFromTemplate(tpl)}
                        className={`opacity-0 group-hover:opacity-100 transition-all transform scale-95 group-hover:scale-100 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${isAdded ? 'bg-[#4ade80] text-[#0b0d13]' : 'bg-white text-[#0b0d13]'}`}
                      >
                        {isAdded ? <><Check className="w-4 h-4" /> Added</> : <><Plus className="w-4 h-4" /> Add to Page</>}
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-bold text-white text-sm">{tpl.name}</p>
                      <span className="text-[10px] font-bold text-white/40 bg-white/8 px-2 py-0.5 rounded-lg uppercase tracking-wider flex-shrink-0">{tpl.category}</span>
                    </div>
                    <p className="text-xs text-white/35 leading-relaxed mb-3">{tpl.description}</p>
                    <button
                      onClick={() => addFromTemplate(tpl)}
                      className={`w-full py-2 rounded-xl text-sm font-bold transition-colors ${isAdded ? 'bg-[#4ade80]/15 text-[#4ade80]' : 'bg-white/8 text-white/70 hover:bg-white/15'}`}
                    >
                      {isAdded ? '✓ Added to Page' : 'Add to Page'}
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Custom blank card */}
            <div
              onClick={addBlank}
              className="bg-[#13161f] border border-dashed border-white/10 rounded-2xl overflow-hidden hover:border-[#4ade80]/40 transition-all cursor-pointer group flex flex-col"
            >
              <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 min-h-44">
                <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-[#4ade80]/10 flex items-center justify-center transition-colors">
                  <Code2 className="w-5 h-5 text-white/30 group-hover:text-[#4ade80] transition-colors" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-white/60 group-hover:text-white transition-colors text-sm">Custom Section</p>
                  <p className="text-xs text-white/25 mt-1">Write your own HTML + CSS</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── My Sections tab ────────────────────────────────────────────── */}
      {tab === 'mysections' && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-16 text-white/30 text-sm">Loading…</div>
          ) : sections.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <p className="text-4xl">📂</p>
              <p className="text-white/50 font-semibold">No custom sections yet</p>
              <p className="text-white/30 text-sm">Browse the Templates tab and click "Add to Page" to get started.</p>
              <button onClick={() => setTab('templates')} className="mt-2 px-5 py-2 bg-[#4ade80] text-[#0b0d13] font-bold rounded-xl text-sm">Browse Templates</button>
            </div>
          ) : (
            <div className="space-y-3">
              {sections.map(sec => (
                <div key={sec.id} className="bg-[#13161f] border border-white/5 rounded-2xl overflow-hidden">
                  {/* Header row */}
                  <div className="flex items-center gap-3 p-4">
                    <GripVertical className="w-4 h-4 text-white/15 cursor-grab flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <input
                        value={sec.name}
                        onChange={e => updateSection(sec.id, { name: e.target.value })}
                        className="bg-transparent text-white font-bold text-sm focus:outline-none w-full"
                        placeholder="Section name"
                      />
                      <p className="text-xs text-white/30">{sec.category}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => setEditingId(editingId === sec.id ? null : sec.id)}
                        className={`p-1.5 rounded-lg transition-colors ${editingId === sec.id ? 'bg-[#4ade80]/15 text-[#4ade80]' : 'text-white/30 hover:text-white/70 hover:bg-white/5'}`}
                        title="Edit HTML"
                      >
                        {editingId === sec.id ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => toggleVisible(sec.id)}
                        className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-colors"
                        title={sec.visible ? 'Hide on storefront' : 'Show on storefront'}
                      >
                        {sec.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => removeSection(sec.id)}
                        className="p-1.5 rounded-lg text-white/25 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Visibility badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${sec.visible ? 'bg-[#4ade80]/15 text-[#4ade80]' : 'bg-white/5 text-white/30'}`}>
                      {sec.visible ? 'Live' : 'Hidden'}
                    </span>
                  </div>

                  {/* HTML editor */}
                  {editingId === sec.id && (
                    <div className="border-t border-white/5 p-4 space-y-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-white/40 uppercase tracking-wider">HTML / CSS Editor</p>
                        <button
                          onClick={() => save()}
                          disabled={saving}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4ade80] text-[#0b0d13] font-bold text-xs rounded-lg disabled:opacity-60"
                        >
                          <Save className="w-3 h-3" />
                          {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save'}
                        </button>
                      </div>
                      <textarea
                        value={sec.html}
                        onChange={e => updateSection(sec.id, { html: e.target.value })}
                        rows={14}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-xs text-green-300 font-mono resize-y focus:outline-none focus:border-[#4ade80] leading-relaxed"
                        spellCheck={false}
                      />
                      {/* Live mini-preview */}
                      <div>
                        <p className="text-[11px] text-white/30 mb-2">Preview</p>
                        <div className="relative overflow-hidden rounded-xl bg-white" style={{ height: '160px' }}>
                          <div
                            style={{ transform: 'scale(0.22)', transformOrigin: 'top left', width: '455%', height: '455%', pointerEvents: 'none' }}
                            dangerouslySetInnerHTML={{ __html: sec.html }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={addBlank}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-dashed border-white/10 text-white/40 hover:text-white/70 hover:border-white/25 transition-all text-sm"
              >
                <Plus className="w-4 h-4" /> Add Custom Section
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Layers({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
  )
}
