<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\API\ResponseTrait;

class LogoController extends ResourceController
{
    use ResponseTrait;

    protected $format = 'json';

    public function getLogo()
    {
        try {
            $db = \Config\Database::connect();
            $logo = $db->table('logos')->where('id', 1)->get()->getRowArray();

            return $this->respond($logo);
        } catch (\Throwable $e) {
            return $this->failServerError('Ошибка при получении логотипа: ' . $e->getMessage());
        }
    }

    public function updateLogo()
    {
        try {
            $request = \Config\Services::request();
            $db = \Config\Database::connect();
            $data = [];

            $uploadPath = FCPATH . '../admin-backend/images/';
            if (!is_dir($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }

            // dark_logo
            $darkFile = $request->getFile('dark_logo');
            if ($darkFile && $darkFile->isValid() && !$darkFile->hasMoved()) {
                $darkName = 'dark_' . $darkFile->getRandomName();
                if ($darkFile->move($uploadPath, $darkName)) {
                    $data['dark_logo'] = 'images/' . $darkName;
                    log_message('debug', 'Сохранён dark_logo: ' . $darkName);
                } else {
                    return $this->failServerError('Ошибка при сохранении dark_logo');
                }
            }

            // light_logo
            $lightFile = $request->getFile('light_logo');
            if ($lightFile && $lightFile->isValid() && !$lightFile->hasMoved()) {
                $lightName = 'light_' . $lightFile->getRandomName();
                if ($lightFile->move($uploadPath, $lightName)) {
                    $data['light_logo'] = 'images/' . $lightName;
                    log_message('debug', 'Сохранён light_logo: ' . $lightName);
                } else {
                    return $this->failServerError('Ошибка при сохранении light_logo');
                }
            }

            if (!empty($data)) {
                $db->table('logos')->where('id', 1)->update($data);
            }

            return $this->respond(['message' => 'Логотипы обновлены']);
        } catch (\Throwable $e) {
            log_message('error', 'Ошибка при обновлении логотипов: ' . $e->getMessage());
            return $this->failServerError('Ошибка сервера: ' . $e->getMessage());
        }
    }
}
