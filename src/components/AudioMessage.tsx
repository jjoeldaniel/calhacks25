import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioMessageProps {
  duration: number; // in seconds
  audioUrl?: string;
}

export function AudioMessage({ duration, audioUrl }: AudioMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateProgress = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
      setCurrentTime(audioRef.current.currentTime);
      
      if (!audioRef.current.paused) {
        animationRef.current = requestAnimationFrame(updateProgress);
      }
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      } else {
        audioRef.current.play();
        animationRef.current = requestAnimationFrame(updateProgress);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(percentage * 100);
      setCurrentTime(newTime);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  // Generate fake waveform bars
  const waveformBars = Array.from({ length: 40 }, (_, i) => {
    const baseHeight = 20 + Math.random() * 60;
    const isActive = progress > (i / 40) * 100;
    return {
      height: baseHeight,
      isActive
    };
  });

  return (
    <div className="flex items-center gap-3 bg-zinc-800 rounded-2xl px-3 py-2.5 max-w-sm mt-2">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handleAudioEnded}
        />
      )}
      
      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700 transition-colors flex-shrink-0"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-white fill-white" />
        ) : (
          <Play className="w-4 h-4 text-white fill-white ml-0.5" />
        )}
      </button>

      {/* Waveform */}
      <div 
        className="flex-1 flex items-center gap-0.5 h-10 cursor-pointer"
        onClick={handleSeek}
      >
        {waveformBars.map((bar, index) => (
          <div
            key={index}
            className="flex-1 rounded-full transition-all duration-200"
            style={{
              height: `${bar.height}%`,
              backgroundColor: bar.isActive ? '#a855f7' : '#52525b',
              minWidth: '2px'
            }}
          />
        ))}
      </div>

      {/* Duration */}
      <span className="text-xs text-zinc-400 tabular-nums flex-shrink-0 min-w-[35px]">
        {isPlaying ? formatTime(currentTime) : formatTime(duration)}
      </span>
    </div>
  );
}
