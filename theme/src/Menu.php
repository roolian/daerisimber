<?php

namespace Daerisimber;

use Timber\Timber;

class Menu
{
    public function __construct()
    {
        add_action('init', [$this, 'register_menus']);
        add_filter('timber/context', [$this, 'add_menu_to_context']);

    }

    public function register_menus()
    {
        register_nav_menus(
            [
                'main_menu' => __('Main Menu'),
                'footer_menu' => __('Footer Menu'),
            ]
        );
    }

    public function add_menu_to_context($context)
    {
        $context['main_menu'] = Timber::get_menu('main_menu');
        return $context;
    }
}
