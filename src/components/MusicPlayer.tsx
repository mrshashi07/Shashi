import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';
import { motion } from 'motion/react';

const TRACKS = [
  { id: 1, title: 'Neon Cyber Drive (AI Gen)', artist: 'SynthBot', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Digital Dreams (AI Gen)', artist: 'NeuralNet', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Retro AI Groove (AI Gen)', artist: 'Algorhythm', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio playback error:", e));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900/80 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-4 sm:p-6 w-full max-w-md shadow-[0_0_20px_rgba(6,182,212,0.15)] mx-auto flex flex-col gap-4"
    >
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={nextTrack}
        loop={false}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <Music className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-cyan-50 font-bold text-sm sm:text-base drop-shadow-[0_0_2px_rgba(207,250,254,0.8)] truncate max-w-[150px] sm:max-w-[200px]">{currentTrack.title}</h3>
            <p className="text-cyan-400/70 text-xs sm:text-sm">{currentTrack.artist}</p>
          </div>
        </div>
        
        {isPlaying && (
          <div className="flex gap-1 items-end h-6">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                animate={{ height: ["20%", "100%", "20%"] }}
                transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                className="w-1.5 bg-cyan-400 rounded-t-sm shadow-[0_0_5px_rgba(34,211,238,0.8)]"
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-center gap-6">
          <button 
            onClick={prevTrack}
            className="text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all focus:outline-none"
          >
            <SkipBack className="w-6 h-6 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-neutral-950 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.6)] hover:shadow-[0_0_25px_rgba(6,182,212,0.8)] transition-all focus:outline-none"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="text-cyan-400 hover:text-cyan-300 hover:scale-110 transition-all focus:outline-none"
          >
            <SkipForward className="w-6 h-6 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" />
          </button>
        </div>

        <div className="flex items-center gap-3 px-2">
          <button onClick={toggleMute} className="text-cyan-500/70 hover:text-cyan-400 focus:outline-none">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>
    </motion.div>
  );
}
