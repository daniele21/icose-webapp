# ICOSE Web App (`icose-webapp`)

Repository per la gestione, lo sviluppo e il deployment del sito web **ICOSE SPA** ospitato su **Firebase Hosting** (Project ID: `icose-spa`).

---

## 📁 Struttura del Progetto

Il progetto è strutturato nel seguente modo:

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD Workflow per il deployment automatico
├── public/                    # Codice sorgente del sito web statico (HTML, CSS, JS, immagini)
│   ├── assets/                # Asset statici (immagini, CSS, JS)
│   ├── index.html             # Homepage
│   ├── attivita.html          # Pagina Attività
│   ├── certificazioni.html    # Pagina Certificazioni
│   ├── contatti.html          # Pagina Contatti
│   ├── gruppo.html            # Pagina Gruppo
│   ├── lavora-con-noi.html    # Pagina Lavora con noi
│   ├── parco-macchine.html    # Pagina Parco Macchine
│   ├── prodotti.html          # Pagina Prodotti
│   └── whistleblowing.html    # Pagina Whistleblowing
├── .firebaserc                # Configurazione progetto Firebase (icose-spa)
├── firebase.json              # Configurazione Hosting Firebase
├── package.json               # Dipendenze e script npm
└── README.md                  # Documentazione del repository
```

---

## 🚀 Come Utilizzare il Repository in Locale

### 1. Prerequisiti
Assicurati di aver installato su Mac/PC:
- [Node.js](https://nodejs.org/) (versione 18 o superiore)
- `git`

### 2. Clona il Repository
```bash
git clone https://github.com/daniele21/icose-webapp.git
cd icose-webapp
```

### 3. Avviare il Server Locale per lo Sviluppo
Per testare e visualizzare le pagine web in locale durante lo sviluppo, esegui:

```bash
npm start
```
Il comando avvierà un server HTTP locale su `http://localhost:3000` (o porta simile indicata nel terminale) per navigare il sito in tempo reale.

In alternativa, se hai la Firebase CLI installata:
```bash
npx firebase serve
```

---

## 💾 Come Salvare le Modifiche (Git Workflow)

Per garantire che il tuo lavoro sia sempre salvato in remoto su GitHub e non vada perso:

### Step 1: Controlla lo stato delle modifiche
```bash
git status
```
Mostrerà i file che hai modificato, creato o eliminato.

### Step 2: Aggiungi i file da salvare
```bash
git add .
```
*(Aggiunge tutte le modifiche correnti alla staging area)*.

### Step 3: Crea un Commit con un messaggio descrittivo
```bash
git commit -m "Descrizione chiara delle modifiche apportate"
```

### Step 4: Invia le modifiche a GitHub (Push)
```bash
git push origin <nome-branch>
```
*Esempio per il branch di sviluppo:*
```bash
git push origin dev
```
*Esempio per il branch di produzione:*
```bash
git push origin main
```

---

## 🔀 Differenze tra i Branch e Strategia di Branching

Il repository segue una strategia di release organizzata su due branch principali per separare l'ambiente di test da quello di produzione:

| Branch | Scopo | Channel Firebase | Deploy Automatico |
| :--- | :--- | :--- | :--- |
| **`main`** | **Produzione**: Contiene solo codice stabile e pronto per il pubblico. | `live` (Produzione) | Sulla spinta/push su `main` |
| **`dev`** | **Sviluppo / Preview**: Utilizzato per integrare e testare nuove funzionalità. | `dev` (Canale Anteprima) | Sulla spinta/push su `dev` |
| **`feature/*`** | **Funzionalità temporanee**: Creati a partire da `dev` per sviluppare singole feature. | - | Nessuno (da unire su `dev`) |

### Workflow Consigliato per Nuove Funzionalità:
1. Crea un branch temporaneo da `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/nome-funzionalita
   ```
2. Apporta le modifiche e fai il commit.
3. Fai il push su GitHub e apri una Pull Request verso `dev`:
   ```bash
   git push origin feature/nome-funzionalita
   ```
4. Dopo la verifica su `dev` (canale di anteprima Firebase), unisci `dev` su `main` per la pubblicazione finale.

---

## 🌐 Come Deployare (Pubblicare il Sito)

### 1. Deployment Automatico (Raccomandato via GitHub Actions)
Il progetto è configurato con un workflow CI/CD in `.github/workflows/deploy.yml`.

- **Deploy in Anteprima (Dev)**:
  Quando effettui un `git push origin dev`, GitHub Actions rilascerà automaticamente le modifiche sul canale di preview **Dev** di Firebase Hosting.

- **Deploy in Produzione (Live)**:
  Quando effettui un `git push origin main` (o accetti un merge su `main`), GitHub Actions rilascerà automaticamente il sito aggiornato in **Produzione** sul canale live (`icose-spa.web.app`).

> ℹ️ **Nota di Sicurezza**: Il deployment automatico utilizza la chiave di servizio configurata nei Secret di GitHub con il nome `FIREBASE_SERVICE_ACCOUNT_ICOSE_SPA`.

---

### 2. Deployment Manuale (da linea di comando)
In caso sia necessario deployare direttamente da locale senza passare da GitHub Actions:

1. Autenticati con Firebase (se non l'hai già fatto):
   ```bash
   npx firebase login
   ```
2. **Deploy in Produzione**:
   ```bash
   npm run deploy
   ```
   *oppure*
   ```bash
   npx firebase deploy --only hosting
   ```
3. **Deploy sul Canale di Preview Dev**:
   ```bash
   npx firebase hosting:channel:deploy dev
   ```

---

## 📝 Note e Manutenzione
- Assicurati di non inserire chiavi private o token nel repository. I file sensibili sono protetti da `.gitignore`.
- In caso di modifiche alla struttura delle pagine HTML o aggiunta di nuovi asset, verifica il corretto caricamento in locale (`npm start`) prima di effettuare il push.
