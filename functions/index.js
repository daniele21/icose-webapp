/**
 * ICOSE — Cloud Function per Whistleblowing
 * Invia la segnalazione via SMTP configurabile.
 *
 * Non dipende da Gmail: usa qualsiasi server SMTP impostato
 * nelle variabili d'ambiente Firebase.
 *
 * Configurazione (firebase functions:config set …):
 *   smtp.host     — server SMTP (es. mail.icose.it, smtp.mailtrap.io, …)
 *   smtp.port     — 25 / 465 / 587 …
 *   smtp.secure   — true / false (TLS)
 *   smtp.user     — utente SMTP
 *   smtp.pass     — password SMTP
 *   mail.to       — destinatario (es. alexnuzzi2@gmail.com)
 *   mail.from     — mittente (es. whistleblowing@icose.it)
 */

const functions = require('firebase-functions');
const nodemailer  = require('nodemailer');
const https      = require('https');

exports.sendWhistleblowing = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).send('');
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    var b = req.body || {};
    var codice = 'ICS-' +
      Math.random().toString(36).slice(2, 8).toUpperCase() + '-' +
      Date.now().toString().slice(-4);

    // --- Verifica reCAPTCHA ---
    var recaptchaSecret = process.env.RECAPTCHA_SECRET || '';
    if (recaptchaSecret) {
      var token = b.recaptcha_token || '';
      if (!token) {
        return res.status(400).json({ success: false, error: 'reCAPTCHA mancante.' });
      }
      var verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
      var postData = 'secret=' + encodeURIComponent(recaptchaSecret) + '&response=' + encodeURIComponent(token);
      var verifyResult = await new Promise(function(resolve, reject) {
        var urlObj = new URL(verifyUrl);
        var opts = {
          hostname: urlObj.hostname,
          path: urlObj.path,
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        };
        var req2 = https.request(opts, function(res2) {
          var data = '';
          res2.on('data', function(chunk) { data += chunk; });
          res2.on('end', function() {
            try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
          });
        });
        req2.on('error', reject);
        req2.write(postData);
        req2.end();
      });
      if (!verifyResult.success) {
        console.warn('reCAPTCHA fallita:', verifyResult['error-codes']);
        return res.status(403).json({ success: false, error: 'Verifica antispam fallita. Riprova.' });
      }
    }

    // --- Componi corpo email ---
    var isIdent = b.modalita === 'ident';
    var rows = [
      '🔒 SEGNALAZIONE WHISTLEBLOWING — ICOSE S.p.A.',
      '',
      'Modalità:      ' + (isIdent ? 'Identificata' : 'Anonima'),
      'Categoria:     ' + (b.categoria || '(non selezionata)'),
      'Data/Periodo:  ' + (b.data || '(non indicata)'),
      'Luogo:         ' + (b.luogo || '(non indicato)'),
      '',
      '--- DESCRIZIONE ---',
      b.descrizione || '(non fornita)',
    ];

    if (isIdent) {
      rows.push('');
      rows.push('--- DATI SEGNALANTE ---');
      rows.push('Nome:     ' + (b.nome || '—'));
      rows.push('Cognome:  ' + (b.cognome || '—'));
      rows.push('Email:    ' + (b.email || '—'));
    }

    if (b.soggetti && b.soggetti.trim()) {
      rows.push('');
      rows.push('Soggetti coinvolti:');
      rows.push(b.soggetti);
    }

    rows.push('');
    rows.push('---');
    rows.push('Codice tracciamento: ' + codice);
    rows.push('Email contatto segnalante: ' + (b.email_tracciamento || 'non fornita'));
    rows.push('');
    rows.push('Generato dal portale Whistleblowing ICOSE.');

    var textBody = rows.join('\n');

    // --- Leggi config SMTP dall'ambiente Firebase ---
    var smtp = {
      host:   process.env.SMTP_HOST || 'smtp.gmail.com',
      port:   parseInt(process.env.SMTP_PORT || '587'),
      secure: (process.env.SMTP_SECURE || 'false') === 'true',
      user:   process.env.SMTP_USER || '',
      pass:   process.env.SMTP_PASS || '',
    };
    var mailTo   = process.env.MAIL_TO   || 'alexnuzzi2@gmail.com';
    var mailFrom = process.env.MAIL_FROM || 'noreply@icose-spa.web.app';

    var transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass },
    });

    await transporter.sendMail({
      from: '"Whistleblowing ICOSE" <' + mailFrom + '>',
      to: mailTo,
      subject: '[Whistleblowing ICOSE] ' + (b.categoria || 'Segnalazione') + ' — ' + codice,
      text: textBody,
    });

    res.status(200).json({ success: true, codice: codice });

  } catch (err) {
    console.error('Errore Cloud Function Whistleblowing:', err);
    res.status(500).json({ success: false, error: 'Errore interno. Riprova più tardi.' });
  }
});