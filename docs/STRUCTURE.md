Project structure overview

- src: Web components, scripts, styles.
  - src/components: Each component in its own folder, only JS files used at runtime. Dev-only artifacts moved out.
  - src/assets: Styles, images, and other static assets used by the site.
  - src/scripts: Small bootstrapping utilities loaded by pages.
- public: Favicons, manifest and public thumbnails referenced by pages.
- designs, fundamentals, experiments, resources: Site sections with their own index.html.
- sandbox: Local demo/test pages not part of production. Safe to delete or ignore in deployments.
- tools/figma: Figma Code Connect files and configs. Not used at runtime.

Guidelines

- Components: Keep all component runtime code under src/components/<name>/<name>.js and import from src/components/index.js. Avoid linking non-existent paths like css/... from within shadow roots; prefer absolute /src/assets/... paths.
- Styles: Global CSS lives under src/assets/styles. Avoid importing unused component styles in base/index.css.
- Demos: Use sandbox for ad-hoc HTML demos; do not leave them at repo root.
- Tooling: Keep design-tool configs under tools/ and out of src/ to prevent accidental shipping to production.

Notes

- The legacy theme-slider and theme-control components were removed in favor of site-settings.
- Unused local fonts were removed; fonts are provided via Google Fonts in pages.

Fonts

- Strategy: Google Fonts only, one combined request per page for Roboto Flex and Material Symbols Sharp.
- Pattern:
  - Preconnect to `https://fonts.googleapis.com` and `https://fonts.gstatic.com` (with `crossorigin`).
  - Preload the combined CSS with `as="style"` and set `onload` to swap rel to `stylesheet`.
  - Provide a `<noscript>` fallback using the same combined CSS URL with `display=swap`.
