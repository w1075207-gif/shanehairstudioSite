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

## Cloudflare Workers

| Setting | Value |
|--------|--------|
| Build command | `npm run build` |
| Worker name | `shanehairstudiosite` |
| Static assets directory | `dist` |
| Root directory | `/` (repository root) |

This project is deployed as a Cloudflare Worker with Static Assets. The Worker serves the built Vite files from `dist` and handles the admin API at `/api/admin/content`.

Deploy from your machine:

```bash
npm run build
npx wrangler deploy --keep-vars
```

Wrangler 4.x requires Node.js 22 or newer.

Pushes to `main` also deploy automatically through GitHub Actions. Add `CLOUDFLARE_API_TOKEN` as a repository secret so the workflow can publish the Worker.

## Content editing

This site includes a password-protected admin at `/admin/`. Editors can update the salon copy, contact details, gallery images, environment images, hero image, logo, and price list. The editable source file is `src/content/shaneContent.json`, and uploaded media is stored under `public/uploads/shane/`.

The admin calls `/api/admin/content`. The Worker checks a shared admin password, then uses a GitHub token stored in Cloudflare secrets to commit changes back to this repository. After the commit lands on GitHub, the GitHub Actions workflow rebuilds and redeploys the Worker.

### Admin setup

1. Create a fine-grained GitHub token for this repository. It needs read/write access to **Contents** for `w1075207-gif/shanehairstudioSite`.
2. Add these Cloudflare Worker secrets/variables:

   | Variable | Value |
   |----------|-------|
   | `ADMIN_PASSWORD` | Secret; shared password for `/admin/` |
   | `GITHUB_TOKEN` | Secret; fine-grained GitHub token |
   | `GITHUB_BRANCH` | Plain variable; defaults to `main` |

3. Deploy the site.
4. Visit `/admin/`, enter the shared password, edit content, and click **Save to GitHub**.

No editor needs a GitHub account. The GitHub token never appears in browser code; it only lives in Cloudflare's server-side environment.

## Assets

Admin-managed images live in `public/uploads/shane/` and are referenced by `src/content/shaneContent.json`. New uploads from `/admin/` are committed to that folder and published as static files under `/uploads/shane/`.

The older source images are still kept in `src/assets/shane/` as original project assets, but the live page now reads from the editable content file.
