<?php

namespace App\Models;

use CodeIgniter\Model;

class PageModel extends Model
{
    protected $table = 'pages';
    protected $primaryKey = 'id';

    // Метод для получения страницы по slug
    public function getPageBySlug($slug)
    {
        return $this->where('slug', $slug)->first();
    }

    // Метод для обновления контента страницы
    public function updatePageContent($slug, $content, $image)
    {
        $data = [
            'text' => $content,
            // Логика для обработки изображения
            // 'image_path' => $image->getPath() 
        ];

        return $this->where('slug', $slug)->set($data)->update();
    }
}
