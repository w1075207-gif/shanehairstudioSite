# Update summary

## 2026-05-11

- Created standalone Vite + React project at `~/shanehairstudioSite`.
- Migrated `ShaneHairstudio.jsx` and `shaneHairstudio.i18n.js`; `App.jsx` renders the page only.
- Added Google Fonts (Outfit, Noto Sans TC/SC/JP/KR) in root `index.html`.
- Salon images live under `src/assets/shane/` (synced from `~/yiyuSite/public/shane/`).
- Documented Cloudflare Pages build (`npm run build`, output `dist`) in `README.md`.

## 2026-05-11 (Cloudflare deploy fix)

- README: clarified that **Deploy command** should be **empty** for standard static Pages; if using `wrangler versions upload`, set **`NODE_VERSION=22`** (Wrangler 4 requires Node ≥22).
- `.nvmrc` set to `22`; `package.json` `engines.node` set to `>=22` for alignment with Wrangler 4.

## 2026-05-11 (build & hero)

- `vite.config.js`: `build.assetsInlineLimit: 0` so images are always real `/assets/*.png` files (no `data:` in JS).
- Hero section: `<img className="shane-hero-photo-img">` instead of CSS `background-image`, for broader browser/CSP compatibility.

## 2026-05-11 (copy real salon assets)

- Synced production PNGs from `~/yiyuSite/public/shane/site/` and `price-list.png` into `~/shanehairstudioSite/src/assets/shane/` (overwriting placeholders). `npm run build` emits ~21 distinct hashed `/assets/*.png` files (~2.6MB total).

## 2026-05-11 (favicon)

- Added `public/favicon.svg`: dark rounded square (`#0a0a0a`) + orange **S** stroke (`#e8752e`, matches site accent).
- `index.html`: `<link rel="icon" href="/favicon.svg" type="image/svg+xml" />` and `theme-color` `#0a0a0a`.
