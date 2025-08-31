<?php
require_once 'config/config.php';
require_once 'src/Router.php';

$router = new Router();

// Define routes
$router->get('/', 'HomeController@index');
$router->get('/tools', 'ToolsController@index');
$router->get('/api/tools', 'ApiController@getTools');
$router->post('/api/convert', 'ApiController@convert');

// Handle the request
$router->dispatch();
?>
