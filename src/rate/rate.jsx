import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './rate.css';

export function Rate() {
  const navigate = useNavigate();
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  // Advice based on the selected emotion
  const advice = {
    Angry: "Take a moment to step away and cool down. Try writing down what’s upsetting you before reacting.",
    Sad: "It's okay to feel sad. Consider talking to a trusted friend or writing down your thoughts.",
    Happy: "That's great! Take a moment to express gratitude and share your happiness with someone.",
    Stressed: "Break tasks into smaller steps and focus on one thing at a time. You don’t have to do everything at once.",
    Anxious: "Remind yourself that thoughts are not facts. Try grounding yourself by noticing three things you can see and hear around you.",
    Calm: "Enjoy this moment of peace. Consider reflecting on what helps you feel this way."
  };

  const handleEmotionClick = (emotion) => {
    setSelectedEmotion(emotion); // Store the selected emotion
  };

  return (
    <main className="d-flex flex-column justify-content-center align-items-center text-center flex-grow-1">
      <div className="bg-overlay">
        <h1>How are you feeling?</h1>
        <p>Track your emotions and check in with yourself regularly for better well-being.</p>

        <div className="button-group">
          {Object.keys(advice).map((emotion) => (
            <button key={emotion} className="custom-btn btn-3" onClick={() => handleEmotionClick(emotion)}>
              <span>{emotion}</span>
            </button>
          ))}
        </div>

        {selectedEmotion && (
          <div className="advice-box">
            <h2>You selected: {selectedEmotion}</h2>
            <p>{advice[selectedEmotion]}</p>
            <button className="custom-btn btn-3" onClick={() => navigate('/journal')}>
              <span>Continue to Journal</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
