import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';

export function Authenticated({ userName, onLogout }) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="playerName">{userName}</div>
      <Button variant="primary" onClick={() => navigate('/rate')}>
        Rate
      </Button>
      <Button variant="secondary" onClick={onLogout}>
        Logout
      </Button>
    </div>
  );
}