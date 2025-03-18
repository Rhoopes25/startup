import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './journal.css';

export function Journal() {
  const navigate = useNavigate();
  const [journalEntry, setJournalEntry] = useState('');
  const [pastJournals, setPastJournals] = useState([]);
  const [showPastJournals, setShowPastJournals] = useState(false);
  const userEmail = localStorage.getItem('email'); // Retrieve user email from localStorage

  // Fix in your useEffect to fetch journals
React.useEffect(() => {
  // Make sure to include the email parameter in the URL
  fetch(`/api/journals?email=${userEmail}`)
    .then((response) => response.json())
    .then((journals) => {
      setPastJournals(journals);
    })
    .catch((error) => {
      console.error('Error fetching journals:', error);
    });
}, [userEmail]); // Add userEmail as a dependency

// Fix in your handleSave function to include email
const handleSave = async() => {
  try {
    const newJournal = { 
      email: userEmail, 
      entry: journalEntry, 
      date: new Date().toISOString() 
    };
    await fetch('/api/journals', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(newJournal),
    });
    const updatedJournals = [...pastJournals, newJournal];
    setPastJournals(updatedJournals);
    setJournalEntry('');
    navigate('/breathe');
  } catch(error){
    console.error('Error saving journal:', error);
  }
};

  const handleShowPastJournals = () => {
    setShowPastJournals(!showPastJournals);
  };

  const handleJournalClick = (journal) => {
    setJournalEntry(journal.entry);
  };

  const handleClearJournal = async (date) => {
    try {
      // Update the server
      await fetch('/api/journals', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: userEmail, date }),
      });
      
      // Update the local state
      const updatedJournals = pastJournals.filter(journal => journal.date !== date);
      setPastJournals(updatedJournals);
      setJournalEntry(''); // Clear the text area if the current entry is deleted
    } catch (error) {
      console.error('Error deleting journal:', error);
    }
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