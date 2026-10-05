/* ==========================================================================
   FinRecAuth: mock authentication service
   --------------------------------------------------------------------------
   Screens talk to this object only. To plug in real SSO / an identity
   provider later, replace the bodies of signIn() and signInWithSSO() and
   keep their signatures: each resolves to a user object, or rejects with an
   AuthError carrying a `code` and a user-facing `message`.

   Plain script (no modules) so pages work when opened straight from disk.
   ========================================================================== */
(function (global) {
  'use strict';

  const DEMO_PASSWORD = 'Recon@2026';
  const NETWORK_DELAY_MS = 1200;

  const KEYS = {
    session: 'finrec.session',            // sessionStorage: ends with the tab
    onboardedPrefix: 'finrec.onboarded:'  // localStorage: survives restarts
  };

  const ROUTES = {
    signIn: 'index.html',
    onboarding: 'onboarding.html',
    dashboard: 'dashboard.html'
  };

  class AuthError extends Error {
    constructor(code, message) {
      super(message);
      this.name = 'AuthError';
      this.code = code;
    }
  }

  // Storage can throw (private mode, blocked site data); never let it break sign-in.
  function read(area, key) {
    try { return global[area].getItem(key); } catch (e) { return null; }
  }
  function write(area, key, value) {
    try { global[area].setItem(key, value); } catch (e) { /* ignore */ }
  }
  function remove(area, key) {
    try { global[area].removeItem(key); } catch (e) { /* ignore */ }
  }

  function delay(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function titleCase(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function userFromIdentifier(identifier) {
    const id = identifier.trim().toLowerCase();
    if (id.includes('@')) {
      const name = id.split('@')[0].split(/[._-]+/).filter(Boolean).map(titleCase).join(' ');
      return { id: id, name: name || id, email: id, employeeId: null };
    }
    const employeeId = identifier.trim().toUpperCase();
    return { id: id, name: 'Employee ' + employeeId, email: null, employeeId: employeeId };
  }

  function startSession(user, method) {
    const session = { user: user, method: method, signedInAt: new Date().toISOString() };
    write('sessionStorage', KEYS.session, JSON.stringify(session));
    return session.user;
  }

  const FinRecAuth = {
    routes: ROUTES,
    AuthError: AuthError,

    /** Mock: any well-formed identifier + DEMO_PASSWORD succeeds. */
    async signIn(identifier, password) {
      await delay(NETWORK_DELAY_MS);
      if (password !== DEMO_PASSWORD) {
        throw new AuthError(
          'INVALID_CREDENTIALS',
          'Incorrect email/employee ID or password. Please try again.'
        );
      }
      return startSession(userFromIdentifier(identifier), 'password');
    },

    /** Mock: a real version would redirect to the IdP and return here. */
    async signInWithSSO() {
      await delay(NETWORK_DELAY_MS + 400);
      return startSession(
        { id: 'alex.morgan@example.com', name: 'Alex Morgan', email: 'alex.morgan@example.com', employeeId: null },
        'sso'
      );
    },

    getSession() {
      const raw = read('sessionStorage', KEYS.session);
      if (!raw) return null;
      try { return JSON.parse(raw); } catch (e) { return null; }
    },

    signOut() {
      remove('sessionStorage', KEYS.session);
    },

    isOnboarded(user) {
      return read('localStorage', KEYS.onboardedPrefix + user.id) === 'true';
    },

    completeOnboarding(user) {
      write('localStorage', KEYS.onboardedPrefix + user.id, 'true');
    },

    resetOnboarding(user) {
      remove('localStorage', KEYS.onboardedPrefix + user.id);
    },

    /** First-time users go to onboarding, returning users to the dashboard. */
    routeFor(user) {
      return this.isOnboarded(user) ? ROUTES.dashboard : ROUTES.onboarding;
    },

    /** Guard for signed-in pages: returns the session or sends the user to sign in. */
    requireSession() {
      const session = this.getSession();
      if (!session) {
        global.location.replace(ROUTES.signIn);
        return null;
      }
      return session;
    }
  };

  global.FinRecAuth = FinRecAuth;
})(window);
