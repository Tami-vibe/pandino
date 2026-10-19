# Pandino Phase 1c spec: multipage site, UI kit, typography, legal (founder-approved Oct 19 2026)

## UI kit (licenses verified)
- daisyUI 5 (MIT) = base components + theming.
- Pandino's own section library in plain HTML/Tailwind 4, adapted from HyperUI patterns (MIT, hyperui.dev, keep MIT notice in repo e.g. THIRD_PARTY_NOTICES.md).
- DO NOT use/copy: Tailwind Plus, Flowbite Pro, shadcndesign.com Pro, Preline (Fair Use license), coss ui/Origin UI (AGPL). Relume = inspiration only.
- Icons: Material Symbols (Apache-2.0). Fonts (OFL): Barlow Condensed headings, Inter body.

## Typography tokens (Utopia fluid scale, 16px@1.2 on 360 -> 18px@1.25 on 1280)
- eyebrow/small (uppercase, tracking .08em): clamp(0.8333rem, 0.8072rem + 0.1159vw, 0.9rem)
- body: clamp(1rem, 0.9511rem + 0.2174vw, 1.125rem)
- subhead/lead: clamp(1.2rem, 1.1193rem + 0.3587vw, 1.4062rem)
- h4: clamp(1.44rem, 1.3156rem + 0.5527vw, 1.7578rem)
- h3: clamp(1.728rem, 1.5444rem + 0.8161vw, 2.1973rem)
- h2: clamp(2.0736rem, 1.8103rem + 1.1704vw, 2.7466rem)
- h1: clamp(2.4883rem, 2.1186rem + 1.6433vw, 3.4332rem); hero display one step above h1.
- @tailwindcss/typography (MIT) only for legal/long text.

## Sitemap (generated on first prompt, complete)
Header nav (real separate pages/routes, not anchors):
1. Home
2. Services (sections per service: Collision, Dent/PDR, Paint, Glass, ADAS calibration as applicable)
3. Process & Warranty
4. Gallery & Reviews
5. About & Contact (map slot, hours, contact form)
Header CTAs top-right: primary "Get an estimate" (-> estimate page/form with dent vs accident logic), secondary Call / WhatsApp (Italy: WhatsApp first).
Footer: logo + short blurb, NAP (name/address/phone, sample flagged), hours, services list, pages, legal links, social icons (WhatsApp, Facebook, Instagram, TikTok, Google Business Profile, YouTube), Italy: P.IVA + company data line, copyright.

## Legal pages (templates, not legal advice; owner fills placeholders)
Italy/EU: Informativa privacy (GDPR art. 13), Cookie policy + consent banner (Garante 10 Jun 2021: accept and reject equal prominence, scrolling is not consent, no non-essential cookies before consent), Note legali (P.IVA must be on homepage per DPR 633/72 art.35; for Srl/SpA registered office, REA number, share capital per art. 2250 c.c.). No EU ODR link (platform closed 20 Jul 2025).
USA: Privacy Policy (CalOPPA) incl. "Your California rights" section, Terms of Use, SMS/TCPA consent wording on forms (clear opt-in checkbox), Accessibility statement (targets WCAG 2.1 AA), cookie notice.
Show the right set based on market (it vs us); all linked in footer.

## Builder
- Pages list in left rail (Pages tab): switch page in preview, section pills per page; two-way wiring kept.
- Header menu items navigate between pages in preview and live preview.
- Sample site (Futura Auto Body Shop, Milano) complete on all pages with icons, free-license images, sample contact data flagged sample; reviews labeled sample.
- Exports: HTML export produces one HTML file per page (zip); WP theme gets templates/page templates per page.
