<?php

namespace App\Controllers;

class Admin extends BaseController
{
    public function index()
    {
        $session = session();

        // Проверка авторизации
        if (!$session->get('isLoggedIn')) {
            return redirect()->to('/login');
        }

        return view('admin'); // Загрузка admin.php из папки Views
    }
}
