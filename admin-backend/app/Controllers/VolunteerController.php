<?php

namespace App\Controllers;
use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class VolunteerController extends ResourceController
{
    use ResponseTrait;

    protected $format = 'json';

    // ✅ Получение секций и волонтёров
    public function index()
    {
        try {
            $db = \Config\Database::connect();
            $pageData = $db->table('volunteer_page')->get()->getRowArray();
            $volunteers = $db->table('volunteers')->get()->getResultArray();

            return $this->respond([
                'page' => $pageData,
                'volunteers' => $volunteers
            ]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    // ✅ Обновление всех 3 секций
    public function updatePage($id = 1)
    {
        try {
            $db = \Config\Database::connect();
            $builder = $db->table('volunteer_page');
            $request = \Config\Services::request();
    
            $data = [
                'section1_title_en' => $request->getPost('section1_title_en'),
                'section1_title_me' => $request->getPost('section1_title_me'),
                'section1_text_en'  => $request->getPost('section1_text_en'),
                'section1_text_me'  => $request->getPost('section1_text_me'),
                'section2_title_en' => $request->getPost('section2_title_en'),
                'section2_title_me' => $request->getPost('section2_title_me'),
                'section2_text_en'  => $request->getPost('section2_text_en'),
                'section2_text_me'  => $request->getPost('section2_text_me'),
            ];
    
            // Картинки
            $img1 = $request->getFile('section1_image');
            if ($img1 && $img1->isValid() && !$img1->hasMoved()) {
                $name1 = $img1->getRandomName();
                $img1->move(FCPATH . '../admin-backend/images/', $name1);
                $data['section1_image'] = $name1;
            }
    
            $img2 = $request->getFile('section2_image');
            if ($img2 && $img2->isValid() && !$img2->hasMoved()) {
                $name2 = $img2->getRandomName();
                $img2->move(FCPATH . '../admin-backend/images/', $name2);
                $data['section2_image'] = $name2;
            }
    
            $img3 = $request->getFile('section3_image');
            if ($img3 && $img3->isValid() && !$img3->hasMoved()) {
                $name3 = $img3->getRandomName();
                $img3->move(FCPATH . '../admin-backend/images/', $name3);
                $data['section3_image'] = $name3;
            }
    
            // 👉 проверяем, есть ли запись с id = 1
            $existing = $builder->where('id', $id)->get()->getRowArray();
    
            if ($existing) {
                $builder->where('id', $id)->update($data);
            } else {
                $data['id'] = $id;
                $builder->insert($data);
            }
    
            return $this->respond([
                'message' => 'Sections updated',
                'data' => $data
            ]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }
    


    // ✅ Добавление одного волонтёра
    public function createVolunteer()
    {
        try {
            $db = \Config\Database::connect();
            $request = \Config\Services::request();
            $builder = $db->table('volunteers');

            $data = [
                'name_en' => $request->getPost('name_en'),
                'name_me' => $request->getPost('name_me'),
                'text_en' => $request->getPost('text_en'),
                'text_me' => $request->getPost('text_me'),
            ];

            $file = $request->getFile('photo');
            if ($file && $file->isValid() && !$file->hasMoved()) {
                $newName = $file->getRandomName();
                $file->move(FCPATH . '../admin-backend/images/', $newName);
                $data['photo'] = $newName;
            }

            $builder->insert($data);
            $id = $db->insertID();

            return $this->respondCreated(['message' => 'Volunteer created', 'id' => $id, 'photo' => $data['photo'] ?? null]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    // ✅ Удаление одного волонтёра
    public function deleteVolunteer($id = null)
    {
        try {
            if (!$id) return $this->fail('Volunteer ID is required');

            $db = \Config\Database::connect();
            $builder = $db->table('volunteers');
            $deleted = $builder->where('id', $id)->delete();

            if ($deleted) {
                return $this->respondDeleted(['message' => 'Volunteer deleted']);
            } else {
                return $this->failServerError('Failed to delete');
            }
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }
    public function updateVolunteer($id = null)
{
    try {
        if (!$id) return $this->fail('Volunteer ID is required');

        $db = \Config\Database::connect();
        $request = \Config\Services::request();
        $builder = $db->table('volunteers');

        $data = [
            'name_en' => $request->getPost('name_en'),
            'name_me' => $request->getPost('name_me'),
            'text_en' => $request->getPost('text_en'),
            'text_me' => $request->getPost('text_me'),
        ];

        $file = $request->getFile('photo');
        if ($file && $file->isValid() && !$file->hasMoved()) {
            $newName = $file->getRandomName();
            $file->move(FCPATH . '../admin-backend/images/', $newName);
            $data['photo'] = $newName;
        }

        $builder->where('id', $id)->update($data);

        return $this->respond(['message' => 'Volunteer updated', 'id' => $id, 'photo' => $data['photo'] ?? null]);
    } catch (\Throwable $e) {
        return $this->failServerError($e->getMessage());
    }
}

}
