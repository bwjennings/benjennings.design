Production readiness updates (2025-09-15)

- Moved experimental-only Web Components (`icon-card`, `copy-button`, `simple-card`) under `sandbox/components/` so they no longer ship with the production bundle.
- Added sitemap (`/sitemap.xml`), robots policy (`/robots.txt`), and a custom `404.html` for better crawlability and user fallbacks.
- Updated the web manifest with canonical icon paths, maskable icon support, and brand metadata.
- Expanded social metadata coverage (OG/Twitter) across all pages.

Cleanup summary (2025-08-11)

- Removed legacy components: `theme-control`, `theme-slider`, and `color-changer` (unused, overlapping with `site-settings`).
- Fixed broken stylesheet references inside shadow DOM:
  - `simple-card` now links `/src/assets/styles/components/card.css`.
  - `resource-card` removes bad `@import 'css/index.css'` and inlines `/src/assets/styles/components/button.css` for shadow button styling.
- Pruned unused styles: dropped `radio-buttons.css` and `slider.css` from the build and removed related variables and hooks.
- Moved ad-hoc demo pages to `sandbox/`: `test.html`, `icon-card-demo.html`, `mobile-nav-test.html`, `navigation-test.html`.
- Consolidated Figma Code Connect files under `tools/figma/` and out of runtime `src/`.
- Removed unused local fonts from `src/assets/fonts/` to avoid shipping dead assets.

Font loading standardization

- Unified all pages to use Google Fonts with a single combined request for Roboto Flex + Material Symbols Sharp:
  - Preconnect to `fonts.googleapis.com` and `fonts.gstatic.com` with `crossorigin`.
  - Preload the combined CSS and swap `rel` on load, with a `<noscript>` fallback.
  - Removed separate Material Symbols stylesheet to reduce requests.

Notes

- `site-settings` is the canonical user theme control going forward.
- All component-internal links should use `/src/assets/...` paths or adopt shadow-friendly styling patterns.
