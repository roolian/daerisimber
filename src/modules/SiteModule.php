<?php

declare(strict_types=1);

namespace Theme\Modules;

class SiteModule
{
    public function __construct()
    {
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

        return $twig;
    }

    public function print_ajax_url()
    {
        echo '<script>const siteData = ' . json_encode([
            'ajaxUrl' => admin_url('admin-ajax.php'),
        ]) . '</script>';
    }
}
