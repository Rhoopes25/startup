import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is already logged in
    const storedEmail = localStorage.getItem('email');
    const storedPassword = localStorage.getItem('password');
    if (storedEmail && storedPassword) {
      setIsLoggedIn(true);
    }
  }, []);

  // Function to handle button click and navigate to the rate page
  const handleGetStarted = (e) => {
    e.preventDefault(); // Prevent form submission

    // Validate email and password
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length === 0) {
      setError('Please enter a password.');
      return;
    }

    // Store email and password in local storage
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
    setIsLoggedIn(true); // Update state

    // Clear error and navigate to the rate page
    setError('');
    navigate('/rate');
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
            <button
              className="custom-btn btn-3"
              onClick={handleGetStarted} // On click, call handleGetStarted
            >
              <span>Get Started</span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
