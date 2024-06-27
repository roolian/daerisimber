<?php

use Timber\Timber;
use Dotenv\Util\Str;
use Daerisimber\Helper;
use Daerisimber\Blocks\BlockRender;

/**
 * @package WordPress
 * @subpackage Timberland
 * @since Timberland 2.0.1
 */

require_once dirname(__DIR__) . '/vendor/autoload.php';

Timber::init();
Timber::$dirname    = ['views', 'blocks'];
Timber::$autoescape = false;

new Daerisimber\Site();
new Daerisimber\Vite();
new Daerisimber\Acf();
new Daerisimber\User();
new Daerisimber\Menu();


// Remove ACF block wrapper div
function acf_should_wrap_innerblocks($wrap, $name)
{
    return false;
}

add_filter('acf/blocks/wrap_frontend_innerblocks', 'acf_should_wrap_innerblocks', 10, 2);
