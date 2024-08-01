<?php

return [
    'services' => [
        Daeris\DaerisimberLibrary\Services\Site::class,
        Daeris\DaerisimberLibrary\Services\DefaultViews::class,
        Daeris\DaerisimberLibrary\Services\Twig::class,
        Daeris\DaerisimberLibrary\Services\Assets::class,
        Daeris\DaerisimberLibrary\Services\User::class,
        Daeris\DaerisimberLibrary\Services\Cleanup::class,
        Daeris\DaerisimberLibrary\Services\Customizer::class,
        Daeris\DaerisimberLibrary\Services\CustomPostTypes::class,
        Daeris\DaerisimberLibrary\Services\Plugins\ACF\ACFSetup::class,
    ],
    'modules' => [
        Theme\Modules\Faq\FaqModule::class,
        Theme\Modules\Icons\IconsModule::class,
    ],
    'commands' => [
        Daeris\DaerisimberLibrary\Console\ViewPublishCommand::class,
    ]
];
