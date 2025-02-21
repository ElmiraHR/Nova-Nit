<?php

use Config\Database;
$routes->get('/db-test', 'DbTest::index');
$routes->get('/login', 'Login::index');
$routes->post('/login/auth', 'Login::auth');
$routes->get('/logout', 'Login::logout');
$routes->setAutoRoute(false);

$routes->get('/captcha', 'Login::captcha');
$routes->get('/admin', 'Admin::index');


$routes->get('/test-db', function () {
    $db = \Config\Database::connect();
    $query = $db->query("SELECT * FROM pages");
    $results = $query->getResult();
    return json_encode($results);
});
