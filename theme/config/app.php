<?php

return [
    'services' => [
        Daerisimber\Services\Site::class,
        Daerisimber\Services\Twig::class,
        Daerisimber\Services\Assets::class,
        Daerisimber\Services\User::class,
        Daerisimber\Services\Cleanup::class,
        Daerisimber\Services\Customizer::class,
        Daerisimber\Services\CustomPostTypes::class,
        Daerisimber\Services\Plugins\ACF\ACFSetup::class,
    ],
    'modules' => [
        Daerisimber\Modules\Faq\FaqModule::class,
        Daerisimber\Modules\Icons\IconsModule::class,
    ]
];
