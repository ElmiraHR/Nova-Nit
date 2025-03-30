<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class GetInvolvedImageController extends ResourceController
{
    use ResponseTrait;

    protected $format = 'json';

    // ✅ Получение всех изображений
    public function index()
    {
        try {
            $db = \Config\Database::connect();
            $builder = $db->table('get_involved_images');
            $images = $builder->get()->getResultArray();

            return $this->respond($images);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    // ✅ Загрузка изображения
    public function upload()
    {
        try {
            $request = \Config\Services::request();
            $file = $request->getFile('image');

            if (!$file || !$file->isValid() || $file->hasMoved()) {
                return $this->fail('Invalid file');
            }

            $newName = $file->getRandomName();
            $file->move(FCPATH . '../admin-backend/images/', $newName);

            $imageUrl = 'images/' . $newName;

            $db = \Config\Database::connect();
            $builder = $db->table('get_involved_images');
            $builder->insert(['image_url' => $imageUrl]);

            return $this->respondCreated([
                'message' => 'Image uploaded',
                'image_url' => $imageUrl
            ]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    // ✅ Удаление изображения
    public function delete($id = null)
    {
        try {
            $db = \Config\Database::connect();
            $builder = $db->table('get_involved_images');

            $image = $builder->where('id', $id)->get()->getRow();

            if (!$image) {
                return $this->failNotFound('Image not found');
            }

            $imagePath = FCPATH . '../admin-backend/' . $image->image_url;
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }

            $builder->where('id', $id)->delete();

            return $this->respondDeleted(['message' => 'Image deleted']);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }
}
