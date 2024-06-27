<?php

namespace Daerisimber;

use Daerisimber\Blocks\BlockController;
use ReflectionClass;
use Daerisimber\Helper;
use Daerisimber\Blocks\BlockFinder;
use Daerisimber\Blocks\BlockRender;

class acf
{
    public BlockFinder $block_finder;
    public array $load_paths = [];
    public function __construct()
    {
        $this->block_finder = new BlockFinder();

        add_action('block_categories_all', [$this, 'block_categories_all']);

        add_action('acf/init', [$this, 'acf_register_blocks'], 5);

        add_filter('acf/settings/load_json', [$this, 'custom_acf_json_load_point'], 11);

        add_filter('acf/json/save_paths', [$this, 'custom_acf_json_save_paths'], 10, 2);

        add_filter('acf/json/save_file_name', [$this, 'custom_acf_json_save_file_name'], 10, 3);

        //If we are in production, we doen't need to store fields in DB, so we deactivate sync
        if (!Helper::is_dev_env()) {
            add_filter('acf/prepare_field_group_for_import', [$this,'prepare_field_group_for_import'], 20, 1);
        }

        //When we edit a groupfield in Admin, a json file is created
        add_filter('acf/prepare_field_group_for_export', [$this,'prepare_field_group_for_export'], 20, 1);
    }

    /**
     * Customize filename where json groupfield are store
     *
     */
    public function custom_acf_json_save_file_name(string $filename, array $post, string $load_path): string
    {
        if ($this->get_block_name_from_fieldgroup_location($post['location'])) {
            $filename = 'acf.json';
        }

        return $filename;
    }

    /**
     * Customize folder where json groupfield are store
     *
     */
    public function custom_acf_json_save_paths(array $paths, array $post): array
    {
        //If not in dev, we don't save json file
        if(!in_array(WP_ENV, ['development', 'local'])) {
            return [];
        }

        if ($name = $this->get_block_name_from_fieldgroup_location($post['location'])) {
            $paths = [dirname($this->block_finder->blocks[$name])];
        }

        return $paths;
    }

    /**
     * Customize folder where json groupfield are loaded
     * We want search in each block folder
     *
     */
    public function custom_acf_json_load_point($paths)
    {
        // Remove the original path (optional).
        //unset($paths[0]);

        foreach ($this->block_finder->blocks as $key => $value) {
            // Append the new path and return it.
            $paths[] = dirname($value);
        }

        return $paths;
    }

    public function prepare_field_group_for_export($group)
    {
        $mod = ['modified' => $group['modified']];
        //unset($group['modified']);

        return $mod + $group;
    }

    public function prepare_field_group_for_import($group)
    {
        $group['private'] = true;
        return $group;
    }

    public function block_categories_all($categories)
    {
        return array_merge(
            [
                [
                    'slug'  => 'daeris',
                    'title' => __('Daeris builder'),
                ],
            ],
            $categories
        );
    }

    public function acf_register_blocks()
    {
        foreach ($this->block_finder->blocks as $slug => $blockJsonPath) {
            new BlockController($blockJsonPath, $slug);
            //register_block_type($blockJsonPath);
        }
    }

    /**
     * Find block name from the field group definition
     *
     * @param array $location
     * A multidimensionnal array.
     * [
     *      [
     *          [
     *              "param" => "block",
     *              "operator" => "==",
     *              "value" => "daeris/hero"
     *          ],
     *          [
     *              ...
     *              can have additionnal AND conditions
     *          ]
     *      ],
     *      [
     *          ...
     *          can have additionnal OR conditions
     *      ]
     * ]
     * @return string|boolean
     */
    private function get_block_name_from_fieldgroup_location(array $location): string|false
    {
        $main_condition = $location[0][0];
        if ($main_condition['param'] === 'block') {
            //Remove first part to get name
            return explode('/', $main_condition['value'])[1];
        }

        return false;
    }
}
