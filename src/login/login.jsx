import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook from react-router-dom

export function Login() {
  const navigate = useNavigate(); // Create an instance of useNavigate

  // Function to handle button click and navigate to the rate page
  const handleGetStarted = (e) => {
    e.preventDefault(); // Prevent form submission
    navigate('/rate'); // Navigate to the rate page
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
              <input type="email" id="email" name="varEmail" />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password: </label>
              <input type="password" id="password" name="varPassword" />
            </div>
            {/* Updated button to use the handleGetStarted function */}
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
