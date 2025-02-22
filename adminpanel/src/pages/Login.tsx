import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

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
      const response = await axios.post<LoginResponse>('http://localhost:8080/api/login', {
        username,
        password,
      });

      if (response.data.status === 'success') {
        navigate('/adminpanel');
      } else {
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (err: unknown) {
      // ✅ Обход без isAxiosError
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Server error');
      } else if (err instanceof Error) {
        setError(err.message);
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
