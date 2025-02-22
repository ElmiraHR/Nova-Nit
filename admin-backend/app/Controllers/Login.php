<?php

namespace App\Controllers;

class Login extends BaseController
{
    public function index()
    {
        return view('login'); // ✅ Загружает страницу логина
    }

    public function captcha()
    {
        $session = session();
        $code = rand(1000, 9999);
        $session->set('captcha', $code);

        header('Content-Type: image/png');
        $image = imagecreate(100, 40);
        $bgColor = imagecolorallocate($image, 255, 255, 255);
        $textColor = imagecolorallocate($image, 0, 0, 0);
        imagestring($image, 5, 20, 10, $code, $textColor);
        imagepng($image);
        imagedestroy($image);
    }

    public function auth()
    {
        $session = session();
        $request = \Config\Services::request();
    
        // ✅ Заголовки для CORS
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    
        // ✅ Ответ на preflight-запрос OPTIONS
        if ($request->getMethod() === 'options') {
            return $this->response->setStatusCode(200);
        }
    
        // ✅ Обработка логина
        $json = $request->getJSON(true); // Получаем JSON как массив
        $username = $json['username'] ?? '';
        $password = md5($json['password'] ?? '');
        
    
        $db = \Config\Database::connect();
        $query = $db->query("SELECT * FROM users WHERE username = ? AND password = ?", [$username, $password]);
        $user = $query->getRow();
    
        if ($user) {
            // Устанавливаем сессии
            $session->set('isLoggedIn', true);
            $session->set('username', $user->username);
    
            // Редирект на админ-панель фронтенда
            return $this->response
                ->setStatusCode(200)
                ->setJSON(['status' => 'success', 'redirect' => 'http://localhost:3000/adminpanel']); // Путь на фронтенде
        } else {
            return $this->response
                ->setStatusCode(401)
                ->setJSON(['status' => 'error', 'message' => 'Invalid credentials']);
        }
    }
    
    public function logout()
    {
        $session = session();
        $session->destroy();
        return redirect()->to('/login');
    }
}
