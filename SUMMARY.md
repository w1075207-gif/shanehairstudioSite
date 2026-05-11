# Update summary

## 2026-05-11

- Created standalone Vite + React project at `~/shanehairstudioSite`.
- Migrated `ShaneHairstudio.jsx` and `shaneHairstudio.i18n.js`; `App.jsx` renders the page only.
- Added Google Fonts (Outfit, Noto Sans TC/SC/JP/KR) in root `index.html`.
- Added placeholder PNGs under `src/assets/shane/` (via bundling); replace with full-resolution assets for launch.
- Documented Cloudflare Pages build (`npm run build`, output `dist`) in `README.md`.

## 2026-05-11 (Cloudflare deploy fix)

- README: clarified that **Deploy command** should be **empty** for standard static Pages; if using `wrangler versions upload`, set **`NODE_VERSION=22`** (Wrangler 4 requires Node ≥22).
- `.nvmrc` set to `22`; `package.json` `engines.node` set to `>=22` for alignment with Wrangler 4.

## 2026-05-11 (hero + asset URLs)

- `vite.config.js`: `build.assetsInlineLimit: 0` so images are always real `/assets/*.png` files (no `data:` in JS).
- Hero section: `<img className="shane-hero-photo-img">` instead of CSS `background-image`, for broader browser/CSP compatibility.
- Identical placeholder PNGs may dedupe to one hashed file in `dist/assets/` until you upload distinct photos.
