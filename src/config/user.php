<?php

return [
    'roles' => [
        'editor' => [
            'name' => 'Administrator',
            'capabilities' => [
                'add' => [
                    'edit_themes',
                ],
                'remove' => [
                    //'switch_themes'
                ]
            ]
        ],
        'administrator' => [
            'name' => 'Full admin'
        ]
    ],

];
