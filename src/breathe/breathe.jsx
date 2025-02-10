import React from 'react';
import './breathe.css';


export function Breathe() {
  return (
    <main className="d-flex flex-column justify-content-center align-items-center text-center flex-grow-1">
      <section className="bg-overlay">
        <h2>Box Breathing Method</h2>
        <h3>What is Box Breathing?</h3>
        <p>
          Box breathing is a simple and effective breathing technique designed to promote calmness and reduce stress.
          It's called "box breathing" because you breathe in a rhythmic pattern of four equal steps—inhale, hold, exhale, 
          and hold again. Each step takes a count of four seconds, creating a “box” pattern.
        </p>
        <section className="bg-overlay pink-box">
          <h3>How to Practice Box Breathing:</h3>
          <ol>
            <li>Inhale slowly for 4 seconds.</li>
            <li>Hold your breath for 4 seconds.</li>
            <li>Exhale slowly for 4 seconds.</li>
            <li>Hold your breath for 4 seconds.</li>
          </ol>
          <p>
            Repeat this cycle for several minutes to help center your mind, reduce stress, and improve focus.
          </p>
        </section>
      </section>

      <section className="bg-overlay">
        <h2>Take a moment to breathe</h2>
        <img 
          alt="breathe" 
          src="https://sleepopolis.com/wp-content/uploads/2023/05/Box-Breathing-1-1536x864.jpg" 
          width="400" 
          height="225" 
          className="image-border"
        />
      </section>
    </main>
  );
}

