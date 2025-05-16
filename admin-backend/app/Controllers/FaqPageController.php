<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use Config\Database;

class FaqPageController extends Controller
{
    public function index()
    {
        $db = Database::connect();
        $builder = $db->table('faq_page');
        $faqs = $builder->orderBy('`order`', 'ASC')->get()->getResult();

        return $this->response->setJSON($faqs);
    }

    public function update()
    {
        $db = Database::connect();
        $builder = $db->table('faq_page');

        $data = $this->request->getJSON(true); // получаем как ассоц. массив

        if (!isset($data['faqs']) || !is_array($data['faqs'])) {
            return $this->response->setStatusCode(400)->setJSON(['error' => 'Invalid data']);
        }

        foreach ($data['faqs'] as $faq) {
            if (!isset($faq['id'])) continue;

            $builder->where('id', $faq['id'])->update([
                'question_en' => $faq['question_en'] ?? '',
                'question_me' => $faq['question_me'] ?? '',
                'answer_en'   => $faq['answer_en'] ?? '',
                'answer_me'   => $faq['answer_me'] ?? ''
            ]);
        }

        return $this->response->setJSON(['message' => 'FAQ updated successfully']);
    }
}
