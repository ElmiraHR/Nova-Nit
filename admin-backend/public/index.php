<?php
use Slim\Factory\AppFactory;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

require __DIR__ . '/../vendor/autoload.php';

$app = AppFactory::create();

$app->get('/api/content/{page}', function (Request $request, Response $response, $args) {
    $page = $args['page'];
    $dbConfig = require __DIR__ . '/../config/database.php';
    $pdo = new PDO($dbConfig['dsn'], $dbConfig['username'], $dbConfig['password']);
    $stmt = $pdo->prepare("SELECT * FROM content WHERE page = ?");
    $stmt->execute([$page]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $response->getBody()->write(json_encode($data ?? ['error' => 'Not found']));
    return $response->withHeader('Content-Type', 'application/json');
});

$app->run();
