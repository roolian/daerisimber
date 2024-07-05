<?php

/**
 * @package WordPress
 * @subpackage Daerisimber
 */


use Timber\Timber;

$services = [
    Daerisimber\Site::class,
    Daerisimber\Vite::class,
    Daerisimber\User::class,
    Daerisimber\Menu::class,
    Daerisimber\Cleanup::class,
    Daerisimber\Customizer::class,
    Daerisimber\CustomPostTypes::class,
    Daerisimber\Plugins\ACF\ACFSetup::class,
];

$modules = [
    Daerisimber\Modules\Faq\FaqModule::class,
    Daerisimber\Modules\Icons\IconsModule::class,
];

require_once dirname(__DIR__) . '/vendor/autoload.php';

Timber::init();
Timber::$dirname    = ['views', 'blocks', 'modules'];



foreach ($services as $key => $class) {
    new $class();
}
foreach ($modules as $key => $class) {
    new $class();
}


// Remove ACF block wrapper div
function acf_should_wrap_innerblocks($wrap, $name)
{
    return false;
}

//add_filter('acf/blocks/wrap_frontend_innerblocks', 'acf_should_wrap_innerblocks', 10, 2);
