# Theme Color System

This document describes how theme colors are defined, distributed across the build pipeline, and how automatic text contrast is enforced.

---

## Single Source of Truth

All theme colors are defined in **`theme/theme-colors.js`**. This file is the only place to add, remove, or modify colors and their contrast pairs.

```js
// theme/theme-colors.js

export const themeColors = {
  primary:   "#007D8F",
  secondary: "#E22019",
  white:     "#ffffff",
  black:     "#000000",
  color1:    "#67bca8",
  // ...
};

export const contrastMap = {
  primary:   "white",   // dark bg → white text
  secondary: "white",
  white:     "black",   // light bg → black text
  black:     "white",
  color1:    "black",
  // ...
};
```

- **`themeColors`** — the palette used by Tailwind and WordPress.
- **`contrastMap`** — maps each color slug to the slug of its readable text color. Only colors intended as backgrounds need an entry.
- **`tailwindColors`** — optional extended palette using Tailwind's built-in color scales (not exported to WordPress).

---

## Build Pipeline

On every `vite build` (and `vite dev` start), the Vite plugin in **`vite.config.js`** generates two files automatically:

### `theme.json`
Generated from `theme/theme.js`, which reads `themeColors` and builds the WordPress color palette. WordPress uses this to populate the block editor color picker.

### `src/assets/styles/gutenberg/_wp-contrast.css`
Generated from `themeColors` + `contrastMap` by the `generateContrastCSS()` function. This file **must not be edited manually**.

It contains:
1. A Tailwind v4 `@source inline(...)` directive to force-include all `bg-{slug}` utility classes in the build output, even if they don't appear literally in templates.
2. CSS rules for every color in `contrastMap`, targeting both the WordPress editor class (`has-{slug}-background-color`) and the Tailwind utility class (`bg-{slug}`).

**Example output for `primary`:**
```css
@source inline("bg-{primary,secondary,white,...}");

.has-primary-background-color,
.bg-primary {
  --text-contrast: #ffffff;
  background-color: #007D8F;
  color: #ffffff;
}
.has-primary-background-color :is(h1, h2, h3, h4, h5, h6, p, li, a, span),
.bg-primary :is(h1, h2, h3, h4, h5, h6, p, li, a, span) {
  color: var(--text-contrast);
}
```

### Why the descendant selector works

Typography utilities (`h1`, `h2`, etc.) are defined with `@utility` in `_typo.css` and have a CSS specificity of `(0,1,0)`. The descendant selector `.bg-primary h1` has specificity `(0,1,1)` and therefore overrides the utility's explicit `text-primary` or `text-black` without needing `!important`.

Because `_wp-contrast.css` is imported outside of any `@layer` in `main.css`, it also takes precedence over all of Tailwind's layered utilities.

---

## Tailwind Config

**`tailwind.config.js`** imports `themeColors` and registers them as Tailwind color tokens, making all `text-{slug}`, `bg-{slug}`, `border-{slug}` utilities available.

---

## PHP: `color_class()` Twig Function

Defined in **`src/modules/SiteModule.php`**, this function maps a hex color value (e.g. from an ACF color picker) to the corresponding `bg-{slug}` class.

```php
public function color_class(?string $hex): ?string
```

- Reads `theme.json` once (static cache) to build a `hex → slug` lookup table.
- Returns `'bg-primary'` for `'#007D8F'`, `null` for unknown hex values.

This avoids maintaining a separate PHP color map — `theme.json` is already the generated artifact from `theme-colors.js`.

---

## Usage in Twig Templates

### Section block (`src/blocks/layout/section/section.twig`)

```twig
{% set bg_class = color_class(fields.bg_color) %}

{% if fields.bg_color %}
    {% set spacing_class = "py-20 ..." %}
    {% if not bg_class %}
        {# Custom hex not in palette — inline style fallback #}
        {% set styles = "background-color:" ~ fields.bg_color ~ ";" %}
    {% endif %}
{% endif %}

<section class="... {{ bg_class }}" style="{{ styles }}">
```

**Behavior:**
- Palette color (e.g. `#007D8F`) → `bg-primary` class applied → automatic text contrast via CSS.
- Custom hex not in palette → inline `background-color` style, no automatic contrast.

### Direct use in any Twig template

```twig
<div class="bg-primary p-8">
    <h2>This heading is automatically white</h2>
    <p>This paragraph is automatically white too.</p>
</div>
```

---

## Adding a New Color

1. Add the hex value to `themeColors` in `theme/theme-colors.js`.
2. Add its contrast pair to `contrastMap` in the same file.
3. Run `npm run build` (or `npm run dev`) — `theme.json` and `_wp-contrast.css` are regenerated automatically.

No other files need to be touched.
