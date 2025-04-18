import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Only redirect if explicitly logged in
    if (storedEmail && isLoggedIn) {
      navigate('/rate');
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!validateInputs()) return;
  
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
  
    if (res.ok) {
      // Save email to localStorage
      localStorage.setItem('email', email);
      // Set isLoggedIn flag
      localStorage.setItem('isLoggedIn', 'true');
      // Navigate to rate page
      navigate('/rate');
    } else {
      setError('Invalid email or password.');
    }
  };
  
  const handleRegister = async () => {
    if (!validateInputs()) return;
  
    const res = await fetch('/api/auth/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    if (res.ok) {
      // Save email to localStorage
      localStorage.setItem('email', email);
      // Set isLoggedIn flag
      localStorage.setItem('isLoggedIn', 'true');
      // Navigate to rate page
      navigate('/rate');
    } else {
      setError('Registration failed. Please try again.');
    }
  };
  
  const validateInputs = () => {
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (password.length === 0) {
      setError('Please enter a password.');
      return false;
    }

    return true;
  };

  return (
    <main className="d-flex flex-column justify-content-center align-items-center text-center flex-grow-1">
      <div className="bg-overlay">
        <h1>Welcome to Emotional Check-In</h1>
        <div className="Name">
          <h2>Login</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <label htmlFor="email">Email: </label>
              <input
                type="email"
                id="email"
                name="varEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                required
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button
              type="button"
              className="custom-btn btn-3"
              onClick={handleLogin}
              disabled={!(email && password)}
            >
              <span>Login</span>
            </button>
            <button
              type="button"
              className="custom-btn btn-3"
              onClick={handleRegister}
              disabled={!(email && password)}
            >
              <span>Register</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}