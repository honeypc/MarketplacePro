# Local Development Setup

This guide explains how to run the MarketplacePro application on your local machine for development.

## Prerequisites
- **Node.js** 20+ and **npm**.
- **PostgreSQL** instance you can connect to (local or remote).
- Optional: ability to create environment files in the repository root.

## 1) Configure environment variables
Create a `.env` file in the project root with at least the following values:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
SESSION_SECRET=your-secure-session-secret
```

Additional variables (optional):
- `RECOMMENDATION_API_KEY` – required only if you intend to call the external recommendation API.
- `ISSUER_URL`, `REPL_ID`, `REPLIT_DOMAINS` – only needed when enabling the Replit OIDC flow (`server/replitAuth.ts`).

## 2) Install dependencies
From the project root run:

```bash
npm install
```

## 3) Prepare the database
Generate the Prisma client and apply the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

Ensure the user defined in `DATABASE_URL` has permission to create tables.

## 4) Run the development server
Start the full stack (API + Vite dev server) in development mode:

```bash
npm run dev
```

The application serves both the API and client on **http://localhost:5000**.

## 5) Common tasks
- **Type checking:** `npm run check`
- **Build for production:** `npm run build`
- **Start production build:** `npm run start` (after `npm run build`)

## Notes
- Uploaded files are served from `public/uploads`.
- The session middleware defaults to non-secure cookies for local development; use HTTPS and secure cookies in production.
