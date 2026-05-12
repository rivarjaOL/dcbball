# DSC Hoops - CLAUDE.md

## What This Project Is

Marketing and registration site for **DSC Hoops** and the **Workhouse Warrior Summer 2026** program.

The live site is now the approved React/Vite redesign. The root route `/` and `/summer` both render the summer registration experience. The old static HTML summer page has been removed from the deployed site.

**Live:** https://rivarjaol.github.io/dcbball/
**Repo:** https://github.com/rivarjaOL/dcbball (note the capital `OL` in the org slug)

The old redesign preview repo, `ClariSortAi/dcball-preview`, was the prototype source. The production source now lives in this repo.

---

## Current Stack

| Layer | Tech |
|---|---|
| App | React 18 + Vite |
| Language | TypeScript |
| Routing | `react-router-dom` with routes for `/` and `/summer` |
| Styles | Tailwind CSS, custom tokens in `src/index.css`, shadcn-style UI primitives |
| Icons | `lucide-react` |
| Build | `npm run build` |
| Deployment | GitHub Pages via `.github/workflows/deploy.yml` |
| Registration | In-page React registration packet posts to Google Forms `formResponse` |
| Notifications | Google Apps Script (`form-submit-notification.gs`) triggered by the linked Google response Sheet |

---

## File Structure

```
/
├── index.html                         # Vite HTML shell
├── src/
│   ├── App.tsx                        # Providers and routes
│   ├── main.tsx                       # React entrypoint
│   ├── index.css                      # Tailwind layers, design tokens, global utilities
│   ├── pages/
│   │   ├── Summer.tsx                 # Live landing page and registration page
│   │   └── NotFound.tsx               # Fallback route
│   ├── components/
│   │   ├── RegistrationPacket.tsx     # In-page Google Form compatible intake flow
│   │   └── ui/                        # shadcn-style primitives
│   └── assets/                        # Hero images and Workhouse logo
├── public/                            # Static public assets
├── .github/workflows/deploy.yml       # Builds Vite app and deploys `dist`
├── form-submit-notification.gs        # Google Apps Script email notification handler
├── APPS_SCRIPT_SETUP_INSTRUCTIONS.md  # Sheet trigger setup and test instructions
├── CHANGELOG.md                       # Plain-language client-facing changelog
├── DSC_HOOPS_Registration_Form.pdf    # Legacy printable registration form
├── package.json
├── package-lock.json
├── tailwind.config.ts
└── vite.config.ts
```

---

## How to Run Locally

Install dependencies:

```bash
npm ci
```

Start the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:8080/
http://localhost:8080/summer
```

The Vite config uses port `8080` by default. If that port is busy, run:

```bash
npm run dev -- --host 127.0.0.1 --port 5173
```

Build production output:

```bash
npm run build
```

Run checks:

```bash
npm run test
npm run lint
```

Current lint status may include shadcn fast-refresh warnings in `src/components/ui/*`; these are warnings, not build blockers.

---

## Deployment

- **Trigger:** push to `main`
- **Workflow:** `.github/workflows/deploy.yml`
- **Pipeline:** checkout, setup Node, `npm ci`, `npm run build`, copy `dist/index.html` to both `dist/404.html` and `dist/summer/index.html`, upload `dist` to GitHub Pages
- **Vite base path:** production builds use `/dcbball/` in `vite.config.ts`
- **SPA routes:** `dist/summer/index.html` serves `/summer` with HTTP 200, and `404.html` remains as a fallback
- **No env vars or secrets are required**

---

## Registration And Intake Wiring

The live site uses an in-page React intake flow in `src/components/RegistrationPacket.tsx`.

Flow:

```text
Website registration packet
  -> Google Forms formResponse endpoint
  -> Google Form response Sheet
  -> Apps Script spreadsheet submit trigger
  -> email notification
```

Important URLs:

- **Summer Google Form public URL:** `https://docs.google.com/forms/d/1tIES8Y_c-Fp957NolfjGFlnlwN67uKyyzPD_ONJNnj8/viewform`
- **Summer Google Form endpoint used by the React intake:** `https://docs.google.com/forms/d/e/1FAIpQLScf7b9ChwsWEaoNOaeRpKzCMW6LctFmk-TXeEe1Z5McnMx2iQ/formResponse`
- **Responses sheet:** `https://docs.google.com/spreadsheets/d/1-_MBTiupAFNOcXvkDpn_FfNhiqAwZoNqULoPw4QFu5o/`
- **Notification emails:** `hoops@dscinternationalgroup.com` (to), `jason.t.rivard@gmail.com` (cc)

The site does **not** write directly to Google Sheets. It submits to the same Google Form that writes to the Sheet. This is what allows the same Apps Script spreadsheet trigger to fire.

The registration packet maps 1-to-1 to the current summer Google Form entry IDs. If the Google Form fields change, update `buildGooglePayload()` in `src/components/RegistrationPacket.tsx` and revalidate the public form metadata before deploying.

### Summer / Summer Flex / Spring mode

The same Google Form (and same response sheet) handles three intake tracks:

1. **Summer** — full 9-week Workhouse Warrior program (Standard $4,000, Weekly $550).
2. **Summer Flex** — 5 / 10 / 15 / 20-workout afternoon packs ($475 / $825 / $1,125 / $1,395). Sessions are scheduled directly with `hoops@dscinternationalgroup.com` against the published afternoon windows (Tue 2 & 3 PM, Wed/Thu 4 & 5 PM).
3. **Spring** — per-session Small Group / Group menu from the pre-facelift site.

Mode is controlled by:

- A 3-way toggle at the top of the registration section in `src/components/RegistrationPacket.tsx`
- A URL param `?session=spring` or `?session=summer-flex` synced from `Summer.tsx` so the choice survives a refresh and is shareable
- A `mode` prop on `<RegistrationPacket>`; each mode swaps in its own package picker (`PACKAGE_OPTIONS`, `FLEX_PACKAGE_OPTIONS`, or `SPRING_PACKAGE_OPTIONS`)

Two backend-only Google Form questions distinguish the rows in the sheet:

| Question | Entry ID | Required | Notes |
|---|---|---|---|
| Session | `entry.162964379` | yes | Always sent. Values: `Spring 2026` or `Summer 2026` (summer-flex sends `Summer 2026`). |
| Spring Package | `entry.1827625793` | no | Sent only in spring mode. One of the 10 options matching `SPRING_PACKAGE_OPTIONS[i].googleValue`. |

The existing **Summer Track** field (`entry.1351164016`) is required by the Google Form, so spring submissions populate it with a fallback string `Spring 2026 - <package text>`, and **summer-flex** submissions populate it with `Summer 2026 Flex - <package text>`. These fallbacks satisfy the required check while keeping the row human-readable and identifiable from the column value alone.

A dedicated **Flex Package** Google Form question has **not** been added yet — when it is, wire an `ENTRY_FLEX_PACKAGE` constant in `RegistrationPacket.tsx` mirroring the spring split (clean column + fallback string) and add the four flex `googleValue` strings to `FORM_ACCEPTED_VALUES`. Until then, the Summer Track prefix is the source of truth for flex rows.

Both backend-only questions live in the existing last section of the form (Acknowledgements & Agreements) — **no new section breaks were added**, so `pageHistory` stays `0,1,2,3,4`. If a section break is ever added or removed, update the `pageHistory` value in `buildGooglePayload()` and re-verify against the responses sheet.

The Apps Script still relies on the exact response column header `"Athlete's Name"` when building the email subject. It also reads `Session` to prefix the subject (`Spring Registration:` vs `Summer Registration:` — summer-flex keeps `Summer Registration:`), `Spring Package` for the body, and scans every column for a `"Summer 2026 Flex - "` prefix so the Flex pack surfaces in the email regardless of the Summer Track column's exact header.

The script in `form-submit-notification.gs` is the source of truth and is deployed via [`clasp`](https://github.com/google/clasp). After editing, run:

```bash
npm run apps-script:push
```

This replaces the cloud copy of the script bound to the responses sheet (script ID is in `.clasp.json`). The form-submit trigger fires on the `onFormSubmit` function name, which is unchanged across deploys. To pull the live cloud copy back into the repo (e.g. to confirm no out-of-band edits happened in the Apps Script editor), run `npm run apps-script:pull` — it overwrites the local `form-submit-notification.gs`, so commit or stash first if you have unpushed changes.

One-time setup for a new contributor: `npm install -g @google/clasp`, then `clasp login` (browser OAuth) and turn on the Apps Script API at https://script.google.com/home/usersettings.

Drafts are saved per mode under separate sessionStorage keys: `workhouse-summer-registration-draft`, `workhouse-summer-flex-registration-draft`, and `workhouse-spring-registration-draft`. Toggling between modes loads that mode's draft cleanly.

---

## Design System

The redesign uses a brutalist basketball training style:

- Bone background, ink typography, orange action color
- Large condensed display type through the `Anton` font
- Monospace utility labels through `Chakra Petch`
- Tailwind custom tokens in `tailwind.config.ts` and `src/index.css`
- Heavy borders, offset shadows, grid-paper texture, and high-contrast registration panels
- Section IDs drive navigation: `#program`, `#schedule`, `#pricing`, `#flex`, `#spring`, `#register`

When editing UI, keep the registration packet and landing sections visually consistent with the current `Summer.tsx` and `RegistrationPacket.tsx` patterns.

---

## Safety Notes

- Public marketing site, no authentication
- No API keys or secrets in the frontend
- Registration data is not stored in this repo
- Draft registration data is saved only in browser `sessionStorage` under `workhouse-summer-registration-draft`, `workhouse-summer-flex-registration-draft`, and `workhouse-spring-registration-draft`
- The Google Form endpoint is public by design
- Do not commit real registration exports or response data
- Confirm with the client before changing email recipients, the response Sheet, or Apps Script behavior
