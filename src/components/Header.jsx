const Header = () => {
  return (
    <header className="p-6 md:p-12 border-b-4 border-white bg-blue-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
        <h1 className="text-9xl font-glitch text-white">404</h1>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none text-neon-green drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
            TORRENT<br />HUB
          </h1>
          <p className="bg-black text-white inline-block px-2 py-1 mt-2 text-sm md:text-xl transform -rotate-2">
            THE LAST FREE HAVEN
          </p>
        </div>

        {/* STATS BOX */}
        <div className="bg-white text-black border-4 border-black p-4 shadow-hard transform rotate-1 w-full md:w-auto">
          <div className="flex justify-between gap-8 border-b-2 border-black pb-2 mb-2">
            <span className="font-bold">PEERS:</span>
            <span className="text-blue-700 font-bold">14,203,991</span>
          </div>
          <div className="flex justify-between gap-8">
            <span className="font-bold">STATUS:</span>
            <span className="bg-neon-green px-1 border border-black text-xs flex items-center">ONLINE</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
