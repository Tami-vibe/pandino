# Pandino

Pandino builds websites for car aftermarket shops: garages, body shops, tyre shops, and glass shops. A site is one JSON document. Renderers turn that document into a hosted page, an HTML download, or a WordPress theme.

Phase 1a turns a prompt and a brand color into a recipe site. With no `AI_API_KEY`, generation is deterministic. Italy (detected from the city or country, or chosen in the prompt) uses euro placeholders, a `+39` number, and WhatsApp. The US uses dollar placeholders, a `+1` number, and call or text. Reviews, prices, photos, and certifications are placeholders.

After Generate, the editor opens on Business info: name, phone, WhatsApp, email, address, city, hours, Google reviews, warranty, and payment options. Section text and the brand color edit the same site JSON. The preview updates live and the draft autosaves in this browser. The quote form asks dent or accident and does not submit. Download HTML saves one `index.html`. Download WordPress theme saves a GPL block theme (`style.css`, `theme.json`, `templates/index.html`) with core blocks only.

```bash
AI_API_KEY=        # optional, OpenAI-compatible
AI_MODEL=gpt-4o-mini
AI_BASE_URL=https://api.openai.com/v1
```

The product plan is `docs/PLAN.md`. The approved sidebar mockup is kept at `docs/design/sidebar-mockup/` for later phases.

## Requirements

- Node.js 22
- pnpm 10 (`packageManager` pins the version)

## Scripts

```bash
pnpm install
pnpm dev          # Next.js app
pnpm lint
pnpm typecheck
pnpm test
pnpm meter
pnpm meter -- --base origin/main
```

`pnpm meter` prints lines used against the Phase 0–1 budget and exits non-zero when a module budget, the 1,400-line total, a per-file cap, or a per-function cap is exceeded. The same check runs on every pull request and updates a comment with the table and the delta versus the base branch.

## What counts

Counted lines are non-blank, non-comment TypeScript, TSX, JavaScript, and PHP in `apps/`, `packages/`, `jobs/`, and `wordpress/`. Tests, config, CSS, recipe data and templates, docs, and the sidebar mockup are reported separately and do not count. `scripts/loc-meter.mjs` is outside the 1,400 and has its own budget in `loc-budget.json`.

## Layout

```
apps/web                 Next.js app (Tailwind). Prompt, editor, and the app shell.
packages/export-html     Single-file HTML download.
packages/export-wp       Minimal GPL WordPress block theme.
packages/schema          Canonical site JSON schema, validator, and the Rossi Auto Body example.
scripts/loc-meter.mjs    Line meter. No dependencies.
docs/PLAN.md             Product and technical plan.
docs/design/sidebar-mockup
```

Module paths for code that is not written yet (`packages/theme`, `packages/recipes`, `packages/ai`, and the others) are already listed in `loc-budget.json`, so new files are counted as soon as they appear.
