# Aerovista

A travel-planning prototype for West African departures, sample stays and itinerary planning.

## Run locally

```sh
npm install
npm run dev
```

The trip planner and dashboard assistants work in guided local mode without a provider key. To enable Gemini responses, create `.env.local` (never commit it) and add:

```env
GEMINI_API_KEY=your-server-side-key
GEMINI_MODEL=gemini-2.5-flash
```

The key is read by the Vite server middleware and is never sent to browser code. Prompts are sent to Gemini when it is configured. The assistant is not connected to airline, hotel, payment, credit or airport systems.

## Administrator access

The admin area is locked unless the server has an `ADMIN_ACCESS_CODE`. Set a long, unique value in `.env.local`:

```env
ADMIN_ACCESS_CODE=use-a-long-random-secret-here
```

Admin sign-in uses an HttpOnly, SameSite=Strict session cookie, a short expiry and rate-limited attempts. The dashboard and all its records are still sample data. Do not use this shared-code prototype as a substitute for production identity and authorization (such as an audited identity provider, per-user roles, persistent session storage, CSRF protections, monitoring and a real data-access layer). For a production deployment, configure secrets only in the host's secret manager and serve the built app with:

```sh
npm run build
npm start
```

`npm run preview` also enables the local API middleware for testing a production build.

## Checks

```sh
npm run build
npm run lint
```
