<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register', 'google-login'],

    'allowed_methods' => ['*'],

    // 💡 '*' રાખવાથી લોકલહોસ્ટ (localhost:8081) અને બ્રાઉઝરની રિક્વેસ્ટ બ્લોક નહીં થાય
    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // 💡 જ્યારે allowed_origins '*' (વાઇલ્ડકાર્ડ) હોય ત્યારે supports_credentials ને false રાખવું જરૂરી છે
    'supports_credentials' => false,

];
