import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;
const MIN_SPEED = 50;

function generateFood(snake: Point[]): Point {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    // eslint-disable-next-line no-loop-func
    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOnSnake) break;
  }
  return newFood;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  
  // Use refs to avoid closure stale state in keydown listeners
  const directionRef = useRef(direction);
  const isPlayingRef = useRef(isPlaying);
  const nextDirectionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
    isPlayingRef.current = isPlaying;
  }, [direction, isPlaying]);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('snakeHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Only handle if playing or if arrows (which could start the game)
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
      e.preventDefault(); // Prevent scrolling
    }

    if (!isPlayingRef.current && !isGameOver && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
      setIsPlaying(true);
    }

    const currentDir = directionRef.current;
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (currentDir.y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (currentDir.y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (currentDir.x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (currentDir.x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
        break;
    }
  }, [isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const gameOver = useCallback(() => {
    setIsPlaying(false);
    setIsGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [score, highScore]);

  const moveSnake = useCallback(() => {
    if (!isPlaying) return;

    setSnake((prevSnake) => {
      const newDir = nextDirectionRef.current;
      setDirection(newDir);

      const head = prevSnake[0];
      const newHead = { x: head.x + newDir.x, y: head.y + newDir.y };

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        gameOver();
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        gameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setSpeed((s) => Math.max(MIN_SPEED, s - SPEED_INCREMENT));
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop(); // Remove tail
      }

      return newSnake;
    });
  }, [isPlaying, food, gameOver]);

  // Game loop
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isPlaying) {
      timeoutId = setTimeout(moveSnake, speed);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isPlaying, moveSnake, speed]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 0, y: -1 });
    nextDirectionRef.current = { x: 0, y: -1 };
    setFood(generateFood([{ x: 10, y: 10 }]));
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Header Info */}
      <div className="flex justify-between w-full px-4 text-green-400 font-mono tracking-wider">
        <div className="flex flex-col">
          <span className="text-sm text-green-500/70">SCORE</span>
          <span className="text-3xl font-bold drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm flex items-center justify-center gap-1 text-green-500/70">
            BEST <Trophy className="w-3 h-3" />
          </span>
          <span className="text-3xl font-bold drop-shadow-[0_0_10px_rgba(74,222,128,0.8)]">{highScore}</span>
        </div>
      </div>

      {/* Game Board container */}
      <div className="relative p-2 rounded-xl bg-neutral-900 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.15)] overflow-hidden">
        {/* The Grid */}
        <div 
          className="bg-neutral-950 grid rounded-lg overflow-hidden relative"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            width: 'min(90vw, 400px)',
            height: 'min(90vw, 400px)',
            backgroundImage: 'radial-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px)',
            backgroundSize: 'min(4.5vw, 20px) min(4.5vw, 20px)' // roughly matches grid visually 
          }}
        >
          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <motion.div
                key={`${segment.x}-${segment.y}-${index}`}
                initial={false}
                animate={{
                  gridColumnStart: segment.x + 1,
                  gridRowStart: segment.y + 1,
                }}
                transition={{ duration: isHead ? speed / 1000 : 0.05, ease: "linear" }}
                className={`w-full h-full rounded-sm ${
                  isHead 
                    ? 'bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1)] z-10' 
                    : 'bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.6)]'
                }`}
                style={{
                  gridColumnStart: segment.x + 1,
                  gridRowStart: segment.y + 1,
                  margin: '1px' // Slight gap
                }}
              />
            );
          })}

          {/* Food */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="bg-pink-500 rounded-full shadow-[0_0_15px_rgba(236,72,153,1)] w-full h-full"
            style={{
              gridColumnStart: food.x + 1,
              gridRowStart: food.y + 1,
              margin: '2px', // Make it slightly smaller than cell
              width: 'calc(100% - 4px)',
              height: 'calc(100% - 4px)',
            }}
          />
          
          {/* Overlays */}
          <AnimatePresence>
            {!isPlaying && !isGameOver && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-0 inset-y-0 bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center z-20"
              >
                <div className="flex flex-col items-center gap-4 text-green-400">
                  <Play className="w-16 h-16 opacity-80" />
                  <p className="font-mono text-center mb-0 text-sm md:text-base px-8 md:px-0">
                    Press any Arrow Key / WASD<br/>to Start
                  </p>
                  
                  {/* Mobile Controls Hint */}
                  <div className="mt-8 flex md:hidden items-center justify-center p-4 border border-green-500/30 rounded-xl bg-neutral-900/50 backdrop-blur">
                     <p className="font-mono text-xs text-green-400/80 text-center">Use buttons below on mobile</p>
                  </div>
                </div>
              </motion.div>
            )}

            {isGameOver && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-x-0 inset-y-0 bg-neutral-950/80 backdrop-blur-md flex flex-col items-center justify-center z-20 gap-6"
              >
                <h2 className="text-4xl font-bold text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] tracking-widest uppercase">
                  System Failure
                </h2>
                <div className="font-mono text-green-400 text-xl">
                  Score: {score}
                </div>
                <button
                  onClick={resetGame}
                  className="mt-4 flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-green-500 text-green-400 rounded-lg hover:bg-green-500 hover:text-neutral-950 transition-all shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:shadow-[0_0_25px_rgba(34,197,94,0.8)] font-bold uppercase tracking-wider focus:outline-none"
                >
                  <RotateCcw className="w-5 h-5" /> Reboot
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Mobile Controls (Visible only on small screens + when playing) */}
      <div className="md:hidden grid grid-cols-3 grid-rows-2 gap-2 w-full max-w-[200px] mt-2">
         {/* Blank */} <div></div>
         {/* Up */}
         <button 
           className="bg-neutral-800 border border-green-500/30 text-green-500 p-4 rounded-lg flex justify-center items-center active:bg-green-900/50"
           onClick={() => { if(directionRef.current.y !== 1) nextDirectionRef.current = {x: 0, y: -1}; if(!isPlaying && !isGameOver) setIsPlaying(true); }}
         >
           <ArrowUp className="w-6 h-6" />
         </button>
         {/* Blank */} <div></div>
         {/* Left */}
         <button 
           className="bg-neutral-800 border border-green-500/30 text-green-500 p-4 rounded-lg flex justify-center items-center active:bg-green-900/50"
           onClick={() => { if(directionRef.current.x !== 1) nextDirectionRef.current = {x: -1, y: 0}; if(!isPlaying && !isGameOver) setIsPlaying(true); }}
         >
           <ArrowLeft className="w-6 h-6" />
         </button>
         {/* Down */}
         <button 
           className="bg-neutral-800 border border-green-500/30 text-green-500 p-4 rounded-lg flex justify-center items-center active:bg-green-900/50"
           onClick={() => { if(directionRef.current.y !== -1) nextDirectionRef.current = {x: 0, y: 1}; if(!isPlaying && !isGameOver) setIsPlaying(true); }}
         >
           <ArrowDown className="w-6 h-6" />
         </button>
         {/* Right */}
         <button 
           className="bg-neutral-800 border border-green-500/30 text-green-500 p-4 rounded-lg flex justify-center items-center active:bg-green-900/50"
           onClick={() => { if(directionRef.current.x !== -1) nextDirectionRef.current = {x: 1, y: 0}; if(!isPlaying && !isGameOver) setIsPlaying(true); }}
         >
           <ArrowRight className="w-6 h-6" />
         </button>
      </div>
    </div>
  );
}
