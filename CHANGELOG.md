# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.2] - 2026-01-07

### Added
- Add admin.js file to execute outside editor iframe

### Changed
- Move dist folder outside src/

## [1.2.0] - 2026-01-05

### Added
- Documentation (README.md) for each JavaScript module
- Organized JS modules into separate directories with documentation

### Changed
- Migrated to iframe editor with apiVersion 3 for Gutenberg blocks
- Updated daerisimber/library to ^1.2.0
- Restructured JS modules: SwiperModule, AjaxFactoryModule, ParalaxModule, ScrollToModule

## [1.0.0] - 2026-01-05

### Added
- Initial Daerisimber theme configuration
- Timber 2.0 integration for templates
- Advanced Custom Fields Pro support
- Vite configuration for asset building
- Tailwind CSS 3.4 with Forms and Typography plugins
- Alpine.js 3.13 for interactivity
- GSAP 3.13 for animations
- Swiper 11.2 for carousels
- Nestor CLI (Symfony Console) for Gutenberg block management
- Modules: FAQ, Icons, Testimony
- Custom post types support
- PHP 8.2+ configuration
- PSR-4 autoload for `Theme\` and `Theme\Modules\` namespaces
- PHPUnit tests with Yoast WP Test Utils
- daerisimber/library ^1.1.6 integration

### Configuration
- PHP >= 8.2 required
- WordPress with Bedrock
- Docker environment with nginx and PHP
