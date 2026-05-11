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

Recommended environment variable:

| Variable | Example |
|----------|---------|
| `NODE_VERSION` | `20` or `22` |

Connect the Git repository in the Cloudflare dashboard, or deploy built artifacts with Wrangler:

```bash
npx wrangler pages deploy dist --project-name=<your-project>
```

This app is a single HTML shell at `/` with no client-side router; no SPA rewrite rules are required unless you add routes later.

## Assets

`public/shane/site/*.png` and `public/shane/price-list.png` must match the filenames referenced in `src/ShaneHairstudio.jsx`. If this repo ships minimal placeholder images, replace them with your full-resolution salon photos before production.
