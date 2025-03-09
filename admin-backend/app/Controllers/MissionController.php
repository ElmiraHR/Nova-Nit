<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class MissionController extends ResourceController
{
    public function getMission($slug)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('pages');

        // Поиск страницы по slug
        $mission = $builder->where('slug', $slug)->get()->getRowArray();

        if ($mission) {
            header('Access-Control-Allow-Origin: *');
            return $this->respond($mission);
        } else {
            header('Access-Control-Allow-Origin: *');
            return $this->respond(['status' => 'error', 'message' => 'Mission not found'], 404);
        }
    }

    public function updateMission($slug)
    {
        $db = \Config\Database::connect();
        $request = \Config\Services::request();
    
        // Получаем данные из запроса
        $data = $request->getPost();
        if (empty($data)) {
            $data = $request->getJSON(true);
        }
    
        // Проверяем, пришли ли данные
        if (!$data) {
            return $this->respond(['status' => 'error', 'message' => 'No data received']);
        }
    
        // Проверка на наличие файла
        $file = $request->getFile('image');
    
        if ($file && $file->isValid() && !$file->hasMoved()) {
            $newName = $file->getRandomName();
            $file->move(FCPATH . '../admin-backend/images/', $newName);
            $data['mission_image_path'] = '/images/' . $newName;
        }
    
        // Обновляем данные в БД
        $builder = $db->table('pages');
        $builder->where('slug', $slug);
        $update = $builder->update($data);
    
        if ($update) {
            return $this->respond([
                'status' => 'success',
                'message' => 'Mission updated successfully',
                'data' => $data
            ]);
        } else {
            return $this->respond(['status' => 'error', 'message' => 'Failed to update mission']);
        }
    }

    public function deleteMission($slug)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('pages');

        $builder->where('slug', $slug);
        $deleted = $builder->delete();

        if ($deleted) {
            return $this->respond(['status' => 'success', 'message' => 'Mission deleted successfully']);
        } else {
            return $this->respond(['status' => 'error', 'message' => 'Mission not found'], 404);
        }
    }
}
