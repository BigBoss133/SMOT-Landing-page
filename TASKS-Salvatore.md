# SMOT Landing — Task Salvatore (Frontend React)

> **Repo:** [BigBoss133/SMOT-Landing-page](https://github.com/BigBoss133/SMOT-Landing-page)
> **Backend API:** gia completo (Michele)
>
> **OpenCode Ready** — Ogni task e delegabile con `/start-work <nome-task>`

---

## Setup iniziale

```bash
git clone https://github.com/BigBoss133/SMOT-Landing-page.git
cd SMOT-Landing-page
npm create vite@latest . -- --template react-ts
npm install react-router-dom lucide-react
```

---

## Task 1 — Convertire landing page in React app

- [ ] **WEB-1**: Struttura progetto
  - Creare: `src/pages/`, `src/components/`, `src/context/`, `src/services/`
  - Configurare routing con react-router-dom
  - Router: `/` (landing), `/pricing`, `/register`, `/login`, `/dashboard`, `/checkout`
  - Spostare contenuto landing page da `index.html` a `src/pages/LandingPage.tsx`
  - Mantenere stesso design (gradienti Navy #0a1a3b, Indaco #4338f5, Viola #894df8)

## Task 2 — Registrazione + Login

- [ ] **WEB-2**: Form registrazione
  - File: `src/pages/RegisterPage.tsx`
  - Campi: email, password (min 6 char), conferma password
  - Validazione lato client con feedback immediato
  - POST a `/api/auth/register`
  - Salvare JWT in localStorage
  - Redirect a `/dashboard` dopo successo

- [ ] **WEB-3**: Form login
  - File: `src/pages/LoginPage.tsx`
  - Campi: email, password
  - POST a `/api/auth/login`
  - Salvare JWT in localStorage
  - Redirect a `/dashboard` se gia loggato
  - Link "Non hai un account? Registrati"

- [ ] **WEB-4**: Auth context
  - File: `src/context/AuthContext.tsx`
  - Provider con: user, token, login(), logout(), isAuthenticated
  - Caricare JWT da localStorage all'avvio
  - Wrappare l'app con <AuthProvider>
  - Proteggere route /dashboard con controllo auth

## Task 3 — Pagina prezzi + Checkout

- [ ] **WEB-5**: Pagina prezzi
  - File: `src/pages/PricingPage.tsx`
  - 2 piani: Monthly 9.99, Annual 89.99
  - Badge "7 giorni gratis" sul primo acquisto
  - Feature: accesso completo, IA locale, aggiornamenti, supporto
  - Bottone "Prova Gratis" / "Acquista Ora"
  - Se utente loggato: POST a /api/payments/create-checkout
  - Se non loggato: redirect a /register

- [ ] **WEB-6**: Checkout flow
  - Al click su "Acquista": chiamare API con JWT
  - Ricevere URL Stripe Checkout: `res.json({ url })`
  - Redirect utente a Stripe: `window.location.href = url`
  - Dopo pagamento: Stripe redirect a /dashboard?session_id=xxx

## Task 4 — Dashboard utente

- [ ] **WEB-7**: Dashboard
  - File: `src/pages/DashboardPage.tsx`
  - Mostrare:
    - Chiave licenza (formato SMOT-XXXX-XXXX-XXXX-XXXX, copiabile)
    - Stato licenza: Attiva / In scadenza / Trial / Scaduta
    - Data scadenza
    - Giorni rimanenti
    - Storico pagamenti
  - Bottone "Scarica SMOT" (link a GitHub Releases)
  - Se licenza scaduta: mostra "Rinnova ora" → /pricing

- [ ] **WEB-8**: API service
  - File: `src/services/api.ts`
  - Funzioni:
    - register(email, password)
    - login(email, password)
    - getLicenseStatus(token)
    - createCheckout(token, plan)
  - Tutte con fetch, gestione errori

## Task 5 — Design & Polish

- [ ] **WEB-9**: Tema coerente
  - Usare palette SMOT: Navy #0a1a3b, Indaco #4338f5, Viola #894df8, Oliva #bcc41c
  - Stessa font system-ui della landing page
  - Dark mode nativa

- [ ] **WEB-10**: Responsive
  - Landing, pricing, dashboard adattivi a mobile
  - Hamburger menu per navigazione mobile

---

## Test

```bash
npm run dev            # Avvia frontend (default :5173)
# Il backend API e su :3000
```

---

*OpenCode: /start-work sul singolo task*
