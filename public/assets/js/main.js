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

  // Hero title — effetto "costruzione": ogni lettera viene eretta dal basso
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const fullText = heroTitle.textContent.trim();
    heroTitle.setAttribute('aria-label', fullText);
    const frag = document.createDocumentFragment();
    let letterIndex = 0;
    fullText.split(/\s+/).forEach((word) => {
      const wordEl = document.createElement('span');
      wordEl.className = 'ht-word';
      wordEl.setAttribute('aria-hidden', 'true');
      Array.from(word).forEach((ch) => {
        const letterEl = document.createElement('span');
        letterEl.className = 'ht-letter';
        letterEl.textContent = ch;
        letterEl.style.setProperty('--i', letterIndex++);
        wordEl.appendChild(letterEl);
      });
      frag.appendChild(wordEl);
    });
    heroTitle.textContent = '';
    heroTitle.appendChild(frag);
  }

  // Cronostoria orizzontale — pagina "Il Gruppo"
  // Quando la rotella verticale raggiunge la sezione .hs__viewport,
  // lo scroll verticale della pagina viene BLOCCATO "al centro" dello schermo
  // (la sezione resta fissa a schermo pieno) e la rotella muove l'orizzontale.
  // Quando lo scroll orizzontale arriva alla fine, lo scroll verticale si
  // sblocca (sia scendendo che risalendo, nelle due direzioni).
  const hs = document.querySelector('.hs');
  const hsViewport = hs ? hs.querySelector('.hs__viewport') : null;
  if (hsViewport && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const hsBar = hs.querySelector('.hs__progress-bar');
    const hsCounter = hs.querySelector('.hs__counter');
    const count = hs.querySelectorAll('.hs-panel').length;

    let lockY = 0;       // posizione di scorrimento in cui la sezione riempie lo schermo
    let maxX = 0;        // scorrimento orizzontale massimo
    let locked = false;  // scroll verticale bloccato

    const measure = () => {
      lockY = hs.getBoundingClientRect().top + window.scrollY;
      maxX = hsViewport.scrollWidth - hsViewport.clientWidth;
    };

    const paint = () => {
      if (maxX <= 0) return;
      const t = hsViewport.scrollLeft;
      if (hsBar) hsBar.style.width = ((t / maxX) * 100).toFixed(1) + '%';
      if (hsCounter && count) {
        const cur = Math.min(count, Math.max(1, Math.floor((t / maxX) * count) + 1));
        hsCounter.textContent = String(cur).padStart(2, '0') + ' / ' + String(count).padStart(2, '0');
      }
    };

    // Posiziona la pagina a un dato altezza senza animazione di scroll
    const scrollTopDirect = (y) => {
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, y);
      html.style.scrollBehavior = prev;
    };

    const lock = () => {
      locked = true;
      scrollTopDirect(lockY);
    };

    const scrollHsBy = (dy) => {
      const next = Math.max(0, Math.min(maxX, hsViewport.scrollLeft + dy));
      hsViewport.scrollLeft = next;
      return next;
    };

    // Rotella: gestione blocco / ingresso / uscita
    const onWheel = (e) => {
      const dy = e.deltaY;
      if (Math.abs(e.deltaX) > Math.abs(dy)) return; // gesto orizzontale → nativo
      if (Math.abs(dy) < 1) return;
      const cur = window.scrollY;

      if (locked) {
        if (dy > 0) {
          // Scroll verticale in giù
          if (hsViewport.scrollLeft < maxX) {
            scrollHsBy(dy);
            e.preventDefault();
          } else {
            locked = false; // fine orizzontale → sblocca verso il basso
          }
        } else {
          // Scroll verticale in su
          if (hsViewport.scrollLeft > 0) {
            scrollHsBy(dy);
            e.preventDefault();
          } else {
            locked = false; // inizio orizzontale → sblocca verso l'alto
          }
        }
        return;
      }

      // Non ancora bloccato: rileva l'attraversamento del confine della sezione
      if (dy > 0 && cur < lockY && cur + dy >= lockY) {
        lock();
        scrollHsBy(cur + dy - lockY); // traduce la rotella "in eccesso"
        e.preventDefault();
      } else if (dy < 0 && cur > lockY && cur + dy <= lockY) {
        // Arrivando da sotto: ribloccami e muovi l'orizzontale indietro
        lock();
        scrollHsBy(dy);
        e.preventDefault();
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });

    // Mantiene la pagina bloccata sul valore lockY mentre locked
    window.addEventListener('scroll', () => {
      if (locked && Math.abs(window.scrollY - lockY) > 2) scrollTopDirect(lockY);
    }, { passive: true });

    hsViewport.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', () => { measure(); paint(); });
    measure();
    paint();

    // --- Drag-to-scroll (click e trascina) sullo viewport orizzontale ---
    let dragState = null;
    const dragContainer = hsViewport;

    const onDragStart = (e) => {
      // Solo tasto sinistro del mouse
      if (e.button !== 0) return;
      dragState = {
        startX: e.clientX,
        startScrollLeft: dragContainer.scrollLeft,
      };
      // Previeni la selezione di testo mentre si trascina
      const prev = dragContainer.style.userSelect;
      dragContainer.style.userSelect = 'none';
      dragContainer.style.webkitUserSelect = 'none';
      dragContainer.dataset.prevUserSelect = prev || '';
      dragContainer.classList.add('is-dragging');
    };

    const onDragMove = (e) => {
      if (!dragState) return;
      e.preventDefault();
      const dx = dragState.startX - e.clientX;
      const next = Math.max(0, Math.min(maxX, dragState.startScrollLeft + dx));
      dragContainer.scrollLeft = next;
    };

    const onDragEnd = () => {
      if (!dragState) return;
      dragContainer.style.userSelect = dragContainer.dataset.prevUserSelect || '';
      dragContainer.style.webkitUserSelect = dragContainer.dataset.prevUserSelect || '';
      delete dragContainer.dataset.prevUserSelect;
      dragContainer.classList.remove('is-dragging');
      dragState = null;
    };

    dragContainer.addEventListener('mousedown', onDragStart);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
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
