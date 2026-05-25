import React, { useState, useEffect } from 'react';
import API_URL from '../config';

function Leaderboard({ onBack }) {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/scores/leaderboard`)
      .then(res => res.json())
      .then(data => {
        setScores(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="overlay">
      <h2>🏆 Leaderboard 🏆</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="leaderboard-list">
          {scores.length === 0 && <p>No scores yet!</p>}
          {scores.map((s, index) => (
            <li key={index}>
              <span>{index + 1}. {s.username}</span>
              <span>{s.score}</span>
            </li>
          ))}
        </ul>
      )}
      <button onClick={onBack}>Back to Home</button>
    </div>
  );
}

export default Leaderboard;
