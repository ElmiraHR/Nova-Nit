<?php

use Config\Database;

// ✅ Проверка БД
$routes->get('/db-test', 'DbTest::index');

// ✅ Капча
$routes->get('/captcha', 'Login::captcha');

// ✅ Страница логина
$routes->get('/login', 'Login::index');

// ✅ API для логина с фронта
$routes->options('/api/login', 'Login::auth'); // Preflight-запрос для CORS
$routes->post('/api/login', 'Login::auth');

// ✅ Главная страница админки
$routes->get('/admin', 'Admin::index');

// ✅ Выход из системы
$routes->get('/logout', 'Login::logout');

$routes->setAutoRoute(false); // Безопасность

// ✅ API для страниц
$routes->group('api', function($routes) {
    $routes->get('pages', 'Pages::index');                           // Получение всех страниц
    $routes->get('pages/(:segment)', 'PageController::getPage/$1');   // ✅ Получение конкретной страницы
    $routes->post('pages/(:segment)', 'PageController::updatePage/$1');
    // ✅ Обновление страницы
});

// ✅ Обработка OPTIONS-запросов (CORS Preflight)
$routes->options('api/(:any)', 'Home::options');

$routes->get('images/(:any)', function($filename) {
    $path = FCPATH . '../admin-backend/images/' . $filename;

    if (file_exists($path)) {
        $mime = mime_content_type($path);
        header("Content-Type: " . $mime);
        readfile($path);
        exit;
    } else {
        throw \CodeIgniter\Exceptions\PageNotFoundException::forPageNotFound();
    }
});

$routes->put('/api/pages/bodyinfo/(:segment)', 'PageController::updateBodyInfo/$1');
$routes->post('/api/pages/partners/(:segment)', 'PageController::updatePartners/$1');

$routes->group('api', function($routes) {
    // Получение миссии
    $routes->get('mission/(:segment)', 'MissionController::getMission/$1');

    // Обновление миссии
    $routes->post('mission/(:segment)', 'MissionController::updateMission/$1');
    $routes->put('mission/(:segment)', 'MissionController::updateMission/$1');

    // Удаление миссии
    $routes->delete('mission/(:segment)', 'MissionController::deleteMission/$1');
});
