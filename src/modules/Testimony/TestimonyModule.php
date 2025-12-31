<?php

namespace Theme\Modules\Testimony;

use Daerisimber\Modules\BaseModule;

class TestimonyModule extends BaseModule
{
    public static $base_url = 'testimony';
    public static $post_type = 'testimony';
    public static $icon = 'dashicons-format-quote';

    public function __construct()
    {
        $labels = [
            'name' => __('Témoignages', 'testimony_module'),
            'singular_name' => __('Témoignage', 'testimony_module'),
            'menu_name' => __('Témoignages', 'testimony_module'),
            'name_admin_bar' => __('Témoignage', 'testimony_module'),
            'add_new' => __('Ajouter Nouveau', 'testimony_module'),
            'add_new_item' => __('Ajouter Nouveau Témoignage', 'testimony_module'),
            'new_item' => __('Nouveau Témoignage', 'testimony_module'),
            'edit_item' => __('Modifier Témoignage', 'testimony_module'),
            'view_item' => __('Voir Témoignage', 'testimony_module'),
            'all_items' => __('Tous les Témoignages', 'testimony_module'),
            'search_items' => __('Chercher un Témoignage', 'testimony_module'),
        ];

        $args = [
            'menu_icon' => self::$icon,
        ];

        $this->registerPostType(self::$post_type, $labels, $args);
    }
}
