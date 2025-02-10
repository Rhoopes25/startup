import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
    return (
      <div className='body bg-dark text-light'>
        <header>
        <h1>Emotional Check-In</h1>
        <nav>
          <a href="index.html">Login page</a>
          <a href="rate.html">Log Emotions</a>
          <a href="journal.html">Journal</a>
        </nav>
      </header>
  
        <main>App components go here</main>
  
        <footer className='custom-footer'>
          <div className='container-fluid'>
            <span className='text-reset'>Rachel Hoopes </span>
            <a className='text-reset' href='https://github.com/Rhoopes25/startup'>
              Github
            </a>
          </div>
        </footer>
      </div>
    );
  }