<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class HowDoesWorkController extends ResourceController
{
    public function getHowDoesWork()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('pages');
    
        // 🛠️ Поиск страницы с фиксированным slug 'howdoeswork'
        $howDoesWork = $builder->where('slug', 'howdoeswork')->get()->getRowArray();
    
        if ($howDoesWork) {
            return $this->respond($howDoesWork);
        } else {
            return $this->respond(['status' => 'error', 'message' => 'How Does Work page not found'], 404);
        }
    }
    
    public function updateHowDoesWork($slug)
    {
        $db = \Config\Database::connect();
        $request = \Config\Services::request();
    
        // Получаем данные из запроса
        $data = $request->getPost();
        if (empty($data)) {
            $data = $request->getJSON(true);
        }

        if (!$data) {
            return $this->respond(['status' => 'error', 'message' => 'No data received']);
        }
    
        // Проверяем, есть ли загружаемое изображение
        $file = $request->getFile('image');
        if ($file && $file->isValid() && !$file->hasMoved()) {
            $newName = $file->getRandomName();

            // ✅ Используем тот же путь, что и в MissionController
            $file->move(FCPATH . '../admin-backend/images/', $newName);

            $data['how_work_image_path'] = '/images/' . $newName;
        }
    
        // Обновляем запись в базе данных
        $builder = $db->table('pages');
        $builder->where('slug', $slug);
        $update = $builder->update($data);
    
        if ($update) {
            return $this->respond([
                'status' => 'success',
                'message' => 'How Does Work updated successfully',
                'data' => $data
            ]);
        } else {
            return $this->respond(['status' => 'error', 'message' => 'Failed to update How Does Work']);
        }
    }
    
    public function deleteHowDoesWork($slug)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('pages');

        $builder->where('slug', $slug);
        $deleted = $builder->delete();

        if ($deleted) {
            return $this->respond(['status' => 'success', 'message' => 'How Does Work deleted successfully']);
        } else {
            return $this->respond(['status' => 'error', 'message' => 'How Does Work not found'], 404);
        }
    }
}
