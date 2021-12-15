<?php

class Router
{
    private $basePath = 'greetings/v1';

    private $routes = [];

    function set_base_path($base_path)
    {
        $this->basePath = $base_path;
    }

    public function add($method, $route, $callback)
    {
        $this->routes[$route] = [
            'route' => $route,
            'method' => strtoupper($method),
            'callback' => $callback
        ];
    }

    public function get($route, $callback)
    {
        $this->add('get', $route, $callback);
    }

    public function post($route, $callback)
    {
        $this->add('post', $route, $callback);
    }

    public function put($route, $callback)
    {
        $this->add('put', $route, $callback);
    }

    public function patch($route, $callback)
    {
        $this->add('patch', $route, $callback);
    }

    public function listen()
    {
        add_action('rest_api_init', function () {
            foreach($this->routes AS $route) {
                register_rest_route($this->basePath, $this->to_wp_rest_api_route($route['route']), [
                    'methods' => $route['method'],
                    'callback' => $route['callback'],
                    'args' => [
                        'foo' => [],
                    ]
                ]);
            }
        });
    }

    function to_wp_rest_api_route($route)
    {
        // Regex to match named groups from double colon (:) to slash (/)
        return preg_replace_callback("/(:[^\/]+)/", [$this, 'to_wp_rest_api_param'], $route);
    }

    function to_wp_rest_api_param($match)
    {
        // Remove the double colon
        $paramName = substr($match[0], 1);

        // Regex required: "(?P<${paramName}>:[^\/]+)"
        // Regex optional with lookahead: "(?:(?P<${paramName}>:[^\/]+))?"
        return "(?P<${paramName}>[^\/]+)";
    }
}