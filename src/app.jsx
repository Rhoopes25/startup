import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { Login } from './login/login';
import { Breathe } from './breathe/breathe';
import { Rate } from './rate/rate';
import { Journal } from './journal/journal';

function App() {
  const location = useLocation(); // Get the current location
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    if (email && password) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className='body bg-dark text-light'>
      <header>
        <h1>Emotional Check-In</h1>
        {location.pathname !== '/' && isLoggedIn && ( // Conditionally render the nav
          <nav>
            <NavLink className='nav-link' to='/'>Login Page</NavLink>
            <NavLink className='nav-link' to='/rate'>Log Emotions</NavLink>
            <NavLink className='nav-link' to='/journal'>Journal</NavLink>
            <NavLink className='nav-link' to='/breathe'>Breathe</NavLink>
          </nav>
        )}
      </header>

      <main>
        <Routes>
          <Route path='/' element={<Login />} />
          {isLoggedIn ? (
            <>
              <Route path='/rate' element={<Rate />} />
              <Route path='/journal' element={<Journal />} />
              <Route path='/breathe' element={<Breathe />} />
              <Route path='/play' element={<h2>Play Page</h2>} />
            </>
          ) : (
            <Route path='*' element={<Navigate to='/' />} />
          )}
        </Routes>
      </main>

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

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function NotFound() {
  return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}