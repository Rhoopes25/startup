import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Breathe } from './breathe/breathe';
import { Rate } from './rate/rate';
import { Journal } from './journal/journal';

export default function App() {
    return (
     <BrowserRouter>
      <div className='body bg-dark text-light'>
        <header>
        <h1>Emotional Check-In</h1>
        <nav>
            <NavLink className='nav-link' to='/login'>Login Page</NavLink>
            <NavLink className='nav-link' to='/rate'>Log Emotions</NavLink>
            <NavLink className='nav-link' to='/journal'>Journal</NavLink>
            <NavLink className='nav-link' to='/breathe'>Breathe</NavLink>
          </nav>
      </header>
  
        <main>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/rate' element={<Rate />} />
            <Route path='/journal' element={<Journal />} />
            <Route path='/breathe' element={<Breathe />} />
            <Route path='/play' element={<h2>Play Page</h2>} />
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
      </BrowserRouter>
    );
  }


  function NotFound() {
    return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
  }