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
        Daerisimber\Modules\Faq\FaqModule::class,
        Daerisimber\Modules\Icons\IconsModule::class,
    ]
];
