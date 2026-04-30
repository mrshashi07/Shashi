import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 overflow-hidden relative font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(6, 182, 212, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(6, 182, 212, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}>
        <div className="absolute inset-0 bg-neutral-950/80 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_80%)]" />
      </div>

      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed top-[40%] right-[20%] w-[30%] h-[30%] bg-pink-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 lg:p-12 gap-8">
        
        {/* Header */}
        <header className="w-full flex flex-col items-center gap-2 pt-4">
          <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-green-400 via-cyan-400 to-pink-500 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            NEON SNAKE
          </h1>
          <p className="text-cyan-400/80 font-mono text-sm tracking-widest uppercase">
            Cybernetic Beats &bull; Digital Grid
          </p>
        </header>

        {/* Game Area */}
        <div className="flex-1 w-full flex items-center justify-center">
          <SnakeGame />
        </div>

        {/* Footer / Music Player */}
        <div className="w-full mt-auto pb-4">
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
