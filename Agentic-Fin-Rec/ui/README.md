# Finance Reconciliation Agent: UI

Plain HTML, CSS and a little vanilla JavaScript. No build step, no npm, no frameworks.

## Run it

Double-click `index.html`, or open it in Chrome, Edge, Safari 17+ or Firefox 125+.

**Demo sign-in:** any valid email (e.g. `jordan.lee@example.com`) or employee ID (5–10 letters/numbers) with password `Recon@2026`. Any other password shows the "invalid credentials" state.

- First sign-in for an account → `onboarding.html` (setup step 1); click through the five steps with Continue
- "Finish setup" or "Skip setup for now" → `dashboard.html` (placeholder for Issue 5); later sign-ins go straight there
- "Reset onboarding & sign out" on the dashboard brings back the first-time path

## Structure

```
ui/
├── index.html               Issue 1: Login screen
├── onboarding.html          Issue 2: Setup step 1, Add CCIDs
├── onboarding-knowledge-base.html  Step 2, Knowledge base
├── onboarding-sources.html  Step 3, Connect sources
├── onboarding-instructions.html  Step 4, Instructions (main prompt + per-file/source notes)
├── onboarding-test-run.html Step 5, Test run (Approve / Not sure / Decline review)
├── dashboard.html           Placeholder (Issue 5)
└── assets/
    ├── css/
    │   ├── tokens.css       Design tokens: the only place raw colours live (Issue 4)
    │   ├── base.css         Reset + shared components: button, input, field, alert, badge, card
    │   ├── login.css        Login layout and states
    │   ├── onboarding.css   Setup rail, work area and step components (static, no JS)
    │   └── placeholder.css  Temporary styles for placeholder pages
    ├── js/
    │   ├── auth.js          FinRecAuth: mock auth service (swap in real SSO here)
    │   └── login.js         Validation, show/hide password, loading/error/success, routing
    └── American_Express/    Official logos, symbol and banner (used as supplied)
```

## Plugging in real SSO later

Screens only call `FinRecAuth` (in `assets/js/auth.js`). Replace the bodies of `signIn()` and `signInWithSSO()` and keep their contracts: resolve with a user object `{ id, name, email, employeeId }`, or reject with an `AuthError` carrying a `code` (e.g. `INVALID_CREDENTIALS`) and a user-facing `message`.

## Notes

- Scripts are classic `<script>` tags, not ES modules, so pages work when opened from disk (`file://`).
- Session is kept in `sessionStorage` (ends with the tab); the onboarding-complete flag is in `localStorage`.
- Inter loads from Google Fonts; offline it falls back to Helvetica.
- Support address `recon-support@example.com` is a placeholder.
