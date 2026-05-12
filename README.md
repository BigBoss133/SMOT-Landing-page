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
│   │   └── AuthContext.tsx    ← JWT, localStorage, route protection
│   └── services/
│       └── api.ts             ← REST client per backend API
├── backend/                   ← API server (Michele - completato)
├── public/favicon.svg         ← SMOT brand icon
├── index.html
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
cp .env.example .env
npm install
npm run dev            # http://localhost:3000
```

### Frontend
```bash
npm install
npm run dev            # http://localhost:5173
```

### Build
```bash
npm run build          # Output in dist/
```

---

## Task completati

### Michele - Backend API (COMPLETATO)
- Auth system (JWT, register, login)
- Stripe integration (checkout + webhook)
- License management (generate, validate)
- DB schema + grace period + trial

### Salvatore - Frontend Sito (COMPLETATO)
- Landing page convertita in React + TypeScript
- Form registrazione + login con validazione
- Auth context con JWT e localStorage
- Pagina prezzi con Stripe Checkout
- Dashboard utente: chiave, stato, storico pagamenti
- Tema coerente (navy/indaco/viola/oliva)
- Responsive con hamburger menu
- API service layer
