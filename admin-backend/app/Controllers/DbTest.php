<?php

namespace App\Controllers;
use CodeIgniter\Controller;
use Config\Database;

class DbTest extends Controller
{
    public function index()
    {
        $db = Database::connect();
        $query = $db->query("SELECT * FROM pages");
        $results = $query->getResult();
        return $this->response->setJSON($results);
    }
}
