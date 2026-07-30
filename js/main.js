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

// Consultation form. This is a static site with no backend, so rather than
// posting into a void the form composes a prefilled email to the firm. Swap
// this for a real endpoint (Formspree, Netlify Forms, your CRM) by giving the
// <form> an action and removing this handler.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('consultForm');
  if (!form) return;

  const TO = 'info@icprofit.com';
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.classList.add('validated');

    if (!form.checkValidity()) {
      const bad = form.querySelector(':invalid');
      if (bad) bad.focus();
      say('Please add your name and a valid email so we can reply.', false);
      return;
    }

    const val = (id) => (document.getElementById(id).value || '').trim();
    const interests = [...form.querySelectorAll('input[name="interest"]:checked')]
      .map((c) => c.value);

    const lines = [
      ['Name', val('name')],
      ['Firm', val('firm')],
      ['Email', val('email')],
      ['Phone', val('phone')],
      ['Firm size', val('size')],
      ['Software', val('software')],
      ['Interested in', interests.join(', ')],
      ['', ''],
      ['Notes', val('message')]
    ]
      .filter(([label, value]) => value || label === '')
      .map(([label, value]) => (label ? label + ': ' + value : ''))
      .join('\n');

    const subject = 'Consultation request' + (val('firm') ? ' — ' + val('firm') : '');
    const href = 'mailto:' + TO +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(lines);

    window.location.href = href;
    say('Opening your email app with the details filled in. If nothing happens, email ' + TO + ' directly.', true);
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
