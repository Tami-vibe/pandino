# Founder's guide: applying the Smiley page design to Pandino (verbatim, 2026-10-20)

The published page is template.html. index.html and js/ are the editor. Do not copy them.

## Copy these files
1. template.html — page markup and page-level CSS.
2. css/tokens-base.css — colors, type scale, section padding, container widths, dark surfaces.
3. css/daisyui-components.css — button, card, badge, tabs, steps, collapse, footer, tooltip (daisyUI 5.7.44).
4. media/ — only if you keep paths under media/hero/, media/showcase/, and media/ai-images/.

## Paste into the new page, in this order
From template.html lines 8–15: the Google Fonts link (Syne, Manrope, Material Symbols), then https://cdn.jsdelivr.net/npm/daisyui@5, then https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4, then ./css/tokens-base.css, then ./css/daisyui-components.css.
Paste the <style> block on lines 35–71. It sets the fonts, hero sizing, overlays, and the pains layout.
Paste the body from <header id="header"> (line 73) through </footer>. Skip <section id="theme-blueprint"> (line 316). It is a hidden palette sample.
Put data-theme="dark" on <html>. Each section already has it.

## Sizes are the classes, not a separate sheet
Keep these class strings as written:
- Frame: w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12
- Grids: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Padding: py-12 md:py-20, py-16 md:py-24, or py-20 md:py-32
- Hero: min-h-[100dvh] when data-hero-tier="full"
Fluid values are in css/tokens-base.css :root: --section-pad-y, --pad-x, --container-boxed (1140px), --container-wide (1440px). Surfaces are --color-base-100/200/300. Brand color is --color-primary (default #10b981). Change that variable to retheme.

## Fit rules
Keep every sm:, md:, and lg: class. Those are the breakpoints. Swap text and image src values only. Leave class names and both CSS files unchanged. Icons are Material Symbols ligatures in <span class="material-symbols-outlined">.

Since Pandino's stack is different, make the design work in it. Design is of paramount importance in this phase. Features Smiley never had must be built in the same design vibe (same tokens, classes, card/badge/button styles, spacing, motion).
