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

Image files live in `src/assets/shane/` and are imported in `src/shaneAssets.js`. Vite bundles them (small files may be inlined; large photos are emitted as files under `dist/assets/` with hashed names). This avoids broken `/shane/...` paths on Cloudflare Workers or other deploy targets.

Replace the placeholder PNGs in `src/assets/shane/site/` and `src/assets/shane/price-list.png` with your full-resolution salon photos; keep the same filenames or update the imports in `shaneAssets.js`.
