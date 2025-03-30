<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class AllImagesController extends ResourceController
{
    public function index()
    {
        $directory = FCPATH . '../admin-backend/images/';
        $files = array_diff(scandir($directory), ['..', '.']);
        $imageList = [];

        foreach ($files as $file) {
            $path = $directory . $file;
            if (is_file($path)) {
                $imageList[] = [
                    'name' => $file,
                    'url' => 'images/' . $file,
                    'created_at' => date('Y-m-d H:i:s', filemtime($path))
                ];
            }
        }

        return $this->respond($imageList);
    }

    public function delete($fileName = null)
    {
        if (!$fileName) {
            return $this->failValidationError('No filename provided');
        }

        $filePath = FCPATH . '../admin-backend/images/' . $fileName;

        if (!file_exists($filePath)) {
            return $this->failNotFound('File not found');
        }

        unlink($filePath);
        return $this->respondDeleted(['message' => 'File deleted']);
    }
}
