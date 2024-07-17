<?php

namespace Daerisimber;

class Customizer
{
    public function __construct()
    {
        add_action('customize_register', [$this, 'add_footer_logo_field']);
        add_filter('timber/context', [$this, 'add_to_context']);
    }


    public function add_to_context($context)
    {
        $context['logo_url'] = wp_get_attachment_image_url(get_theme_mod('custom_logo'), 'full');
        $context['logo_footer_url'] = get_theme_mod('logo_footer');

        return $context;
    }

    public function add_footer_logo_field($wp_customize)
    {
        $wp_customize->add_setting('logo_footer', [
            'default' => '',
            'type' => 'theme_mod',
            'capability' => 'edit_theme_options',
        ]);

        $wp_customize->add_control(
            new \WP_Customize_Image_Control(
                $wp_customize,
                'logo',
                [
                    'label' => __('Logo footer', 'daerisimber'),
                    'section' => 'title_tagline',
                    'settings' => 'logo_footer',
                    'priority' => 9,
                ]
            )
        );

    }
}
