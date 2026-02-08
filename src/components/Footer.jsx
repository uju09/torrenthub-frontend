const Footer = () => {
  return (
    <footer className="bg-black text-white border-t-4 border-white p-6 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-2xl font-bold text-neon-green mb-4">/// WARNING</h3>
          <p className="text-sm text-gray-400">
            We do not host any files on our servers. All links are user-submitted magnet links. Use a VPN or risk
            everything. We are not responsible for what you download.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <a href="#" className="hover:bg-neon-pink hover:text-black p-2 border border-gray-700 hover:border-neon-pink transition-colors">
            &gt;&gt; DMCA TAKEDOWN
          </a>
          <a href="#" className="hover:bg-neon-pink hover:text-black p-2 border border-gray-700 hover:border-neon-pink transition-colors">
            &gt;&gt; UPLOAD TORRENT
          </a>
          <a href="#" className="hover:bg-neon-pink hover:text-black p-2 border border-gray-700 hover:border-neon-pink transition-colors">
            &gt;&gt; DONATE (BTC)
          </a>
        </div>
        <div className="flex flex-col justify-center items-center md:items-end">
          <h3 className="text-4xl font-glitch mb-2">DATA_DUMP</h3>
          <p className="text-xs text-gray-500">EST. 2024 // HOSTED IN THE VOID</p>
          <div className="mt-4 flex gap-2">
            <div className="w-4 h-4 bg-neon-green animate-pulse"></div>
            <div className="w-4 h-4 bg-neon-pink animate-bounce"></div>
            <div className="w-4 h-4 bg-neon-cyan animate-pulse"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
