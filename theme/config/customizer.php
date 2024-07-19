<?php

return [
    "customize_register" => [
        "logo_footer" => [
            'default' => '',
            'type' => 'theme_mod',
            'capability' => 'edit_theme_options',
            'control_class' => \WP_Customize_Image_Control::class,
            'control_options' => [
                'label' => __('Logo footer', 'daerisimber'),
                'section' => 'title_tagline',
                'priority' => 9,
            ]
        ]
    ]
];