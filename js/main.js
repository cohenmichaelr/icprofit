// Theme toggle. The stored choice is applied by a small inline script in
// <head> so the page never paints in the wrong theme first; this only wires
// up the button and keeps its label in sync.
document.addEventListener('DOMContentLoaded', () => {
  const KEY = 'icprofit-theme';
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const systemDark = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () =>
    root.getAttribute('data-theme') === 'dark' ||
    (!root.hasAttribute('data-theme') && systemDark.matches);

  const syncLabel = () => {
    const dark = isDark();
    btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
  };

  btn.addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';

    // Suppress transitions for one frame. Without this, Chrome leaves any
    // transitioned colour at its previous value when the custom property
    // behind it changes, which can strand light text on a light background.
    root.classList.add('theme-switching');
    root.setAttribute('data-theme', next);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => root.classList.remove('theme-switching'));
    });

    try { localStorage.setItem(KEY, next); } catch (e) { /* private mode */ }
    syncLabel();
  });

  // Follow the OS while the visitor hasn't overridden it.
  systemDark.addEventListener('change', () => {
    if (!root.hasAttribute('data-theme')) syncLabel();
  });

  syncLabel();
});

// Consultation form. Posts to FormSubmit, which relays the submission as an
// email to the address below. The <form> also carries a plain action/method so
// it still works with JavaScript disabled; this handler upgrades that to an
// in-page POST so the visitor never leaves the page.
//
// To change provider, update ENDPOINT here and the form's action in
// schedule.html. For Netlify Forms, drop this handler and add
// data-netlify="true" to the form instead.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('consultForm');
  if (!form) return;

  // Derive the endpoint from the form's own action so the JS path and the
  // no-JavaScript fallback can never point at different addresses. Change the
  // recipient in schedule.html only.
  const ACTION = form.getAttribute('action') || '';
  const ENDPOINT = ACTION.replace('formsubmit.co/', 'formsubmit.co/ajax/');
  const TO = ACTION.split('/').pop() || 'info@icprofit.com';
  const note = document.getElementById('formNote');

  const say = (msg, ok) => {
    let box = form.querySelector('.form-status');
    if (!box) {
      box = document.createElement('p');
      box.className = 'form-status';
      box.setAttribute('role', 'status');
      form.insertBefore(box, note);
    }
    box.classList.toggle('form-status--ok', !!ok);
    box.classList.toggle('form-status--err', !ok);
    box.textContent = msg;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    form.classList.add('validated');

    if (!form.checkValidity()) {
      const bad = form.querySelector(':invalid');
      if (bad) bad.focus();
      say('Please add your name and a valid email so we can reply.', false);
      return;
    }

    // Spam trap: only a bot fills the hidden field, so drop it silently.
    const honey = form.querySelector('[name="_honey"]');
    if (honey && honey.value) return;

    const val = (id) => {
      const el = document.getElementById(id);
      return el ? (el.value || '').trim() : '';
    };
    const interests = [...form.querySelectorAll('input[name="interest"]:checked')]
      .map((c) => c.value);

    const payload = {
      _subject: 'Consultation request' + (val('firm') ? ' — ' + val('firm') : ''),
      _template: 'table',
      _captcha: 'false',
      Name: val('name'),
      Firm: val('firm'),
      Email: val('email'),
      Phone: val('phone'),
      'Firm size': val('size'),
      'Current software': val('software'),
      'Interested in': interests.join(', '),
      Notes: val('message')
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    const label = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    say('Sending your request…', true);

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok || String(body.success) !== 'true') {
        throw new Error(body.message || 'HTTP ' + res.status);
      }

      // Swap the form for a clear confirmation, so the visitor is left in no
      // doubt the message went. Falls back to the inline status line if the
      // panel is missing.
      form.reset();
      form.classList.remove('validated');
      const done = document.getElementById('formSuccess');
      if (done) {
        form.hidden = true;
        done.hidden = false;
        done.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        say('Thank you — your request has been sent. We reply the same business day.', true);
      }
    } catch (err) {
      // Visitors get a plain fallback; the real reason goes to the console so
      // setup problems (an unactivated form, a wrong address) are diagnosable.
      console.warn('Consultation form did not send:', err.message);
      say('Sorry, that did not go through. Please email ' + TO +
          ' or call (561) 404-0060 and we will pick it up from there.', false);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = label;
    }
  });
});

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (toggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    toggle.addEventListener('click', () => {
      setOpen(!nav.classList.contains('open'));
    });

    // Tapping a link should close the menu — same-page anchors don't reload,
    // so it would otherwise stay open over the content.
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });

    // Rotating to landscape / resizing past the breakpoint reveals the desktop
    // nav; clear the mobile open state so it isn't stuck when coming back.
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) setOpen(false);
    });
  }

  // Highlight the current page in the nav (host may serve clean URLs, so
  // compare with the .html extension stripped from both sides)
  const page = (location.pathname.replace(/\/+$/, '').split('/').pop() || 'index').replace(/\.html$/, '');
  document.querySelectorAll('.site-nav a[href]').forEach(a => {
    if (a.getAttribute('href').replace(/\.html$/, '') === page) a.classList.add('active');
  });
});
