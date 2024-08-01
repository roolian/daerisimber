<?php

/**
 * @package WordPress
 * @subpackage Daerisimber
 * Use this file as boot
 */

define('ROOT_THEME_DIR', dirname(__DIR__));
define('THEME_DIR', __DIR__);

require_once ROOT_THEME_DIR . '/vendor/autoload.php';


Daerisimber\Boot::load();
