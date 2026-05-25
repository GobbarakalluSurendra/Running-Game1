import React, { useState } from 'react';
import API_URL from '../config';

function StartScreen({ username, setUsername, onStart, onLeaderboard }) {
  const [inputName, setInputName] = useState(username);
  const [isEditing, setIsEditing] = useState(!username);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) {
      setError('Username cannot be empty');
      return;
    }
    if (trimmed.length > 15) {
      setError('Username must be 15 characters or less');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/scores/check/${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        throw new Error('Server error checking name');
      }
      const data = await res.json();
      if (data.exists) {
        // If it exists but it is the same username they had stored locally, they can reuse it!
        // This allows returning players to keep using their name.
        if (username.toLowerCase() === trimmed.toLowerCase()) {
          localStorage.setItem('runningGameUsername', trimmed);
          setUsername(trimmed);
          setIsEditing(false);
          onStart();
        } else {
          setError('Username already taken! Please choose another name.');
        }
      } else {
        localStorage.setItem('runningGameUsername', trimmed);
        setUsername(trimmed);
        setIsEditing(false);
        onStart();
      }
    } catch (err) {
      console.error(err);
      setError('Could not verify username. Server may be offline.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartExisting = () => {
    onStart();
  };

  return (
    <div className="overlay">
      <h1>🐶 Shadow Dog Runner</h1>
      
      {!isEditing ? (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '1.5rem', marginBottom: '10px' }}>
            Welcome back, <strong style={{ color: '#00e5ff' }}>{username}</strong>!
          </p>
          <button onClick={handleStartExisting} style={{ display: 'block', margin: '15px auto', width: '220px' }}>
            Start Game
          </button>
          <button 
            onClick={() => setIsEditing(true)} 
            style={{ 
              background: '#555', 
              fontSize: '1rem', 
              padding: '8px 15px', 
              display: 'block', 
              margin: '10px auto' 
            }}
          >
            Change Username
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Choose a Username to Start:</p>
          <input
            type="text"
            placeholder="Username (e.g. ShadowRunner)"
            value={inputName}
            onChange={(e) => setInputName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} // allow alphanumeric + underscores
            maxLength={15}
            disabled={loading}
            style={{
              padding: '12px 20px',
              fontSize: '1.2rem',
              borderRadius: '10px',
              border: '2px solid #00e5ff',
              background: '#111',
              color: '#fff',
              outline: 'none',
              textAlign: 'center',
              boxShadow: '0 0 10px rgba(0,229,255,0.2)',
              marginBottom: '10px'
            }}
          />
          {error && <p style={{ color: '#ff4c4c', fontWeight: 'bold', margin: '5px 0 15px 0' }}>{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: loading ? '#555' : 'linear-gradient(135deg, #00e5ff, #007bb5)',
              color: loading ? '#aaa' : '#fff',
              width: '220px'
            }}
          >
            {loading ? 'Checking Name...' : 'Confirm & Play'}
          </button>
          {username && (
            <button 
              type="button" 
              onClick={() => {
                setInputName(username);
                setIsEditing(false);
                setError('');
              }} 
              style={{ background: '#333', fontSize: '1rem', padding: '8px 15px', marginTop: '10px' }}
            >
              Cancel
            </button>
          )}
        </form>
      )}

      <button onClick={onLeaderboard} style={{ background: 'linear-gradient(135deg, #ff512f, #f09819)', width: '220px' }}>
        Leaderboard
      </button>
    </div>
  );
}

export default StartScreen;
