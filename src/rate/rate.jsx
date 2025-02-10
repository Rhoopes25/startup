import React from 'react';
import './rate.css';


import { useNavigate } from 'react-router-dom'; // Import useNavigate from React Router

export function Rate() {
  const navigate = useNavigate(); // Initialize useNavigate for handling navigation

  const handleClick = () => {
    navigate('/journal'); // Navigate to the 'journal' page when button is clicked
  };

  return (
    <main className="d-flex flex-column justify-content-center align-items-center text-center flex-grow-1">
        <div className="bg-overlay">
            <h1>How are you feeling?</h1>
            <p>Track your emotions and check in with yourself regularly for better well-being.</p>
            <div className="button-group">
                <button className="custom-btn btn-3" onClick={handleClick}><span>Angry</span></button>
                <button className="custom-btn btn-3" onClick={handleClick}><span>Sad</span></button>
                <button className="custom-btn btn-3" onClick={handleClick}><span>Happy</span></button>
                <button className="custom-btn btn-3" onClick={handleClick}><span>Stressed</span></button>
                <button className="custom-btn btn-3" onClick={handleClick}><span>Anxious</span></button>
                <button className="custom-btn btn-3" onClick={handleClick}><span>Calm</span></button>
            </div>
        </div>
    </main>
  );
}
