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

$routes->setAutoRoute(false); // Оставляем false для безопасности
