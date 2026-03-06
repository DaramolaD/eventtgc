This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Why the page might not load sometimes

- **Dev server not running** – Run `npm run dev` (or your package manager) and keep the terminal open.
- **Missing environment variables** – In `.env.local` you need `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`. If any are missing, server actions and data fetching can fail and the app may show errors or blank content.
- **Supabase unreachable** – Check your internet connection and that the Supabase project is active in the dashboard.
- **Build/runtime errors** – Check the terminal and browser console for errors; fix any TypeScript or missing-module issues.

### “Application error: a client-side exception” when clicking links (e.g. on Vercel)

If **full page load** works but **clicking a navigation link** triggers this error:

1. **Environment variables on Vercel** – In the Vercel project dashboard go to **Settings → Environment Variables**. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` for **Production** (and Preview if you use it). For client-side code to work, `NEXT_PUBLIC_*` vars must be available at **build time**: either leave “Expose to Build” enabled or redeploy after adding them so they are in the client bundle.
2. **Redeploy** – After changing env vars, trigger a new deployment (e.g. push a commit or use “Redeploy” in Vercel).
3. **Browser console** – When the error appears, open DevTools → Console and note the actual error message; that will point to the failing line (e.g. missing env, failed import).
4. **Error recovery** – The app includes an error boundary (`app/error.tsx`). When a client error occurs you’ll see “Something went wrong” with **Try again** and **Go home** so you can recover without a full refresh.

### Invoice feature – database setup

For the admin **Generate invoice** flow and **View invoice** on My Bookings to work, add these columns to your Supabase `submissions` table. In Supabase: **Table Editor → submissions → add column**:

| Column name             | Type      | Default / nullable |
|-------------------------|-----------|---------------------|
| `invoice_generated_at`  | `timestamptz` | nullable        |
| `invoice_number`        | `text`        | nullable        |

Or run in the SQL Editor:

```sql
ALTER TABLE submissions
  ADD COLUMN IF NOT EXISTS invoice_generated_at timestamptz,
  ADD COLUMN IF NOT EXISTS invoice_number text;
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
