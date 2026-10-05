/* ==========================================================================
   Login screen behaviour (Issue 1)
   --------------------------------------------------------------------------
   Validation, show/hide password, Caps Lock hint, loading / error / success
   states and routing. Auth itself lives in auth.js (FinRecAuth).
   ========================================================================== */
(function () {
  'use strict';

  const Auth = window.FinRecAuth;

  // Already signed in this tab? Skip straight to the right screen.
  const existing = Auth.getSession();
  if (existing) {
    window.location.replace(Auth.routeFor(existing.user));
    return;
  }

  const card       = document.querySelector('.auth-card');
  const form       = document.getElementById('signin-form');
  const fieldset   = document.getElementById('signin-fields');
  const identifier = document.getElementById('identifier');
  const password   = document.getElementById('password');
  const toggle     = document.getElementById('toggle-password');
  const submitBtn  = document.getElementById('signin-submit');
  const ssoBtn     = document.getElementById('sso-submit');
  const alertText  = document.getElementById('form-alert-text');
  const srStatus   = document.getElementById('sr-status');

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const EMPLOYEE_ID_RE = /^[A-Za-z0-9]{5,10}$/;
  const SUCCESS_PAUSE_MS = 650;

  // Messages are kept short so they fit on one reserved line (no layout shift).
  const validators = {
    identifier(value) {
      const v = value.trim();
      if (!v) return 'Enter your email or employee ID.';
      if (v.includes('@')) return EMAIL_RE.test(v) ? '' : 'Enter a valid email address.';
      return EMPLOYEE_ID_RE.test(v) ? '' : 'Employee IDs are 5–10 letters or numbers.';
    },
    password(value) {
      if (!value) return 'Enter your password.';
      if (value.length < 8) return 'Use at least 8 characters.';
      return '';
    }
  };

  let busy = false;

  /* ---- Field errors ----------------------------------------------------- */

  function messageEl(input) {
    return document.getElementById(input.getAttribute('aria-describedby'));
  }

  function setFieldError(input, message) {
    const field = input.closest('.field');
    field.classList.toggle('is-invalid', Boolean(message));
    field.classList.remove('has-warning');
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    messageEl(input).textContent = message;
  }

  function validate(input) {
    const message = validators[input.name](input.value);
    setFieldError(input, message);
    return message;
  }

  function isShowingError(input) {
    return input.closest('.field').classList.contains('is-invalid');
  }

  /* ---- Form-level alert (invalid credentials) -------------------------- */

  function showFormAlert(message) {
    card.classList.add('has-error');
    // Set text after the alert becomes visible so screen readers announce it.
    requestAnimationFrame(function () { alertText.textContent = message; });
  }

  function hideFormAlert() {
    if (!card.classList.contains('has-error')) return;
    card.classList.remove('has-error');
    alertText.textContent = '';
    // Credential errors outline both fields; clear that unless a field has its own error.
    [identifier, password].forEach(function (input) {
      if (!isShowingError(input)) input.setAttribute('aria-invalid', 'false');
    });
  }

  /* ---- Busy / success states -------------------------------------------- */

  function setBusy(button, label) {
    busy = true;
    fieldset.disabled = true;
    submitBtn.disabled = true;
    ssoBtn.disabled = true;
    button.setAttribute('aria-busy', 'true');
    const labelEl = button.querySelector('.btn__label');
    labelEl.dataset.idle = labelEl.textContent;
    labelEl.textContent = label;
    srStatus.textContent = label;
  }

  function clearBusy() {
    busy = false;
    fieldset.disabled = false;
    [submitBtn, ssoBtn].forEach(function (button) {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      delete button.dataset.state;
      const labelEl = button.querySelector('.btn__label');
      if (labelEl.dataset.idle) labelEl.textContent = labelEl.dataset.idle;
    });
    srStatus.textContent = '';
  }

  function succeed(button, user) {
    button.removeAttribute('aria-busy');
    button.dataset.state = 'success';
    button.querySelector('.btn__label').textContent = 'Signed in';
    srStatus.textContent = 'Signed in. Redirecting.';
    setTimeout(function () {
      window.location.assign(Auth.routeFor(user));
    }, SUCCESS_PAUSE_MS);
  }

  function fail(err) {
    clearBusy();
    showFormAlert((err && err.message) || 'Something went wrong. Please try again.');
    if (err && err.code === 'INVALID_CREDENTIALS') {
      identifier.setAttribute('aria-invalid', 'true');
      password.setAttribute('aria-invalid', 'true');
      password.focus();
      password.select();
    }
  }

  /* ---- Events ----------------------------------------------------------- */

  [identifier, password].forEach(function (input) {
    // Validate on blur once something has been typed (don't nag empty fields early).
    input.addEventListener('blur', function () {
      if (input.value) validate(input);
    });

    // While an error is showing, re-check live so it clears the moment it's fixed.
    input.addEventListener('input', function () {
      hideFormAlert();
      if (isShowingError(input)) validate(input);
    });
  });

  // Caps Lock hint on the password field.
  function updateCapsLock(event) {
    if (isShowingError(password) || typeof event.getModifierState !== 'function') return;
    const on = event.getModifierState('CapsLock');
    password.closest('.field').classList.toggle('has-warning', on);
    messageEl(password).textContent = on ? 'Caps Lock is on.' : '';
  }
  password.addEventListener('keydown', updateCapsLock);
  password.addEventListener('keyup', updateCapsLock);
  password.addEventListener('blur', function () {
    if (isShowingError(password)) return;
    password.closest('.field').classList.remove('has-warning');
    messageEl(password).textContent = '';
  });

  // Show / hide password.
  toggle.addEventListener('click', function () {
    const show = password.type === 'password';
    password.type = show ? 'text' : 'password';
    toggle.setAttribute('aria-pressed', String(show));
    toggle.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });

  // Enter in either field submits natively, landing here.
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    if (busy) return;
    hideFormAlert();

    const idError = validate(identifier);
    const pwError = validate(password);
    if (idError || pwError) {
      (idError ? identifier : password).focus();
      return;
    }

    setBusy(submitBtn, 'Signing in…');
    try {
      const user = await Auth.signIn(identifier.value, password.value);
      succeed(submitBtn, user);
    } catch (err) {
      fail(err);
    }
  });

  ssoBtn.addEventListener('click', async function () {
    if (busy) return;
    hideFormAlert();
    setBusy(ssoBtn, 'Redirecting to SSO…');
    try {
      const user = await Auth.signInWithSSO();
      succeed(ssoBtn, user);
    } catch (err) {
      fail(err);
    }
  });

  // Returning via the Back button can restore a frozen "Signing in…" page.
  window.addEventListener('pageshow', function (event) {
    if (!event.persisted) return;
    const session = Auth.getSession();
    if (session) {
      window.location.replace(Auth.routeFor(session.user));
      return;
    }
    clearBusy();
    password.value = '';
  });
})();
