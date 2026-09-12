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

const siteConfig = {
  apiBaseUrl: document.body.dataset.apiBaseUrl || 'https://www.wizzycrm.com/api',
  subdomain: document.body.dataset.leadSubdomain || 'patrick-hammon',
};

document.querySelectorAll('[data-lead-form]').forEach((form) => {
  form.dataset.formStartedAt = String(Date.now());

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const status = form.querySelector('[data-form-status]');
    const formData = new FormData(form);
    const firstName = String(formData.get('firstName') || '').trim();
    const lastName = String(formData.get('lastName') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();

    if (!firstName || !lastName || (!email && !phone)) {
      setLeadStatus(status, 'error', 'Please add your name and an email address or phone number.');
      return;
    }

    setLeadStatus(status, null, '');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.dataset.defaultLabel = submitButton.textContent;
      submitButton.textContent = 'Sending...';
    }

    try {
      const response = await fetch(`${siteConfig.apiBaseUrl}/public/websites/${encodeURIComponent(siteConfig.subdomain)}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email: email || null,
          phone: phone || null,
          timeline: String(formData.get('timeline') || '').trim() || null,
          message: String(formData.get('message') || '').trim() || null,
          leadType: 'General',
          campaign: form.dataset.campaign || 'Patrick personal site',
          landingPage: window.location.pathname,
          referrer: document.referrer || null,
          formSubmitted: form.dataset.formName || 'website form',
          deviceType: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1100 ? 'tablet' : 'desktop',
          website: String(formData.get('website') || '').trim() || null,
          formStartedAt: Number(form.dataset.formStartedAt),
        }),
      });

      if (!response.ok) throw new Error('The form could not be sent right now.');
      form.reset();
      setLeadStatus(status, 'success', form.dataset.successMessage || 'Thanks. Your note was sent.');
    } catch (error) {
      setLeadStatus(status, 'error', error instanceof Error ? error.message : 'The form could not be sent right now.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.defaultLabel || 'Send my note';
      }
    }
  });
});

function setLeadStatus(status, kind, message) {
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('is-visible', Boolean(kind && message));
  status.classList.toggle('is-success', kind === 'success');
  status.classList.toggle('is-error', kind === 'error');
}
