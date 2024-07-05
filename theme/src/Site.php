<?php

namespace Daerisimber;

use Twig\TwigFunction;
use Timber\Site as TimberSite;

class Site extends TimberSite
{
    public function __construct()
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);
        add_action('after_setup_theme', [$this, 'theme_supports']);
        add_filter('timber/context', [$this, 'add_to_context']);
        add_filter('timber/twig', [$this, 'add_to_twig']);
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_assets']);

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
        $twig->addFunction(
            new TwigFunction('add_styles', [$this, 'add_styles'])
        );
        $twig->addFunction(
            new TwigFunction('print_styles', [$this, 'print_styles'])
        );

        return $twig;
    }

    public function add_styles($selector, $styles = [])
    {
        $compiled_styles[$selector] = [];

        foreach ($styles as $key => $value) {
            if (!empty($value)) {
                $compiled_styles[$selector][] = $key;
            }
        }

        return count($compiled_styles[$selector]) > 0 ? $compiled_styles : [];
    }

    public function print_styles($styles = [])
    {
        if(count($styles) <= 0) {
            return false;
        }

        $render = '<style type="text/css">';
        foreach ($styles as $selector => $rules) {
            $render .= $selector . '{';

            foreach ($rules as $rule) {
                $render .= $rule . ';';
            }

            $render .= '}';
        }
        $render .= '</style>';

        return $render;
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

    public function enqueue_assets()
    {
        wp_dequeue_style('wp-block-library');
        wp_dequeue_style('wp-block-library-theme');
        wp_dequeue_style('wc-block-style');
        wp_dequeue_script('jquery');
    }

}
