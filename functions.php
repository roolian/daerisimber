<?php

/**
 * @package WordPress
 * @subpackage Daerisimber
 * Use this file as boot
 */

define('DAERISIMBER_VERSION', '1.0');
define('ROOT_THEME_DIR', __DIR__);
define('THEME_DIR', __DIR__ . '/src');

require_once ROOT_THEME_DIR . '/vendor/autoload.php';
require_once THEME_DIR . '/bootstrap.php';
