<?php




use Timber\Timber;
use PHLAK\Config\Config;


Timber::init();
Timber::$dirname    = ['views', 'blocks', 'modules'];

$conf = Config::fromDirectory(DIR_ROOT . '/config/');

//Global helper function
function config($key, $default = null)  {
    global $conf;
    return $conf->get($key, $default);
}

foreach (config('app.services', []) as $key => $class) {
    new $class();
}
foreach (config('app.modules', []) as $key => $class) {
    new $class();
}


// Remove ACF block wrapper div
function acf_should_wrap_innerblocks($wrap, $name)
{
    return false;
}

//add_filter('acf/blocks/wrap_frontend_innerblocks', 'acf_should_wrap_innerblocks', 10, 2);
