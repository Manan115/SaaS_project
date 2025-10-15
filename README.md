# SaaS_project

This repository contains a Next.js + TypeScript SaaS starter focused around "Companions" — short, voice-driven learning sessions driven by a real-time assistant (VAPI), user auth (Clerk), and a Supabase backend.

This README summarizes how to get the project running locally, the important environment variables (from `.env.local`), and a few troubleshooting tips for issues you may encounter during local development (common problems we've seen: malformed VAPI token, duplicate audio SDK/Krisp warnings, and stale dev artifacts after renaming routes).

## Quick start (Windows / PowerShell)

1. Install dependencies

```powershell
npm install
```

2. Add environment variables

Create a `.env.local` at the project root (example values are shown below). Keep secrets out of git.

Example `.env.local` (values in your repo):

```bash
# Clerk Environment Variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk Custom auth
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase Environment Variables
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>

# VAPI Environment Variables (public token used by client)
NEXT_PUBLIC_VAPI_WEB_TOKEN=<your-vapi-web-token>
```

Important: ensure tokens do not include stray quotes or newlines. For example, the VAPI token line must look like:

```
NEXT_PUBLIC_VAPI_WEB_TOKEN=xxxx-xxxx-xxxx-xxxx-xxxx
```

3. Run the dev server

```powershell
npm run dev
```

Open http://localhost:3000 in your browser.

## Project structure (high level)

- `app/` – Next.js App Router pages and layout
- `components/` – React components (Companion UI, Navbar, forms, etc.)
- `lib/` – helper utilities, SDK wrappers (`vapi.sdk.ts`), and server actions
- `public/` – static images and icons
- `types/` – global TypeScript types

## Key Integrations

- Clerk — authentication (client + server)
- Supabase — database for companions and session history
- VAPI (@vapi-ai/web) — real-time assistant and voice streaming
- react-hook-form + zod — forms and validation

## Troubleshooting & common fixes

- VAPI 401 Unauthorized / assistant not responding
	- Symptom: network requests to `api.vapi.ai` return 401 or the assistant only reads the initial prompt and stops.
	- Fix: check `NEXT_PUBLIC_VAPI_WEB_TOKEN` in `.env.local`. Remove any leading/trailing quotes and ensure there's no accidental newline. Restart the dev server after editing `.env.local`.

- "KrispSDK duplicated" warning or duplicated audio behavior
	- Symptom: console shows "The KrispSDK is duplicated. Please ensure that the SDK is only imported once." or audio behavior is unstable after HMR.
	- Fix: ensure the VAPI client is created as a client-side singleton. The project contains `lib/vapi.sdk.ts` which should attach the instance to `window.__VAPI_INSTANCE__` in the browser so HMR doesn't re-initialize the audio SDK. If you still see the warning, search for any remaining `new Vapi(...)` usages and replace them with the exported singleton.

- React duplicate key warnings
	- Symptom: "Encountered two children with the same key ..." when rendering lists such as recent sessions.
	- Fix: lists that can include the same referenced companion multiple times (e.g., session history) should use composite keys like `${id}-${index}` to guarantee uniqueness. The `CompanionsList` component has been adjusted for this.

- Stale routes / page rename issues
	- Symptom: renamed routes (for example `subsciption` → `subscription`) still appear as the old route or cause 404s.
	- Fix: stop the dev server and restart it. If issues persist, delete the `.next` folder and restart.

## Developer notes & next steps

- The voice assistant flow requires the client to request `serverMessages` (for example `['model-output']`) and the assistant server to emit those events. If the client requests server outputs but your app still only receives transcripts, capture the raw `vapi` message events (the client logs them to the console) and paste them into an issue so we can adapt the `extractModelOutput` logic.
- If you are using environment variables with secrets in CI or production, move secret tokens into private environment settings in your deployment provider — do not commit `.env.local` to the repo.

## Useful commands

Start development server:

```powershell
npm run dev
```

Build for production:

```powershell
npm run build
npm run start
```

Run TypeScript checks:

```powershell
npm run type-check
```

## Where I changed things while debugging

During the recent debugging session (voice assistant + VAPI), the following practical changes were made to help stability and diagnostics:

- `components/Navitems.tsx` — added `"use client"` to allow `usePathname()`
- `components/CompanionForm.tsx` — fixed zod/react-hook-form resolver typing
- `next.config.ts` — allowed Clerk avatar host for Next/Image
- `components/CompanionComponent.tsx` — added logging for `vapi` events, requested `model-output` server messages, and more defensive handling for message extraction
- `lib/vapi.sdk.ts` — converted VAPI client to a browser singleton to avoid duplicate SDK & Krisp warnings during HMR
- `lib/actions/companion.actions.ts` — defensive handling for missing `bookmarks` table
- `components/CompanionsList.tsx` — changed table row keys to a composite key to avoid duplicate React key warnings



