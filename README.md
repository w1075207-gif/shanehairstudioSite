# Shane's Hair Studio — standalone site

React + Vite single-page site derived from the Yiyu portal page. Static assets live under `public/shane/`.

## Local development

```bash
npm install
npm run dev
```

Production bundle:

```bash
npm run build
npm run preview
```

## Cloudflare Pages

| Setting | Value |
|--------|--------|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `/` (repository root) |
| **Deploy command** | **Leave empty** for normal static Pages (recommended). |

For a **static Vite site**, Cloudflare Pages publishes `dist` automatically after the build step. You do **not** need a custom deploy command.

### If you set a deploy command (e.g. `npx wrangler versions upload`)

Wrangler **4.x** requires **Node.js ≥ 22**. Set this in **Pages → Settings → Environment variables** (Production + Preview):

| Variable | Value |
|----------|--------|
| `NODE_VERSION` | `22` |

Without Node 22, deploy fails with: `Wrangler requires at least Node.js v22.0.0`.

### CLI deploy (alternative)

From your machine after `npm run build`:

```bash
npx wrangler pages deploy dist --project-name=<your-project>
```

Use a local Node 22+ when Wrangler 4 is involved.

This app is a single HTML shell at `/` with no client-side router; no SPA rewrite rules are required unless you add routes later.

## Assets

`public/shane/site/*.png` and `public/shane/price-list.png` must match the filenames referenced in `src/ShaneHairstudio.jsx`. If this repo ships minimal placeholder images, replace them with your full-resolution salon photos before production.
