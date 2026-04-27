import MusicPlayer from './components/MusicPlayer';
import SnakeGame from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] flex flex-col font-mono relative overflow-hidden uppercase">
      <div className="crt-overlay"></div>
      
      <header className="w-full p-4 border-b-4 border-[#ff00ff] bg-black z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl sm:text-5xl font-bold glitch-text text-white" data-text="SYS.CORRUPTION">
            SYS.CORRUPTION
          </h1>
          <p className="text-[#ff00ff] text-sm mt-1 animate-pulse tracking-widest">&gt;&gt; OVERRIDE_INITIATED</p>
        </div>
        <div className="text-right mt-4 sm:mt-0 flicker block border border-[#00ffff] p-2 bg-black shadow-[2px_2px_0_#ff00ff]">
          <span className="text-[#ff00ff]">WARN:</span> UNAUTHORIZED_ACCESS
          <br/>
          <span className="text-xs">NET_LINK: STABLE</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 sm:p-8 gap-8 z-10 w-full overflow-y-auto">
        {/* Game Module */}
        <div className="w-full max-w-[500px] border-2 border-[#00ffff] bg-black p-1 shadow-[8px_8px_0_#ff00ff] relative group">
          <div className="bg-[#00ffff] text-black px-2 py-1 text-sm font-bold flex justify-between">
            <span>&gt; EXEC // PROTOCOL:SNAKE</span>
            <span className="animate-pulse">_</span>
          </div>
          <div className="p-4 border-t-2 border-black flex justify-center">
            <SnakeGame />
          </div>
        </div>

        {/* Audio Module */}
        <div className="w-full max-w-[500px] lg:max-w-[400px] border-2 border-[#ff00ff] bg-black p-1 shadow-[8px_8px_0_#00ffff] relative">
          <div className="bg-[#ff00ff] text-black px-2 py-1 text-sm font-bold flex justify-between">
            <span>&gt; DECODE // DATA_STREAM</span>
            <span>[ACTV]</span>
          </div>
          <div className="p-4 border-t-2 border-black">
            <MusicPlayer />
          </div>
        </div>
      </main>

      <footer className="p-2 border-t-2 border-[#00ffff] text-xs flex justify-between z-10 bg-black">
        <span>V.09 // SIGNAL:_LOST</span>
        <span className="text-[#ff00ff] hidden sm:inline">0x00A1F 0x0000 0xFF2A</span>
      </footer>
    </div>
  );
}
