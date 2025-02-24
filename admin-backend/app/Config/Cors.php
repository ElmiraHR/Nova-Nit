<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

/**
 * Cross-Origin Resource Sharing (CORS) Configuration
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 */
class Cors extends BaseConfig
{
    /**
     * The default CORS configuration.
     *
     * @var array{
     *      allowedOrigins: list<string>,
     *      allowedOriginsPatterns: list<string>,
     *      supportsCredentials: bool,
     *      allowedHeaders: list<string>,
     *      exposedHeaders: list<string>,
     *      allowedMethods: list<string>,
     *      maxAge: int,
     *  }
     */
    public array $default;

    public function __construct()
    {
        // ✅ Читаем API_URL из .env
        $apiUrl = getenv('API_URL') ?: 'http://localhost:8080';

        $this->default = [
            /**
             * Origins for the `Access-Control-Allow-Origin` header.
             *
             * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
             */
            'allowedOrigins' => [$apiUrl],

            /**
             * Origin regex patterns for the `Access-Control-Allow-Origin` header.
             *
             * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Origin
             */
            'allowedOriginsPatterns' => [],

            /**
             * Whether to send the `Access-Control-Allow-Credentials` header.
             *
             * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
             */
            'supportsCredentials' => true,

            /**
             * Set headers to allow.
             *
             * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers
             */
            'allowedHeaders' => [
                'Content-Type',
                'Authorization',
                'X-Requested-With',
                'X-CSRF-TOKEN',
            ],

            /**
             * Set headers to expose.
             *
             * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Expose-Headers
             */
            'exposedHeaders' => [
                'Content-Type',
                'Authorization',
            ],

            /**
             * Set methods to allow.
             *
             * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Methods
             */
            'allowedMethods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

            /**
             * Set how many seconds the results of a preflight request can be cached.
             *
             * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Max-Age
             */
            'maxAge' => 7200,
        ];
    }
}
