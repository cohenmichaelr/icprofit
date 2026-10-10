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
