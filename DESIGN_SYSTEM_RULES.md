# Design System Rules for Ben.Cards

## Overview
This codebase is a modern personal portfolio site built with vanilla HTML, CSS, and Web Components. It features a sophisticated design system with dynamic theming, accessibility features, and clean architectural patterns.

## Design System Structure

### 1. Token Definitions
**Location:** `src/assets/styles/base/vars.css`

The design system uses CSS custom properties with advanced features:
- **CSS @property declarations** for type-safe, animatable tokens
- **OKLCH color space** for perceptual uniformity and advanced color manipulation
- **Clamp-based fluid typography** scales responsive to viewport
- **Comprehensive spacing, radius, and animation token systems**

```css
/* Example token structure */
--hue-root: 230deg; /* Base hue for color system */
--spacing-xs: 4px;
--spacing-sm: 8px;
--radius-md: 8px;
--font-size-3: clamp(1rem, 0.33vi + 0.92rem, 1.13rem);
```

**Color System Architecture:**
- 11-step color scales with exponential chroma curves
- 4 accent color variants with hue shifts (+20°, +40°, +60°, +80°)
- Semantic color roles (background, text, icon, border)
- Automatic light/dark mode support via `light-dark()` function

### 2. Component Library
**Location:** `src/components/`

**Architecture:** Custom Web Components using Shadow DOM
- Each component is a self-contained module
- Lifecycle managed via `observedAttributes` and attribute callbacks
- External CSS linked via `<link>` in shadow root for maintainability

**Component Structure:**
```
src/components/
├── badge/
│   └── badge.js          # Web Component class
├── card/
├── navigation/
└── index.js              # Component registration hub

tools/figma/
├── badge.figma.ts        # Figma Code Connect mapping
├── icon-card.figma.ts
├── settings.figma.ts
└── figma.config.json
```

**Example Component Pattern:**
```javascript
class Badge extends HTMLElement {
  static get observedAttributes() {
    return ['icon', 'text', 'variant'];
  }
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    // External stylesheet linking pattern
    const css = document.createElement('link');
    css.setAttribute('href', '/src/assets/styles/components/badge.css');
    this.shadowRoot.append(css, ...elements);
  }
}
customElements.define('ben-badge', Badge);
```

### 3. Frameworks & Libraries

**Frontend:**
- **Vanilla Web Components** - No framework dependencies
- **CSS Cascade Layers** - `@layer base layout components` for style organization
- **Modern CSS Features** - Container queries, view transitions, CSS properties

**Build System:**
- **No build step** - Direct browser loading of ES modules
- **Speculation Rules API** for prefetching/prerendering
- **Performance optimizations** - preload, modulepreload, critical CSS first

**Loading Strategy:**
```html
<!-- Critical CSS first -->
<link href="src/assets/styles/base/vars.css" rel="stylesheet" />
<!-- Components with blocking render -->
<script type="module" src="src/components/index.js" blocking="render"></script>
```

### 4. Asset Management
**Fonts:**
- **Google Fonts** - Roboto Flex (variable font)
- **Material Symbols Sharp** - Icon system
- **Preload strategy** for critical fonts with fallback

**Images:**
- **Static assets** in `/public/` directory
- **Optimized PNGs/SVGs** for thumbnails and favicons
- **Responsive image strategy** using modern formats

### 5. Icon System
**Location:** Material Symbols Sharp font
**Integration:** CSS custom properties for consistent sizing

```css
.icon {
  font-family: var(--icon-font-family, "Material Symbols Sharp");
  font-variation-settings: "FILL" var(--icon-fill), "GRAD" var(--icon-grade);
  font-size: var(--icon-size-lg); /* lg, md, sm variants */
}
```

**Size Scale:**
- `--icon-size-xl` through `--icon-size-sm`
- Consistent with typography scale
- Variable font settings for fill, grade, weight

### 6. Styling Approach

**Methodology:**
- **BEM-inspired class naming** without strict adherence
- **CSS Cascade Layers** for predictable style ordering
- **Container queries** for responsive component design
- **CSS custom properties** for dynamic theming

**File Organization:**
```
src/assets/styles/
├── base/           # Global styles, tokens, typography
├── components/     # Component-specific styles
├── layout/         # Page layout styles
└── utilities/      # Animation keyframes, view transitions
```

**Theme System:**
- **Automatic light/dark mode** detection
- **Manual theme controls** via data attributes
- **High contrast mode** support
- **Reduced motion** and **reduced transparency** respect

### 7. Project Structure

```
ben.cards/
├── config/                 # Figma Code Connect configurations
├── designs/               # Portfolio project pages
├── public/               # Static assets (images, manifest)
├── src/
│   ├── assets/
│   │   ├── fonts/        # Local font files
│   │   └── styles/       # CSS architecture
│   ├── components/       # Web Components
│   └── scripts/         # JavaScript utilities
├── experiments/          # Experimental features
├── fundamentals/         # Design principles pages
└── resources/           # Resource links page
```

## Figma Integration

**Code Connect Setup:**
- Configuration files map Figma designs to components
- TypeScript-based mapping for type safety
- Props mapping for component variants

```typescript
// Example Figma Code Connect
figma.connect("figma-url", {
  props: {
    text: figma.string("Text"),
    variant: figma.enum("variant", { ... })
  },
  example: (props) => html`<ben-badge text="${props.text}"></ben-badge>`
});
```

## Implementation Guidelines

### Creating New Components
1. Create component directory in `src/components/`
2. Implement Web Component class with Shadow DOM
3. Create corresponding CSS file in `src/assets/styles/components/`
4. Add CSS import to `src/assets/styles/base/index.css`
5. Register component in `src/components/index.js`
6. Create Figma Code Connect mapping if applicable

### Color Usage
- Use semantic color tokens (`--color-text-primary`)
- Leverage color variants for brand consistency
- Support automatic light/dark mode via `light-dark()`

### Typography
- Use predefined text classes (`.heading.lg`, `.body.md`)
- Leverage fluid typography tokens
- Support variable font features when available

### Responsive Design
- Prefer container queries over media queries
- Use fluid tokens (spacing, typography)
- Test across various screen sizes and zoom levels

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Color contrast compliance
- Reduced motion support
- Keyboard navigation support

This architecture provides a scalable, maintainable foundation for design-to-code workflows with Figma integration while maintaining excellent performance and accessibility standards.
