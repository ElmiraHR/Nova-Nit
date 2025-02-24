<?php
// router.php

// Путь к файлу, который запрашивает браузер
$requested = $_SERVER["REQUEST_URI"];

// Путь к папке с картинками
$imagePath = __DIR__ . '/admin-backend/images' . $requested;

// Если файл существует в папке images, отдаем его напрямую
if (file_exists($imagePath) && is_file($imagePath)) {
    $mime = mime_content_type($imagePath);
    header("Content-Type: $mime");
    readfile($imagePath);
    exit;
}

// Иначе — стандартный PHP роутинг
return false;
?>
