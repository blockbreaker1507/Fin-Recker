# Session History: Finance Reconciliation Agent (UI)

Running log of work across sessions. **Read the status board and latest entry at the start of every session; add an entry at the end.** Durable rules live in `CLAUDE.md`.

---

## Status board

| # | Issue | Status | Notes |
|---|-------|--------|-------|
| 1 | Login Screen | ✅ Built, awaiting review | `ui/index.html`; Amex branding; keeps its JS/mock sign-in by decision (pre-dates static scope); not yet committed |
| 2 | Onboarding Screen | ✅ Built, awaiting review | 5 static steps: CCIDs, knowledge base, sources, instructions, test run; not yet committed |
| 3 | Feedback Screen | Not started | |
| 4 | Design System and App Shell | 🟡 Partial | Tokens + base components (incl. chip, table, select, switch) done; sidebar/top bar/style-guide page pending |
| 5 | Dashboard / Home | Not started | Placeholder `ui/dashboard.html` exists for routing |
| 6 | Data Source Selection and Upload | Not started | |
| 7 | Matching Configuration | Not started | |
| 8 | Run Progress and Agent Activity | Not started | |
| 9 | Results and Exception Review | Not started | |
| 10 | Reports, Export and Audit Trail | Not started | |

## Open items / backlog

- [ ] Commit Issue 1 on branch `issue-1-login-screen` once the user approves.
- [ ] Screens shorter than 800px (e.g. 1366×768, 1280×720): sign-in column is ~792px, so the page scrolls slightly. Outside the 1440×900 / 1280×800 targets; accepted.
- [ ] Playwright plugin can't launch: it needs Google Chrome (`/Applications/Google Chrome.app`), and only Safari is installed. User to choose: install Chrome (`npx playwright install chrome`) or configure the plugin with `--browser chromium`. Until then, reviews use the scratchpad Playwright (same engine).
- [ ] Design-review recommendations awaiting user decision (see Session 4): sentence-case labels instead of tracked ALL-CAPS eyebrows, fewer middle-dot meta strings, drop page-load fade-ups so the cycle is the only motion, more specific headline copy.
- [ ] Replace placeholder support address `recon-support@example.com` with the real one.
- [ ] Issue 4 remainder: sidebar, top bar with environment tag, Select / Table / Modal / Toast components, style-guide page.

---

## Sessions (newest first)

<!--
Template: copy for each new session.

### Session N: YYYY-MM-DD: <short title>
**Goal:** what the user asked for.
**Done:**
- ...
**Decisions (and why):**
- ...
**Verification:** what was checked and the result.
**Next:** what should happen next session.
-->

### Session 6: 2026-10-04: Instructions step + review verdicts

**Goal:** (1) Add a separate step where the user writes instructions. (2) On it, allow file-/source-specific instructions for every connected file and source, typed by the user or filled in by the agent from the main prompt. (3) In the post-test-run review, give Approve / Decline / Not sure options, visibly distinct in green / red / yellow.

**Done:**
- New step **4 Instructions** (`ui/onboarding-instructions.html`); Test run is now step 5. Rail shows five steps (intro copy "Five steps…"); Sources → Instructions → Test run links updated.
- Instructions page: main prompt textarea (sample prompt written so its sentences match what the agent "filled in"), character count, "What to include" tips; then **Instructions for files and sources**: 2 sources + 9 documents as native `<details>` rows with states **Written by you** (neutral chip), **Filled in by the agent** (info chip, tinted textarea, quotes the sentence from the main prompt, "Edit this to override it") and **None yet** (placeholder explains auto-fill).
- Test run review table redesigned: A record / B record (ref, amount, description) / Matched by (rule + confidence) / **Your review** with an **Approve / Not sure / Decline** radio group (`.verdict`): green / yellow / red tints, solid fill when selected, ✓ ? ✕ icons, and a matching coloured edge on reviewed rows. Sample shows 2 approved, 1 not sure, 1 declined, 1 unreviewed, 1 unmatched.
- Rule 2's provenance now cites the user's instructions ("From your main instructions, confirmed by … SOP v4.2").
- Tokens: `--color-caution`, `--color-caution-soft`, `--color-caution-ink`, `--color-caution-line`, `--color-success-line`. Base: `.textarea`.
- Rail tier for ≤860px-tall screens (hides intro sentence, tighter spacing) so all five steps fit at 1280×800.
- Issue 2, `CLAUDE.md` (verdict + instructions conventions), `ui/README.md` updated.

**Decisions (and why):**
- Instructions placed **before** Test run so the test reflects them.
- Verdict order Approve / Not sure / Decline (green, yellow, red: traffic-light order) rather than the order mentioned.
- Yellow is a true yellow (`#F2B600`) with dark ink, not the amber warning colour: amber read brown, and white on amber fails contrast (4.2:1).
- Per-item notes are on the Instructions step only (not duplicated into the Knowledge base / Sources rows) to keep those steps simple.

**Verification:** Scratchpad Playwright (plugin still blocked by missing Chrome): all 5 steps at 1440×900, 1280×800 and 1920×970; rail fits; no horizontal scroll or errors; `<details>` open on click; choosing Not sure fills it yellow and adds the yellow row edge; verdict contrast 4.55–5.62 (all ≥ 4.5); all links resolve. Login suite: 51 pass (2 known short-screen fails).

**Next:** User review → confirm the CCID format → commit Issues 1–2 → Issue 4 shell + style guide.

### Session 5: 2026-10-04: Issue 2 onboarding (static)

**Goal:** Build the onboarding as four steps: 1 Add CCIDs; 2 Knowledge base (SOPs, example recons, supporting docs, any format); 3 Connect sources (BigQuery, SharePoint, other inputs); 4 Test run (agent suggests matches, option to test-run rules). Use the frontend-design skill and the Playwright plugin.

**Done:**
- Four static pages, no JS: `ui/onboarding.html`, `onboarding-knowledge-base.html`, `onboarding-sources.html`, `onboarding-test-run.html` + `assets/css/onboarding.css`.
- Layout: navy **setup rail** (continues the login's brand panel) + work area that scrolls internally + fixed action bar (Skip setup / Back / Continue or Finish setup). The rail is the signature element: finished steps show what they gave the agent ("5 CCIDs verified", "9 documents uploaded", "2 sources connected").
- Step 1: CCID entry + Import from file (styled native file input); table with verified rows and one "Not found" error example.
- Step 2: drop zone (any format) + documents grouped SOPs / Example recons / Supporting documents with read / reading / couldn't-read statuses.
- Step 3: source type radio cards (BigQuery, SharePoint, Cloud Storage, File upload, Other systems "Planned" and disabled); the selected card shows its form via `:has()` (no script); connected sources in **Dataset A / Dataset B lanes**.
- Step 4: suggested rules with switches, confidence chips and "learned from" provenance (ties to the knowledge base); Test run panel (sample select, Run test, last result 92.1% with outcome bar + legend); sample matches table with accept / reject.
- New shared components in `base.css`: `.chip`, `.table`/`.table-wrap`, `.icon-btn`, `.select`, `.switch`.
- `dashboard.html` placeholder now calls `completeOnboarding()` on load, so the login still sends returning users to the dashboard.
- Issue 2 rewritten in the issues doc to match the new steps; `CLAUDE.md` + `ui/README.md` updated.

**Decisions (and why):**
- Each step is its own page (buttons are links, per the static scope); file names are descriptive rather than numbered.
- Followed the Session 4 review guidance on new screens: sentence case, no ALL-CAPS eyebrows, no middle-dot meta strings, no fade-ins, no "Step 1 of 4" label (the rail shows position).
- Generic icons for BigQuery / SharePoint / GCS (their logos weren't supplied).
- CCID format shown as 8 digits is a **placeholder**; the user should confirm the real format.

**Verification:** Playwright plugin still can't launch (no Google Chrome). Used the scratchpad Playwright: all 4 steps at 1440×900 and 1280×800, no horizontal scroll, all images load, no errors; the action bar stays visible while content scrolls; the SharePoint card swaps the form; the disabled card can't be chosen; switches toggle; every link resolves (flow: CCIDs → KB → Sources → Test run → Dashboard; Skip → Dashboard). Login suite updated for the new onboarding: 51 pass (2 known short-screen fails). Fixed during review: action bar pushed off-screen (grid row sizing), unreadable truncated file names (moved to full-width grouped lists), wrapping in the Sources lanes and the matches table, email breaking mid-word in the rail.

**Next:** User review of onboarding → confirm the CCID format → commit Issues 1–2 → Issue 4 app shell + style guide → Issue 5 dashboard.

### Session 4: 2026-10-04: Scope change to static UI + design review

**Goal:** Rewrite the issues for UI only: no reactive/responsive behaviour, no mock capabilities, just buttons. Review the site with the newly added frontend-design and Playwright plugins.

**Done:**
- Rewrote `Issues Summary/Reconciliation_UI_Issues.md` (original backed up in the session scratchpad):
  - New scope statement + working notes: HTML/CSS only, fixed 1440×900 desktop (must look right at 1280 wide), buttons are links, sample content in HTML, alternative states as static variants.
  - Added a screen-flow link map.
  - Every issue's scope and acceptance criteria rewritten to visual/link criteria. Removed validation, persistence, streaming, filtering, payload docs, skeleton loading and tablet criteria. Modals/drawers via native `popover`.
  - Issue 1 marked as built before the change and kept as is. Issue 7 re-sized Large → Medium and Issue 8 Medium → Small (less logic).
- `CLAUDE.md`: scope section, hard constraints (no JS for new screens, fixed desktop), "JavaScript (login only)" section, verification targets, plugin usage.
- Design review (frontend-design skill criteria; Playwright engine). Fixed one defect: at 1280×800 the cycle hit its minimum size (labels ≈ 9px) and the page scrolled. Added a `max-height: 860px` tier (tighter brand padding/gaps, `--text-display-sm` headline, 16px tagline, cycle formula `(100dvh - 28rem) * 1.19`, tighter sign-in padding), so labels are now ≈ 12.6px and nothing scrolls at 1280×800.

**Decisions (and why):**
- User chose to **keep the login's working JS** (validation, mock sign-in, tablet layout) even though new screens are static.
- User chose **buttons as links between screens** (clickable prototype), not inert.
- Aesthetic recommendations reported rather than applied: they change copy/look the user already approved.

**Verification:** Regression suite: 51 pass; the 2 failures are screens under 800px tall (expected). 1280×800 and 1440×900 fit with no scroll. Playwright plugin couldn't run (no Google Chrome); used the scratchpad Playwright instead.

**Next:** User decides on review recommendations + Playwright plugin fix → commit Issue 1 → Issue 4 shell/style guide, then Issue 2 as static screens.

### Session 3: 2026-10-04: Official American Express assets

**Goal:** Use the logos and banner the user added in `ui/assets/American_Express/` instead of the fabricated logo and product imagery.

**Done:**
- Login (`ui/index.html`): brand header now uses the **Blue Box logo** (PNG) with "Finance Reconciliation Agent / American Express · Global Finance"; the cycle hub uses the **AM EX symbol** (SVG `<image>`) above "AI Agent".
- Favicon on all pages → `American_Express_Symbol_6.svg`.
- Placeholder onboarding/dashboard: **blue wordmark** header + **Platinum Card banner** as the card's header image (`placeholder.css` updated).
- Removed the fabricated two-circle mark everywhere (`.logo-mark` CSS, hub circles) and deleted `ui/assets/img/favicon.svg` (folder removed).
- `CLAUDE.md`: replaced the "no Amex logo" rule with an asset-usage map (which file where, use as supplied). `ui/README.md` structure updated.

**Decisions (and why):**
- Blue Box on the navy panel (not the blue wordmark), because the blue wordmark has too little contrast on navy.
- Blue Box via PNG: the supplied `_3.svg` lacks a `viewBox`, so scaling is unreliable.
- Banner kept off the login page: the left panel is the capability cycle (user-approved) and a busy floral photo would compete with it and with the "calm motion" rule. It's used on the welcome placeholders, where Issue 2/5 hero moments will live.
- Logos used unmodified (no rounding/recolouring), per standard brand practice.
- Cycle width formula adjusted to `(100dvh - 35.5rem) * 1.19` so the panel still fits at 1440×900 with the taller logo.

**Verification:** Headless Chromium: 51 checks pass (all images load with non-zero size, no failed asset requests, favicon correct, no fabricated logo elements remain, plus all earlier login/cycle checks). The 2 failing checks are the known short-screen scroll (1366×657, 1280×720). Screenshots reviewed (desktop, tablet, onboarding).

**Next:** User review → commit on `issue-1-login-screen` → Issue 2 (Onboarding, can reuse the banner on its welcome step).

### Session 2: 2026-10-04: Capability cycle + continuity docs

**Goal:** The animated "match preview" on the login's left panel felt like too much; replace it with a capability demo drawn from `Issues Summary/capabilities.md`, as a cyclic graph. Create `CLAUDE.md` and `Session-History.md` for cross-session consistency.

**Done:**
- Replaced the match preview and the Ingest/Match/Flag/Learn step strip with a **capability cycle** (inline SVG + CSS, no JS) in `ui/index.html`:
  - Ring of 6 capabilities, clockwise: Data Context → Fuzzy Matching → Document Intelligence → Investigation → Human Review → Feedback Loop → back to Data Context.
  - Centre hub "AI Agent · learns every cycle"; input tag "Staging DB · IRIS · Grassroots" flows into Data Context; output tag "Outputs · Report · Audit · Logs" flows out of Human Review.
  - One slow highlight travels the ring (18s loop, 3s per node); the active node lights up and a caption below shows its step, description and components.
  - Hovering a node pauses the loop and shows that capability (pure CSS via `:has()`).
  - Reduced motion: no travelling highlight; shows an intro caption ("6 capabilities · 1 learning loop").
  - Screen readers get a visually hidden `<figcaption>` describing the whole flow; the SVG and captions are `aria-hidden`.
- New tokens: `--color-navy-raised`, `--color-primary-on-dark`.
- Removed now-unused CSS (preview, steps, chip/meter/pulse keyframes) and the steps height tier.
- Created `CLAUDE.md` (durable rules) and this file.

**Decisions (and why):**
- Feedback Loop is drawn as its own node between Human Review and Data Context, which makes the "learns from feedback" cycle explicit, matching the doc's "Feedback in the Loop → processing capabilities".
- SOR Connectors (Lumi, Sub-ledger, AP/AR) left off the graph: they're aspirational and would clutter it.
- Motion kept deliberately minimal after user feedback; recorded as a durable rule in `CLAUDE.md`.
- Diagram width scales with viewport height (`clamp(17rem, (100dvh - 35rem) * 1.19, 31rem)`) so the brand panel fits without scrolling on 1440×900 and 1920×970.

**Verification:** Headless Chromium: 46 checks pass (all Issue 1 criteria still pass; the cycle shows the right caption at t≈1.5s and t≈4.5s; the active node turns primary blue; hover shows the hovered capability; reduced-motion fallback works; no JS errors). The 2 failing checks are the known short-screen scroll (1366×657, 1280×720). Screenshots reviewed.

**Next:** User review of the login page → commit on `issue-1-login-screen` → start Issue 2 (Onboarding).

### Session 1: 2026-10-04: Issue 1 login screen + design foundations

**Goal:** Understand the project, then build Issue 1 (Landing + Login), clean and simple, HTML/CSS only (no npm/TS).

**Done:**
- `ui/assets/css/tokens.css`: full token set (palette, type scale, spacing, radius, shadow, motion, reduced-motion overrides).
- `ui/assets/css/base.css`: reset + shared components (button with spinner/success states, input, input-group, field with reserved message line, alert, badge, card, link).
- `ui/index.html` + `login.css` + `login.js`: split layout on desktop (navy brand panel + sign-in card), centred card on navy at tablet width. Fields: email/employee ID, password with show/hide, Caps Lock hint. States: default, focus, loading, error (no layout shift), success. "Forgot password?" via native `popover`; demo credentials via `<details>`.
- `ui/assets/js/auth.js`: `FinRecAuth` mock service shaped for real SSO later. Demo password `Recon@2026`; first sign-in → onboarding, returning → dashboard (flag per user in `localStorage`); session in `sessionStorage`.
- Placeholder `onboarding.html` / `dashboard.html` so routing is testable; `ui/README.md`.

**Decisions (and why):**
- Minimal vanilla JS is unavoidable for validation/loading/routing; classic scripts (not modules) so `file://` works.
- Validation: on blur only once something has been typed; errors clear live as they're fixed; full validation on submit with focus on the first invalid field.
- Credentials error replaces the card lede in the same grid cell, so there's zero layout shift.
- No Amex logo; product uses its own two-circle "match" mark.

**Verification:** 36/36 headless checks passed at that time (tab order, validation, Enter submits, no layout shift, routing both paths, SSO, popover, contrast ≥ 4.5, Inter loaded, no JS errors). Fixed during review: popover rendered top-left (reset removed UA `margin: auto`), brand panel overflow at 900px height, footer email wrapping mid-word.

**Next:** User review; then Issue 2.
