import React, { useEffect, useState } from 'react';
import './rate.css';
import { useNavigate } from 'react-router-dom';

const quotes = {
  Angry: "It's okay to feel angry. Give yourself a moment to step away and regain your composure. Take a deep breath, exhale slowly, and allow yourself to cool down.",
  Sad: "It's okay to feel sad. Consider talking to a trusted friend or writing down your thoughts.",
  Happy: "That's great! Take a moment to express gratitude and share your happiness with someone.",
  Stressed: "Break tasks into smaller steps and focus on one thing at a time. You don’t have to do everything at once.",
  Anxious: "Remind yourself that thoughts are not facts. Try grounding yourself by noticing three things you can see and hear around you.",
  Calm: "Calmness is a gift. Embrace the peace within you."
};

export function Rate() {
  const navigate = useNavigate();
  const [emotions, setEmotions] = useState([]);
  const [showPastEmotions, setShowPastEmotions] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState(null); // Track the selected emotion
  const [showQuote, setShowQuote] = useState(false); // Track whether to show the quote
  const userEmail = localStorage.getItem('email'); // Retrieve user email from localStorage

  useEffect(() => {
    // Load saved emotions for the logged-in user
    if (userEmail) {
      const savedEmotions = JSON.parse(localStorage.getItem(`emotions_${userEmail}`)) || [];
      setEmotions(savedEmotions);
    }
  }, [userEmail]);

  const handleClick = async (emotion) => {
    try {
      const newEmotion = { email: userEmail, emotion, date: new Date().toISOString() };
      const updatedEmotions = [...emotions, newEmotion];
      localStorage.setItem(`emotions_${userEmail}`, JSON.stringify(updatedEmotions)); // Save emotion
      setEmotions(updatedEmotions);
      setSelectedEmotion(emotion); // Set the selected emotion
      setShowQuote(true); // Show the quote
    } catch (error) {
      console.error('Error saving emotion:', error);
    }
  };

  const handleShowPastEmotions = () => {
    setShowPastEmotions(!showPastEmotions);
  };

  const handleDeleteEmotion = (date) => {
    const updatedEmotions = emotions.filter(emotion => emotion.date !== date);
    localStorage.setItem(`emotions_${userEmail}`, JSON.stringify(updatedEmotions));
    setEmotions(updatedEmotions);
  };

  const handleContinueToJournal = () => {
    navigate('/journal'); // Navigate to the journal page
  };

  return (
    <main className="d-flex flex-column justify-content-center align-items-center text-center flex-grow-1">
      <div className="bg-overlay">
        <button className="custom-btn toggle-ratings-btn" onClick={handleShowPastEmotions}>
          {showPastEmotions ? 'Hide Past Emotions' : 'Show Past Emotions'}
        </button>

        {showPastEmotions && (
          <div className="past-ratings">
            <h2>Past Emotions</h2>
            <div className="ratings-list">
              {emotions.map((emotion, index) => (
                <div key={index} className="rating-item">
                  <span className="rating-date">
                    📅 {new Date(emotion.date).toLocaleDateString()} - {emotion.emotion}
                  </span>
                  <button className="custom-btn clear-ratings-btn" onClick={() => handleDeleteEmotion(emotion.date)}>
                    Clear
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2>How are you feeling?</h2>
        <p>Track your emotions and check in with yourself regularly for better well-being.</p>
        <div className="button-group">
          <button className="custom-btn btn-3" onClick={() => handleClick('Angry')}><span>Angry</span></button>
          <button className="custom-btn btn-3" onClick={() => handleClick('Sad')}><span>Sad</span></button>
          <button className="custom-btn btn-3" onClick={() => handleClick('Happy')}><span>Happy</span></button>
          <button className="custom-btn btn-3" onClick={() => handleClick('Stressed')}><span>Stressed</span></button>
          <button className="custom-btn btn-3" onClick={() => handleClick('Anxious')}><span>Anxious</span></button>
          <button className="custom-btn btn-3" onClick={() => handleClick('Calm')}><span>Calm</span></button>
        </div>

        {/* Display the quote and "Continue to Journal" button */}
        {showQuote && selectedEmotion && (
          <div className="quote-section">
            <p className="quote-text">{quotes[selectedEmotion]}</p>
            <button className="custom-btn btn-3" onClick={handleContinueToJournal}>
              <span>Continue to Journal</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}