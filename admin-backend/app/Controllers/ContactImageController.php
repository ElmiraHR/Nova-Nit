<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class ContactImageController extends ResourceController
{
    use ResponseTrait;

    public function index()
    {
        $db = \Config\Database::connect();
        $row = $db->table('contact_images')->get()->getRow();

        return $this->respond($row ? ['image_url' => $row->image_url, 'id' => $row->id] : []);
    }

    public function upload()
    {
        $request = \Config\Services::request();
        $file = $request->getFile('image');

        if (!$file->isValid()) {
            return $this->failValidationError('Файл недействителен');
        }

        $newName = $file->getRandomName();
        $file->move(FCPATH . '../admin-backend/images/', $newName);

        $imageUrl = 'images/' . $newName;
        $db = \Config\Database::connect();
        $builder = $db->table('contact_images');

        // Удаляем старую картинку
        $old = $builder->get()->getRow();
        if ($old && file_exists(FCPATH . '../admin-backend/' . $old->image_url)) {
            unlink(FCPATH . '../admin-backend/' . $old->image_url);
        }

        $builder->truncate(); // Очищаем
        $builder->insert(['image_url' => $imageUrl]);

        return $this->respond(['message' => 'Uploaded', 'image_url' => $imageUrl]);
    }
}
