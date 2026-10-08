// ICOSE — Template centrali per header, footer e cookie banner
// Modifica QUESTO file per aggiornare tutte le pagine del sito.
(function () {

window.SITE_H =
`<header class="site-header">
  <div class="container">
    <div class="site-header__bar">
      <a href="index.html" class="brand" aria-label="ICOSE S.p.A.">
        <img src="assets/img/icose-logo.jpg" alt="ICOSE S.p.A." class="brand__logo">
      </a>
      <button class="nav-toggle" aria-label="Apri menu"><span></span></button>
      <nav class="nav" aria-label="Principale">
        <a href="index.html">Home</a>
        <a href="gruppo.html">Il Gruppo</a>
        <a href="attivita.html">Attivit\u00e0</a>
        <a href="prodotti.html">Prodotti</a>
        <a href="parco-macchine.html">Parco Macchine</a>
        <a href="certificazioni.html">Certificazioni</a>
        <a href="lavora-con-noi.html">Lavora con noi</a>
        <a href="contatti.html" class="nav__cta">Contattaci</a>
      </nav>
    </div>
  </div>
</header>`;

window.SITE_F =
`<footer class="site-footer">
  <div class="container">
    <div class="site-footer__grid">
      <div class="footer-block">
        <div class="footer-brand">
          <img src="assets/img/icose-logo.jpg" alt="ICOSE S.p.A." class="brand__logo">
        </div>
        <p>Da oltre 50 anni: opere edili, infrastrutture, estrazione e produzione di conglomerati in Liguria e Piemonte.</p>
      </div>
      <div>
        <h4>Azienda</h4>
        <ul>
          <li><a href="gruppo.html">Il Gruppo</a></li>
          <li><a href="attivita.html">Attivit\u00e0</a></li>
          <li><a href="prodotti.html">Prodotti</a></li>
          <li><a href="parco-macchine.html">Parco Macchine</a></li>
          <li><a href="certificazioni.html">Certificazioni</a></li>
        </ul>
      </div>
      <div>
        <h4>Persone</h4>
        <ul>
          <li><a href="lavora-con-noi.html">Lavora con noi</a></li>
          <li><a href="contatti.html">Contattaci</a></li>
          <li><a href="whistleblowing.html">Whistleblowing</a></li>
        </ul>
      </div>
      <div class="footer-block">
        <h4>Contatti</h4>
        <strong class="label">Uffici tecnici e amministrativi</strong>
        <address>17035 Cisano sul Neva (SV)<br>Via Benessea, 29/A<br><a href="tel:+390182589021">Tel. 0182 58921</a><br><a href="mailto:icose@icose.it">icose@icose.it</a></address>
        <strong class="label">Impianti e cava</strong>
        <address>17039 Zuccarello (SV)<br>Regione Isola, snc<br><a href="tel:+390182790033">Tel. 0182 79033</a></address>
      </div>
    </div>
  </div>
  <div class="funding-strip">
    <div class="container">
      <div class="funding-strip__logos">
        <img src="assets/img/filse21_27.png" alt="Coesione Italia 21-27 Liguria \u00b7 Cofinanziato dall'Unione europea \u00b7 Repubblica Italiana \u00b7 Regione Liguria">
      </div>
      <p class="funding-strip__text">L'impresa ha ricevuto risorse del PR FESR Liguria 2021 \u2013 2027 a valere sull'azione 1.2.3 \u2014 Bando supporto allo sviluppo di progetti di digitalizzazione nelle MPMI \u2013 pos. 1385.</p>
      <p class="funding-strip__codice">Codice univoco ufficio per invio fatture elettroniche <strong>A4707H7</strong></p>
    </div>
  </div>
  <div class="container">
    <div class="site-footer__bar">
      <div>\u00a9 <span id="yr"></span> ICOSE S.p.A. \u00b7 Sede legale Paroldo (CN), Regione Bovina 2 \u00b7 P.IVA 02158740049 \u00b7 SDI A4707H7</div>
      <div>
        <a href="privacy.html">Privacy</a> \u00b7 <a href="cookie.html">Cookie</a> \u00b7 <a href="whistleblowing.html">Whistleblowing</a> \u00b7 <a href="dlgs-231.html">D.Lgs. 231/01</a>
      </div>
    </div>
  </div>
</footer>`;

window.SITE_C =
`<div class="cookie-banner">
  <div>Utilizziamo cookie tecnici e, previo consenso, cookie analitici e di profilazione per migliorare l'esperienza di navigazione. <a href="cookie.html">Leggi la cookie policy</a>.</div>
  <div class="cookie-banner__actions">
    <button class="btn-decline" data-choice="decline">Solo tecnici</button>
    <button class="btn-accept" data-choice="accept">Accetta tutti</button>
  </div>
</div>`;

})();