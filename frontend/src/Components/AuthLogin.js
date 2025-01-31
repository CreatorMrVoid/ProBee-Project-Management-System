import React from 'react';
import '../Components/AuthLogin.css';

function AuthLogin({ username, password, onLogin }) {
  const handleLogin = (role) => {
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }
    onLogin(role); // Pass the role to the login handler
  };

  return (
    <div className="button-group">
      <button onClick={() => handleLogin('Instructor')} className="login-button">Instructor Login</button>
      <button onClick={() => handleLogin('Student')} className="login-button">Student Login</button>
    </div>
  );
}

export default AuthLogin;
