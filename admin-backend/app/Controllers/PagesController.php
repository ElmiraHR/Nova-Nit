<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use App\Models\PageModel;

class PagesController extends Controller
{
    public function getPageContent($slug)
    {
        $pageModel = new PageModel();

        // Получаем данные страницы по slug
        $pageData = $pageModel->getPageBySlug($slug);

        if ($pageData) {
            return $this->response->setJSON([
                'content' => $pageData['text'],
                'imageUrl' => $pageData['image_path']
            ]);
        } else {
            return $this->response->setStatusCode(404)->setJSON(['error' => 'Page not found']);
        }
    }

    public function savePageContent($slug)
    {
        $pageModel = new PageModel();

        // Получаем данные из POST-запроса
        $content = $this->request->getPost('content');
        $image = $this->request->getFile('image');

        // Здесь можно добавить логику для обработки изображения, если оно было передано

        // Обновляем контент страницы
        $pageModel->updatePageContent($slug, $content, $image);

        return $this->response->setJSON(['message' => 'Page content saved successfully']);
    }
}
