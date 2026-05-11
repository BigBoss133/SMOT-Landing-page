# SMOT — Landing Page & Backend API

> Sito web per registrazione, pagamento e download di SMOT Smart Archive.
> Repository principale: https://github.com/BigBoss133/SMOT-APP

---

## Struttura della repo

```
SMOT-Landing-page/
├── index.html              ← Landing page marketing (Salvatore)
├── backend/                ← API server (Michele - completato)
│   ├── src/
│   │   ├── index.ts        ← Entry point
│   │   ├── db.ts           ← SQLite schema + init
│   │   ├── types.ts        ← TypeScript types
│   │   ├── middleware/
│   │   │   └── auth.ts     ← JWT middleware
│   │   └── routes/
│   │       ├── auth.ts     ← Registrazione / Login
│   │       ├── license.ts  ← Gestione licenze
│   │       └── payments.ts ← Stripe checkout + webhook
│   ├── package.json
│   └── tsconfig.json
├── .gitignore
└── README.md
```

---

## Setup rapido

### Backend API
```bash
cd backend
cp .env.example .env   # Modificare STRIPE_SECRET_KEY e JWT_SECRET
npm install
npm run dev            # http://localhost:3000
```

---

## Endpoint API

| Metodo | Endpoint | Auth | Cosa fa |
|--------|----------|------|---------|
| POST | /api/auth/register | No | Registrazione |
| POST | /api/auth/login | No | Login, ritorna JWT |
| GET | /api/auth/me | JWT | Profilo utente |
| GET | /api/license/status | JWT | Stato licenza |
| GET | /api/license/validate/:key | No | Valida chiave (per SMOT-APP) |
| POST | /api/payments/create-checkout | JWT | Stripe checkout |
| POST | /api/payments/webhook | Stripe | Webhook pagamenti |
| GET | /api/health | No | Health check |

---

## Task del Team

### Michele - Backend API (COMPLETATO)
- Progetto Node.js + Express + TypeScript
- Auth system (JWT, register, login)
- Stripe integration (checkout + webhook)
- License management (generate, validate)
- Database schema (users, licenses, payments)
- Grace period 24h + hard block
- 7 giorni trial solo al primo pagamento

### Salvatore - Frontend Sito (DA FARE)
- Convertire landing page in React app strutturata
- Form registrazione + login
- Pagina prezzi (Monthly 9.99, Annual 89.99) + badge 7gg gratis
- Checkout pagamento
- Dashboard utente: chiave, stato, storico
- Collegamento backend API (fetch con JWT)

### Tommaso - SMOT-APP Licenza (DA FARE)
- validate_license Tauri command
- Check licenza in setup.rs all'avvio
- LicenseBlockedPage (schermata blocco totale)
- Banner grazia 24h in App.tsx
- LicenseStep con validazione API
- Stato licenza in SettingsPage

---

## Regole

- **7gg gratis**: Solo al PRIMO pagamento
- **Grace period**: 24 ore dopo scadenza
- **Blocco**: Dopo 24 ore, solo input nuova chiave
- **Nessun bypass**: App inutilizzabile senza licenza

---

## Variabili d'ambiente
```
PORT=3000
JWT_SECRET=cambiami
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173
```
