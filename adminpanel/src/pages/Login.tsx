import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface LoginResponse {
  status: 'success' | 'error';
  message?: string;
}

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Используем API_URL из .env
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

      // Отправляем запрос на логин
      const response = await axios.post<LoginResponse>(`${API_URL}/api/login`, {
        username,
        password,
      });

      const data = response.data;

      if (data.status === 'success') {
        // Сохраняем статус логина
        localStorage.setItem('isLoggedIn', 'true');

        // Перенаправление в админпанель
        navigate('/adminpanel');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err: any) {
      if (err?.response) {
        setError(err.response.data?.message || 'Server error');
      } else {
        setError('Unexpected error');
      }
    }
  };

  return (
    <div>
      <h2>Login to Admin Panel</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;