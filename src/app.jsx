import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { Login } from './login/login';
import { Breathe } from './breathe/breathe';
import { Rate } from './rate/rate';
import { Journal } from './journal/journal';
import { AuthState } from "./login/authState";

function App() {
  const location = useLocation();
  const [authState, setAuthState] = useState(AuthState.Unknown);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem('email');
    if (email) {
      setAuthState(AuthState.Authenticated);
      setUserName(email);
    } else {
      setAuthState(AuthState.Unauthenticated);
    }
  }, []);

  const onAuthChange = (userName, newAuthState) => {
    setUserName(userName);
    setAuthState(newAuthState);
  };

  return (
    <div className='body bg-dark text-light'>
      <header>
        <h1>Emotional Check-In</h1>
        {authState === AuthState.Authenticated && ( // Conditionally render the nav
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
          <Route
            path='/'
            element={
              <Login
                userName={userName}
                authState={authState}
                onAuthChange={onAuthChange}
              />
            }
          />
          {authState === AuthState.Authenticated ? (
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