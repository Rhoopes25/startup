import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';

export function Unauthenticated({ userName, onLogin }) {
  const [email, setEmail] = useState(userName);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function loginUser() {
    loginOrCreate(`/api/auth/login`);
  }

  async function createUser() {
    loginOrCreate(`/api/auth/create`);
  }

  async function loginOrCreate(endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'post',
        body: JSON.stringify({ email, password }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (response?.status === 200) {
        localStorage.setItem('userName', email);
        onLogin(email);
      } else {
        const body = await response.json();
        setError(`⚠ Error: ${body.msg}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('⚠ Error: An error occurred. Please try again.');
    }
  }

  return (
    <div>
      <div className="input-group mb-3">
        <span className="input-group-text">@</span>
        <input
          className="form-control"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
        />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text">🔒</span>
        <input
          className="form-control"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
      </div>
      {error && <p className="text-danger">{error}</p>}
      <Button variant="primary" onClick={loginUser} disabled={!email || !password}>
        Login
      </Button>
      <Button variant="secondary" onClick={createUser} disabled={!email || !password}>
        Create
      </Button>
    </div>
  );
}