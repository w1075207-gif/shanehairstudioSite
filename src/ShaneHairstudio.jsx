import { useEffect, useMemo, useRef, useState } from 'react';
import {
  MESSAGES,
  SHANE_HTML_LANG,
  SHANE_LOCALES,
  detectInitialLocale,
  writeSavedLocale,
} from './shaneHairstudio.i18n.js';

import {
  ABOUT_IMG,
  ENV_IMG1,
  ENV_IMG2,
  ENV_IMG3,
  GALLERY_IMGS,
  HERO_BG,
  NAV_LOGO,
  PRICE_LIST_URL,
  TEAM_IMG,
} from './shaneAssets.js';

/**
 * Client mockups are visual specifications only. This page is built with real
 * markup/CSS to match that layout; photos are bundled via ./shaneAssets.js (Vite).
 */

/** Design tokens – warm amber-orange (aligned with salon photography) */
const ORANGE = '#e8752e';
const ORANGE_DIM = '#c46218';
const ORANGE_SOFT = 'rgba(232, 117, 46, 0.38)';
const ORANGE_GLOW = 'rgba(232, 115, 58, 0.09)';
const BLACK = '#0a0a0a';
const BLACK_CARD = '#121212';
const TEXT = '#ffffff';
const TEXT_MUTED = 'rgba(255,255,255,0.72)';
const BORDER = 'rgba(255,255,255,0.08)';

const MAPS_URL = 'https://maps.app.goo.gl/axbCgenAmhye3kq39';
const MAPS_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3113.214!2d-9.136875400000001!3d38.726738899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19333796b3ec81%3A0x9e55a011962cd8f8!2sShane\'s%20HairStudio%E3%80%8CAsian%E3%80%8D!5e0!3m2!1sen!2spt!4v1715000000000!5m2!1sen!2spt';

const WHATSAPP_URL = 'https://wa.me/351936825171';
const WHATSAPP_DISPLAY = '+351 936 825 171';
const INSTAGRAM_URL = 'https://www.instagram.com/shane_hairstudio/';
const INSTAGRAM_HANDLE = 'shane_hairstudio';

const LANG_DISPLAY = { zh: '中文', en: 'EN', pt: 'PT', ko: '한', ja: '日' };

function langAriaLabel(code, t) {
  const map = {
    zh: t.langZhAria,
    en: t.langEnAria,
    pt: t.langPtAria,
    ko: t.langKoAria,
    ja: t.langJaAria,
  };
  return map[code] || code;
}

function gallerySlotWide(i) {
  return i % 4 === 0;
}

function splitBulletLines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function IconFeatTeam() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7.5" r="3.25" />
      <circle cx="16" cy="8" r="2.75" />
      <path d="M3.5 19.5v-0.5a4.5 4.5 0 0 1 4.5-4.5h1.2M14.8 14.5h1.2a4.5 4.5 0 0 1 4.5 4.5v0.5" />
    </svg>
  );
}

function IconFeatSpark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round">
      <path d="M12 3.5l1.2 4.2h4.3l-3.5 2.6 1.3 4.2L12 14l-3.3 2.5 1.3-4.2-3.5-2.6h4.3L12 3.5z" />
    </svg>
  );
}

function IconFeatDiamond() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinejoin="round">
      <path d="M12 4.5l7.5 8-7.5 8-7.5-8 7.5-8z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="shane-social-svg" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="shane-social-svg">
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      />
    </svg>
  );
}

const CSS = `
  .shane-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .shane-root { scroll-behavior: smooth; background: ${BLACK}; color: ${TEXT};
    font-family: 'Outfit', 'Noto Sans TC', 'Noto Sans SC', 'Noto Sans JP', 'Noto Sans KR', system-ui, sans-serif;
    min-height: 100vh;
  }
  .shane-root :focus-visible {
    outline: 2px solid ${ORANGE};
    outline-offset: 3px;
  }

  /* Honeycomb background */
  .shane-honey {
    background-color: ${BLACK};
    background-image:
      radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0);
    background-size: 48px 84px;
    position: relative;
  }
  .shane-honey::before {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
    opacity: 0.4;
    background:
      repeating-linear-gradient(30deg, transparent, transparent 36px, ${ORANGE_GLOW} 36px, ${ORANGE_GLOW} 37px),
      repeating-linear-gradient(-30deg, transparent, transparent 36px, ${ORANGE_GLOW} 36px, ${ORANGE_GLOW} 37px);
  }
  .shane-z1 { position: relative; z-index: 1; }

  /* Nav */
  .shane-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 200;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 clamp(16px, 4vw, 48px);
    height: 72px;
    background: rgba(10,10,10,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid ${BORDER};
  }
  .shane-brand {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    text-decoration: none;
    line-height: 0;
    transition: opacity 0.2s;
  }
  .shane-brand:hover { opacity: 0.92; }
  .shane-brand-logo {
    height: 42px;
    width: auto;
    max-width: min(220px, 42vw);
    object-fit: contain;
    object-position: left center;
    display: block;
  }
  .shane-nav-links { display: flex; gap: clamp(12px, 2vw, 28px); list-style: none; align-items: center; }
  .shane-nav-links a {
    color: ${TEXT_MUTED}; text-decoration: none; font-size: 0.84rem;
    white-space: nowrap; transition: color 0.2s;
  }
  .shane-nav-links a:hover { color: ${ORANGE}; }
  .shane-nav-cta {
    background: ${ORANGE}; color: #fff; padding: 10px 22px; border-radius: 6px;
    font-size: 0.86rem; font-weight: 700; text-decoration: none;
    transition: filter 0.2s, transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06) inset;
  }
  .shane-nav-cta:hover {
    filter: brightness(1.06);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(232, 117, 46, 0.25), 0 0 0 1px rgba(255,255,255,0.08) inset;
  }
  .shane-burger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 8px; background: none; border: none; color: #fff; }
  .shane-burger span { width: 22px; height: 2px; background: #fff; border-radius: 1px; }
  .shane-nav-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .shane-lang-dd { position: relative; }
  .shane-lang-dd-trigger {
    display: flex; align-items: center; gap: 6px;
    padding: 7px 12px;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    border: 1px solid ${BORDER};
    background: rgba(0,0,0,0.45);
    color: ${TEXT};
    border-radius: 6px;
    cursor: pointer;
    font-family: inherit;
    line-height: 1.2;
    min-width: 4.5rem;
    justify-content: center;
    transition: border-color 0.2s, color 0.2s;
  }
  .shane-lang-dd-trigger:hover { border-color: ${ORANGE_SOFT}; color: ${ORANGE}; }
  .shane-lang-dd-trigger[aria-expanded="true"] {
    border-color: ${ORANGE};
    background: rgba(232, 117, 46, 0.12);
  }
  .shane-lang-dd-caret { font-size: 0.55rem; opacity: 0.85; }
  .shane-lang-dd-list {
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    min-width: 9rem;
    padding: 6px;
    margin: 0;
    list-style: none;
    background: rgba(14,14,14,0.98);
    border: 1px solid ${BORDER};
    border-radius: 8px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.55);
    z-index: 220;
  }
  .shane-lang-dd-list button {
    display: block;
    width: 100%;
    text-align: left;
    padding: 10px 12px;
    border: none;
    background: none;
    color: ${TEXT_MUTED};
    font-size: 0.8rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    border-radius: 6px;
    transition: background 0.15s, color 0.15s;
  }
  .shane-lang-dd-list button:hover { background: rgba(232, 117, 46, 0.12); color: ${ORANGE}; }
  .shane-lang-dd-list button[aria-selected="true"] {
    color: #fff;
    background: rgba(232, 117, 46, 0.22);
  }

  /* Hero: left 1/3 copy + right 2/3 photo (gradient blends at the seam) */
  .shane-hero {
    padding-top: 72px;
    min-height: calc(100dvh - 72px);
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    align-items: stretch;
    width: 100%;
  }
  .shane-hero-inner {
    position: relative;
    z-index: 2;
    padding: clamp(28px, 5vw, 64px) clamp(18px, 2.8vw, 36px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #060608;
    background-image: radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.055) 1px, transparent 0);
    background-size: 22px 38px;
    border-right: 1px solid ${BORDER};
  }
  .shane-hero-photo {
    position: relative;
    min-height: 280px;
    overflow: hidden;
  }
  .shane-hero-photo-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 52% center;
    display: block;
    pointer-events: none;
  }
  .shane-hero-photoGrad {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      90deg,
      rgba(6, 6, 10, 0.94) 0%,
      rgba(6, 6, 10, 0.55) 18%,
      rgba(6, 6, 10, 0.15) 42%,
      rgba(0, 0, 0, 0) 68%
    );
  }
  .shane-hero-inner .shane-btn-outline {
    border-color: rgba(255, 255, 255, 0.82);
    color: #fff;
  }
  .shane-hero-inner .shane-btn-outline:hover {
    border-color: ${ORANGE};
    color: ${ORANGE};
  }
  .shane-hero-title {
    font-size: clamp(1.7rem, 3.4vw, 2.75rem); font-weight: 700; color: ${ORANGE};
    line-height: 1.15; margin-bottom: 12px; letter-spacing: 0.03em;
    font-family: 'Outfit', 'Noto Sans TC', 'Noto Sans SC', sans-serif;
  }
  .shane-hero-sub { font-size: clamp(1rem, 1.9vw, 1.2rem); color: ${TEXT}; margin-bottom: 14px; font-weight: 600; }
  .shane-hero-lead {
    color: rgba(255,255,255,0.92); font-size: clamp(0.84rem, 1.45vw, 0.98rem); font-weight: 600;
    letter-spacing: 0.04em; margin-bottom: 12px;
  }
  .shane-hero-desc { color: ${TEXT_MUTED}; font-size: clamp(0.86rem, 1.4vw, 0.95rem); line-height: 1.75; margin-bottom: 22px; }
  .shane-hero-btns { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: clamp(22px, 4vh, 40px); }
  .shane-btn-solid {
    background: ${ORANGE}; color: #fff; padding: 14px 28px; border-radius: 6px;
    font-weight: 700; text-decoration: none; font-size: 0.95rem; border: 2px solid ${ORANGE};
    transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
    box-shadow: 0 4px 18px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06) inset;
  }
  .shane-btn-solid:hover {
    transform: translateY(-2px) scale(1.02);
    filter: brightness(1.05);
    box-shadow: 0 8px 28px rgba(232, 117, 46, 0.28), 0 0 0 1px rgba(255,255,255,0.1) inset;
  }
  .shane-btn-outline {
    border: 2px solid ${ORANGE}; color: ${ORANGE}; background: transparent;
    padding: 12px 26px; border-radius: 6px; font-weight: 700; text-decoration: none; font-size: 0.95rem;
    transition: transform 0.2s, background 0.2s, border-color 0.2s;
  }
  .shane-btn-outline:hover {
    transform: translateY(-1px);
    background: rgba(232, 117, 46, 0.1);
  }
  .shane-hero-features {
    display: flex; flex-wrap: wrap; gap: clamp(12px, 2.5vw, 24px);
  }
  .shane-hero-feat { display: flex; align-items: center; gap: 10px; color: ${TEXT}; font-size: 0.84rem; }
  .shane-hero-feat-icon {
    width: 38px; height: 38px; border-radius: 50%; border: 1px solid ${ORANGE_SOFT};
    display: flex; align-items: center; justify-content: center; color: ${ORANGE};
  }
  .shane-hero-feat-icon svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 1.75; }
  .shane-hero-pin {
    position: absolute; right: clamp(12px, 2.5vw, 28px); bottom: clamp(16px, 3vh, 32px); z-index: 3;
    background: rgba(0,0,0,0.78); border: 1px solid ${BORDER}; padding: 10px 14px; border-radius: 6px;
    font-size: 0.78rem; color: ${TEXT}; display: flex; align-items: center; gap: 8px;
  }

  /* Section */
  .shane-sec {
    padding: clamp(56px, 10vw, 96px) clamp(20px, 4vw, 48px);
    position: relative;
    background-image: radial-gradient(ellipse 95% 120px at 50% 0%, ${ORANGE_GLOW}, transparent 72%);
    background-repeat: no-repeat;
  }
  .shane-sec::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    width: min(1120px, calc(100% - 40px));
    height: 1px;
    background: linear-gradient(90deg, transparent, ${ORANGE_SOFT}, transparent);
    opacity: 0.65;
    pointer-events: none;
  }
  .shane-sec:first-of-type::before { opacity: 0.45; }
  .shane-sec-head { text-align: center; margin-bottom: clamp(36px, 6vw, 56px); }
  .shane-sec-head h2 {
    font-size: clamp(1.45rem, 3.2vw, 2.15rem); font-weight: 700; color: ${TEXT};
    letter-spacing: 0.02em;
  }
  .shane-sec-head .en {
    color: ${ORANGE}; font-size: 0.7rem; letter-spacing: 0.4em; text-transform: uppercase; margin-top: 12px;
    font-family: 'Outfit', 'Noto Sans TC', sans-serif; font-weight: 600;
  }
  .shane-inner { max-width: 1120px; margin: 0 auto; }
  .shane-sec--alt {
    background-color: #0d0d0d;
    background-image:
      radial-gradient(ellipse 100% 140px at 50% 0%, rgba(232, 115, 58, 0.1), transparent 70%),
      radial-gradient(ellipse 95% 120px at 50% 0%, ${ORANGE_GLOW}, transparent 72%);
  }

  /* Services – hex */
  .shane-svc-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: clamp(16px, 3vw, 28px);
  }
  .shane-svc-card {
    background: ${BLACK_CARD}; border: 1px solid ${BORDER}; border-radius: 12px;
    padding: clamp(20px, 3vw, 28px) 16px; text-align: center; transition: border-color 0.2s, transform 0.2s;
  }
  .shane-svc-card:hover {
    border-color: ${ORANGE_SOFT};
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.45);
  }
  .shane-hex {
    width: 88px; height: 88px; margin: 0 auto 18px;
    display: flex; align-items: center; justify-content: center;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    background: linear-gradient(145deg, ${ORANGE_DIM}, ${ORANGE});
    font-size: 2rem;
    transition: box-shadow 0.25s, filter 0.25s;
    box-shadow: 0 6px 20px rgba(232, 117, 46, 0.22), 0 0 0 1px rgba(255,255,255,0.08) inset;
  }
  .shane-svc-card:hover .shane-hex {
    box-shadow: 0 10px 28px rgba(232, 117, 46, 0.35);
    filter: brightness(1.06);
  }
  .shane-svc-card h3 { font-size: 1.08rem; margin-bottom: 10px; color: ${TEXT}; font-weight: 700; }
  .shane-svc-card p { font-size: 0.84rem; color: ${TEXT_MUTED}; line-height: 1.65; margin-bottom: 14px; min-height: 3.2em; }
  .shane-svc-more { color: ${ORANGE}; font-size: 0.82rem; font-weight: 600; text-decoration: none; }
  .shane-svc-more:hover { text-decoration: underline; }

  /* About */
  .shane-about-grid {
    display: grid; grid-template-columns: 1fr 1.1fr; gap: clamp(28px, 5vw, 48px); align-items: center;
  }
  .shane-about-img { border-radius: 12px; overflow: hidden; border: 1px solid ${BORDER}; }
  .shane-about-img img { width: 100%; height: 100%; object-fit: cover; object-position: center 35%; display: block; min-height: 320px; }
  .shane-about-text h2 { font-size: clamp(1.4rem, 2.9vw, 1.95rem); margin-bottom: 16px; color: ${TEXT}; font-weight: 700; }
  .shane-about-text p { color: ${TEXT_MUTED}; line-height: 1.85; font-size: 0.94rem; margin-bottom: 28px; }
  .shane-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
  .shane-stat {
    background: ${BLACK_CARD}; border: 1px solid ${BORDER}; border-radius: 10px;
    padding: 14px 16px; font-size: 0.8rem; color: ${TEXT_MUTED}; text-align: center;
  }
  .shane-stat strong { display: block; color: ${ORANGE}; font-size: 1.05rem; margin-bottom: 4px; }

  /* Gallery – masonry-style grid + lightbox */
  #gallery.shane-sec {
    background-color: #070707;
    background-image:
      radial-gradient(ellipse 90% 100px at 50% 0%, rgba(232, 115, 58, 0.07), transparent 65%),
      radial-gradient(ellipse 95% 120px at 50% 0%, ${ORANGE_GLOW}, transparent 72%);
  }
  .shane-gal-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-auto-rows: auto;
    gap: clamp(10px, 1.4vw, 16px);
    max-width: min(1120px, 100%);
    margin: 0 auto;
  }
  .shane-gal-item {
    position: relative;
    display: block;
    padding: 0;
    border: none;
    cursor: zoom-in;
    border-radius: 10px;
    overflow: hidden;
    background: ${BLACK_CARD};
    border: 1px solid ${BORDER};
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .shane-gal-item:hover {
    border-color: ${ORANGE_SOFT};
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(0,0,0,0.4);
  }
  .shane-gal-item:focus-visible { outline-offset: 4px; }
  .shane-gal-item img {
    width: 100%;
    height: 100%;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    display: block;
  }
  .shane-gal-item--wide {
    grid-column: span 2;
  }
  .shane-gal-item--wide img {
    aspect-ratio: 5 / 4;
  }
  .shane-gal-more { text-align: center; margin-top: 32px; }
  .shane-gal-more a {
    display: inline-block;
    border: 2px solid ${ORANGE};
    color: #fff;
    background: transparent;
    padding: 11px 28px;
    border-radius: 6px;
    font-weight: 700;
    font-size: 0.88rem;
    text-decoration: none;
    transition: transform 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .shane-gal-more a:hover {
    background: rgba(232, 117, 46, 0.14);
    color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(232, 117, 46, 0.15);
  }

  .shane-lightbox {
    position: fixed;
    inset: 0;
    z-index: 400;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(16px, 4vw, 48px);
    background: rgba(0,0,0,0.88);
    backdrop-filter: blur(8px);
  }
  .shane-lightbox-backdrop {
    position: absolute;
    inset: 0;
    border: none;
    padding: 0;
    margin: 0;
    background: transparent;
    cursor: zoom-out;
    z-index: 0;
  }
  .shane-lightbox-fig {
    position: relative;
    z-index: 1;
    max-width: min(92vw, 1000px);
    max-height: 88vh;
    margin: 0;
  }
  .shane-lightbox-fig img {
    display: block;
    max-width: min(92vw, 1000px);
    max-height: 88vh;
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 10px;
    border: 1px solid ${BORDER};
    box-shadow: 0 24px 80px rgba(0,0,0,0.65);
  }
  .shane-lightbox-close {
    position: fixed;
    top: clamp(16px, 4vw, 28px);
    right: clamp(16px, 4vw, 28px);
    z-index: 2;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid ${BORDER};
    background: rgba(14,14,14,0.95);
    color: #fff;
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s, color 0.2s;
  }
  .shane-lightbox-close:hover { border-color: ${ORANGE}; color: ${ORANGE}; }
  .shane-lightbox-nav {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 1px solid ${BORDER};
    background: rgba(14,14,14,0.92);
    color: #fff;
    font-size: 1.25rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s, color 0.2s;
  }
  .shane-lightbox-nav:hover { border-color: ${ORANGE}; color: ${ORANGE}; }
  .shane-lightbox-nav--prev { left: clamp(12px, 3vw, 24px); }
  .shane-lightbox-nav--next { right: clamp(12px, 3vw, 24px); }

  /* Environment */
  .shane-env-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(24px, 4vw, 40px); }
  .shane-env-block h3 { font-size: 1.12rem; margin-bottom: 12px; color: ${TEXT}; font-weight: 700; }
  .shane-env-block p { font-size: 0.89rem; color: ${TEXT_MUTED}; line-height: 1.75; margin-bottom: 16px; }
  .shane-env-block img { width: 100%; border-radius: 10px; border: 1px solid ${BORDER}; }
  .shane-env-imgs {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }
  .shane-env-imgs img {
    aspect-ratio: 3 / 4;
    object-fit: cover;
    height: auto;
    display: block;
  }

  /* Contact */
  .shane-contact-grid {
    display: grid; grid-template-columns: 1fr 1.2fr 1fr; gap: clamp(20px, 3vw, 32px); align-items: start;
  }
  .shane-contact-col h4 { font-size: 0.68rem; color: ${ORANGE}; letter-spacing: 0.22em; text-transform: uppercase; margin-bottom: 8px; font-weight: 700; }
  .shane-contact-col p, .shane-contact-col a { font-size: 0.92rem; color: ${TEXT_MUTED}; line-height: 1.7; text-decoration: none; }
  .shane-contact-col a:hover { color: ${ORANGE}; }
  .shane-map { border-radius: 12px; overflow: hidden; border: 1px solid ${BORDER}; min-height: 280px; }
  .shane-map iframe { width: 100%; height: 320px; border: 0; display: block; filter: grayscale(0.06) contrast(1.03); }
  .shane-social { display: flex; gap: 12px; margin-top: 12px; }
  .shane-social a {
    width: 40px; height: 40px; border-radius: 50%; border: 1px solid ${BORDER};
    display: flex; align-items: center; justify-content: center; color: ${TEXT};
    text-decoration: none;
    transition: border-color 0.2s, color 0.2s;
  }
  .shane-social a:hover { border-color: ${ORANGE}; color: ${ORANGE}; }
  .shane-social-svg { width: 21px; height: 21px; display: block; flex-shrink: 0; }

  /* Digitperm long-form */
  .shane-prose {
    max-width: min(720px, 100%);
    margin: 0 auto;
    text-align: left;
  }
  .shane-prose-main {
    font-size: clamp(1.12rem, 2.2vw, 1.38rem);
    color: ${TEXT};
    margin-bottom: 14px;
    font-weight: 700;
    line-height: 1.45;
    letter-spacing: 0.02em;
  }
  .shane-prose-lead {
    color: ${TEXT_MUTED};
    font-size: clamp(0.88rem, 1.5vw, 0.96rem);
    line-height: 1.85;
    margin-bottom: 28px;
  }
  .shane-prose h4 {
    font-size: 1.02rem;
    color: ${ORANGE};
    margin: 26px 0 10px;
    font-weight: 700;
    line-height: 1.35;
  }
  .shane-prose .shane-prose-subintro {
    color: ${TEXT_MUTED};
    font-size: 0.9rem;
    margin-bottom: 10px;
    line-height: 1.75;
  }
  .shane-prose ul {
    margin: 0 0 18px 1.15rem;
    padding: 0;
    color: ${TEXT_MUTED};
    font-size: 0.9rem;
    line-height: 1.82;
    list-style: disc;
  }

  /* Footer */
  .shane-foot {
    border-top: 1px solid ${BORDER}; padding: 40px clamp(20px, 4vw, 48px) 48px;
    background: #050505;
  }
  .shane-foot-grid {
    max-width: 1120px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 28px; align-items: start;
  }
  .shane-foot-brand { color: ${ORANGE}; font-weight: 700; font-size: 1rem; font-family: 'Outfit', 'Noto Sans TC', sans-serif; }
  .shane-foot-mid { font-size: 0.82rem; color: ${TEXT_MUTED}; line-height: 1.9; }
  .shane-foot-copy { text-align: center; margin-top: 32px; font-size: 0.75rem; color: ${TEXT_MUTED}; }

  /* Price list strip */
  .shane-price-strip {
    max-width: 1120px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 48px) 48px;
  }
  .shane-price-strip a { color: ${ORANGE}; font-weight: 600; font-size: 0.9rem; }

  @media (max-width: 1024px) {
    .shane-svc-grid { grid-template-columns: repeat(2, 1fr); }
    .shane-contact-grid { grid-template-columns: 1fr; }
    .shane-map iframe { height: 260px; }
    .shane-foot-grid { grid-template-columns: 1fr; text-align: center; }
    .shane-foot-grid .shane-social { justify-content: center; }
    .shane-gal-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      max-width: min(900px, 100%);
    }
    .shane-gal-item--wide {
      grid-column: span 2;
    }
  }
  @media (max-width: 900px) {
    .shane-nav-links { display: none; position: fixed; top: 72px; left: 0; right: 0;
      flex-direction: column; background: rgba(10,10,10,0.98); padding: 16px 0; border-bottom: 1px solid ${BORDER}; gap: 0; }
    .shane-nav-links.open { display: flex; }
    .shane-nav-links li { width: 100%; }
    .shane-nav-links a { display: block; padding: 14px 24px; font-size: 1rem; }
    .shane-nav-cta { display: none; }
    .shane-burger { display: flex; }
    .shane-about-grid { grid-template-columns: 1fr; }
    .shane-env-grid { grid-template-columns: 1fr; }
    .shane-gal-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      max-width: 100%;
      padding: 0;
      overflow: visible;
    }
    .shane-gal-item--wide {
      grid-column: span 2;
    }
    .shane-gal-item img {
      aspect-ratio: 4 / 5;
    }
    .shane-gal-item--wide img {
      aspect-ratio: 5 / 4;
    }
    .shane-hero {
      grid-template-columns: 1fr;
      min-height: auto;
    }
    .shane-hero-inner {
      border-right: none;
      border-bottom: 1px solid ${BORDER};
      padding-bottom: 36px;
    }
    .shane-hero-photo {
      min-height: 46vh;
    }
    .shane-hero-photo-img {
      object-position: center;
    }
  }
  @media (max-width: 520px) {
    .shane-svc-grid { grid-template-columns: 1fr; }
    .shane-env-imgs { grid-template-columns: 1fr; }
    .shane-gal-grid {
      gap: 10px;
    }
    .shane-brand-logo { height: 34px; max-width: 52vw; }
    .shane-hero-pin { right: 12px; bottom: 12px; font-size: 0.72rem; padding: 8px 10px; }
    .shane-hero-photo { min-height: 38vh; }
  }
`;

export default function ShaneHairstudio() {
  const [lang, setLang] = useState(() => detectInitialLocale());
  const [lightbox, setLightbox] = useState(null);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const t = MESSAGES[lang];
  const colon = ['zh', 'ja', 'ko'].includes(lang) ? '：' : ': ';
  const menuRef = useRef(null);
  const burgerRef = useRef(null);
  const langDropdownRef = useRef(null);

  const services = useMemo(
    () => [
      { icon: '◎', title: t.svcPerm, desc: t.svcPermDesc, href: '#contact' },
      { icon: '✂', title: t.svcCut, desc: t.svcCutDesc, href: '#contact' },
      { icon: '☇', title: t.svcStyle, desc: t.svcStyleDesc, href: '#contact' },
      { icon: '◐', title: t.svcColor, desc: t.svcColorDesc, href: '#contact' },
    ],
    [t],
  );

  useEffect(() => {
    document.documentElement.lang = SHANE_HTML_LANG[lang] || 'en';
    document.title = t.docTitle;
  }, [lang, t.docTitle]);

  const pickLang = (next) => {
    writeSavedLocale(next);
    setLang(next);
  };

  useEffect(() => {
    if (lightbox === null) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setLightbox(null);
        setLangMenuOpen(false);
      }
      if (lightbox === null) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setLightbox((i) => (i <= 0 ? GALLERY_IMGS.length - 1 : i - 1));
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setLightbox((i) => (i >= GALLERY_IMGS.length - 1 ? 0 : i + 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  useEffect(() => {
    if (!langMenuOpen) return undefined;
    const onDoc = (e) => {
      if (langDropdownRef.current?.contains(e.target)) return;
      setLangMenuOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [langMenuOpen]);

  useEffect(() => {
    const menu = menuRef.current;
    const burger = burgerRef.current;
    const onDoc = (e) => {
      if (!menu?.classList.contains('open')) return;
      if (menu.contains(e.target) || burger?.contains(e.target)) return;
      menu.classList.remove('open');
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="shane-root shane-honey">
        <div className="shane-z1">
          <nav className="shane-nav" aria-label={t.navAria}>
            <a className="shane-brand" href="#home">
              <img
                className="shane-brand-logo"
                src={NAV_LOGO}
                alt={t.navBrand}
                loading="eager"
                decoding="async"
              />
            </a>
            <ul className="shane-nav-links" ref={menuRef}>
              <li><a href="#home">{t.navHome}</a></li>
              <li><a href="#services">{t.navServices}</a></li>
              <li><a href="#digitperm">{t.navDigitperm}</a></li>
              <li><a href="#about">{t.navAbout}</a></li>
              <li><a href="#gallery">{t.navGallery}</a></li>
              <li><a href="#environment">{t.navEnvironment}</a></li>
              <li><a href="#contact">{t.navContact}</a></li>
            </ul>
            <div className="shane-nav-actions">
              <div className="shane-lang-dd" ref={langDropdownRef}>
                <button
                  type="button"
                  className="shane-lang-dd-trigger"
                  aria-expanded={langMenuOpen}
                  aria-haspopup="listbox"
                  aria-label={t.langGroupAria}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLangMenuOpen((o) => !o);
                  }}
                >
                  {LANG_DISPLAY[lang] ?? lang.toUpperCase()}
                  <span className="shane-lang-dd-caret" aria-hidden>▾</span>
                </button>
                {langMenuOpen ? (
                  <ul className="shane-lang-dd-list" role="listbox" aria-label={t.langGroupAria}>
                    {SHANE_LOCALES.map((code) => (
                      <li key={code} role="presentation">
                        <button
                          type="button"
                          role="option"
                          aria-selected={lang === code}
                          onClick={() => {
                            pickLang(code);
                            setLangMenuOpen(false);
                          }}
                        >
                          {langAriaLabel(code, t)}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <a className="shane-nav-cta" href="#contact">{t.navCta}</a>
              <button
                type="button"
                className="shane-burger"
                aria-label={t.burgerOpen}
                ref={burgerRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setLangMenuOpen(false);
                  menuRef.current?.classList.toggle('open');
                }}
              >
                <span /><span /><span />
              </button>
            </div>
          </nav>

          <header className="shane-hero" id="home">
            <div className="shane-hero-inner">
              <h1 className="shane-hero-title">{t.heroTitle}</h1>
              <p className="shane-hero-sub">{t.heroSub}</p>
              <p className="shane-hero-lead">{t.heroLead}</p>
              <p className="shane-hero-desc">{t.heroDesc}</p>
              <div className="shane-hero-btns">
                <a className="shane-btn-solid" href="#contact">{t.heroBook}</a>
                <a className="shane-btn-outline" href="#gallery">{t.heroGallery}</a>
              </div>
              <div className="shane-hero-features">
                <div className="shane-hero-feat">
                  <span className="shane-hero-feat-icon"><IconFeatTeam /></span>
                  <span>{t.heroFeat1}</span>
                </div>
                <div className="shane-hero-feat">
                  <span className="shane-hero-feat-icon"><IconFeatSpark /></span>
                  <span>{t.heroFeat2}</span>
                </div>
                <div className="shane-hero-feat">
                  <span className="shane-hero-feat-icon"><IconFeatDiamond /></span>
                  <span>{t.heroFeat3}</span>
                </div>
              </div>
            </div>
            <div className="shane-hero-photo">
              <img className="shane-hero-photo-img" src={HERO_BG} alt="" decoding="async" />
              <div className="shane-hero-photoGrad" aria-hidden />
              <div className="shane-hero-pin">
                <span aria-hidden>📍</span>
                <span>{t.heroPin}</span>
              </div>
            </div>
          </header>

          <section className="shane-sec" id="services">
            <div className="shane-inner">
              <div className="shane-sec-head">
                <h2>{t.secServices}</h2>
                <p className="en">{t.secServicesSub}</p>
              </div>
              <div className="shane-svc-grid">
                {services.map((s) => (
                  <div key={s.title} className="shane-svc-card">
                    <div className="shane-hex" aria-hidden>{s.icon}</div>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <a className="shane-svc-more" href={s.href}>{t.svcMore} &gt;</a>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="shane-sec" id="digitperm" aria-labelledby="shane-digitperm-h2">
            <div className="shane-inner">
              <div className="shane-sec-head">
                <h2 id="shane-digitperm-h2">{t.secDigitperm}</h2>
                <p className="en">{t.secDigitpermSub}</p>
              </div>
              <article className="shane-prose">
                <h3 className="shane-prose-main">{t.digitpermTitle}</h3>
                <p className="shane-prose-lead">{t.digitpermLead}</p>

                <h4>{t.digitpermH3a}</h4>
                <p className="shane-prose-subintro">{t.digitpermIntroA}</p>
                <ul>
                  {splitBulletLines(t.digitpermBulletsA).map((line, i) => (
                    <li key={`dp-a-${i}`}>{line}</li>
                  ))}
                </ul>

                <h4>{t.digitpermH3b}</h4>
                <p className="shane-prose-subintro">{t.digitpermIntroB}</p>
                <ul>
                  {splitBulletLines(t.digitpermBulletsB).map((line, i) => (
                    <li key={`dp-b-${i}`}>{line}</li>
                  ))}
                </ul>

                <h4>{t.digitpermH3c}</h4>
                <p className="shane-prose-subintro">{t.digitpermIntroC}</p>
                <ul>
                  {splitBulletLines(t.digitpermBulletsC).map((line, i) => (
                    <li key={`dp-c-${i}`}>{line}</li>
                  ))}
                </ul>
              </article>
            </div>
          </section>

          <section className="shane-sec shane-sec--alt" id="about">
            <div className="shane-inner">
              <div className="shane-about-grid">
                <div className="shane-about-img">
                  <img src={ABOUT_IMG} alt={t.aboutImgAlt} loading="lazy" />
                </div>
                <div className="shane-about-text">
                  <h2>{t.aboutH2}</h2>
                  <p>{t.aboutP}</p>
                  <div className="shane-stats">
                    <div className="shane-stat"><strong>{t.statYearsStrong}</strong>{t.statTeam}</div>
                    <div className="shane-stat"><strong>1000+</strong>{t.statClients}</div>
                    <div className="shane-stat"><strong>{t.statProductsStrong}</strong>{t.statProducts}</div>
                    <div className="shane-stat"><strong>{t.statComfortStrong}</strong>{t.statComfort}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="shane-sec" id="gallery">
            <div className="shane-inner">
              <div className="shane-sec-head">
                <h2>{t.secGallery}</h2>
                <p className="en">{t.secGallerySub}</p>
              </div>
              <div className="shane-gal-grid">
                {GALLERY_IMGS.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={`shane-gal-item${gallerySlotWide(i) ? ' shane-gal-item--wide' : ''}`}
                    onClick={() => setLightbox(i)}
                    aria-label={`${t.galleryWorkAlt} ${i + 1}`}
                  >
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
              <div className="shane-gal-more">
                <a href="#contact">{t.galleryMore}</a>
              </div>
            </div>
          </section>

          <section className="shane-sec shane-sec--alt" id="environment">
            <div className="shane-inner">
              <div className="shane-env-grid">
                <div className="shane-env-block">
                  <h3>{t.envTeamH3}</h3>
                  <p>{t.envTeamP}</p>
                  <img src={TEAM_IMG} alt={t.envTeamImgAlt} loading="lazy" />
                </div>
                <div className="shane-env-block">
                  <h3>{t.envSpaceH3}</h3>
                  <p>{t.envSpaceP}</p>
                  <div className="shane-env-imgs">
                    <img src={ENV_IMG1} alt={t.envImg1Alt} loading="lazy" />
                    <img src={ENV_IMG2} alt={t.envImg2Alt} loading="lazy" />
                    <img src={ENV_IMG3} alt={t.envImg3Alt} loading="lazy" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="shane-sec" id="contact">
            <div className="shane-inner">
              <div className="shane-sec-head">
                <h2>{t.secContact}</h2>
                <p className="en">{t.secContactSub}</p>
              </div>
              <div className="shane-contact-grid">
                <div className="shane-contact-col">
                  <h4>{t.addrLabel}</h4>
                  <p>
                    Rua dos Anjos 6A<br />
                    1150-191 Lisboa, Portugal
                  </p>
                  <h4 style={{ marginTop: 20 }}>{t.hoursLabel}</h4>
                  <p>
                    {t.hoursRegularLine}
                    <br />
                    <span style={{ color: ORANGE }}>{t.hoursMonSunNote}</span>
                  </p>
                </div>
                <div className="shane-map">
                  <iframe
                    title={t.mapTitle}
                    src={MAPS_EMBED}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <div className="shane-contact-col">
                  <h4>{t.bookH4}</h4>
                  <p>
                    <a className="shane-btn-solid" href={MAPS_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 4 }}>
                      {t.googleMaps}
                    </a>
                  </p>
                  <h4 style={{ marginTop: 20 }}>{t.contactH4}</h4>
                  <p>
                    {t.labelWhatsApp}{colon}
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                      {WHATSAPP_DISPLAY}
                    </a>
                  </p>
                  <p style={{ marginTop: 8 }}>
                    {t.labelInstagram}{colon}
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                      @{INSTAGRAM_HANDLE}
                    </a>
                  </p>
                  <div className="shane-social" style={{ marginTop: 16 }}>
                    <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={t.ariaInstagram}>
                      <IconInstagram />
                    </a>
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label={`${t.ariaWhatsApp} ${WHATSAPP_DISPLAY}`}>
                      <IconWhatsApp />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="shane-price-strip">
            <p style={{ color: TEXT_MUTED, fontSize: '0.88rem', marginBottom: 8 }}>{t.priceIntro}</p>
            <a href={PRICE_LIST_URL} target="_blank" rel="noopener noreferrer">{t.priceLink}</a>
          </div>

          <footer className="shane-foot">
            <div className="shane-foot-grid">
              <div className="shane-foot-brand">{t.footerBrand}</div>
              <div className="shane-foot-mid">
                {t.labelWhatsApp}{colon}
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>
                  {WHATSAPP_DISPLAY}
                </a>
                <br />
                {t.labelInstagram}{colon}
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={{ color: ORANGE }}>
                  @{INSTAGRAM_HANDLE}
                </a>
                <br />
                Rua dos Anjos 6A, 1150-191 Lisboa
              </div>
              <div style={{ justifySelf: 'end' }} className="shane-social">
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={t.ariaInstagram}>
                  <IconInstagram />
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label={`${t.ariaWhatsApp} ${WHATSAPP_DISPLAY}`}>
                  <IconWhatsApp />
                </a>
              </div>
            </div>
            <p className="shane-foot-copy">
              {t.footerCopyright.replace('{{year}}', String(new Date().getFullYear()))}
            </p>
          </footer>
      </div>
      </div>
      {lightbox !== null ? (
        <div
          className="shane-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t.lightboxDialog}
        >
          <button
            type="button"
            className="shane-lightbox-backdrop"
            tabIndex={-1}
            aria-label={t.lightboxClose}
            onClick={() => setLightbox(null)}
          />
          <figure className="shane-lightbox-fig">
            <img
              src={GALLERY_IMGS[lightbox]}
              alt={`${t.galleryWorkAlt} ${lightbox + 1}`}
            />
          </figure>
          <button
            type="button"
            className="shane-lightbox-close"
            aria-label={t.lightboxClose}
            onClick={(e) => {
              e.stopPropagation();
              setLightbox(null);
            }}
          >
            ×
          </button>
          <button
            type="button"
            className="shane-lightbox-nav shane-lightbox-nav--prev"
            aria-label={t.lightboxPrev}
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i <= 0 ? GALLERY_IMGS.length - 1 : i - 1));
            }}
          >
            ‹
          </button>
          <button
            type="button"
            className="shane-lightbox-nav shane-lightbox-nav--next"
            aria-label={t.lightboxNext}
            onClick={(e) => {
              e.stopPropagation();
              setLightbox((i) => (i >= GALLERY_IMGS.length - 1 ? 0 : i + 1));
            }}
          >
            ›
          </button>
        </div>
      ) : null}
    </>
  );
}
