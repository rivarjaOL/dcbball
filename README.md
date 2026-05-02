# DSC Hoops Workhouse Summer Site

Production site for DSC Hoops and the Workhouse Warrior Summer 2026 registration flow.

Live site: https://rivarjaol.github.io/dcbball/

## Overview

This repo now serves the approved React/Vite redesign. The root route `/` and `/summer` both render the Workhouse Warrior Summer 2026 landing page with an in-page registration packet.

The registration packet mirrors the current summer Google Form field set and submits to the Google Form `formResponse` endpoint. The Google Form writes to the linked response Sheet, where the Apps Script notification trigger sends email alerts.

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn-style UI primitives
- lucide-react icons
- GitHub Pages deployment

## Local Development

```bash
npm ci
npm run dev
```

Open `http://localhost:8080/`.

If port `8080` is unavailable:

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

## Checks

```bash
npm run build
npm run test
npm run lint
```

Lint currently reports shadcn fast-refresh warnings in shared UI primitive files. These are warnings, not build errors.

## Deployment

Push to `main` to deploy.

The GitHub Actions workflow:

1. Installs dependencies with `npm ci`
2. Builds with `npm run build`
3. Copies `dist/index.html` to `dist/404.html` and `dist/summer/index.html`
4. Publishes `dist` to GitHub Pages

Production Vite builds use the `/dcbball/` base path.

## Registration Wiring

Main code path:

- Page: `src/pages/Summer.tsx`
- Intake component: `src/components/RegistrationPacket.tsx`
- Payload builder: `buildGooglePayload()`
- Google Form endpoint: `https://docs.google.com/forms/d/e/1FAIpQLScf7b9ChwsWEaoNOaeRpKzCMW6LctFmk-TXeEe1Z5McnMx2iQ/formResponse`
- Public Google Form: `https://docs.google.com/forms/d/1tIES8Y_c-Fp957NolfjGFlnlwN67uKyyzPD_ONJNnj8/viewform`
- Response Sheet: `https://docs.google.com/spreadsheets/d/1-_MBTiupAFNOcXvkDpn_FfNhiqAwZoNqULoPw4QFu5o/`

The frontend does not write directly to Google Sheets. It posts to Google Forms so the same response Sheet and Apps Script trigger are used.

If the Google Form changes, update the `entry.*` mappings in `RegistrationPacket.tsx` and confirm the Apps Script still receives the `"Athlete's Name"` response column.

## Safety

- No secrets or environment variables are required.
- Do not commit real registration exports or response data.
- Confirm with the client before changing the response Sheet, Apps Script, or notification recipients.
