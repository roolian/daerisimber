<?php

namespace Theme\Modules\Testimony;

class TestimonyModule
{
    public static $base_url = 'testimony';
    public static $post_type = 'testimony';
    public static $icon = 'dashicons-format-quote';
    public function __construct()
    {
        add_action('init', [$this, 'create_post_types']);

        add_filter('acf/settings/load_json', [$this, 'acf_load_json'], 11);
        add_filter('acf/json/save_paths', [$this, 'acf_save_paths'], 10, 2);
    }


    public function acf_load_json($paths)
    {
        $paths[] = __DIR__.'/acf-json';
        return $paths;
    }

    public function acf_save_paths($paths, $post)
    {
        $main_condition = $post['location'][0][0] ?? false;

        $format = 'return "%s" %s "%s";';

        $control_location = eval(sprintf($format, $main_condition['value'], $main_condition['operator'], self::$post_type));
        if (
            $main_condition
            && $main_condition['param'] == "post_type"
            && $control_location
        ) {
            $paths =[ get_stylesheet_directory().'/modules/Testimony/acf-json'];
        }

        return $paths;
    }



    public function create_post_types()
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
        register_post_type(
            self::$post_type,
            [
                'labels' => $labels,
                'taxonomies' => [],
                'public' => true,
                'has_archive' => false,
                'exclude_from_search' => true,
                'show_ui' => true,
                'query_var' => false,
                'rewrite' => false,
                'supports' => ['title'],
                'menu_icon' => self::$icon,
            ]
        );
    }
}
