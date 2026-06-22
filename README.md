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

## Content editing

This site includes a password-protected admin at `/admin/`. Editors can update the salon copy, contact details, gallery images, environment images, hero image, logo, and price list. The editable source file is `src/content/shaneContent.json`, and uploaded media is stored under `public/uploads/shane/`.

The admin calls a Cloudflare Pages Function at `/api/admin/content`. The Function checks a shared admin password, then uses a GitHub token stored in Cloudflare environment variables to commit changes back to this repository. After the commit lands on GitHub, Cloudflare Pages rebuilds and publishes the new static site.

### Admin setup

1. Create a fine-grained GitHub token for this repository. It needs read/write access to **Contents** for `w1075207-gif/shanehairstudioSite`.
2. In Cloudflare Pages, add these environment variables for Production:

   | Variable | Value |
   |----------|-------|
   | `ADMIN_PASSWORD` | Shared password for `/admin/` |
   | `GITHUB_TOKEN` | Fine-grained GitHub token |
   | `GITHUB_BRANCH` | Optional; defaults to `main` |

3. Deploy the site.
4. Visit `/admin/`, enter the shared password, edit content, and click **Save to GitHub**.

No editor needs a GitHub account. The GitHub token never appears in browser code; it only lives in Cloudflare's server-side environment.

## Assets

Admin-managed images live in `public/uploads/shane/` and are referenced by `src/content/shaneContent.json`. New uploads from `/admin/` are committed to that folder and published as static files under `/uploads/shane/`.

The older source images are still kept in `src/assets/shane/` as original project assets, but the live page now reads from the editable content file.
