# SMOT — Landing Page & Backend API

> Sito web per registrazione, pagamento e download di SMOT Smart Archive.
> Repository principale: https://github.com/BigBoss133/SMOT-APP

---

## Struttura della repo

```
SMOT-Landing-page/
├── src/
│   ├── main.tsx               ← Entry point React
│   ├── App.tsx                ← Router + AuthProvider
│   ├── index.css              ← Stili globali (palette SMOT, responsive)
│   ├── components/
│   │   └── Navbar.tsx         ← Barra navigazione + hamburger mobile
│   ├── pages/
│   │   ├── LandingPage.tsx    ← Landing page marketing
│   │   ├── PricingPage.tsx    ← Piani (Monthly 9.99, Annual 89.99)
│   │   ├── RegisterPage.tsx   ← Form registrazione
│   │   ├── LoginPage.tsx      ← Form login
│   │   ├── DashboardPage.tsx  ← Dashboard utente (licenza, storico)
│   │   └── CheckoutPage.tsx   ← Redirect Stripe
│   ├── context/
│   │   └── AuthContext.tsx    ← httpOnly cookie auth, route protection
│   ├── services/
│   │   └── api.ts             ← REST client (VITE_API_URL, credentials: include)
│   ├── __tests__/             ← Vitest unit tests
│   └── test/                  ← Vitest + React Testing Library tests
├── e2e/                       ← Playwright E2E + accessibility tests
├── backend/                   ← API server (Express + SQLite + JWT + Stripe)
├── public/
│   ├── favicon.svg             ← SMOT brand icon
│   ├── robots.txt              ← SEO
│   └── sitemap.xml             ← SEO
├── .env.example                ← Variabili d'ambiente richieste
├── eslint.config.js            ← ESLint flat config
├── .prettierrc / .prettierignore
├── vitest.config.ts
├── playwright.config.ts
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## Setup rapido

### Backend API
```bash
cd backend
cp .env.example .env          # JWT_SECRET, FRONTEND_URL, STRIPE_SECRET_KEY
npm install
npm run dev                    # http://localhost:3000
```

### Frontend
```bash
npm install
npm run dev                    # http://localhost:5173
```

### Build
```bash
npm run build                  # Output in dist/
```

### Test
```bash
npx vitest run                 # Unit tests (17 test)
npx playwright test            # E2E tests (6 test)
npm run lint                   # ESLint + Prettier
npx tsc --noEmit               # TypeScript check
```

---

## 👥 Team

| Sviluppatore | GitHub | Ruolo | Task |
|---|---|---|---|
| **Michele** | BigBoss133 | Backend API + Sicurezza | ✅ Completati |
| **Salvatore** | salvograsso10 | Frontend React + UI/UX | ✅ Completati |
| **Tommaso** | osurac5 | DevOps + Sicurezza + CI | ✅ Completati |

---

## ✅ Build Status

| Comando | Risultato |
|---------|:--------:|
| `npx tsc --noEmit` | ✅ 0 errori |
| `npm run lint` | ✅ 0 errori |
| `npx vitest run` | ✅ 17/17 test passano |
| `npx playwright test` | ✅ 6/6 E2E test passano |

---

## Task completati

### 🔴 Michele — Backend API + Sicurezza
- Auth system (JWT httpOnly cookie, register, login, logout)
- Stripe integration (checkout + webhook + lazy key validation)
- License management (generate, validate, grace period, trial)
- DB schema + grace period + trial
- `requireEnv()` per JWT_SECRET obbligatorio a startup
- `validateEnv()` per FRONTEND_URL, JWT_SECRET, STRIPE_SECRET_KEY
- CORS ristretto a FRONTEND_URL con `credentials: true`
- `getStripe()` con validazione runtime della chiave

### 🔵 Salvatore — Frontend + UI/UX
- Landing page convertita in React + TypeScript
- Form registrazione + login con validazione
- Auth context con httpOnly cookie (no localStorage)
- Pagina prezzi con Stripe Checkout
- Dashboard utente: chiave, stato, storico pagamenti
- Tema coerente (navy/indaco/viola/oliva)
- Responsive con hamburger menu
- API service layer con `VITE_API_URL` env var
- ESLint + Prettier config
- Vitest unit tests (17 test)
- Playwright E2E tests (6 test)
- Test accessibilità axe-core
- SEO (react-helmet-async, sitemap.xml, robots.txt)

### 🟢 Tommaso — DevOps + Sicurezza
- CORS wildcard → FRONTEND_URL only + credentials
- Env validation a startup (JWT_SECRET, FRONTEND_URL, STRIPE_SECRET_KEY)
- Stripe key lazy validation con `getStripe()`

---

## Sicurezza

| Check | Stato |
|-------|:-----:|
| JWT_SECRET obbligatorio a startup | ✅ `requireEnv()` |
| CORS ristretto | ✅ `FRONTEND_URL` only |
| httpOnly cookie auth | ✅ No localStorage |
| Stripe key validation | ✅ `getStripe()` runtime |
| Env validation a startup | ✅ `validateEnv()` |
| API URL da env var | ✅ `VITE_API_URL` |

---

*SMOT — Il tuo archivio intelligente, sul tuo computer, solo per te.*