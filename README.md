# Macramumu

> Handcrafted with love in London — Nordic-style macramé homeware and accessories.

A full-stack e-commerce web app for [Macramumu](https://www.instagram.com/macramumu/), a small handmade macramé business. Built with React, TypeScript, Supabase, and Stripe.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Framer Motion |
| State | Zustand, TanStack Query |
| Auth & DB | Supabase |
| Payments | Stripe |
| Forms | React Hook Form + Zod |
| Testing | Vitest, Testing Library, MSW |

---

## Features

- 🛍️ Product catalogue with categories and filtering
- 🛒 Shopping cart with persistent state
- 💳 Checkout with Stripe payments
- 🔐 Auth (sign up, login, protected routes)
- 🧑‍💼 Admin dashboard for managing products
- 🤖 Chatbot with FAQ support
- 📦 Delivery rate calculation (free over £50)
- 📱 Fully responsive

---

## Project Structure

```
macramumu/
├── apps/
│   └── web/          # React frontend (Vite)
│       ├── src/
│       │   ├── components/   # UI, layout, auth, product, chatbot
│       │   ├── pages/        # Route-level page components
│       │   ├── store/        # Zustand stores (auth, cart)
│       │   ├── services/     # Supabase API calls
│       │   ├── contexts/     # React contexts
│       │   ├── lib/          # Constants, Supabase client, helpers
│       │   ├── router/       # React Router config
│       │   └── types/        # TypeScript types
│       └── ...
└── apps/
    └── database/     # DB schema and migrations
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account

### 1. Clone and install

```bash
git clone https://github.com/your-username/macramumu.git
cd macramumu
npm install
```

### 2. Set up environment variables

```bash
cp apps/web/.env.example apps/web/.env.local
```

Fill in your values in `apps/web/.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
VITE_ADMIN_EMAIL=your@email.com
VITE_APP_URL=http://localhost:3000
```

### 3. Run the dev server

```bash
npm run dev
```

App runs at `http://localhost:5173`.

---

## Available Scripts

All scripts run from the repo root and target the `apps/web` workspace.

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Lint TypeScript and TSX files |

---

## Database

The database schema lives in `apps/database/schema.sql`. Run it against your Supabase project via the SQL editor in the Supabase dashboard.

---

## Deployment

Build the app with:

```bash
npm run build
```

The output is in `apps/web/dist` — deploy to any static host (Vercel, Netlify, Cloudflare Pages, etc.).

Make sure to set the environment variables in your hosting provider's dashboard.

---

## Social

- Instagram: [@macramumu](https://www.instagram.com/macramumu/)
- Pinterest: [macramumu](https://uk.pinterest.com/macramumu/)
- Facebook: [Macramumu](https://www.facebook.com/macramumu/)
- Email: hello@macramumu.co.uk
