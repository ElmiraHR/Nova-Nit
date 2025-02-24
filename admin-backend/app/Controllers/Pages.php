<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Pages extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $db = \Config\Database::connect();
        $builder = $db->table('pages');
        $query = $builder->get();
        return $this->respond($query->getResult());
    }

    public function show($slug = null)
    {
        $db = \Config\Database::connect();
        $builder = $db->table('pages');
        $builder->where('slug', $slug);
        $query = $builder->get();

        if ($query->getNumRows() > 0) {
            return $this->respond($query->getRow());
        } else {
            return $this->failNotFound('Page not found');
        }
    }

    public function update($slug = null)
    {
        $db = \Config\Database::connect();
        $data = $this->request->getJSON();

        $builder = $db->table('pages');
        $builder->where('slug', $slug);
        $builder->update([
            'title_en' => $data->title_en,
            'title_me' => $data->title_me,
            'text_en' => $data->text_en,
            'text_me' => $data->text_me,
            'image_path' => $data->image_path,
            'updated_at' => date('Y-m-d H:i:s')
        ]);

        return $this->respond(['status' => 'success', 'message' => 'Page updated successfully']);
    }
}
