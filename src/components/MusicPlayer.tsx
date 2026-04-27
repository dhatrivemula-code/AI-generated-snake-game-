import { useEffect, useRef, useState } from 'react';

const TRACKS = [
  {
    id: "SRC_01.dat",
    title: "NEON_PULSE_V1",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: "SRC_02.dat",
    title: "CYBER_DRIFT_X",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: "SRC_03.dat",
    title: "SYNAPSE_ERR",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentTrack = TRACKS[currentTrackIndex];

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress((current / duration) * 100 || 0);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => setIsPlaying(false));
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrackIndex, isPlaying]);

  const barLength = 20;
  const filledBars = Math.floor((progress / 100) * barLength) || 0;
  const progressString = '[' + '#'.repeat(filledBars) + '-'.repeat(Math.max(0, barLength - filledBars)) + ']';

  return (
    <div className="w-full flex justify-center text-[#ff00ff] font-mono">
      <div className="w-full">
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />

        <div className="border border-[#ff00ff] p-4 bg-black">
          <div className="flex justify-between items-center mb-4 text-sm border-b border-[#ff00ff] pb-2">
            <span className="text-[#00ffff] glitch-text font-bold" data-text={currentTrack.id}>{currentTrack.id}</span>
            <span className={isPlaying ? "animate-pulse" : "text-gray-500"}>
              {isPlaying ? "READING..." : "IDLE"}
            </span>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-bold text-black mb-1 uppercase tracking-widest bg-[#ff00ff] inline-block px-2">
              {currentTrack.title}
            </h3>
            <div className="text-xs text-[#00ffff] mt-2 space-y-1">
              <p>BITRATE: 128 KBPS</p>
              <p>ENCRYPTION: NONE</p>
            </div>
          </div>

          <div className="mb-4 text-xs font-mono h-8 flex items-end justify-between space-x-1 border-b border-t border-[#ff00ff]/30 py-1">
            {[...Array(24)].map((_, i) => {
              const height = isPlaying ? Math.max(10, Math.random() * 100) : 10;
              return (
                <div 
                  key={i} 
                  className="w-full bg-[#ff00ff]"
                  style={{ height: `${height}%` }}
                />
              );
            })}
          </div>

          <div className="text-center w-full whitespace-pre tracking-widest text-sm mb-6 text-[#00ffff]">
            {progressString}
          </div>

          <div className="flex items-center justify-between text-white">
            <button 
              onClick={handlePrev}
              className="px-3 py-1 border border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors"
            >
              &lt;&lt;
            </button>
            
            <button 
              onClick={handlePlayPause}
              className="px-6 py-2 border-2 border-[#ff00ff] text-[#ff00ff] font-bold hover:bg-[#ff00ff] hover:text-black transition-all active:translate-y-1"
            >
              {isPlaying ? "[ HALT ]" : "[ EXEC ]"}
            </button>
            
            <button 
              onClick={handleNext}
              className="px-3 py-1 border border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors"
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
