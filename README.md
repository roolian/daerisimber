
# Daerisimber


A theme extending [Timberland](https://github.com/cearls/timberland)

  

Timberland is an opinionated WordPress theme using

 - [Timber](https://www.upstatement.com/timber/)
 - [Advanced Custom Fields Pro](https://www.advancedcustomfields.com/)
 - [Vite](https://vitejs.dev/)
 - [Tailwind](https://tailwindcss.com/)
 - [Alpine.js](https://github.com/alpinejs/alpine).

  

## Installation

1.  Download the zip for this theme (or clone it) and move it to  `wp-content/themes`  in your WordPress installation.
2.  Run  `composer install`  in the theme directory.
3.  Run  `npm install`  in the theme directory.
4.  Activate the theme in Appearance > Themes.
5.  Make sure you have installed  [Advanced Custom Fields Pro](https://www.advancedcustomfields.com/)

## Development

[](https://github.com/cearls/timberland?tab=readme-ov-file#development)

Timberland builds your css and js files using Vite. This allows you to use the latest Javascript and CSS features.

To get started:

1.  Run  `npm run build`  to generate assets that can be used in the admin block editor. This only needs to be run as often as you want to see updated block previews in the admin.
2.  Run  `npm run dev`  to start the Vite dev server.

### Live Reload

[](https://github.com/cearls/timberland?tab=readme-ov-file#live-reload)

Live reload is enabled by default.

### Versioning

[](https://github.com/cearls/timberland?tab=readme-ov-file#versioning)

To assist with long-term caching, file hashing (e.g.  `main-e1457bfd.js`) is enabled by default. This is useful for cache-busting purposes.