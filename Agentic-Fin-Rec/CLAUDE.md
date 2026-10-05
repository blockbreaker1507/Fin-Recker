# CLAUDE.md: Finance Reconciliation Agent (UI)

Durable rules for every session on this project. For *what happened when* and *what's next*, see `Session-History.md`.

## Session protocol

1. **Start:** read `Session-History.md` (status board + latest entry) before touching code.
2. **Source of truth for scope:** `Issues Summary/Reconciliation_UI_Issues.md` (10 UI issues, acceptance criteria) and `Issues Summary/capabilities.md` (agent capabilities). Don't invent scope; ask if an issue is ambiguous.
3. **End:** append a new entry to `Session-History.md` (newest first) and update its status board. Record decisions and their reasons, not just changes.
4. If a new durable rule emerges (user preference, convention), add it here, not in the history.

## Project

Front end for an agentic AI tool, built for American Express Global Finance, that reconciles two datasets and flags differences.

**Scope (changed in Session 4): static UI only.** Layouts, components and sample content. No mock capabilities (no fake auth, validation, data loading, filtering, saving, streaming), no responsive layouts. **Buttons are plain links between screens** so the prototype clicks through; actions with no destination yet are visual only. See "Working notes" and the link map in `Issues Summary/Reconciliation_UI_Issues.md`.

**Exception:** the Issue 1 login (`index.html`, `auth.js`, `login.js`) was built before the change and **keeps** its validation, mocked sign-in and tablet layout by the user's decision. Don't strip it, and don't copy its JS patterns into new screens.

## Hard constraints

- **No build tooling.** No npm, Node packages, TypeScript, bundlers or frameworks in the deliverable. The user's environment doesn't have them.
- **HTML + CSS only for new screens. No JavaScript.** Script-free native interactions are fine: `<a>` links, `popover` + `popovertarget` (modals, drawers), `<details>`, styled radios/checkboxes, `:has()`, `:target`.
- **Fixed desktop layout:** design for 1440 × 900; must still look right at 1280 wide. No tablet/mobile breakpoints for new screens.
- **Sample content lives in the HTML** (tables, KPIs, logs, charts as static SVG). Alternative states (empty, error, failed) are separate static screens or style-guide examples.
- External resources: only Google Fonts (Inter). Everything else lives in the repo.
- Target browsers: current Chrome / Edge, Safari 17+, Firefox 125+.

## Structure

```
Agentic-Fin-Rec/
├── CLAUDE.md, Session-History.md
├── Issues Summary/                     scope documents (read-only input)
└── ui/
    ├── index.html                      Issue 1: login (+ capability cycle)
    ├── onboarding*.html                Issue 2: setup steps (CCIDs, knowledge base, sources, instructions, test run)
    ├── daily-review.html               Daily feedback screen: filter by date matched + CCID, approve/not sure/decline each match
    ├── dashboard.html                  placeholder until Issue 5 (its script marks onboarding done)
    └── assets/
        ├── css/tokens.css              design tokens (ONLY place for raw colours)
        ├── css/base.css                reset + shared components
        ├── css/<screen>.css            one stylesheet per screen
        ├── js/auth.js                  FinRecAuth: the single auth boundary
        ├── js/<screen>.js              one script per screen
        └── American_Express/           official brand assets supplied by the user (don't edit)
```

New screens follow the same pattern: `ui/<screen>.html` + `assets/css/<screen>.css` + `assets/js/<screen>.js`, loading `tokens.css` → `base.css` → screen CSS.

## Design system

- **Palette (Amex-aligned, not an official brand spec):** primary `#006FCF`, navy `#00175A`, slate `#53565A`, light grey `#F7F8F9`, white, success `#2E7D32`, warning `#B26A00`, error `#C62828`. Defined once in `tokens.css`.
- **No raw hex/rgba outside `tokens.css`.** Need a new shade? Add a token. (Alpha masks using `black` are fine.)
- **Type:** Inter → Helvetica fallback. Use the `--text-*` scale and `--weight-*` tokens; no ad-hoc sizes in screen CSS (SVG user-unit sizes are the exception).
- **Spacing/shape/motion:** `--space-*` (4px base), `--radius-*`, `--shadow-*`, `--duration*` / `--ease-*`.
- **Branding: use only the supplied American Express assets in `ui/assets/American_Express/`; never draw or fabricate logos or product imagery.** Use them as supplied: no recolouring, cropping, rounding, outlines or effects. Which asset where:
  - **Blue Box logo** (`Registered Trademark Left.svg`): on navy/dark surfaces (login brand panel, onboarding rail), as the favicon on every page, and for small marks (the cycle hub).
  - **Wordmark** (`AXP_Logotype.png`, blue): on light surfaces (page headers).
  - **Banner** (`GettyImages.jpeg`, Platinum Card photo, 820×312): welcome / hero moments (dashboard welcome). Keep it off dense working screens.
  - These three are the whole set. Use each in its own file type (SVG stays SVG, PNG stays PNG, JPEG stays JPEG); don't convert or substitute.
- **Feel:** calm, minimal, trustworthy enterprise tool. **Motion must be restrained.** The user rejected a busy animated demo as "a bit too much". Prefer one slow, purposeful animation over many; always honour `prefers-reduced-motion` with a sensible static state.

## Component & CSS conventions

- BEM-style names: `.block`, `.block__element`, `.block--modifier` (e.g. `.btn--primary`, `.field__message`).
- State lives in attributes first: `aria-invalid`, `aria-busy`, `aria-pressed`, `data-state="success"`; then `.is-*` / `.has-*` classes (`.is-invalid`, `.has-warning`, `.has-error`).
- Shared components in `base.css`: `.btn` (primary / secondary / ghost, spinner + success check), `.input`, `.input-group` + `.input-action`, `.field` + `.field__message`, `.alert`, `.badge`, `.card`, `.link`, `.spinner`, `.visually-hidden`, `.chip` (status: success / warning / error / info / neutral), `.table` + `.table-wrap`, `.icon-btn`, `.select` (wrapper draws the chevron), `.switch`.
- Copy and labels (from the design review): sentence case, no tracked ALL-CAPS eyebrows, avoid "A · B · C" meta strings (use commas or separate columns), no page-load fade-ins on new screens, no "→" in button text.
- **Review verdicts are always Approve (green) / Not sure (yellow) / Decline (red)**, each with an icon (✓ ? ✕) so colour isn't the only cue; selected = solid fill. Yellow uses the `--color-caution*` tokens (dark ink on yellow), not the amber warning colour. Reuse `.verdict` wherever a user reviews a match (Issue 9 included).
- **Instructions model:** a main free-text prompt plus per-item notes for every file and source. Each note is "Written by you", "Filled in by the agent" (tinted `.textarea--agent`, shows the source sentence, editable) or "None yet".
- Logged-in-but-pre-dashboard screens use the navy **rail** layout from onboarding (`.setup` / `.rail` / `.work` / `.actions`); file inputs are styled `<label>`s wrapping a hidden `.file-input`. Reuse and extend these rather than restyling per screen.
- **No layout shift on errors:** message lines reserve their height; swapped content shares a grid cell (`grid-area: 1 / 1`).

## Accessibility (non-negotiable)

WCAG AA contrast; visible `:focus-visible` everywhere; logical tab order (never positive `tabindex`); labels on every input; `role="alert"` / `role="status"` for announcements; decorative graphics `aria-hidden` with a visually hidden text equivalent; 16px inputs (prevents iOS zoom).

## JavaScript (login only)

- JS exists only for the Issue 1 login (`auth.js`, `login.js`), kept by decision. Classic scripts, IIFE, `'use strict'`, no ES modules (so `file://` works).
- When Issues 2 and 5 replace the placeholder pages, drop their `requireSession()` scripts. New screens are script-free.

## Verification

- Visual + behavioural checks use a throwaway headless Chromium (Playwright) installed in the **session scratchpad**, never in the repo.
- Check new screens at 1440×900 and 1280×800 (plus 1920×970 for large monitors); no horizontal scroll; every link in the flow resolves; zero console errors; reduced-motion state where there's animation. The login is also checked at tablet width since it keeps that layout.
- Design review: use the **frontend-design** plugin skill for the aesthetic pass and the **Playwright** plugin (MCP browser tools) for interactive review.
- Look at the screenshots, not just the assertions.

## Git workflow

- Repo root is the parent folder (`Claude's Plan/`); this project lives in `Agentic-Fin-Rec/`.
- One branch per issue (e.g. `issue-1-login-screen`), small PRs. Commit only when the user asks.
