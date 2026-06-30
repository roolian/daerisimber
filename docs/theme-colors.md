# Theme Color System

## Concept

Applying a `surface-primary` or `has-primary-background-color` class to a container automatically activates a complete mini-theme: background color, per-element text colors — all configurable via CSS variables without touching templates.

---

## Source of Truth — `theme/theme-colors.js`

Three exports:

| Export | Usage |
|---|---|
| `palette` | Main source — generates Surface classes and `theme.json` |
| `tailwindCustomColors` | Tailwind tokens derived from `palette` (`bg-primary`, `text-primary`…) |
| `tailwindColors` | Tailwind-only colors: `success`, `warning`, `error`, `info` |

### `palette` structure

```js
export const palette = {
  primary: {
    color: "#007D8F",
    contrast: { default: "#ffffff", h1: "#ccf5ff" },  // string or per-selector object
  },
  secondary: {
    color: "#030712",
    contrast: { default: "#ffffff", h1: "#00ccea", h2: "#00ccea" },
  },
  light: { color: "#ffffff", contrast: "#030712" },
  // ...
};
```

`contrast`: string `"#hex"` (all elements) or object `{ default: "#hex", h2: "#hex" }` (per selector). No `dark`/`darkContrast` — dark mode is handled manually in `utilities/_surfaces.css`.

---

## Build Pipeline

`vite build` only generates `theme.json` (WordPress color palette). Everything else lives in the Tailwind plugin.

---

## CSS Architecture

### 1. CSS Variables — `@layer base` (Tailwind plugin)

The plugin injects via `addBase` the default value for each color, **explicit values only** (no redundant fallback vars):

```css
:root {
  --surface-primary: #ffffff;
  --surface-secondary: #ffffff;
  --surface-secondary-h1: #00ccea;  /* only when defined in palette.contrast */
  --surface-secondary-h2: #00ccea;
}
```

### 2. Overrides — `_theme.css`

Since `@layer base` takes precedence over `@theme`, use unlayered `:root` (unlayered > all layers):

```css
/* _theme.css */
:root {
  --surface-white-h2: #444444;
  --surface-secondary-h1: #00ccea;
}
```

### 3. Wildcard rules — `@layer base`

```css
[class*="-background-color"] h2,
[class*="surface-"] h2 {
  color: var(--surface-text-color-h2, var(--surface-text-color));
}
```

### 4. Color blocks — `@layer utilities`

Grouped selector for both WP class and Tailwind utility:

```css
.has-primary-background-color,
.surface-primary {
  --surface-text-color: var(--surface-primary);
  --surface-text-color-h1: var(--surface-primary-h1, var(--surface-primary));
  background-color: var(--surface-primary-bg, var(--color-primary, #007D8F)) !important;
  color: var(--surface-text-color);
}
```

`--surface-{slug}-bg` lets you override the background color via CSS variable without touching the palette.

`background-color: !important` is required because WordPress injects `.has-primary-background-color { background-color: ... !important; }` globally.

---

## Available Classes

| Class | Dark mode | Context |
|---|---|---|
| `has-{slug}-background-color` | Manual in `_surfaces.css` | WP editor / `color_class()` PHP |
| `surface-{slug}` | Manual via `dark:surface-{slug}` | Twig templates |
| `bg-{slug}` | — | UI components — **no contrast rules** |
| `surface-text-{color}` | — | Forces `--surface-text-color` to any palette color |

### Dark mode

Handled manually in `src/assets/styles/_theme.css`:

```css
@variant dark {
  .has-primary-background-color {
    --surface-primary-bg: #005A67;
    --surface-primary: #ffffff;
  }
}
```

Or in Twig: `class="surface-primary dark:surface-dark"`.

---

## PHP: `color_class()`

Maps an ACF hex value to `has-{slug}-background-color`. Returns `null` for colors not in the palette (fallback to inline style in the section block).

---

## Adding a Color

1. Add to `palette` in `theme/theme-colors.js`:
   ```js
   brand: { color: "#3a1f6e", contrast: "#ffffff" },
   ```
2. `npm run build` — `theme.json` regenerated, CSS variables injected automatically.
