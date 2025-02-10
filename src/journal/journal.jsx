import React from 'react';
import './journal.css';


import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation

export function Journal() {
  const navigate = useNavigate();  // Using the useNavigate hook to handle navigation
  
  const handleSave = () => {
    navigate('/breathe'); // Navigates to the 'breathe' route
  };

  return (
    <main className="d-flex flex-column justify-content-center align-items-center text-center flex-grow-1">
      <section className="bg-overlay">
        <h2>Want to share more about how you are feeling?</h2>
        <textarea 
          id="textarea" 
          name="varTextarea" 
          rows="50" 
          cols="50" 
          className="cute-textarea"
        ></textarea><br />
        <button 
          className="custom-btn btn-3" 
          onClick={handleSave}  // React event handler
        >
          <span>Save</span>
        </button>
      </section>
    </main>
  );
}
