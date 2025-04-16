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
    
        // ✅ Проверяем JSON или FormData
        $data = $request->getPost();
        if (empty($data)) {
            $data = $request->getJSON(true);
        }
    
        // ✅ Проверяем загруженный файл
        $file = $request->getFile('image');
    
        if ($file && $file->isValid() && !$file->hasMoved()) {
            $newName = $file->getRandomName();
            $file->move(FCPATH . '../admin-backend/images/', $newName);
    
            // ✅ Проверяем, какой именно раздел обновляется
            if ($slug === 'howdoeswork') {
                $data['how_work_image_path'] = '/images/' . $newName; // Фикс для How Does Work
            } else {
                $data['hero_image_path'] = '/images/' . $newName; // Для остальных страниц
            }
        }
    
        // ✅ Обновляем данные в БД
        $builder = $db->table('pages');
        $builder->where('slug', $slug);
        $builder->update($data);
    
        return $this->respond([
            'status' => 'success',
            'message' => 'Page updated successfully',
            'data' => $data
        ]);
    }
    

public function updateBodyInfo($slug)
{
    $db = \Config\Database::connect();
    $data = $this->request->getJSON();

    $builder = $db->table('pages');
    $builder->where('slug', $slug);
    $builder->update([
        'body_title_en' => $data->body_title_en,
        'body_title_me' => $data->body_title_me,
        'body_info_en' => $data->body_info_en,
        'body_info_me' => $data->body_info_me,
        'section1_en' => $data->section1_en,
        'section1_me' => $data->section1_me,
        'section2_en' => $data->section2_en,
        'section2_me' => $data->section2_me,
        'section3_en' => $data->section3_en,
        'section3_me' => $data->section3_me,
        'updated_at' => date('Y-m-d H:i:s')
    ]);

    return $this->respond(['status' => 'success', 'message' => 'Body Info updated successfully']);
}

public function updatePartners($slug)
{
    $db = \Config\Database::connect();
    $request = \Config\Services::request();

    // Получаем данные из формы
    $data = $request->getPost();
    if (empty($data)) {
        $data = $request->getJSON(true);
    }

    // 🔥 Обработка партнёрских логотипов, которые остались (после удаления)
    $existingLogos = [];

    $rawLogos = $request->getPost('partners_logos');
    if (!empty($rawLogos)) {
        $decoded = json_decode($rawLogos, true);
        if (is_array($decoded)) {
            $existingLogos = $decoded;
        }
    }

    // ✅ Обработка главного изображения (если есть)
    $file = $request->getFile('image');
    if ($file && $file->isValid() && !$file->hasMoved()) {
        $newName = $file->getRandomName();
        $file->move(FCPATH . '../admin-backend/images/', $newName);
        $data['partners_image_path'] = '/images/' . $newName;
    }

    // ✅ Обработка новых логотипов
    $logos = $request->getFileMultiple('logos');
    $newLogos = [];

    if ($logos) {
        foreach ($logos as $logo) {
            if ($logo->isValid() && !$logo->hasMoved()) {
                $logoName = $logo->getRandomName();
                $logo->move(FCPATH . '../admin-backend/images/', $logoName);
                $newLogos[] = '/images/' . $logoName;
            }
        }
    }

    // 🧠 Итоговый массив: существующие + новые
    $combinedLogos = array_merge($existingLogos, $newLogos);
    $data['partners_logos'] = json_encode($combinedLogos);

    // ✅ Обновление записи
    $builder = $db->table('pages');
    $builder->where('slug', $slug);
    $builder->update($data);

    return $this->respond(['status' => 'success', 'data' => $data]);
}


}
