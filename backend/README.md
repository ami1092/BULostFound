# BULostFound Backend

Express + TypeScript API for matching lost and found items at Binghamton University.

## Tech stack

- Node.js, Express 5, PostgreSQL
- TypeScript (run in dev with ts-node + nodemon)

## Prerequisites

- Node.js 20+ and npm

## Setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in values
```

## Supabase CLI

- Use the Session pooler string from the Supabase dashboard (Connect). The direct host often fails with ENOTFOUND.
- Get the password from the project owner privately. Never commit .env.

Check it works
npx tsc && node dist/pingDB.js
A timestamp means you're connected. Then start the server with npm run dev once src/server.ts
exists.

Only if you're changing the schema
npx supabase login
npx supabase link --project-ref <PRO
npx supabase migration new <name> # write the SQL, then:
npx supabase db push
Commit the new migration file, and don't edit one that has already been pushed.
