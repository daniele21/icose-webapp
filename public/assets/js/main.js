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

  // Counter animation per le statistiche (grid-stats)
  var gridStats = document.querySelector('.grid-stats');
  if (gridStats) {
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(e) {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.stat__num').forEach(animateCounter);
          counterObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    counterObserver.observe(gridStats);
  }

  function animateCounter(el) {
    var origHTML = el.innerHTML;
    var txt = el.textContent || '';
    var m = txt.match(/^([\d]+)(.*)/);
    if (!m) return;
    var target  = parseInt(m[1], 10);
    var suffix  = m[2]; // es. "+"
    var step    = target > 100 ? Math.max(1, Math.floor(target / 80)) : 1;
    var adj     = Math.ceil(target / step);
    var dur     = 1600; // ms
    var t0      = performance.now();

    function tick() {
      var elapsed = performance.now() - t0;
      var p = Math.min(elapsed / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubico
      var cur = Math.floor(eased * adj) * step;
      var html = String(cur);
      if (suffix) html += '<small>' + suffix + '</small>';
      el.innerHTML = html;
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        el.innerHTML = origHTML; // valore esatto finale
      }
    }
    tick();
  }

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

  // Whistleblowing form — invio diretto via Firebase Cloud Function
  const wbForm = document.querySelector('#wb-form');
  if (wbForm) {
    // URL della Cloud Function — aggiorna dopo il deploy
    var WB_ENDPOINT = 'https://us-central1-icose-spa.cloudfunctions.net/sendWhistleblowing';

    // Mostra/nascondi campi identificativi in base alla modalità
    var wbModalita = document.getElementById('wb-modalita');
    var wbIdentFields = document.getElementById('wb-ident-fields');
    if (wbModalita && wbIdentFields) {
      wbModalita.addEventListener('change', function(){
        var visibile = wbModalita.value === 'ident';
        wbIdentFields.style.display = visibile ? '' : 'none';
        // Rendi obbligatori/facoltativi
        ['wb-nome', 'wb-cognome', 'wb-email'].forEach(function(id){
          var el = document.getElementById(id);
          if (el) el.required = visibile;
        });
      });
    }

    wbForm.addEventListener('submit', function(e){
      e.preventDefault();

      var submitBtn = document.getElementById('wb-submit');
      var originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Invio in corso…';

      // Leggi token reCAPTCHA
      var recaptchaResponse = '';
      var recaptchaEl = document.getElementById('g-recaptcha-response');
      if (recaptchaEl) recaptchaResponse = recaptchaEl.value;

      var payload = {
        modalita:          document.getElementById('wb-modalita').value,
        nome:              (document.getElementById('wb-nome')      || {}).value || '',
        cognome:           (document.getElementById('wb-cognome')   || {}).value || '',
        email:             (document.getElementById('wb-email')     || {}).value || '',
        categoria:         document.getElementById('wb-categoria').value,
        data:              document.getElementById('wb-data').value,
        luogo:             document.getElementById('wb-luogo').value,
        descrizione:       document.getElementById('wb-descrizione').value,
        soggetti:          document.getElementById('wb-soggetti').value,
        email_tracciamento: document.getElementById('wb-email-tracciamento').value,
        recaptcha_token:   recaptchaResponse,
      };

      fetch(WB_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      .then(function(r){ return r.json(); })
      .then(function(data){
        var out = document.getElementById('wb-result');
        if (data.success) {
          out.style.display = 'block';
          out.innerHTML =
            '<p style="margin:0 0 8px; color:var(--c-success); font-weight:600;">Segnalazione inviata con successo.</p>' +
            '<p style="margin:0 0 12px;">Codice di tracciamento: <strong>' + (data.codice || '—') + '</strong></p>' +
            '<p class="text-muted" style="margin:12px 0 0; font-size:.9rem;">Conserva questo codice per riferimento futuro.</p>';
          out.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          out.style.display = 'block';
          out.innerHTML = '<p style="color:#c33; font-weight:600;">Errore nell\'invio. ' + (data.error || 'Riprova più tardi.') + '</p>';
        }
      })
      .catch(function(err){
        var out = document.getElementById('wb-result');
        out.style.display = 'block';
        out.innerHTML = '<p style="color:#c33; font-weight:600;">Errore di connessione. Verifica la tua connessione Internet e riprova.</p>';
      })
      .finally(function(){
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
        wbForm.querySelectorAll('input, select, textarea').forEach(function(el){ el.value = ''; });
        document.getElementById('wb-priv').checked = false;
        // Nascondi campi identificativi
        if (wbIdentFields) wbIdentFields.style.display = 'none';
      });
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
