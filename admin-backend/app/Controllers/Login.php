<?php

namespace App\Controllers;

class Login extends BaseController
{
    public function index()
    {
        return view('login'); // Отображает страницу логина
    }

    public function captcha()
    {
        $session = session();
        
        // ✅ Генерируем капчу только если она еще не создана
        if (!$session->has('captcha')) {
            $code = rand(1000, 9999);
            $session->set('captcha', $code);
        } else {
            $code = $session->get('captcha');
        }
    
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
    
        $username = $request->getPost('username');
        $password = md5($request->getPost('password'));
        $captchaInput = $request->getPost('captcha');
        $captchaSession = $session->get('captcha');
    
        if ((string)$captchaInput !== (string)$captchaSession) {
            $session->setFlashdata('msg', 'Неверная капча');
            return redirect()->to('/login');
        }
        
    
        $session->remove('captcha'); // Чистим капчу после проверки
    
        $db = \Config\Database::connect();
        $query = $db->query("SELECT * FROM users WHERE username = ? AND password = ?", [$username, $password]);
        $user = $query->getRow();
    
        if ($user) {
            $session->set('isLoggedIn', true);
            $session->set('username', $user->username);
    
            // Чистим кеш браузера после логина
            header("Cache-Control: no-cache, no-store, must-revalidate");
            header("Pragma: no-cache");
            header("Expires: 0");
    
            return redirect()->to(base_url('admin'));

        } else {
            $session->setFlashdata('msg', 'Неверный логин или пароль');
            return redirect()->to('/login');
        }
    }
    

    public function logout()
    {
        $session = session();
        $session->destroy(); // Удаление сессии
    
        // Очистка кэша браузера
        header("Cache-Control: no-cache, no-store, must-revalidate");
        header("Pragma: no-cache");
        header("Expires: 0");
    
        // Принудительный редирект на страницу логина
        return redirect()->to('/login')->withHeaders([
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }
    
    
    
}
