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
$routes->group('api', function($routes) {
    // Получение данных
    $routes->get('howdoeswork', 'HowDoesWorkController::getHowDoesWork');

    // Обновление
    $routes->post('howdoeswork', 'HowDoesWorkController::updateHowDoesWork/howdoeswork');
    $routes->put('howdoeswork', 'HowDoesWorkController::updateHowDoesWork/howdoeswork');

    // Удаление
    $routes->delete('howdoeswork', 'HowDoesWorkController::deleteHowDoesWork/howdoeswork');
});


$routes->group('api', function($routes) {
    // ✅ Получение данных страницы партнёров (верхняя часть)
    $routes->get('partners', 'Partners::index');

    // ✅ Обновление верхней части страницы (тексты, заголовки, баннер)
    $routes->post('partners/page/update/(:num)', 'Partners::updatePage/$1');

    // ✅ Добавить партнёра
    $routes->post('partners/create', 'Partners::createPartner');

    // ✅ Обновить партнёра
    $routes->post('partners/update/(:num)', 'Partners::updatePartner/$1');

    // ✅ Удалить партнёра
    $routes->delete('partners/delete/(:num)', 'Partners::deletePartner/$1');
});
$routes->get('images/(:any)', function ($fileName) {
    $path = FCPATH . '../admin-backend/images/' . $fileName;
    if (file_exists($path)) {
        return \CodeIgniter\HTTP\Response::download($path, null)->setFileName($fileName)->setContentType(mime_content_type($path));
    }
    return \CodeIgniter\HTTP\Response::setStatusCode(404);
});

$routes->group('api/getinvolved', function($routes) {
    $routes->get('/', 'GetInvolvedImageController::index');
    $routes->post('upload', 'GetInvolvedImageController::upload');
    $routes->delete('(:num)', 'GetInvolvedImageController::delete/$1');
});


$routes->group('api/contact-image', function($routes) {
    $routes->get('/', 'ContactImageController::index');
    $routes->post('upload', 'ContactImageController::upload');
});

$routes->group('api', function($routes) {
    $routes->get('all-images', 'AllImagesController::index');
    $routes->delete('all-images/(:any)', 'AllImagesController::delete/$1');
});

$routes->group('api', function($routes) {
    $routes->get('faq-image', 'FaqImageController::index');
    $routes->post('faq-image/upload', 'FaqImageController::upload');
});
