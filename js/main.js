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
    root.setAttribute('data-theme', next);
    try { localStorage.setItem(KEY, next); } catch (e) { /* private mode */ }
    syncLabel();
  });

  // Follow the OS while the visitor hasn't overridden it.
  systemDark.addEventListener('change', () => {
    if (!root.hasAttribute('data-theme')) syncLabel();
  });

  syncLabel();
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
