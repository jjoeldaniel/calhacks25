import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioMessageProps {
  duration: number; // fallback duration in seconds
  audioUrl?: string;
}

export function AudioMessage({ duration: fallbackDuration, audioUrl }: AudioMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<number>(fallbackDuration || 0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // When metadata is loaded, update duration
    const onLoaded = () => {
      if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    // Update time/progress during playback
    const onTimeUpdate = () => {
      const d = audio.duration || fallbackDuration || 1;
      if (d > 0) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / d) * 100);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      if (audio) audio.currentTime = 0;
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      // Pause when unmounting
      try {
        audio.pause();
      } catch {
        // ignore
      }
    };
    // We only want to set these listeners when audioRef changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioRef.current]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        setIsPlaying(true);
      } catch (err) {
        // Play() can reject for many reasons (no src, not allowed, codec unsupported)
        // Log and fail gracefully
        console.warn('Audio play failed', err);
        setIsPlaying(false);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const d = audio.duration || fallbackDuration || 0;
    const newTime = percentage * d;
    if (!isNaN(newTime) && isFinite(newTime)) {
      audio.currentTime = newTime;
      setProgress(percentage * 100);
      setCurrentTime(newTime);
    }
  };

  // Generate waveform bars once per render (visual only)
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
          preload="metadata"
        />
      )}

      {/* Play/Pause Button */}
      <button
        onClick={togglePlayPause}
    className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 hover:bg-purple-700 transition-colors shrink-0"
        aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
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
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
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
  <span className="text-xs text-zinc-400 tabular-nums shrink-0 min-w-[35px]">
        {isPlaying ? formatTime(currentTime) : formatTime(duration || fallbackDuration)}
      </span>
    </div>
  );
}
