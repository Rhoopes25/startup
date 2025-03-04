import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './journal.css';

export function Journal() {
  const navigate = useNavigate();
  const [journalEntry, setJournalEntry] = useState('');
  const [pastJournals, setPastJournals] = useState([]);
  const [showPastJournals, setShowPastJournals] = useState(false);
  const userEmail = localStorage.getItem('email'); // Retrieve user email from localStorage

  useEffect(() => {
    // Load saved journal entries for the logged-in user
    if (userEmail) {
      const savedJournals = JSON.parse(localStorage.getItem(`journals_${userEmail}`)) || [];
      setPastJournals(savedJournals);
    }
  }, [userEmail]);

  const handleSave = () => {
    if (userEmail) {
      const newJournal = { entry: journalEntry, date: new Date().toISOString() };
      const updatedJournals = [...pastJournals, newJournal];
      localStorage.setItem(`journals_${userEmail}`, JSON.stringify(updatedJournals)); // Save entry
      setPastJournals(updatedJournals);
      setJournalEntry(''); // Clear the text area
    }
    navigate('/breathe'); // Navigate to the 'breathe' page
  };

  const handleShowPastJournals = () => {
    setShowPastJournals(!showPastJournals);
  };

  const handleJournalClick = (journal) => {
    setJournalEntry(journal.entry);
  };

  const handleClearJournal = (date) => {
    const updatedJournals = pastJournals.filter(journal => journal.date !== date);
    localStorage.setItem(`journals_${userEmail}`, JSON.stringify(updatedJournals));
    setPastJournals(updatedJournals);
    setJournalEntry(''); // Clear the text area if the current entry is deleted
  };

  return (
    <main className="d-flex flex-column justify-content-center align-items-center text-center flex-grow-1">
      <section className="bg-overlay">
        <button className="custom-btn toggle-journals-btn" onClick={handleShowPastJournals}>
          {showPastJournals ? 'Hide Past Journals' : 'Show Past Journals'}
        </button>

        {showPastJournals && (
          <div className="past-journals">
            <h2>Past Journals</h2>
            <div className="journals-list">
              {pastJournals.map((journal, index) => (
                <div key={index} className="journal-item">
                  <span className="journal-date" onClick={() => handleJournalClick(journal)}>
                    📅 {new Date(journal.date).toLocaleDateString()}
                  </span>
                  <button className="custom-btn clear-journal-btn" onClick={() => handleClearJournal(journal.date)}>
                    Clear
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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

