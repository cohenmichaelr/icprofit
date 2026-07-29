// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Highlight the current page in the nav (host may serve clean URLs, so
  // compare with the .html extension stripped from both sides)
  const page = (location.pathname.replace(/\/+$/, '').split('/').pop() || 'index').replace(/\.html$/, '');
  document.querySelectorAll('.site-nav a[href]').forEach(a => {
    if (a.getAttribute('href').replace(/\.html$/, '') === page) a.classList.add('active');
  });
});
