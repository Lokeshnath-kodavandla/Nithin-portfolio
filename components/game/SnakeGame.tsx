'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Database, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RefreshCw, Play, Pause } from 'lucide-react';

const GRID = 20;
const CELL = 22;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const OPPOSITE: Record<Direction, Direction> = {
  UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT',
};

function randomPoint(snake: Point[]): Point {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

const initialSnake: Point[] = [
  { x: 10, y: 10 },
  { x: 9,  y: 10 },
  { x: 8,  y: 10 },
];

export function SnakeGame() {
  const [snake, setSnake]       = useState<Point[]>(initialSnake);
  const [food, setFood]         = useState<Point>({ x: 15, y: 10 });
  const [dir, setDir]           = useState<Direction>('RIGHT');
  const [score, setScore]       = useState(0);
  const [best, setBest]         = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [running, setRunning]   = useState(false);

  const dirRef      = useRef<Direction>('RIGHT');
  const snakeRef    = useRef<Point[]>(initialSnake);
  const foodRef     = useRef<Point>({ x: 15, y: 10 });
  const gameOverRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const reset = useCallback(() => {
    const s = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    const f = randomPoint(s);
    setSnake(s);
    setFood(f);
    setDir('RIGHT');
    setScore(0);
    setGameOver(false);
    snakeRef.current    = s;
    foodRef.current     = f;
    dirRef.current      = 'RIGHT';
    gameOverRef.current = false;
  }, []);

  const changeDir = useCallback((newDir: Direction) => {
    if (OPPOSITE[newDir] === dirRef.current) return;
    dirRef.current = newDir;
    setDir(newDir);
  }, []);

  const tick = useCallback(() => {
    if (gameOverRef.current) return;
    const head = snakeRef.current[0];
    const d    = dirRef.current;
    const next: Point = {
      x: (head.x + (d === 'RIGHT' ? 1 : d === 'LEFT' ? -1 : 0) + GRID) % GRID,
      y: (head.y + (d === 'DOWN'  ? 1 : d === 'UP'   ? -1 : 0) + GRID) % GRID,
    };

    if (snakeRef.current.some((s) => s.x === next.x && s.y === next.y)) {
      gameOverRef.current = true;
      setGameOver(true);
      setRunning(false);
      return;
    }

    const ateFood  = next.x === foodRef.current.x && next.y === foodRef.current.y;
    const newSnake = ateFood
      ? [next, ...snakeRef.current]
      : [next, ...snakeRef.current.slice(0, -1)];

    snakeRef.current = newSnake;
    setSnake([...newSnake]);

    if (ateFood) {
      const newFood = randomPoint(newSnake);
      foodRef.current = newFood;
      setFood(newFood);
      setScore((s) => {
        const ns = s + 10;
        setBest((b) => Math.max(b, ns));
        return ns;
      });
    }
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 130);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, tick]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
        W: 'UP', S: 'DOWN', A: 'LEFT', D: 'RIGHT',
      };
      if (map[e.key]) {
        e.preventDefault();
        changeDir(map[e.key]);
        if (!running && !gameOverRef.current) setRunning(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [changeDir, running]);

  const boardSize = GRID * CELL;

  const dpadBtn = (onClick: () => void, icon: React.ReactNode) => (
    <button
      type="button"
      onPointerDown={onClick}
      className="w-12 h-12 rounded-xl flex items-center justify-center active:scale-95 transition-all"
      style={{
        background: `rgba(var(--accent-rgb), 0.08)`,
        border: `1px solid rgba(var(--accent-rgb), 0.25)`,
        color: 'var(--accent-light)',
      }}
    >
      {icon}
    </button>
  );

  return (
    <section
      id="playground"
      className="relative py-28 px-4 sm:px-6 overflow-hidden theme-transition"
      style={{ background: 'var(--section-bg)' }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color) 1px, transparent 1px)`,
          backgroundSize: '44px 44px',
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '600px',
          height: '600px',
          background: `radial-gradient(circle, var(--glow-color) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-mono tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--text-accent)' }}>
            &gt; interactive
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: 'var(--text-heading)' }}>
            Data <span style={{ color: 'var(--accent-light)' }}>Snake</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-px w-16" style={{ background: `rgba(var(--accent-rgb), 0.3)` }} />
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--accent-color)' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="h-px w-16" style={{ background: `rgba(var(--accent-rgb), 0.3)` }} />
          </div>
          <p className="text-sm mt-4" style={{ color: 'var(--text-body)' }}>
            Eat the database icons to grow. Arrow keys or D-pad below.
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-6">

          {/* Score */}
          <div className="flex items-center gap-6">
            <div
              className="text-center px-6 py-3 rounded-xl"
              style={{
                background: `rgba(var(--accent-rgb), 0.08)`,
                border: `1px solid rgba(var(--accent-rgb), 0.18)`,
              }}
            >
              <div className="text-3xl font-bold font-mono" style={{ color: 'var(--text-accent-lighter)' }}>{score}</div>
              <div className="text-[10px] font-mono uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-body)' }}>Score</div>
            </div>
            <div
              className="text-center px-6 py-3 rounded-xl"
              style={{
                background: `rgba(var(--accent-rgb), 0.04)`,
                border: `1px solid rgba(var(--accent-rgb), 0.1)`,
              }}
            >
              <div className="text-3xl font-bold font-mono" style={{ color: 'var(--accent-color)' }}>{best}</div>
              <div className="text-[10px] font-mono uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-body)' }}>Best</div>
            </div>
          </div>

          {/* Board */}
          <div className="relative">
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                width: boardSize,
                height: boardSize,
                maxWidth: '92vw',
                background: 'var(--card-bg)',
                border: `1px solid rgba(var(--accent-rgb), 0.2)`,
                backdropFilter: 'blur(12px)',
              }}
            >
              {/* Inner grid lines */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    `linear-gradient(rgba(var(--accent-rgb), 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb), 0.04) 1px, transparent 1px)`,
                  backgroundSize: `${CELL}px ${CELL}px`,
                }}
              />

              {/* Snake */}
              {snake.map((seg, i) => (
                <motion.div
                  key={`${seg.x}-${seg.y}-${i}`}
                  style={{
                    position: 'absolute',
                    left: seg.x * CELL + 1,
                    top:  seg.y * CELL + 1,
                    width:  CELL - 3,
                    height: CELL - 3,
                    borderRadius: 4,
                    background: i === 0 ? 'var(--accent-color)' : `rgba(var(--accent-rgb), ${Math.max(0.35, 0.85 - i * 0.025)})`,
                    boxShadow: i === 0 ? `0 0 8px rgba(var(--accent-rgb), 0.7)` : 'none',
                  }}
                  initial={i === 0 ? { scale: 1.2 } : undefined}
                  animate={i === 0 ? { scale: 1 } : undefined}
                  transition={{ duration: 0.08 }}
                />
              ))}

              {/* Food */}
              <motion.div
                style={{
                  position: 'absolute',
                  left: food.x * CELL + 1,
                  top:  food.y * CELL + 1,
                  width:  CELL - 3,
                  height: CELL - 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4,
                  background: `rgba(var(--accent-rgb), 0.12)`,
                }}
                animate={{ scale: [1, 1.15, 1], opacity: [1, 0.8, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <Database
                  className="w-3.5 h-3.5"
                  style={{ color: 'var(--text-accent-lightest)', filter: `drop-shadow(0 0 4px rgba(var(--accent-rgb), 0.8))` }}
                />
              </motion.div>

              {/* Start overlay */}
              {!running && !gameOver && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ background: 'var(--overlay-bg)', backdropFilter: 'blur(6px)' }}
                >
                  <div className="text-center">
                    <p className="text-xs font-mono mb-1" style={{ color: 'var(--text-accent)' }}>&gt; ready</p>
                    <div className="text-lg font-bold mb-1" style={{ color: 'var(--text-heading)' }}>Data Snake</div>
                    <p className="text-xs mb-5" style={{ color: 'var(--text-body)' }}>Press an arrow key or tap Play</p>
                    <button
                      type="button"
                      onClick={() => setRunning(true)}
                      className="px-6 py-2 rounded-lg text-sm font-mono flex items-center gap-2 mx-auto"
                      style={{ background: 'var(--accent-color)', color: '#fff' }}
                    >
                      <Play className="w-4 h-4" />
                      Play
                    </button>
                  </div>
                </div>
              )}

              {/* Game over overlay */}
              {gameOver && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center"
                  style={{ background: 'var(--overlay-bg)', backdropFilter: 'blur(6px)' }}
                >
                  <div className="text-center">
                    <p className="text-xs font-mono mb-1" style={{ color: 'var(--text-accent)' }}>&gt; game over</p>
                    <div className="text-lg font-bold mb-1" style={{ color: 'var(--text-heading)' }}>Terminated</div>
                    <div className="text-3xl font-bold font-mono mb-0.5" style={{ color: 'var(--text-accent-lighter)' }}>{score}</div>
                    <div className="text-xs mb-5" style={{ color: 'var(--text-body)' }}>points scored</div>
                    <button
                      type="button"
                      onClick={() => { reset(); setRunning(true); }}
                      className="px-6 py-2 rounded-lg text-sm font-mono flex items-center gap-2 mx-auto"
                      style={{ background: 'var(--accent-color)', color: '#fff' }}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                running
                  ? setRunning(false)
                  : gameOver
                  ? (reset(), setRunning(true))
                  : setRunning(true)
              }
              className="px-4 py-2 rounded-lg text-sm font-mono flex items-center gap-2"
              style={{
                background: `rgba(var(--accent-rgb), 0.12)`,
                border: `1px solid rgba(var(--accent-rgb), 0.3)`,
                color: 'var(--text-accent-lighter)',
              }}
            >
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {running ? 'Pause' : 'Play'}
            </button>
            <button
              type="button"
              onClick={() => { reset(); setRunning(false); }}
              className="px-4 py-2 rounded-lg text-sm font-mono flex items-center gap-2"
              style={{
                background: `rgba(var(--accent-rgb), 0.06)`,
                border: `1px solid rgba(var(--accent-rgb), 0.15)`,
                color: 'var(--text-body)',
              }}
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* D-pad */}
          <div className="grid grid-cols-3 gap-2">
            <div />
            {dpadBtn(() => { changeDir('UP');    if (!running && !gameOverRef.current) setRunning(true); }, <ChevronUp    className="w-5 h-5" />)}
            <div />
            {dpadBtn(() => { changeDir('LEFT');  if (!running && !gameOverRef.current) setRunning(true); }, <ChevronLeft  className="w-5 h-5" />)}
            {dpadBtn(() => { changeDir('DOWN');  if (!running && !gameOverRef.current) setRunning(true); }, <ChevronDown  className="w-5 h-5" />)}
            {dpadBtn(() => { changeDir('RIGHT'); if (!running && !gameOverRef.current) setRunning(true); }, <ChevronRight className="w-5 h-5" />)}
          </div>

          <p className="text-xs font-mono" style={{ color: `rgba(var(--accent-rgb), 0.4)` }}>
            _ arrow keys / WASD on desktop
          </p>
        </div>
      </div>
    </section>
  );
}