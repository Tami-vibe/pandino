# Third-party notices

- daisyUI 5 (MIT). Base components and theming in the builder and generated sites.
- @tailwindcss/typography (MIT). Used only for legal and long text (`.prose`).
- HyperUI (MIT, https://www.hyperui.dev). Pandino's header, footer, service rows, and cookie bar are adapted from HyperUI section patterns. They are written as Pandino's own HTML and CSS. HyperUI's MIT license applies to those adapted patterns.
- Material Symbols Outlined (Apache-2.0).
- Barlow Condensed and Inter (SIL Open Font License).

Not used: Tailwind Plus, Flowbite Pro, shadcndesign.com Pro, Preline, coss ui, Origin UI.

## Cursor agent skills (.cursor/skills/)

These are vendored, unmodified SKILL.md folders. They contain no hooks, no plugin manifests and no executables that run automatically. License texts are in .cursor/skills/LICENSES/.

- **ponytail** (`ponytail`, `ponytail-review`, `ponytail-audit`): Copyright (c) 2026 DietrichGebert. MIT. https://github.com/DietrichGebert/ponytail @ 09c434a
- **mattpocock/skills** (`tdd`, `diagnosing-bugs`, `codebase-design`, `prototype`): Copyright (c) 2026 Matt Pocock. MIT. https://github.com/mattpocock/skills @ 5beb35b. The `agents/openai.yaml` metadata files were dropped.
- **superpowers** (`verification-before-completion`, `dispatching-parallel-agents`, `executing-plans`, `finishing-a-development-branch`, `receiving-code-review`, `requesting-code-review`, `subagent-driven-development`, `systematic-debugging`, `test-driven-development`, `using-git-worktrees`, `writing-plans`): Copyright (c) 2025 Jesse Vincent. MIT. https://github.com/obra/superpowers v7.0.0 @ bb92a77. No hooks, plugin manifest, or `using-superpowers` skill.
- **impeccable** (`impeccable`): Copyright (c) Renaissance Geek, Inc. / Paul Bakaus. Apache-2.0, with its NOTICE in LICENSES/impeccable-NOTICE.md. https://github.com/pbakaus/impeccable @ 46b822f (from its .cursor/skills/impeccable). The `scripts/` folder (engine launcher, downloaded binary and browser scripts) was intentionally omitted; the skill uses its documented "Launcher unavailable" fallback. Per Apache-2.0 §4(b): files unmodified, the scripts/ directory removed.
- **i-have-adhd** (`i-have-adhd`): Copyright (c) 2026 Ayoub Ghriss MIT. https://github.com/ayghri/i-have-adhd @ 1ecea19. The `agents/` metadata files were dropped.
