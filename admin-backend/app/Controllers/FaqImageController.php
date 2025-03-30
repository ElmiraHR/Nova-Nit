<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use Config\Database;

class FaqImageController extends Controller
{
    public function index()
    {
        $db = Database::connect();
        $builder = $db->table('faq_images');
        $query = $builder->orderBy('uploaded_at', 'DESC')->get()->getRow();

        return $this->response->setJSON($query ?? []);
    }

    public function upload()
    {
        $file = $this->request->getFile('image');

        if (!$file->isValid()) {
            return $this->response->setStatusCode(400)->setJSON(['error' => 'Invalid file']);
        }

        $newName = $file->getRandomName();
        $uploadPath = FCPATH . '../admin-backend/images';

        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0775, true);
        }

        $file->move($uploadPath, $newName);
        $imageUrl = 'images/' . $newName;

        $db = Database::connect();
        $db->table('faq_images')->insert(['image_url' => $imageUrl]);

        return $this->response->setJSON(['image_url' => $imageUrl]);
    }
}
