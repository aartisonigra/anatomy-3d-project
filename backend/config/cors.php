<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register', 'google-login'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:8081'], // વેબ/મોબાઈલ માટે પરવાનગી

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // આને 'true' કરવું અનિવાર્ય છે, કારણ કે તમે Cookies/Sanctum વાપરો છો
    'supports_credentials' => true,
];
