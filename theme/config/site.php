<?php

return [
    'menus' => [
        'main_menu' => __('Main Menu'),
        'footer_menu' => __('Footer Menu'),
    ],
    'themes_supports' => [
        'automatic-feed-links' => true,
        'menus' => true,
        'post-thumbnails' => true,
        'custom-logo' => true,
        'wp-block-styles' => true,
        'title-tag' => true,
        'editor-styles' => true,
        'align-wide' => true,
        'anchor' => true,
        'html5' =>
            [
                'comment-form',
                'comment-list',
                'gallery',
                'caption',
            ]
    ],
    'upload_mimes' => [
        'svg' => 'image/svg+xml',
        //"json" => "text/plain",
    ]
];
