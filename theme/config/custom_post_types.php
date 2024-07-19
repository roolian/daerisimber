<?php

return [
    'disable_block_editor' => [],
    'taxonomies' => [
        'categorie_question' => [
            'label' => __('Categorie de question', 'daerisimber'),
            'auto_labels' => [
                "plural" => __('Categories de question', 'daerisimber'),
                "singular" => __('Categorie de question', 'daerisimber'),
                "gender" => 'f',
            ],
            'hierarchical' => true,
            'public' => true,
            'rewrite' => [
                'slug' => 'categorie_question',
                'with_front' => false
            ],
            'show_admin_column' => true,
            'show_in_menu' => true,
        ]
    ],
    'post_types' => [
        'question' => [
            'label' => __('Questions', 'daerisimber'),
            'auto_labels' => [
                "plural" => __('Questions', 'daerisimber'),
                "singular" => __('Question', 'daerisimber'),
                "gender" => 'f',
            ],
            'taxonomies' => ['categorie_question'],
            'public' => true,
            'has_archive' => true,
            'exclude_from_search' => true,
            'show_ui' => true,
            'query_var' => true,
            'rewrite' => ['slug' => 'question'],
            'supports' => ['title', 'editor'],
            'menu_icon' => 'dashicons-info',
        ]
    ],
];
