<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class PageController extends ResourceController
{
    public function getPage($slug)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('pages');

        // Поиск страницы по slug
        $page = $builder->where('slug', $slug)->get()->getRowArray();

        if ($page) {
            header('Access-Control-Allow-Origin: *');
            return $this->respond($page);
        } else {
            header('Access-Control-Allow-Origin: *');
            return $this->respond(['status' => 'error', 'message' => 'Page not found'], 404);
        }
    }

    // Обновление страницы с загрузкой файла через POST
    public function updatePage($slug)
{
    $db = \Config\Database::connect();
    $request = \Config\Services::request();

    // Получаем файл
    $file = $this->request->getFile('image');

    if ($file && $file->isValid() && !$file->hasMoved()) {
        // Генерируем хешированное имя
        $newName = $file->getRandomName();
        $file->move(FCPATH . '../admin-backend/images/', $newName);

        // Сохраняем хешированное имя в БД
        $db->table('pages')->where('slug', $slug)->update([
            'hero_image_path' => '/images/' . $newName
        ]);

        return $this->respond([
            'status' => 'success',
            'hero_image_path' => '/images/' . $newName
        ]);
    } else {
        return $this->fail('File upload failed', 400);
    }
}

    

}
