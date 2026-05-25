import React, { useState, useEffect } from 'react';
import API_URL from '../config';

function GameOverScreen({ score, username, onRestart, onHome }) {
  const [status, setStatus] = useState('submitting'); // submitting, saved, error
  const [error, setError] = useState('');

  useEffect(() => {
    const submitScore = async () => {
      if (!username) {
        setStatus('error');
        setError('No username found to save score.');
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/scores`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, score })
        });
        
        if (res.ok) {
          setStatus('saved');
        } else {
          setStatus('error');
          setError('Failed to save score on server.');
        }
      } catch (err) {
        console.error(err);
        setStatus('error');
        setError('Error connecting to server.');
      }
    };

    submitScore();
  }, [score, username]);

  return (
    <div className="overlay">
      <h2>💥 GAME OVER</h2>
      <p style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Score: {score}</p>
      <p style={{ fontSize: '1.2rem', color: '#aaa', marginBottom: '20px' }}>Player: <strong style={{ color: '#00e5ff' }}>{username}</strong></p>
      
      <div style={{ marginBottom: '30px' }}>
        {status === 'submitting' && (
          <p style={{ color: '#ffb300', fontSize: '1.2rem' }}>⏳ Saving your score...</p>
        )}
        {status === 'saved' && (
          <p style={{ color: '#00e5ff', fontSize: '1.5rem', fontWeight: 'bold' }}>🏆 Score saved to Leaderboard!</p>
        )}
        {status === 'error' && (
          <p style={{ color: '#ff4c4c', fontSize: '1.1rem', fontWeight: 'bold' }}>⚠️ {error}</p>
        )}
      </div>

      <div>
        <button onClick={onRestart}>Play Again</button>
        <button onClick={onHome} style={{ background: '#555' }}>Home</button>
      </div>
    </div>
  );
}

export default GameOverScreen;
