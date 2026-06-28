# EPACC Impact Hub — Demo

A connected demo for EPACC Impact Hub, a fundraising command center for schools, athletic departments, and booster clubs. Built with Vite + React.

## What's inside

Three connected views, navigable from the top bar:

- **Platform** — the marketing/pitch site (services, shared-risk model, pricing tiers)
- **Donor page** — the give-now experience (preset amounts, monthly giving, donor wall, confirmation)
- **School dashboard** — the campaign admin view (progress ring, fundraising by source, KPIs, tasks)

A gift made on the donor page flows into the dashboard numbers, so you can demo the whole loop in one click.

## Demo limitations

- No payments are processed — the donation flow is a visual confirm only.
- The donor/dashboard sync resets on page reload (no backend yet).

When ready to make it real, the donation flow is structured so Stripe drops in at the `give()` function, and data lives in plain objects ready to wire to a backend (Supabase, Notion, etc.).

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy (Vercel)

Vercel auto-detects Vite. `vercel.json` sets the build command, output directory, and SPA rewrites. Either connect this repo in the Vercel dashboard, or run `npx vercel deploy --prod`.
