import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLogin from '../../Components/AuthLogin';
import '../Pages_css/LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (role) => {
    try {
      const response = await fetch('http://localhost:8000/api/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Correct token storage keys
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        // Fetch user details
        const userResponse = await fetch('http://localhost:8000/api/users/me/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();

          if (userData.role === role) {
            if (role === 'Instructor') {
              navigate('/instructor/home');
            } else if (role === 'Student') {
              navigate('/student/home');
            }
          } else {
            alert(`Login failed: You are not authorized as a ${role}.`);
          }
        } else {
          alert('Failed to fetch user details.');
        }
      } else {
        alert('Invalid username or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <h1>Welcome to Project Management System</h1>
        <h2>Login</h2>
        <form>
          <div className="form-group">
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </label>
          </div>
        </form>
        <button
          onClick={() => handleLogin('Instructor')} // For testing Instructor login
          className="login-button"
        >
          Login as Instructor
        </button>
        <button
          onClick={() => handleLogin('Student')} // For testing Student login
          className="login-button"
        >
          Login as Student
        </button>
      </div>
    </div>
  );
}

export default LoginPage;

