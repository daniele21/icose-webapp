// ICOSE — interazioni
(function () {

  // Mobile menu
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      toggle.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu');
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // Mark active nav
  const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav a').forEach(a => {
    const href = (a.getAttribute('href') || '').toLowerCase();
    if (href === page) a.classList.add('is-active');
  });

  // Cookie banner
  const banner = document.querySelector('.cookie-banner');
  if (banner) {
    if (!localStorage.getItem('icose_cookie_choice')) {
      setTimeout(() => banner.classList.add('is-visible'), 900);
    }
    banner.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        localStorage.setItem('icose_cookie_choice', btn.dataset.choice || 'accept');
        banner.classList.remove('is-visible');
      });
    });
  }

  // Reveal on scroll — with tracking to avoid re-processing
  const revealed = new WeakSet();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !revealed.has(e.target)) {
        revealed.add(e.target);
        e.target.classList.add('is-in');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

  // Sticky header shadow + scroll progress + back-to-top
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const toTop = document.querySelector('.to-top');

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (toTop) toTop.classList.toggle('is-visible', y > 480);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (y / max) * 100 : 0;
      progress.style.width = pct + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Whistleblowing demo form — codice univoco di tracciamento
  const wbForm = document.querySelector('#wb-form');
  if (wbForm) {
    wbForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const code = 'ICS-' + Math.random().toString(36).slice(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
      const out = document.querySelector('#wb-result');
      if (out) {
        out.style.display = 'block';
        out.querySelector('strong').textContent = code;
        out.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Generic contact form (demo)
  const cForm = document.querySelector('#contact-form');
  if (cForm) {
    cForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = document.querySelector('#contact-success');
      if (ok) {
        ok.style.display = 'block';
        ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      cForm.reset();
    });
  }
})();
