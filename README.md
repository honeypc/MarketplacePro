# MarketplacePro

MarketplacePro is a full-stack marketplace platform that blends classic e-commerce, property bookings, and travel experiences into a single application. The React front end provides buyer, seller, and traveler journeys while an Express + Prisma backend powers catalog, analytics, recommendations, chat, and booking APIs. 【F:client/src/pages/Landing.tsx†L1-L101】【F:server/routes.ts†L225-L316】【F:client/src/pages/TravelBooking.tsx†L1-L120】

## Table of contents
- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Environment variables](#environment-variables)
- [Seeding demo data](#seeding-demo-data)
- [Additional resources](#additional-resources)

## Features
- **Buyer experience** – Product search, guided filters, carts, wishlists, checkout, and localized UI copy for multiple languages. 【F:client/src/pages/Products.tsx†L1-L82】【F:client/src/lib/i18n.ts†L1-L120】
- **Seller operations** – Product CRUD with image uploads, inventory controls, and a multi-tab analytics suite driven by dedicated API routes. 【F:server/routes.ts†L237-L344】【F:client/src/pages/SellerAnalytics.tsx†L1-L120】
- **Admin oversight** – Role-gated admin panel that manages users, products, orders, reviews, properties, itineraries, and exports. 【F:client/src/pages/AdminPanel.tsx†L1-L120】
- **Travel & hospitality** – Property discovery with advanced filters, travel booking flows, and destination spotlights. 【F:client/src/pages/Properties.tsx†L1-L120】【F:client/src/pages/TravelBooking.tsx†L1-L120】
- **Personalization** – Comprehensive recommendation dashboard that combines preference management, collaborative and hybrid ML hooks, and engagement tracking. 【F:client/src/pages/RecommendationsDashboard.tsx†L1-L120】
- **Real-time support** – WebSocket-powered chat rooms with read receipts and active connection management. 【F:server/routes.ts†L232-L334】

## Tech stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, Wouter. 【F:client/src/main.tsx†L1-L16】【F:package.json†L9-L88】
- **Backend**: Express, Prisma, PostgreSQL, session-based auth, WebSockets via `ws`. 【F:server/index.ts†L1-L64】【F:server/routes.ts†L1-L334】
- **Tooling**: TypeScript, ESLint, Vite, esbuild, tsx. 【F:package.json†L9-L132】

## Project structure
```
client/         React application (pages, components, hooks, stores)
server/         Express server (routes, auth, uploads, recommendation services)
shared/         Shared type exports from Prisma
prisma/         Prisma schema and database configuration
```

## Getting started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure environment variables** (see [Environment variables](#environment-variables)).
3. **Generate the Prisma client and apply schema**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
4. **Run the development server**
   ```bash
   npm run dev
   ```
   The Express server (with Vite in middleware mode) listens on port `5000` for both API and client traffic. 【F:server/index.ts†L37-L64】

## Available scripts
- `npm run dev` – Start Express in development with hot reloading. 【F:package.json†L9-L17】
- `npm run build` – Build the client and bundle the server for production. 【F:package.json†L9-L20】
- `npm run start` – Serve the production build from `dist/`. 【F:package.json†L9-L21】
- `npm run check` – Run the TypeScript compiler for type checking. 【F:package.json†L9-L22】
- `npm run db:push` – Sync the Prisma schema (alias of `drizzle-kit push`).

## Environment variables
| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma and the session store. 【F:server/routes.ts†L66-L86】【F:prisma/schema.prisma†L6-L15】
| `SESSION_SECRET` | Secret for signing Express sessions. 【F:server/routes.ts†L78-L94】
| `NODE_ENV` | Controls dev vs production behavior for Prisma and Vite middleware. 【F:server/index.ts†L1-L64】【F:server/prisma.ts†L1-L11】

## Seeding demo data
A convenience seed inserts example users, categories, products, and reviews for demos, plus the governed admin form templates used by the form management dashboard. Run it after pushing the schema:
```bash
npx tsx server/simple-seed.ts
```
The script clears dependent tables in order before recreating sample content. 【F:server/simple-seed.ts†L1-L240】

## Additional resources
- [Feature overview](docs/FEATURES.md)
- [Prisma schema](prisma/schema.prisma)
