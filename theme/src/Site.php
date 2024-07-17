<?php

namespace Daerisimber;

use Twig\TwigFunction;
use Timber\Site as TimberSite;

class Site extends TimberSite
{
    public function __construct()
    {
        add_action('after_setup_theme', [$this, 'theme_supports']);
        add_filter('timber/context', [$this, 'add_to_context']);
        add_filter('upload_mimes', [$this, 'allow_file_type_upload']);

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

    public function theme_supports()
    {
        add_theme_support('automatic-feed-links');
        add_theme_support(
            'html5',
            [
                'comment-form',
                'comment-list',
                'gallery',
                'caption',
            ]
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

    

    public function allow_file_type_upload($mimes)
    {
        $mimes['svg'] = 'image/svg+xml';
        //Add this to allow lottie
        //$mimes['json'] = 'text/plain';

        return $mimes;
    }

}
