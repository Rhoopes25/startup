import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Unauthenticated } from './unauthenticated';
import { Authenticated } from './authenticated';
import { AuthState } from './authState';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleGetStarted = async (e) => {
    e.preventDefault();

    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length === 0) {
      setError('Please enter a password.');
      return;
    }

    try {
      const response = await axios.post('/api/auth/login', { email, password });

      if (response.data.success) {
        localStorage.setItem('email', email);
        localStorage.setItem('token', response.data.token); // Store token instead of password
        navigate('/rate');
      } else {
        setError('Invalid email or password.');
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setError(`Error: ${error.response.data.msg}`);
      } else if (error.request) {
        // Request was made but no response received
        setError('No response from server. Please try again.');
      } else {
        // Something else happened
        setError(`Error: ${error.message}`);
      }
    }
  };

  return (
    <main className="d-flex flex-column justify-content-center align-items-center text-center flex-grow-1">
      <div className="bg-overlay">
        <h1>Welcome to Emotional Check-In</h1>
        <div className="Name">
          <h2>Login</h2>
          <form onSubmit={handleGetStarted}>
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
            <button className="custom-btn btn-3" type="submit">
              <span>Get Started</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}