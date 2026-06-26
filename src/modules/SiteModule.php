<?php

declare(strict_types=1);

namespace Theme\Modules;

use Twig\TwigFunction;

class SiteModule
{
    private $colorPalette = null;

    public function __construct()
    {
        static $palette = null;
        if ($palette === null) {
            $data    = json_decode(file_get_contents(get_template_directory() . '/theme.json'), true);
            $entries = $data['settings']['color']['palette'] ?? [];
            $palette = [];
            foreach ($entries as $entry) {
                $palette[strtolower($entry['color'])] = $entry['slug'];
            }
            $this->colorPalette = $palette;
        }
        // add is_admin to twig context
        add_filter('timber/twig', [$this, 'add_to_twig']);

        // print ajax_url in header with hook script inline wp_enqueue_scripts
        add_action('wp_head', [$this, 'print_ajax_url'], 8);

        // add_filter('rocket_set_wp_cache_constant', '__return_false');
    }

    // add is_admin to twig context
    public function add_to_twig($twig)
    {
        $twig->addGlobal('is_admin', is_admin() && !wp_doing_ajax());

        $twig->addFunction(new TwigFunction('color_class', [$this, 'color_class']));

        return $twig;
    }

    public function color_class(?string $hex): ?string
    {
        if (empty($hex)) {
            return null;
        }

        $slug = $this->colorPalette[strtolower($hex)] ?? null;

        return $slug ? 'has-' . $slug . '-background-color' : null;
    }

    public function print_ajax_url()
    {
        echo '<script>const siteData = ' . json_encode([
            'ajaxUrl' => admin_url('admin-ajax.php'),
        ]) . '</script>';
    }
}
