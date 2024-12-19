
  

# Daerisimber

  
  

A theme extending [Timberland](https://github.com/cearls/timberland)

  

  

Timberland is an opinionated WordPress theme using

  

-  [Timber](https://www.upstatement.com/timber/)

-  [Advanced Custom Fields Pro](https://www.advancedcustomfields.com/)

-  [Vite](https://vitejs.dev/)

-  [Tailwind](https://tailwindcss.com/)

-  [Alpine.js](https://github.com/alpinejs/alpine).

  

  

## Installation

  

1. Download the zip for this theme (or clone it) and move it to `wp-content/themes` in your WordPress installation.

2. Run `composer install` in the theme directory.

3. Run `npm install` in the theme directory.

4. Activate the theme in Appearance > Themes.

5. Make sure you have installed [Advanced Custom Fields Pro](https://www.advancedcustomfields.com/)

  

## Development

  

Timberland builds your css and js files using Vite. This allows you to use the latest Javascript and CSS features.

  

To get started:

  

1. Run `npm run build` to generate assets that can be used in the admin block editor. This only needs to be run as often as you want to see updated block previews in the admin.

2. Run `npm run dev` to start the Vite dev server.

  

### Live Reload

  

Live reload is enabled by default with vite.

Vite config is located in ./vite.json.

`environment` variable in this file is read by this WP theme to know if it load assets from HMR or not.

`environment` variable is set automatically when running `npm run build` (environment = production) or `npm run dev` (environment = development).

  

### Wordpress theme config

  

theme.json is generated from files in ./theme-json folder.

THe command `npm run build` automatically update the file in ./theme/theme.json.

  

#### Colors

  

Define colors in ./theme-json/theme-colors.js.

This way the same colors are available from :

  

- WP Gutenberg color palette

  

- Tailwind css class

  

- ACf color field (loaded in ./theme/assets/main.js)

  

## ACF related features

  

### Gutenberg blocks

  
  

#### General

Each block in theme/blocks is located in a dedicated folder (theme/blocks/component/button/) and require a block.json file to be auto registered.

Render twig file will be in priority order:

  

- folder-name.twig (theme/blocks/component/button/button.twig)

- index.twig (theme/blocks/component/button/index.twig)

  

ACF field group associated with the block will be stored in the dedicated folder :
- theme/blocks/component/button/acf.json

  

A block can be easily copied to another daerisimber theme without adaptations.

  
  

#### Variants

  

Sometimes you need to display same field with another layout.

You can create a folder variant/ containing twig template files in your block folder to automaticly add a field "Variant" in block admin panel.

```twig
    {% set variant_path = block.path ~ '/variant/' %}
    <div  id="{{ id }}"  class="{{ class }}">
    {% include [variant_path ~ fields.variant, variant_path ~ 'default.twig'] ignore missing %}
    </div>
```