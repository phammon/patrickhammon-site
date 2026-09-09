const navToggle = document.querySelector('[data-nav-toggle]');
const siteNav = document.querySelector('#site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') !== 'true';
    navToggle.setAttribute('aria-expanded', String(isOpen));
    siteNav.classList.toggle('is-open', isOpen);
  });
  siteNav.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      navToggle.setAttribute('aria-expanded', 'false');
      siteNav.classList.remove('is-open');
    }
  });
}

document.querySelectorAll('[data-faq-button]').forEach((button) => {
  button.setAttribute('aria-expanded', 'false');
  button.addEventListener('click', () => {
    const item = button.closest('.faq-item');
    if (!item) return;
    const isOpen = item.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(isOpen));
  });
});

document.querySelectorAll('[data-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});
