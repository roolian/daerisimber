<?php

namespace Daerisimber\Blocks;

use ReflectionClass;
use Daerisimber\Helper;

/**
 * WIP
 */

class BlockController
{
    public BlockRender $block_render;

    public function __construct(string $blockJsonPath, string $slug)
    {
        $className = Helper::str_to_camel($slug) . 'BlockRender';
        $classPath = dirname($blockJsonPath) . '/' . $className . '.php';

        if(file_exists($classPath)) {
            if(!class_exists($className)) {
                include $classPath;
            }
            //The class need to inherits BlockRender
            $refl = new ReflectionClass($className);
            $this->block_render = $refl->newInstanceArgs();
        } else {
            $this->block_render  = new BlockRender();
        }

        register_block_type($blockJsonPath, [
            'render_callback' => [$this->block_render, 'render']
        ]);
    }


}
