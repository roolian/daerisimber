<?php

namespace Daerisimber\Modules\Icons;

use Daeris\DaerisimberLibrary\Services\Helper;

class IconsModule
{
    public function __construct()
    {
        add_filter('timber/twig/functions', [self::class, 'add_function_to_twig']);
        if (function_exists('acf_add_local_field_group')) {
            add_action('acf/include_fields', [self::class, 'add_icon_field']);
        }
    }

    public static function add_function_to_twig($functions)
    {
        $functions['display_icon'] = [
            'callable' => [self::class, 'display_icon'],
        ];

        return $functions;
    }

    public static function display_icon($name, $size = '24', $class = '')
    {
        $href = get_template_directory() . '/modules/Icons/assets/svg/' . $name . '.svg';

        if($svg = @file_get_contents($href)) {
            //replace width
            $svg = preg_replace(['/width\s*=\s*"\d*"/', '/height\s*=\s*"\d*"/', '/<svg\s*/'], ['width="' . $size . '"', 'height="' . $size . '"', '<svg class="' . $class . '"'], $svg);

            return $svg;
        }

        return "<span class='text-sm'>icon not found</span>";

    }

    public static function add_icon_field()
    {
        acf_add_local_field_group([
            'modified' => null,
            'key' => 'group_6686ba5d4ea8a',
            'title' => 'Icon choice',
            'fields' => [
                [
                    'key' => 'field_6686ba5df0dd0',
                    'label' => 'Icone',
                    'name' => 'icon',
                    'aria-label' => '',
                    'type' => 'select',
                    'instructions' => '',
                    'required' => 0,
                    'conditional_logic' => 0,
                    'choices' => self::get_icon_list(),
                    'default_value' => false,
                    'return_format' => 'array',
                    'multiple' => 0,
                    'allow_null' => 0,
                    'ui' => 0,
                    'ajax' => 0,
                ],
            ],
            'active' => false,
        ]);
    }

    public static function get_icon_list(): array
    {
        $icon_list = scandir(dirname(__FILE__) . '/assets/svg', SCANDIR_SORT_ASCENDING);

        $icon_list_choice = ['none' => '--- Aucun ---'];
        //dump($icon_list);

        foreach ($icon_list as $value) {
            if(in_array($value, ['.', '..'])) {
                continue;
            }

            $name = str_replace('.svg', '', $value);

            $icon_list_choice[$name] = Helper::str_to_title($name);
        }

        return $icon_list_choice;
    }
}
