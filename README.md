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

## Content editing with Decap CMS

This site includes a Decap CMS admin at `/admin/`. Editors can update the salon copy, contact details, gallery images, environment images, hero image, logo, and price list. The editable source file is `src/content/shaneContent.json`, and uploaded media is stored under `public/uploads/shane/`.

Decap saves changes back to GitHub. After a save, Cloudflare Pages will rebuild and publish the new static site.

### GitHub OAuth setup

1. In GitHub, go to **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Use your deployed site URL for the homepage URL, for example:

   ```text
   https://your-domain.com/admin/
   ```

3. Use this authorization callback URL:

   ```text
   https://your-domain.com/api/callback
   ```

4. Copy the OAuth app's client ID and client secret.
5. In Cloudflare Pages, add these environment variables for Production and Preview:

   | Variable | Value |
   |----------|-------|
   | `GITHUB_CLIENT_ID` | GitHub OAuth app client ID |
   | `GITHUB_CLIENT_SECRET` | GitHub OAuth app client secret |

6. Redeploy the site, then visit `/admin/` and sign in with a GitHub account that has push access to this repository.

The admin config uses the current browser origin as `base_url`. GitHub OAuth callback URLs are domain-specific, so for day-to-day editing use the production domain you registered in the OAuth app. To test login on a preview domain, create a second OAuth app or temporarily change the callback URL.

## Assets

CMS-managed images live in `public/uploads/shane/` and are referenced by `src/content/shaneContent.json`. New uploads through Decap are committed to that folder and published as static files under `/uploads/shane/`.

The older source images are still kept in `src/assets/shane/` as original project assets, but the live page now reads from the CMS content file.
