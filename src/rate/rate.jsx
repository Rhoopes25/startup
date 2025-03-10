import React, { useEffect, useState } from 'react';
import './rate.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const quotes = {
  Angry: "It's okay to feel angry. Take a deep breath and let it out.",
  Sad: "It's alright to feel sad. Remember, it's just a passing emotion.",
  Happy: "Happiness is a wonderful feeling. Enjoy the moment!",
  Stressed: "Feeling stressed? Take a break and relax.",
  Anxious: "Anxiety is tough, but you're tougher. Take it one step at a time.",
  Calm: "Calmness is a gift. Embrace the peace within you."
};

export function Rate() {
  const navigate = useNavigate();
  const [emotions, setEmotions] = useState([]);
  const [showPastEmotions, setShowPastEmotions] = useState(false);
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
      alert(quotes[emotion]); // Display the quote
      navigate('/journal'); // Navigate to the journal page
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
      </div>
    </main>
  );
}