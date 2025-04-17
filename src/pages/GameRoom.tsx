
import React, { useState, useEffect, useRef } from 'react';
import PageLayout from '@/components/PageLayout';

const GameRoom = () => {
  return (
    <PageLayout pageType="gameRoom">
      <div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
          <span className="neon-text-gradient">Game Room</span>
        </h1>
        
        <div className="max-w-3xl mx-auto glass-card p-4 md:p-8 mt-8 border border-neon-purple/30">
          <p className="text-center text-lg mb-8">
            Welcome to the game room! A simple snake game where you control Rusty collecting ML nodes.
          </p>
          
          <SnakeGame />
        </div>
      </div>
    </PageLayout>
  );
};

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
  };
  
  useEffect(() => {
    if (!gameStarted || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Game variables
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;
    
    // Snake
    let snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    let velocityX = 1;
    let velocityY = 0;
    
    // Food
    let foodX = Math.floor(Math.random() * tileCount);
    let foodY = Math.floor(Math.random() * tileCount);
    
    // Game loop
    const gameLoop = setInterval(() => {
      // Move snake
      const head = { x: snake[0].x + velocityX, y: snake[0].y + velocityY };
      
      // Check walls
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        clearInterval(gameLoop);
        setGameStarted(false);
        return;
      }
      
      // Check self collision
      for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          clearInterval(gameLoop);
          setGameStarted(false);
          return;
        }
      }
      
      snake.unshift(head);
      
      // Check food collision
      if (head.x === foodX && head.y === foodY) {
        // Increase score
        setScore(prev => prev + 1);
        
        // New food position
        foodX = Math.floor(Math.random() * tileCount);
        foodY = Math.floor(Math.random() * tileCount);
      } else {
        snake.pop();
      }
      
      // Clear canvas
      ctx.fillStyle = '#0F0E17';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw snake
      ctx.fillStyle = '#8352FD';
      snake.forEach((segment, index) => {
        if (index === 0) {
          // Head with glow effect
          ctx.shadowColor = '#8352FD';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#FF5277';
        } else {
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#8352FD';
        }
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
      });
      
      // Draw food
      ctx.shadowColor = '#3BF4FB';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#3BF4FB';
      ctx.beginPath();
      ctx.arc(
        foodX * gridSize + gridSize/2, 
        foodY * gridSize + gridSize/2, 
        gridSize/2 - 2, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;
      
    }, 100);
    
    // Handle keyboard
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowUp':
          if (velocityY !== 1) {
            velocityX = 0;
            velocityY = -1;
          }
          break;
        case 'ArrowDown':
          if (velocityY !== -1) {
            velocityX = 0;
            velocityY = 1;
          }
          break;
        case 'ArrowLeft':
          if (velocityX !== 1) {
            velocityX = -1;
            velocityY = 0;
          }
          break;
        case 'ArrowRight':
          if (velocityX !== -1) {
            velocityX = 1;
            velocityY = 0;
          }
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStarted]);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md border-4 border-neon-purple">
        <canvas
          ref={canvasRef}
          width="400"
          height="400"
          className="bg-dark-card"
        />
        
        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-card/80 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4">
              {score > 0 ? `Game Over - Score: ${score}` : 'Snake Game'}
            </h3>
            <button
              className="px-6 py-2 rounded-full bg-neon-purple text-white hover:bg-neon-purple/80 transition-colors"
              onClick={startGame}
            >
              {score > 0 ? 'Play Again' : 'Start Game'}
            </button>
            <p className="mt-4 text-center text-sm text-gray-400">
              Use arrow keys to control the snake
            </p>
          </div>
        )}
      </div>
      
      {gameStarted && (
        <div className="mt-4 text-xl font-bold">
          Score: <span className="text-neon-pink">{score}</span>
        </div>
      )}
    </div>
  );
};

export default GameRoom;
