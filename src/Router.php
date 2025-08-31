<?php
class Router {
    private $routes = [];
    
    public function get($path, $handler) {
        $this->routes['GET'][$path] = $handler;
    }
    
    public function post($path, $handler) {
        $this->routes['POST'][$path] = $handler;
    }
    
    public function dispatch() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        if (isset($this->routes[$method][$path])) {
            $handler = $this->routes[$method][$path];
            list($controller, $method) = explode('@', $handler);
            
            require_once "src/controllers/{$controller}.php";
            $controllerInstance = new $controller();
            $controllerInstance->$method();
        } else {
            http_response_code(404);
            include 'public/404.html';
        }
    }
}
?>
