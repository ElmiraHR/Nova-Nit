<?php

namespace App\Controllers;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class Partners extends ResourceController
{
    use ResponseTrait;

    protected $format = 'json';

    public function index()
    {
        try {
            $db = \Config\Database::connect();

            // Таблица partner_page (или другое имя — уточни)
            $page = $db->table('partner_pages')->get()->getRowArray();

            // Таблица partners
            $partners = $db->table('partners')->get()->getResultArray();

            return $this->respond([
                'page' => $page,
                'partners' => $partners
            ]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }


    public function updatePage($id = null)
    {
        try {
            $db = \Config\Database::connect();
            $builder = $db->table('partner_pages');
    
            $request = \Config\Services::request();
    
            // Получаем данные из формы (FormData)
            $title_en = $request->getPost('title_en');
            $title_me = $request->getPost('title_me');
            $text_en = $request->getPost('text_en');
            $text_me = $request->getPost('text_me');
    
            $data = [
                'title_en' => $title_en,
                'title_me' => $title_me,
                'text_en' => $text_en,
                'text_me' => $text_me,
            ];
    
            // Обработка картинки
            $file = $request->getFile('image');
            if ($file && $file->isValid() && !$file->hasMoved()) {
                $newName = $file->getRandomName();
                $file->move(FCPATH . '../admin-backend/images/', $newName);
                $data['banner_image'] = $newName;
            }
    
            // Обновляем
            $builder->where('id', $id);
            $updated = $builder->update($data);
    
            if ($updated) {
                return $this->respond([
                    'message' => 'Page updated',
                    'data' => $data
                ]);
            } else {
                return $this->failServerError('Update failed');
            }
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }
    

    public function createPartner()
    {
        try {
            $db = \Config\Database::connect();
            $request = \Config\Services::request();
            $builder = $db->table('partners');
    
            $data = [
    'partner_page_id' => 1, // 🔥 <== Добавили эту строку!
    'name_en' => $request->getPost('name_en'),
    'name_me' => $request->getPost('name_me'),
    'text_en' => $request->getPost('text_en'),
    'text_me' => $request->getPost('text_me'),
    'instagram_link' => $request->getPost('instagram_link'),
    'facebook_link' => $request->getPost('facebook_link'),
];

    
            $file = $request->getFile('logo');
            if ($file && $file->isValid() && !$file->hasMoved()) {
                $newName = $file->getRandomName();
                $file->move(FCPATH . '../admin-backend/images/', $newName);
                $data['logo'] = $newName;
            }
    
            // ЛОГ — покажи, что реально получаем
            log_message('debug', 'CREATE PARTNER DATA: ' . print_r($data, true));
    
            $inserted = $builder->insert($data);
    
            if ($inserted) {
                $id = $db->insertID();
                return $this->respondCreated(['message' => 'Partner created', 'id' => $id]);
            } else {
                return $this->failServerError('Insert failed');
            }
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage()); // ⚠️ покажет конкретную ошибку в ответе!
        }
        
    }
    

    public function updatePartner($id = null)
{
    try {
        $db = \Config\Database::connect();
        $request = \Config\Services::request();
        $builder = $db->table('partners');

        $data = [
            'name_en' => $request->getPost('name_en'),
            'name_me' => $request->getPost('name_me'),
            'text_en' => $request->getPost('text_en'),
            'text_me' => $request->getPost('text_me'),
            'instagram_link' => $request->getPost('instagram_link'),
            'facebook_link' => $request->getPost('facebook_link'),
        ];

        $file = $request->getFile('logo');
        if ($file && $file->isValid() && !$file->hasMoved()) {
            $newName = $file->getRandomName();
            $file->move(FCPATH . '../admin-backend/images/', $newName);
            $data['logo'] = $newName;
        }

        $builder->where('id', $id);
        $builder->update($data);

        return $this->respond(['message' => 'Partner updated']);
    } catch (\Throwable $e) {
        return $this->failServerError($e->getMessage());
    }
}

public function deletePartner($id = null)
{
    try {
        if (!$id) {
            return $this->fail('No partner ID provided');
        }

        $db = \Config\Database::connect();
        $builder = $db->table('partners');

        $builder->where('id', $id);
        $deleted = $builder->delete();

        if ($deleted) {
            return $this->respondDeleted(['message' => 'Partner deleted']);
        } else {
            return $this->failServerError('Delete failed');
        }
    } catch (\Throwable $e) {
        return $this->failServerError($e->getMessage());
    }
}


}
