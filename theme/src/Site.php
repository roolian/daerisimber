<?php

namespace Daerisimber;

use Timber\Site as TimberSite;
use Timber\Timber;

class Site extends TimberSite
{
    public function __construct()
    {
        add_action('wp_enqueue_scripts', array( $this, 'enqueue_assets' ));
        add_action('after_setup_theme', array( $this, 'theme_supports' ));
        add_filter('timber/context', array( $this, 'add_to_context' ));
        add_filter('timber/twig', array( $this, 'add_to_twig' ));
        add_action('enqueue_block_editor_assets', array( $this, 'enqueue_assets' ));

        parent::__construct();
    }

    public function add_to_context($context)
    {
        $context['site'] = $this;

        // Require block functions files
        foreach (glob(__DIR__ . '/blocks/*/functions.php') as $file) {
            require_once $file;
        }

        return $context;
    }

    public function add_to_twig($twig)
    {
        return $twig;
    }

    public function theme_supports()
    {
        add_theme_support('automatic-feed-links');
        add_theme_support(
            'html5',
            array(
                'comment-form',
                'comment-list',
                'gallery',
                'caption',
            )
        );
        add_theme_support('menus');
        add_theme_support('post-thumbnails');
        add_theme_support('custom-logo');
        add_theme_support('wp-block-styles');
        add_theme_support('title-tag');
        add_theme_support('editor-styles');
        add_theme_support('align-wide');
        add_theme_support('anchor');
    }

    public function enqueue_assets()
    {
        wp_dequeue_style('wp-block-library');
        wp_dequeue_style('wp-block-library-theme');
        wp_dequeue_style('wc-block-style');
        wp_dequeue_script('jquery');
    }

    
}
