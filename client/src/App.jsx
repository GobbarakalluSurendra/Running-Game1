import { useState, useRef, useEffect } from 'react'
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOverScreen from './components/GameOverScreen'
import Leaderboard from './components/Leaderboard'

function App() {
  const [screen, setScreen] = useState('start'); // start, game, gameover, leaderboard
  const [score, setScore] = useState(0);
  const [username, setUsername] = useState(() => localStorage.getItem('runningGameUsername') || '');
  const [musicOn, setMusicOn] = useState(false);
  
  const bgMusicRef = useRef(null);

  useEffect(() => {
    bgMusicRef.current = new Audio('/bg-music.mp3');
    bgMusicRef.current.loop = true;
  }, []);

  const toggleMusic = () => {
    if (!musicOn) {
      bgMusicRef.current.play().catch(e => console.log('Audio play error:', e));
    } else {
      bgMusicRef.current.pause();
    }
    setMusicOn(!musicOn);
  };

  return (
    <>
      <button className="music-toggle" onClick={toggleMusic}>
        {musicOn ? '🎵 ON' : '🎵 OFF'}
      </button>

      {screen === 'start' && (
        <StartScreen 
          username={username}
          setUsername={setUsername}
          onStart={() => setScreen('game')} 
          onLeaderboard={() => setScreen('leaderboard')} 
        />
      )}
      
      {screen === 'game' && (
        <Game onGameOver={(finalScore) => {
          setScore(finalScore);
          setScreen('gameover');
        }} />
      )}
      
      {screen === 'gameover' && (
        <GameOverScreen 
          score={score} 
          username={username}
          onRestart={() => setScreen('game')} 
          onHome={() => setScreen('start')} 
        />
      )}
      
      {screen === 'leaderboard' && (
        <Leaderboard onBack={() => setScreen('start')} />
      )}
    </>
  )
}

export default App
