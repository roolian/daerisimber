<?php

namespace Daerisimber;

use Roots\WPConfig\Config;

class Helper
{
    public static function config(string $key): mixed
    {
        return Config::get($key);
    }

    public static function is_dev_env(): bool
    {
        return  in_array(Config::get('WP_ENVIRONMENT_TYPE'), ['development', 'local']);
    }

    public static function str_to_camel($string)
    {
        $string = ucwords(
            strtr(
                $string,
                ['_' => ' ', '-' => ' ']
            )
        );

        $string = str_replace(' ', '', $string);

        return $string;
    }
}
