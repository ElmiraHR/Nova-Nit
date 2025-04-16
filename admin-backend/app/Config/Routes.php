<?php

use Config\Database;

$routes->setAutoRoute(false); // Безопасность

// ✅ Проверка БД
$routes->get('/db-test', 'DbTest::index');

// ✅ Капча
$routes->get('/captcha', 'Login::captcha');

// ✅ Страница логина
$routes->get('/login', 'Login::index');

// ✅ API для логина с фронта
$routes->options('/api/login', 'Login::auth');
$routes->post('/api/login', 'Login::auth');

// ✅ Главная страница админки
$routes->get('/admin', 'Admin::index');

// ✅ Выход из системы
$routes->get('/logout', 'Login::logout');


// ✅ API для страниц
$routes->group('api', function($routes) {
    $routes->get('pages', 'Pages::index');
    $routes->get('pages/(:segment)', 'PageController::getPage/$1');
    $routes->post('pages/(:segment)', 'PageController::updatePage/$1');
});

$routes->group('api', function($routes) {
    $routes->get('logo', 'LogoController::getLogo');
    $routes->post('logo/update', 'LogoController::updateLogo');
});

// ✅ Обработка OPTIONS-запросов (CORS Preflight)
$routes->options('api/(:any)', 'Home::options');

// ✅ Отдача изображений
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
$routes->get('images/(:any)', function ($fileName) {
    $path = FCPATH . '../admin-backend/images/' . $fileName;
    if (file_exists($path)) {
        return \CodeIgniter\HTTP\Response::download($path, null)->setFileName($fileName)->setContentType(mime_content_type($path));
    }
    return \CodeIgniter\HTTP\Response::setStatusCode(404);
});

// ✅ Обновление bodyinfo и partners
$routes->put('/api/pages/bodyinfo/(:segment)', 'PageController::updateBodyInfo/$1');
$routes->post('/api/pages/partners/(:segment)', 'PageController::updatePartners/$1');

// ✅ Mission
$routes->group('api', function($routes) {
    $routes->get('mission/(:segment)', 'MissionController::getMission/$1');
    $routes->post('mission/(:segment)', 'MissionController::updateMission/$1');
    $routes->put('mission/(:segment)', 'MissionController::updateMission/$1');
    $routes->delete('mission/(:segment)', 'MissionController::deleteMission/$1');
});

// ✅ HowDoesWork
$routes->group('api', function($routes) {
    $routes->get('howdoeswork', 'HowDoesWorkController::getHowDoesWork');
    $routes->post('howdoeswork', 'HowDoesWorkController::updateHowDoesWork/howdoeswork');
    $routes->put('howdoeswork', 'HowDoesWorkController::updateHowDoesWork/howdoeswork');
    $routes->delete('howdoeswork', 'HowDoesWorkController::deleteHowDoesWork/howdoeswork');
});

// ✅ Partners
$routes->group('api', function($routes) {
    $routes->get('partners', 'Partners::index');
    $routes->post('partners/page/update/(:num)', 'Partners::updatePage/$1');
    $routes->post('partners/create', 'Partners::createPartner');
    $routes->post('partners/update/(:num)', 'Partners::updatePartner/$1');
    $routes->delete('partners/delete/(:num)', 'Partners::deletePartner/$1');
});

// ✅ Get Involved
$routes->group('api/getinvolved', function($routes) {
    $routes->get('/', 'GetInvolvedImageController::index');
    $routes->post('upload', 'GetInvolvedImageController::upload');
    $routes->delete('(:num)', 'GetInvolvedImageController::delete/$1');
});

// ✅ Contact Image
$routes->group('api/contact-image', function($routes) {
    $routes->get('/', 'ContactImageController::index');
    $routes->post('upload', 'ContactImageController::upload');
});

// ✅ All Images
$routes->group('api', function($routes) {
    $routes->get('all-images', 'AllImagesController::index');
    $routes->delete('all-images/(:any)', 'AllImagesController::delete/$1');
});

// ✅ FAQ
$routes->group('api', function($routes) {
    $routes->get('faq-image', 'FaqImageController::index');
    $routes->post('faq-image/upload', 'FaqImageController::upload');
});

// ✅ Volunteer
$routes->group('api/volunteer', function($routes) {
    $routes->get('/', 'VolunteerController::index');
    $routes->post('page/update/(:num)', 'VolunteerController::updatePage/$1');
    $routes->post('create', 'VolunteerController::createVolunteer');
    $routes->post('update/(:num)', 'VolunteerController::updateVolunteer/$1');
    $routes->delete('delete/(:num)', 'VolunteerController::deleteVolunteer/$1');
    $routes->post('volunteer/update', 'VolunteerController::update');
    $routes->post('update', 'VolunteerController::update');
    $routes->post('api/volunteer/update', 'VolunteerController::update');
    $routes->post('api/volunteer/update/(:num)', 'VolunteerController::updateVolunteer/$1');
});
