import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminPanel from './components/AdminPanel/AdminPanel';

const App = () => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <Router> {/* ✅ Это единственный Router */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/adminpanel/*"
          element={isAuthenticated ? <AdminPanel /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
};

export default App;
