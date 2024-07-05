<?php

namespace Daerisimber;

class CustomPostTypes
{
    private $disable_block_editor = [
        //'application',
    ];

    public function __construct()
    {
        add_action('init', [$this, 'create_post_types']);
        add_action('init', [$this, 'create_taxonomies']);

        if (!empty($this->disable_block_editor)) {
            add_filter('use_block_editor_for_post_type', [$this, 'remove_block_editor'], 10, 2);
        }
    }

    public function create_post_types()
    {
        register_post_type(
            'question',
            [
                'labels' => self::generateLabels('FAQ', 'FAQ', 'f'),
                'taxonomies' => [],
                'public' => true,
                'has_archive' => true,
                'exclude_from_search' => true,
                'show_ui' => true,
                'query_var' => true,
                'rewrite' => ['slug' => 'question'],
                'supports' => ['title', 'editor'],
                'menu_icon' => 'dashicons-info',

            ]
        );

    }

    public function create_taxonomies()
    {
        register_taxonomy(
            'categorie_question',
            ['question'],
            [
                'labels' => self::generateLabels('categorie de questions', 'catégories de questions', 'f'),
                'hierarchical' => true,
                'public' => true,
                'rewrite' => ['slug' => 'categorie_question', 'with_front' => false],
                'show_admin_column' => true,
                'show_in_menu' => true,
            ]
        );
    }
    public function remove_block_editor($current_status, $post_type)
    {
        foreach ($this->disable_block_editor as $post_type_slug) {
            if ($post_type === $post_type_slug) {
                return false;
            }
        }

        return $current_status;
    }

    public static function generateLabels(string $singular, string $plural, string $gender = 'm')
    {
        $all = 'Tous';
        $one = 'un';
        $the = 'le';
        $new = 'Nouveau';
        $find = 'trouvé';
        if ($gender === 'f') {
            $all = 'Toutes';
            $one = 'une';
            $the = 'la';
            $new = 'Nouvelle';
            $find = 'trouvée';
        }

        return  [
            'name' => ucfirst($plural),
            'singular_name' => ucfirst($singular),
            'all_items' => $all . ' les ' . $plural,
            'add_new' => 'Ajouter',
            'add_new_item' => 'Ajouter ' . $one . ' ' . $singular,
            'edit' => 'Modifier',
            'edit_item' => 'Modifier ' . $the . ' ' . $singular,
            'new_item' => $new . ' ' . $singular,
            'view_item' => 'Voir ' . $the . ' ' . $singular,
            'search_items' => 'Rechercher ' . $one . ' ' . $singular,
            'not_found' =>  'Non ' . $find,
            'not_found_in_trash' => 'Non ' . $find . ' dans la corbeille',
            'parent_item_colon' => ''
        ];
    }

}
