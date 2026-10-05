# Finance Reconciliation Agent

## UI build plan: 10 issues

A simple, clean front end for an agentic AI solution that matches two datasets and flags differences. The work is split into 10 issues so each can be built, reviewed and merged on its own.

**Scope: static UI only.** Every screen is plain HTML and CSS: layouts, components and sample content. There is no application logic. No mock capabilities (no fake sign-in, validation, data loading, filtering, saving or streaming) and no responsive layouts. Buttons and navigation are links that move between screens so the prototype can be clicked through.

---

## Issue overview

| # | Issue | Size | Depends on |
|---|-------|------|------------|
| 1 | Login Screen | Small | 4 (theme) |
| 2 | Onboarding Screen | Medium | 1, 4 |
| 3 | Feedback Screen | Medium | 4 |
| 4 | Design System and App Shell | Medium | None |
| 5 | Dashboard / Home | Medium | 4 |
| 6 | Data Source Selection and Upload | Medium | 4, 5 |
| 7 | Matching Configuration | Medium | 6 |
| 8 | Run Progress and Agent Activity | Small | 7 |
| 9 | Results and Exception Review | Large | 8, 3 |
| 10 | Reports, Export and Audit Trail | Medium | 9 |

Issues 1 to 3 are the requested starting screens. Issue 4 (theme) is small enough to do alongside Issue 1, so the login screen already uses the final colours.

## Colour palette (Amex-aligned)

| Colour | Hex | Use |
|--------|-----|-----|
| Primary blue | `#006FCF` | Buttons, links, active states |
| Deep navy | `#00175A` | Headings, sidebar, dark surfaces |
| Slate grey | `#53565A` | Secondary text |
| Light grey | `#F7F8F9` | Page background |
| White | `#FFFFFF` | Cards and inputs |
| Success green | `#2E7D32` | Matched, completed |
| Warning amber | `#B26A00` | Needs review |
| Error red | `#C62828` | Failed, unmatched |

These are approximate brand-style colours for an internal tool, not an official Amex brand specification. Use a clean sans-serif font (Helvetica / Inter) and keep layouts uncluttered. Use the supplied American Express logos and banner (`ui/assets/American_Express/`); don't create new logos or product imagery.

## Working notes

- **UI only.** HTML and CSS; no JavaScript for new screens. Native HTML interactions are fine where they need no script (links, `popover` / `popovertarget` for modals and drawers, `<details>`, radio/checkbox styling).
- **Fixed desktop layout.** Design for a 1440 × 900 desktop viewport (must still look right at 1280 wide). No tablet or mobile layouts, no responsive breakpoints.
- **Buttons are links.** Primary actions link to the next screen in the flow (e.g. "Sign in" → Onboarding, "Start new reconciliation" → Data Source Selection). Actions with no destination yet (Export, Approve, Save template…) are visual only.
- **Sample content, not mock behaviour.** Tables, KPIs, logs and charts show realistic sample values written directly into the HTML.
- **States as static variants.** Where a screen has alternative states (empty, error, failed run), build them as separate static screens or as examples on the style-guide page, not as behaviour.
- Create one GitHub issue per section, copy the Description, Scope and Acceptance Criteria into it, and use the labels shown.
- Work on one branch per issue and open a small pull request for each, which keeps reviews easy.

### Screen flow (link map)

```
Login ──► Onboarding (steps 1→4) ──► Dashboard ──► Data Source Selection ──► Matching Configuration
                     └─ Skip ───────►    ▲                                              │
                                         │                                              ▼
           Reports & Audit ◄── Results & Exception Review ◄──────────────── Run Progress
                                         │
                                         └─► Feedback
Sidebar (Issue 4) links to every logged-in screen.
```

---

## Issue 1: Login Screen

**Labels:** `ui`, `auth`, `priority: high` | **Size:** Small

> **Status:** Built before the scope change. By decision, the login keeps its working validation and mocked sign-in; the static-UI scope applies to Issues 2 to 10.

### Summary
The entry point to the app. A clean sign-in card next to a branded panel.

### Description
Build the sign-in screen users see first. It should feel like an internal enterprise tool: calm, minimal and trustworthy.

### Scope / UI elements
- Brand panel with the American Express Blue Box logo, product name and tagline ("Finance Reconciliation Agent")
- Capability cycle graphic (from `capabilities.md`) on the brand panel
- Email / employee ID and password fields with show/hide password icon
- Primary "Sign in" button in Amex blue; secondary "Sign in with SSO" button
- "Forgot password?" link and footer with support contact
- Visual styles for default, focus, loading (spinner on button) and error (inline message)

### Acceptance criteria
- [ ] Matches the palette and type scale from Issue 4
- [ ] "Sign in" and "Sign in with SSO" lead to Onboarding
- [ ] Error message styling reserves its space (no layout shift)
- [ ] Looks correct at 1440 × 900 and 1280 wide

---

## Issue 2: Onboarding Screen

**Labels:** `ui`, `onboarding`, `priority: high` | **Size:** Medium

> **Status:** Built in Sessions 5–6 as five static screens: `onboarding.html`, `onboarding-knowledge-base.html`, `onboarding-sources.html`, `onboarding-instructions.html`, `onboarding-test-run.html`.

### Summary
A guided first-run setup that gives the agent its scope, its knowledge, its data and its instructions, then a first test of its matching rules.

### Description
A 5-step setup wizard built as five static screens, with a setup rail that shows progress and what each finished step has given the agent. Keep copy short.

### Scope / UI elements
- Setup rail with the five steps, current / done / upcoming styles, and a result line on finished steps (e.g. "5 CCIDs verified")
- Action bar with Skip setup, Back and Continue / Finish setup links
- **Step 1, Add CCIDs:** CCID entry field with Add and Import from file, and a table of added CCIDs (account, entity, source system, verified / not found status, remove)
- **Step 2, Knowledge base:** drop zone accepting any format, and uploaded documents grouped as SOPs, Example recons and Supporting documents, each with size and read status (read, reading, couldn't read)
- **Step 3, Connect sources:** source type cards (BigQuery table, SharePoint link, Cloud Storage, File upload, Other systems as planned), the form for the selected type, and connected sources grouped into Dataset A and Dataset B
- **Step 4, Instructions:** a main instruction prompt (free text, with tips on what to include), plus **file- and source-specific instructions** for every connected source and uploaded document. Each item can be typed by the user, or **filled in by the agent** from the main prompt when it mentions that item (shown tinted, with the sentence it came from, and editable). Items with nothing yet say so.
- **Step 5, Test run:** agent-suggested matching rules with on/off switches, confidence and where each rule came from; a Test run panel (sample picker, Run test button, last result with matched / needs review / unmatched); and a table of sample matches where each match can be marked **Approve (green), Not sure (yellow) or Decline (red)**

### Acceptance criteria
- [ ] Continue / Back link to the adjacent step; Skip setup links to Dashboard; Finish setup (step 5) links to Dashboard
- [ ] Current step is clearly highlighted in the rail; finished steps show their result
- [ ] Choosing a source type shows its form (CSS only, no script)
- [ ] Instructions written by the user, filled in by the agent, and not yet added are visually distinct
- [ ] Approve / Not sure / Decline are distinct in green / yellow / red, each with an icon, and the chosen option is clearly selected
- [ ] Cards, switches, drop zones and buttons have visible hover, focus and selected styles
- [ ] Looks correct at 1440 × 900 and 1280 wide; the action bar stays visible while content scrolls

---

## Issue 3: Feedback Screen

**Labels:** `ui`, `feedback`, `priority: high` | **Size:** Medium

### Summary
A screen where users give structured feedback on the agent's matching decisions, designed so the same panel can sit inside the Results screen (Issue 9).

### Description
Lets users rate a reconciliation run, mark individual match decisions, and submit general product feedback. UI only; nothing is saved.

### Scope / UI elements
- Overall run rating (1 to 5 stars or thumbs up/down) with an optional comment box
- Per-match feedback options: "Correct match" / "Incorrect match" / "Should have matched" with a reason dropdown
- Free-text field for what the agent missed, with category tags (tolerance, date mismatch, duplicate, other)
- Comment character counter (static, e.g. "0 / 500")
- Submit button, a success toast (shown on the style-guide page), and a history list of sample past feedback
- Empty-state variant of the history list

### Acceptance criteria
- [ ] Rating, verdict options and tags have clear hover, focus and selected styles
- [ ] Layout works both as a full page and inside a side panel (Issue 9 drawer)
- [ ] Empty state is built as a static variant
- [ ] Submit button is visual only

---

## Issue 4: Design System and App Shell

**Labels:** `ui`, `foundation`, `theme` | **Size:** Medium

### Summary
Shared Amex-aligned theme tokens plus the persistent layout (sidebar, top bar) used by every screen after login.

### Description
Define the colour palette, typography scale, spacing, buttons, inputs, cards, tables and status chips once, so Issues 1 to 3 and 5 to 10 stay consistent. Build the logged-in layout with navigation.

### Scope / UI elements
- Theme tokens: primary blue, navy, greys, success / warning / error colours (see palette above)
- Base components: Button (primary, secondary, ghost), Input, Select, Card, Table, Badge / status chip, Modal, Toast, Tabs
- Left sidebar: Dashboard, New Reconciliation, Runs, Exceptions, Reports, Feedback, Settings (links)
- Top bar with page title, user menu (profile, sign out) and environment tag
- Style-guide page listing every component and its static states (hover, focus, disabled, error, empty)

### Acceptance criteria
- [ ] All colours come from tokens, no hard-coded hex values in screens
- [ ] Active nav item is clearly highlighted; nav items link to their screens
- [ ] Text contrast meets WCAG AA
- [ ] Style-guide page lists all components

---

## Issue 5: Dashboard / Home

**Labels:** `ui`, `dashboard` | **Size:** Medium

### Summary
At-a-glance view of reconciliation health and recent activity.

### Description
Landing page after onboarding. Shows how much has been reconciled, what needs attention, and gives quick access to start a new run. All figures are sample values in the HTML.

### Scope / UI elements
- KPI cards: total runs, match rate %, open exceptions, avg. time per run
- Recent runs table with status chips (Completed, Running, Needs review, Failed)
- "Start new reconciliation" primary button
- Simple trend chart of match rate over time (static SVG)
- Empty-state variant for brand-new users

### Acceptance criteria
- [ ] "Start new reconciliation" links to Data Source Selection
- [ ] Run names in the table link to Run Progress or Results
- [ ] Layout holds up with long run names and large numbers
- [ ] Empty state is built as a static variant

---

## Issue 6: Data Source Selection and Upload

**Labels:** `ui`, `data-ingestion` | **Size:** Medium

### Summary
Screen for choosing the two datasets to be reconciled.

### Description
The core use case is matching two datasets. The screen shows Dataset A and Dataset B side by side with source choices and a preview. The UI must make the two-sided structure obvious.

### Scope / UI elements
- Two side-by-side panels labelled Dataset A and Dataset B
- Source type selector: BigQuery table, Excel / CSV upload, GCS path
- BigQuery: project, dataset and table pickers; Upload: file drop zone showing a sample file name and size
- Preview of the first 10 rows with column names / types (sample data)
- Example validation messages (unsupported file type, empty file, missing access) shown as static styles

### Acceptance criteria
- [ ] "Next" links to Matching Configuration; "Back" links to Dashboard
- [ ] Preview table scrolls horizontally for wide tables (CSS overflow)
- [ ] Both panels share identical structure and alignment
- [ ] Drop zone has visible hover / focus styling

---

## Issue 7: Matching Configuration

**Labels:** `ui`, `configuration` | **Size:** Medium

### Summary
Screen where users define how the two datasets should be matched.

### Description
Shows column mapping, matching rules and tolerances, and agent-suggested mappings. This is the most form-heavy screen, so keep it structured and readable.

### Scope / UI elements
- Column mapping table: Dataset A column on the left, Dataset B column on the right, with match type
- Key fields (exact match) vs value fields (amount, date) with tolerance inputs (e.g. +/- 0.01, +/- 2 days)
- Match strategy options: one-to-one, one-to-many, many-to-many
- "Let the agent suggest mapping" button, with sample suggested mappings shown with confidence chips
- "Save as template" button and a list of saved templates (name, last-used date)
- Configuration summary panel

### Acceptance criteria
- [ ] "Run reconciliation" links to Run Progress; "Back" links to Data Source Selection
- [ ] Key fields are visually distinguished from value fields
- [ ] Confidence chips use the status colours consistently
- [ ] Template list shows name and last-used date

---

## Issue 8: Run Progress and Agent Activity

**Labels:** `ui`, `agent` | **Size:** Small

### Summary
View of the agent working through a reconciliation, shown as a static snapshot.

### Description
Because this is an agentic solution, users should see what the agent is doing, not just a spinner. Show stages, progress and a readable activity log, captured mid-run.

### Scope / UI elements
- Stage tracker: Load data, Clean and normalise, Match, Flag exceptions, Summarise (with done / current / upcoming styles)
- Overall progress bar with elapsed time and estimated remaining time (sample values)
- Activity log panel with timestamped sample agent messages (e.g. "Matched 12,340 of 13,002 rows")
- Cancel run button with a confirmation modal (native `popover`)
- Failure-state variant with error summary and "Retry" button

### Acceptance criteria
- [ ] "View results" links to Results; "Cancel" confirmation returns to Matching Configuration
- [ ] Done, current and upcoming stages are clearly distinguishable
- [ ] Activity log is a fixed-height scrollable panel
- [ ] Failure state is built as a static variant

---

## Issue 9: Results and Exception Review

**Labels:** `ui`, `results`, `priority: high` | **Size:** Large

### Summary
Review matched, unmatched and flagged records.

### Description
The main value screen. Users see summary numbers, inspect records, and see the approve / override actions. Embeds the Feedback panel from Issue 3.

### Scope / UI elements
- Summary strip: matched, unmatched in A, unmatched in B, flagged, total variance amount
- Tabs: Matched, Unmatched, Exceptions, each a table of sample rows
- Filter bar (amount range, date, status) and pagination controls (visual only)
- Row detail drawer (native `popover`) showing the two records side by side with differences highlighted
- Row actions: approve, reject, manually match, add note; bulk-action bar; thumbs up / down per match
- "User-modified" marker style for manually changed rows

### Acceptance criteria
- [ ] Tabs link to their table views; the active tab is highlighted
- [ ] Differences in the drawer are highlighted with the status colours
- [ ] Feedback panel (Issue 3) appears inside the drawer
- [ ] "Reports" links to Reports, Export and Audit Trail

---

## Issue 10: Reports, Export and Audit Trail

**Labels:** `ui`, `reporting`, `compliance` | **Size:** Medium

### Summary
Shows report outputs and who did what, which matters in a finance setting.

### Description
Finance teams need evidence. Provide the run report view, export options and an audit log of actions taken by the agent and by users. Settings live here as a lightweight tab.

### Scope / UI elements
- Run summary report view with a print-friendly layout
- Export buttons: Excel, CSV, PDF; option to include or exclude unmatched records (visual)
- Audit trail table: timestamp, user or agent, action, run ID, details; with filter controls (visual)
- Settings tab: default tolerances, notification preferences, profile (static form)
- Export confirmation toast (shown on the style-guide page)

### Acceptance criteria
- [ ] Report view prints cleanly (print stylesheet)
- [ ] Audit entries are presented read-only (no edit / delete controls)
- [ ] Report / Audit / Settings tabs link between their views
- [ ] Export buttons are visual only
