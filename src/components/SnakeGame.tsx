import { useEffect, useRef, useState, useCallback } from 'react';

const GRID_SIZE = 20;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const snake = useRef([{ x: 10, y: 10 }]);
  const food = useRef({ x: 15, y: 15 });
  const direction = useRef({ dx: 1, dy: 0 });
  const isPlayingRef = useRef(true);
  const nextDirection = useRef({ dx: 1, dy: 0 });
  const scoreRef = useRef(0);
  
  const lastRenderTime = useRef(0);
  const SNAKE_SPEED = 12; 

  const placeFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      const onSnake = snake.current.some(
        segment => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!onSnake) break;
    }
    food.current = newFood;
  }, []);

  const resetGame = useCallback(() => {
    snake.current = [{ x: 10, y: 10 }];
    direction.current = { dx: 1, dy: 0 };
    nextDirection.current = { dx: 1, dy: 0 };
    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    isPlayingRef.current = true;
    placeFood();
    window.requestAnimationFrame(gameLoop);
  }, [placeFood]);

  const gameLoop = useCallback((currentTime: number) => {
    if (!isPlayingRef.current) return;

    window.requestAnimationFrame(gameLoop);

    const secondsSinceLastRender = (currentTime - lastRenderTime.current) / 1000;
    if (secondsSinceLastRender < 1 / SNAKE_SPEED) return;

    lastRenderTime.current = currentTime;
    update();
    draw();
  }, []);

  const update = () => {
    direction.current = nextDirection.current;
    
    const newHead = {
      x: snake.current[0].x + direction.current.dx,
      y: snake.current[0].y + direction.current.dy
    };

    if (
      newHead.x < 0 || newHead.x >= GRID_SIZE ||
      newHead.y < 0 || newHead.y >= GRID_SIZE
    ) {
      handleGameOver();
      return;
    }

    if (snake.current.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
      handleGameOver();
      return;
    }

    snake.current.unshift(newHead);

    if (newHead.x === food.current.x && newHead.y === food.current.y) {
      scoreRef.current += 16;
      setScore(scoreRef.current);
      placeFood();
    } else {
      snake.current.pop();
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Raw black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cellSize = canvas.width / GRID_SIZE;

    // Draw jarring magenta grid
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]); // Dotted retro grid
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Food (Magenta Square)
    ctx.fillStyle = '#ff00ff';
    ctx.fillRect(food.current.x * cellSize, food.current.y * cellSize, cellSize, cellSize);
    ctx.fillStyle = '#000000'; // Make it look like a target bracket
    ctx.fillRect(food.current.x * cellSize + 4, food.current.y * cellSize + 4, cellSize - 8, cellSize - 8);

    // Snake (Cyan Squares)
    snake.current.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : '#00ffff';
      ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
    });
  };

  const handleGameOver = () => {
    setGameOver(true);
    isPlayingRef.current = false;
    setHighScore(prev => Math.max(prev, scoreRef.current));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.current.dy === 0) nextDirection.current = { dx: 0, dy: -1 };
          break;
        case 'ArrowDown':
        case 's':
          if (direction.current.dy === 0) nextDirection.current = { dx: 0, dy: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.current.dx === 0) nextDirection.current = { dx: -1, dy: 0 };
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.current.dx === 0) nextDirection.current = { dx: 1, dy: 0 };
          break;
        case ' ':
          if (gameOver) {
            resetGame();
          } else {
            setIsPaused(p => {
              isPlayingRef.current = p;
              if (p) window.requestAnimationFrame(gameLoop);
              return !p;
            });
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      isPlayingRef.current = false;
    };
  }, [gameLoop, gameOver, resetGame]);

  const formatHex = (num: number) => `0x${num.toString(16).toUpperCase().padStart(4, '0')}`;

  return (
    <div className="flex flex-col items-center font-mono">
      <div className="flex justify-between w-full max-w-[400px] mb-2 text-sm border-b border-[#00ffff] pb-2">
        <div>
          <div className="text-[#00ffff]">MEM_ALLOC:</div>
          <div className="text-white bg-[#00ffff] px-1 text-black font-bold">{formatHex(score)}</div>
        </div>
        <div className="text-right">
          <div className="text-[#ff00ff]">PEAK_ALLOC:</div>
          <div className="text-white bg-[#ff00ff] px-1 text-black font-bold">{formatHex(highScore)}</div>
        </div>
      </div>

      <div className="relative mt-2">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className={`border-4 border-[#00ffff] bg-black block w-full max-w-[400px] ${gameOver ? 'opacity-50' : ''}`}
        />

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="glitch-text text-4xl text-[#ff00ff] font-bold mb-4" data-text="FATAL_ERROR">FATAL_ERROR</div>
            <div className="text-[#00ffff] mb-6 text-center">
              <p>PROCESS_TERMINATED</p>
              <p className="text-xs">SECTOR COLLISION DETECTED</p>
            </div>
            <button 
              onClick={resetGame}
              className="px-4 py-2 border-2 border-[#ff00ff] bg-black text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-colors uppercase font-bold focus:outline-none"
            >
              [ REBOOT_SYSTEM ]
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/80">
            <div className="text-4xl font-bold text-black bg-[#00ffff] px-2 mb-4">SUSPENDED</div>
            <p className="text-[#00ffff] animate-pulse font-bold">&gt; PRESS_SPACE_TO_RESUME</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 w-full max-w-[400px] text-xs text-[#00ffff] flex justify-between border-t border-[#00ffff] pt-2">
        <span>INPUT: W A S D / ARROWS</span>
        <span className="text-[#ff00ff]">HALT: SPACE</span>
      </div>
    </div>
  );
}
