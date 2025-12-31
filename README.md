
  

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

### CLI Commands (Nestor)

The theme includes a CLI tool named Nestor to streamline development. Use `php nestor` or `./nestor` to run the following commands:

#### Main Commands

- **`completion`** - Generates the shell completion script for your shell
- **`help`** - Displays help for a specific command
  ```bash
  php nestor help block:create
  ```
- **`list`** - Lists all available commands

#### Block Management

- **`block:create`** - Creates a new Gutenberg block with full scaffolding
  ```bash
  php nestor block:create
  ```
  
  This interactive command will prompt you for:
  1. **Block name** - Enter a human-readable name (e.g., "Hero Banner")
  2. **Category** - Choose from:
     - **Layout** - For structural blocks (sections, containers)
     - **Component** - For reusable UI components (buttons, cards)
     - **Query** - For dynamic content blocks (post lists, archives)
     - **Module** - For blocks within existing modules
  3. **Module selection** - If you selected "Module" category, choose which module to add the block to
  
  The command automatically generates:
  - **Block directory** in `src/blocks/{category}/{slug}/` (or `src/modules/{module}/blocks/{slug}/` for modules)
  - **block.json** - Block registration configuration with metadata, category, icon, and ACF settings
  - **{slug}.twig** - Twig template file for rendering the block's HTML output
  - **{BlockName}BlockModel.php** - PHP model class extending `BlockModel` to handle data preparation and business logic
  - **acf.json** - ACF field group definition with a sample "title" field, automatically linked to the block
  
  Example workflow:
  ```bash
  php nestor block:create
  # Enter "Feature Card" as block name
  # Select "Component" as category
  # Block created at: src/blocks/component/feature-card/
  ```

#### View Management

- **`view:publish`** - Publishes a default Timber view to your theme for customization
  ```bash
  php nestor view:publish
  ```
  Allows you to copy default Timber templates into your theme directory so you can modify them without affecting the core files.

  

### Live Reload

  

Live reload is enabled by default with vite.

Vite config is located in ./vite.json.

`environment` variable in this file is read by this WP theme to know if it load assets from HMR or not.

`environment` variable is set automatically when running `npm run build` (environment = production) or `npm run dev` (environment = development).

  

### Wordpress theme config

  

theme.json is generated from files in ./theme folder.

THe command `npm run build` automatically update the file in ./theme.json.

  

#### Colors

  

Define colors in ./theme/theme-colors.js.

This way the same colors are available from :

  

- WP Gutenberg color palette

  

- Tailwind css class

  

- ACf color field (loaded in ./src/assets/main.js)

  

## ACF related features

  

### Gutenberg blocks

  
  

#### General

Each block in src/blocks is located in a dedicated folder (src/blocks/component/button/) and require a block.json file to be auto registered.

Render twig file will be in priority order:


- folder-name.twig (src/blocks/component/button/button.twig)

- index.twig (src/blocks/component/button/index.twig)

  

ACF field group associated with the block will be stored in the dedicated folder :
- src/blocks/component/button/acf.json

  

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

### Modules

Modules are self-contained features that can include custom post types, ACF fields, and blocks. The theme provides a `BaseModule` class to simplify module development.

#### Creating a Module

1. Create a new directory in `src/modules/{ModuleName}/`
2. Create a module class extending `BaseModule`:

```php
<?php

namespace Theme\Modules\Testimony;

use Daerisimber\Modules\BaseModule;

class TestimonyModule extends BaseModule
{
    public function __construct()
    {
        // Register ACF paths for this module
        $this->registerAcfPaths();

        // Register a custom post type
        $this->registerPostType('testimony', [
            'name' => __('Testimonials', 'theme'),
            'singular_name' => __('Testimonial', 'theme'),
            'add_new' => __('Add New', 'theme'),
            'add_new_item' => __('Add New Testimonial', 'theme'),
            // ... other labels
        ], [
            'menu_icon' => 'dashicons-format-quote',
            'supports' => ['title', 'editor'],
            'has_archive' => true,
            // ... other args
        ]);
    }
}
```

3. Register your module in `src/config/app.php`:

```php
'modules' => [
    Theme\Modules\Testimony\TestimonyModule::class,
],
```

#### Multiple Post Types

A module can register multiple custom post types:

```php
public function __construct()
{
    $this->registerAcfPaths();

    // First post type
    $this->registerPostType('testimony', [
        'name' => __('Testimonials', 'theme'),
        // ...
    ], [
        'menu_icon' => 'dashicons-format-quote',
    ]);

    // Second post type
    $this->registerPostType('review', [
        'name' => __('Reviews', 'theme'),
        // ...
    ], [
        'menu_icon' => 'dashicons-star-filled',
    ]);
}
```

#### ACF Field Management

ACF field groups created for your module's post types will automatically be saved to `src/modules/{ModuleName}/acf-json/`. This keeps your module's field definitions version-controlled and portable.

The module will automatically:
- Load ACF JSON files from its `acf-json/` directory
- Save ACF field groups associated with its post types to its `acf-json/` directory

#### Module Blocks

Blocks within a module are only registered if the module is active in `app.php`. Store module-specific blocks in `src/modules/{ModuleName}/blocks/` and they will be automatically discovered.