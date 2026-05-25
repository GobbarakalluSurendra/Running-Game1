import React, { useEffect, useRef, useState } from 'react';
import Player from './Player';
import Obstacle from './Obstacle';
import Ground from './Ground';
import Background from './Background';

function Game({ onGameOver }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const groundRef = useRef(null);
  const bgRef = useRef(null);
  const requestRef = useRef(null);
  
  const jumpSoundRef = useRef(null);
  const gameOverSoundRef = useRef(null);

  const [displayScore, setDisplayScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeObstacles, setActiveObstacles] = useState([]);

  // Use refs for game loop state to avoid React re-renders
  const gameState = useRef({
    frame: 0,
    score: 0,
    isPaused: false,
    gameOver: false,
    bgX: 0,
    groundX: 0,
    
    // Player
    playerY: 0, // 0 is ground level (bottom: 20px)
    playerVelocity: 0,
    jumping: false,
    playerState: 'run',
    
    // Obstacles
    obstaclesData: [],
    obstacleSpeed: 3.5, // Reduced from 6 for a slower start
    obstacleSpawnRate: 180, // Increased from 110 for wider gaps initially
    nextObstacleId: 0
  });

  // Sprite mapping
  const spriteWidth = 575; 
  const spriteHeight = 523; 
  const spriteAnimations = {
    idle: { row: 0, frames: 7 },
    jump: { row: 1, frames: 7 },
    fall: { row: 2, frames: 9 },
    run: { row: 3, frames: 9 },
    dizzy: { row: 4, frames: 11 }
  };
  const staggerFrames = 5;

  useEffect(() => {
    // Load high score
    const savedHighScore = localStorage.getItem('runningGameHighScore');
    if (savedHighScore) setHighScore(parseInt(savedHighScore, 10));

    // Audio
    jumpSoundRef.current = new Audio('/jump.wav');
    gameOverSoundRef.current = new Audio('/gameover.wav');

    // Key handlers
    const handleKeyDown = (e) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !gameState.current.isPaused) {
        e.preventDefault();
        jump();
      }
      if (e.code === 'KeyP') {
        togglePause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Start loop is handled by the isPaused useEffect below

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Sync state ref when isPaused state changes and manage game loop
  useEffect(() => {
    gameState.current.isPaused = isPaused;
    
    // Cancel any existing loop to prevent double-speed bug
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    
    if (!isPaused && !gameState.current.gameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  }, [isPaused]);

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  const jump = () => {
    if (!gameState.current.jumping && !gameState.current.gameOver) {
      gameState.current.playerVelocity = 24; // Increased jump force for higher clearance
      gameState.current.jumping = true;
      gameState.current.playerState = 'jump';
      
      jumpSoundRef.current.currentTime = 0;
      jumpSoundRef.current.play().catch(() => {});
    }
  };

  const endGame = () => {
    gameState.current.gameOver = true;
    gameState.current.playerState = 'dizzy';
    
    // Save high score
    if (gameState.current.score > highScore) {
      localStorage.setItem('runningGameHighScore', gameState.current.score);
    }

    if (containerRef.current) {
      containerRef.current.classList.add('shake');
    }
    
    gameOverSoundRef.current.play().catch(() => {});
    
    setTimeout(() => {
      onGameOver(gameState.current.score);
    }, 1500);
  };

  const gameLoop = () => {
    const state = gameState.current;
    
    if (state.isPaused || state.gameOver) return;

    state.frame++;

    // --- PHYSICS & MOVEMENT ---
    
    // Background parallax
    state.bgX -= 0.5;
    if (bgRef.current) {
      bgRef.current.style.backgroundPositionX = `${state.bgX}px`;
    }

    // Ground scroll
    state.groundX -= state.obstacleSpeed;
    if (state.groundX <= -800) state.groundX = 0;
    if (groundRef.current) {
      groundRef.current.style.transform = `translateX(${state.groundX}px)`;
    }

    // Player jump & gravity
    state.playerY += state.playerVelocity;
    state.playerVelocity -= 0.9; // Softer gravity for better float/air time

    if (state.playerY <= 0) {
      state.playerY = 0;
      state.jumping = false;
      state.playerVelocity = 0;
      state.playerState = 'run';
    } else if (state.playerVelocity < 0 && state.jumping) {
      state.playerState = 'fall';
    }

    // Player DOM Update
    if (playerRef.current) {
      // Y Position
      playerRef.current.style.bottom = `${20 + state.playerY}px`; // 20px is ground offset
      
      // Sprite animation
      const currentAnim = spriteAnimations[state.playerState];
      const position = Math.floor(state.frame / staggerFrames) % currentAnim.frames;
      const bgPosX = -(position * spriteWidth);
      const bgPosY = -(currentAnim.row * spriteHeight);
      playerRef.current.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
    }

    // --- OBSTACLES ---
    
    // Spawn
    if (state.frame % state.obstacleSpawnRate === 0) {
      const newObs = {
        id: state.nextObstacleId++,
        x: 800, // Spawn off screen right
        width: 40,
        height: 40 + Math.random() * 30, // Random height 40-70
        ref: React.createRef()
      };
      state.obstaclesData.push(newObs);
      // Trigger React render to mount the new obstacle component
      setActiveObstacles([...state.obstaclesData]);
    }

    // Move & Collide
    let obstaclesChanged = false;
    for (let i = 0; i < state.obstaclesData.length; i++) {
      const obs = state.obstaclesData[i];
      obs.x -= state.obstacleSpeed;
      
      if (obs.ref.current) {
        obs.ref.current.style.transform = `translateX(${obs.x}px)`;
        obs.ref.current.style.height = `${obs.height}px`;
      }

      // Collision Detection (Forgiving hitboxes to prevent frustrating near-miss deaths)
      const playerBox = { 
        left: 250, 
        right: 290, 
        bottom: state.playerY + 35, 
        top: state.playerY + 130 
      };
      const obsBox = { 
        left: obs.x + 8, 
        right: obs.x + obs.width - 8, 
        bottom: 20, 
        top: 20 + obs.height - 5 
      };

      if (
        playerBox.right > obsBox.left &&
        playerBox.left < obsBox.right &&
        playerBox.bottom < obsBox.top
      ) {
        endGame();
        return;
      }

      // Passed Obstacle
      if (obs.x + obs.width < 0) {
        state.obstaclesData.splice(i, 1);
        i--;
        obstaclesChanged = true;
        
        state.score++;
        setDisplayScore(state.score);
        
        // Difficulty scaling
        if (state.score > 0 && state.score % 5 === 0) {
          state.obstacleSpeed += 0.5;
          state.obstacleSpawnRate = Math.max(50, state.obstacleSpawnRate - 5);
        }
      }
    }

    if (obstaclesChanged) {
      setActiveObstacles([...state.obstaclesData]);
    }

    // Next frame
    if (!state.gameOver) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  const handleMobileJump = () => {
    // Trigger spacebar programmatically or directly call jump
    if (!isPaused) jump();
  };

  return (
    <div className="game-container" ref={containerRef}>
      <Background ref={bgRef} />
      <Ground ref={groundRef} />
      
      {activeObstacles.map(obs => (
        <Obstacle key={obs.id} id={obs.id} ref={obs.ref} />
      ))}
      
      <Player ref={playerRef} />

      {/* UI Overlay */}
      <div className="game-ui" style={{ display: 'flex', justifyContent: 'space-between', width: '90%', top: '10px' }}>
        <div>Score: {displayScore}</div>
        <div>HI: {highScore}</div>
      </div>
      
      {isPaused && (
        <div className="overlay" style={{ background: 'rgba(0,0,0,0.5)', zIndex: 100 }}>
          <h2>PAUSED</h2>
          <button onClick={togglePause}>Resume</button>
        </div>
      )}

      <button 
        className="mobile-jump" 
        onClick={handleMobileJump}
        style={{ zIndex: 50 }}
      >
        ⬆ Jump
      </button>

      <button 
        onClick={togglePause} 
        style={{ position: 'absolute', top: 10, right: 10, zIndex: 50, background: 'rgba(255,255,255,0.3)', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}
      >
        {isPaused ? '▶' : '⏸'}
      </button>
    </div>
  );
}

export default Game;
