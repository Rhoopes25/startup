import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './journal.css';

export function Journal() {
  const navigate = useNavigate();
  const [journalEntry, setJournalEntry] = useState('');
  const userEmail = localStorage.getItem('email'); // Retrieve user email from localStorage

  useEffect(() => {
    // Load saved journal entry for the logged-in user
    if (userEmail) {
      const savedEntry = localStorage.getItem(`journal_${userEmail}`);
      if (savedEntry) {
        setJournalEntry(savedEntry);
      }
    }
  }, [userEmail]);

  const handleSave = () => {
    if (userEmail) {
      localStorage.setItem(`journal_${userEmail}`, journalEntry); // Save entry
    }
    navigate('/breathe'); // Navigate to the 'breathe' page
  };

  return (
    <main className="d-flex flex-column justify-content-center align-items-center text-center flex-grow-1">
      <section className="bg-overlay">
        <h2>Want to share more about how you are feeling?</h2>
        <textarea 
          id="textarea" 
          name="varTextarea" 
          rows="10" 
          cols="50" 
          className="cute-textarea"
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)} // Update state when typing
        ></textarea>
        <br />
        <button className="custom-btn btn-3" onClick={handleSave}>
          <span>Save</span>
        </button>
      </section>
    </main>
  );
}
