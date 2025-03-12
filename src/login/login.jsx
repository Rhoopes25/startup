import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleGetStarted = (e) => {
    e.preventDefault();

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length === 0) {
      setError('Please enter a password.');
      return;
    }

    // Get stored users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users')) || {};

    if (storedUsers[email]) {
      // User exists, check password
      if (storedUsers[email] === password) {
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        navigate('/rate');
      } else {
        setError('Invalid email or password.');
      }
    } else {
      // New user, store credentials
      storedUsers[email] = password;
      localStorage.setItem('users', JSON.stringify(storedUsers));
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      navigate('/rate');
    }
  };

  return (
    <main className="d-flex flex-column justify-content-center align-items-center text-center flex-grow-1">
      <div className="bg-overlay">
        <h1>Welcome to Emotional Check-In</h1>
        <div className="Name">
          <h2>Login</h2>
          <form>
            <div className="input-group">
              <label htmlFor="email">Email: </label>
              <input
                type="email"
                id="email"
                name="varEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password: </label>
              <input
                type="password"
                id="password"
                name="varPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button className="custom-btn btn-3" onClick={handleGetStarted}>
              <span>Get Started</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}