import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Pages_css/RegisterPage.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/users/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (response.ok) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-card">
        <h1>Register</h1>
        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                required
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
                required
              />
            </label>
          </div>
          <div className="form-group">
            <label>
              Role:
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-input"
                required
              >
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
              </select>
            </label>
          </div>
          <button type="submit" className="register-button">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
