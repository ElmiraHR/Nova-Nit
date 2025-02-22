import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; // ✅ Убедись, что путь правильный
import AdminPanel from './components/AdminPanel/AdminPanel'; // Если админка подключена

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/adminpanel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
};

export default App;
