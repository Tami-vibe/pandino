# Agent rules

Read `docs/PLAN.md` before changing the product. These rules win when a prompt disagrees with them.

## Line budget

Phases 0–1 share one budget of 1,000 counted lines. `loc-budget.json` splits that budget by module and sets the per-file and per-function caps. Run `pnpm meter` before you finish. A pull request states which module budgets it touches.

Counted lines are non-blank, non-comment TypeScript, TSX, JavaScript, and PHP under `apps/`, `packages/`, `jobs/`, and `wordpress/`. Tests, config, CSS, recipe data and templates, docs, and the sidebar mockup do not count. The line meter is outside the 1,000 but has its own budget in `loc-budget.json`. Do not move product code into an uncounted bucket, and do not raise the tooling budget, to pass the meter.

## How to change the code

- Small pull requests. One concern each.
- Delete unused code before adding new code.
- No new dependency without the founder's approval. The agreed stack is in `docs/PLAN.md`.
- No speculative abstraction. Add a helper when a second real caller needs it.
- No fake proof. Never invent reviews, photos, certifications, or prices. Placeholders must be marked and must not look publishable.
- The model fills schema fields only. It does not write HTML or CSS for a customer site.

## Scope

Stay inside the phase you were asked for. If the budget is too small, stop and ask. Do not raise a number in `loc-budget.json` yourself.
