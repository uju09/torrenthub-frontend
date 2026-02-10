import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { torrents } from '../data/torrents';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const TorrentDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [downloading, setDownloading] = useState({ linux: false, windows: false });
  const [downloadStatus, setDownloadStatus] = useState({ linux: '', windows: '' });

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get torrent from navigation state or find by slug
  const torrent = location.state?.torrent || torrents.find((t) =>
    t.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug
  );

  if (!torrent) {
    return (
      <div className="bg-void-black text-white font-mono min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">404 - Not Found</h1>
        <p className="text-gray-400 mb-8">The requested torrent does not exist.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-[#ccff00] text-black px-6 py-3 font-bold border-2 border-black hover:bg-[#ff00ff] transition-colors"
        >
          ← BACK TO HOME
        </button>
      </div>
    );
  }

  const getCategoryStyles = () => {
    switch (torrent.category) {
      case 'SOFTWARE':
        return { accent: '#00ffff', border: 'border-[#00ffff]', badge: 'bg-[#00ffff]' };
      case 'GAME':
        return { accent: '#ff00ff', border: 'border-[#ff00ff]', badge: 'bg-[#ff00ff]' };
      case 'MOVIE':
        return { accent: '#fbbf24', border: 'border-yellow-400', badge: 'bg-yellow-400' };
      case 'OS':
        return { accent: '#a855f7', border: 'border-purple-500', badge: 'bg-purple-500' };
      default:
        return { accent: '#00ffff', border: 'border-[#00ffff]', badge: 'bg-[#00ffff]' };
    }
  };

  const styles = getCategoryStyles();

  const handleDownload = async (platform) => {
    try {
      setDownloading((prev) => ({ ...prev, [platform]: true }));
      setDownloadStatus((prev) => ({ ...prev, [platform]: 'Initiating...' }));

      const response = await fetch(`${API_URL}/api/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          torrentId: torrent.id,
          title: torrent.title,
          platform: platform,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setDownloadStatus((prev) => ({ ...prev, [platform]: 'Downloading...' }));

        const downloadUrl = `${API_URL}/api/download/file/${torrent.id}?platform=${platform}`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          setDownloadStatus((prev) => ({ ...prev, [platform]: 'Complete!' }));
          setTimeout(() => {
            setDownloading((prev) => ({ ...prev, [platform]: false }));
            setDownloadStatus((prev) => ({ ...prev, [platform]: '' }));
          }, 2000);
        }, 1000);
      } else {
        setDownloadStatus((prev) => ({ ...prev, [platform]: 'Error!' }));
        setTimeout(() => {
          setDownloading((prev) => ({ ...prev, [platform]: false }));
          setDownloadStatus((prev) => ({ ...prev, [platform]: '' }));
        }, 2000);
      }
    } catch (error) {
      console.error('Download error:', error);
      setDownloadStatus((prev) => ({ ...prev, [platform]: 'Failed!' }));
      setTimeout(() => {
        setDownloading((prev) => ({ ...prev, [platform]: false }));
        setDownloadStatus((prev) => ({ ...prev, [platform]: '' }));
      }, 2000);
    }
  };

  return (
    <div className="bg-void-black text-white font-mono min-h-screen">
      {/* Header Bar */}
      <div className="bg-zinc-900 border-b-4 border-[#ccff00] p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-[#ccff00] hover:text-[#ff00ff] font-bold flex items-center gap-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            BACK
          </button>
          <span className="text-gray-500 text-sm uppercase">{slug}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 md:p-12">
        {/* Title Section */}
        <div className={`bg-zinc-900 border-4 ${styles.border} p-6 mb-8 shadow-[8px_8px_0px_0px_#fff]`}>
          <div className="flex flex-wrap items-start gap-4 mb-4">
            <span className={`${styles.badge} text-black px-3 py-1 text-sm font-bold border border-black`}>
              {torrent.category}
            </span>
            {torrent.isHot && (
              <span className="bg-[#ff00ff] text-black px-3 py-1 text-sm font-bold border border-black transform rotate-1">
                🔥 HOT
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: styles.accent }}>
            {torrent.title}
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-black/50 p-3 border border-zinc-700">
              <p className="text-gray-500 mb-1">SIZE</p>
              <p className="font-bold text-[#ccff00]">{torrent.size}</p>
            </div>
            <div className="bg-black/50 p-3 border border-zinc-700">
              <p className="text-gray-500 mb-1">UPLOADED</p>
              <p className="font-bold">{torrent.uploadTime}</p>
            </div>
            <div className="bg-black/50 p-3 border border-zinc-700">
              <p className="text-gray-500 mb-1">SEEDERS</p>
              <p className="font-bold text-[#ccff00]">↑ {torrent.seeders.toLocaleString()}</p>
            </div>
            <div className="bg-black/50 p-3 border border-zinc-700">
              <p className="text-gray-500 mb-1">LEECHERS</p>
              <p className="font-bold text-red-500">↓ {torrent.leechers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Download Section */}
        <div className="bg-zinc-900 border-4 border-[#ccff00] p-6 mb-8 shadow-[8px_8px_0px_0px_#fff]">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ccff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            DOWNLOAD OPTIONS
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Windows Download */}
            <div className="bg-black/50 border-2 border-blue-400 p-6 hover:border-white transition-colors group">
              <div className="flex items-center gap-4 mb-4">
                <svg className="h-12 w-12 text-blue-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold text-blue-400 group-hover:text-white transition-colors">WINDOWS</h3>
                  <p className="text-gray-500 text-sm">Windows 10/11 64-bit</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Compatible with Windows 10 and Windows 11. Includes auto-installer and all required dependencies.
              </p>
              <button
                onClick={() => handleDownload('windows')}
                disabled={downloading.windows}
                className={`w-full border-2 border-black py-3 font-bold text-sm flex justify-center items-center gap-2 transition-colors ${downloading.windows
                  ? 'bg-white text-black cursor-wait'
                  : 'bg-blue-400 text-black hover:bg-[#ff00ff]'
                  }`}
              >
                <span>{downloadStatus.windows || 'DOWNLOAD FOR WINDOWS'}</span>
                {!downloading.windows && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
              </button>
            </div>

            {/* Linux Download */}
            <div className="bg-black/50 border-2 border-orange-400 p-6 hover:border-white transition-colors group">
              <div className="flex items-center gap-4 mb-4">
                <svg className="h-12 w-12 text-orange-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.503 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.729-.528 2.093-1.42 2.934-.942.889-2.244 1.626-2.759 2.998-.588 1.567.007 3.478 1.49 1.906 1.06-1.124 1.96-1.022 2.896-.833.798.162 1.591.69 2.393 1.083.89.437 1.792.774 2.547.774.755 0 1.656-.337 2.547-.774.802-.393 1.594-.921 2.393-1.083.936-.189 1.835-.291 2.896.833 1.483 1.572 2.078-.339 1.49-1.906-.515-1.372-1.817-2.109-2.759-2.998-.892-.841-1.344-1.205-1.42-2.934-.066-1.491 1.056-5.965-3.17-6.298-.165-.013-.325-.021-.48-.021h-.524zm-4.328 19.59c.188 1.164-.228 2.264-1.069 2.856-.84.593-1.996.606-2.898.03l-.003.003c-.894-.571-1.37-1.652-1.183-2.816.188-1.165.897-2.12 1.829-2.461.933-.341 1.98-.051 2.633.759.653.81.876 1.76.69 2.93v-.3l.001-.001zm10.653 0c-.187 1.17.036 2.12.69 2.93.652.81 1.7 1.1 2.632.759.933-.341 1.642-1.296 1.83-2.461.188-1.164-.29-2.246-1.184-2.816l-.003-.003c-.902-.576-2.058-.563-2.898.03-.84.592-1.256 1.692-1.068 2.856v.301l-.001-.596h.002z" />
                </svg>
                <div>
                  <h3 className="text-xl font-bold text-orange-400 group-hover:text-white transition-colors">LINUX</h3>
                  <p className="text-gray-500 text-sm">Ubuntu/Debian/Arch</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Universal Linux package. Works with major distributions including Ubuntu, Debian, Fedora, and Arch Linux.
              </p>
              <button
                onClick={() => handleDownload('linux')}
                disabled={true}
                className={`w-full border-2 border-black py-3 font-bold text-sm flex justify-center items-center gap-2 transition-colors ${downloading.linux
                  ? 'bg-white text-black cursor-wait'
                  : 'bg-orange-400 text-black '
                  }`}
              >
                <span>{downloadStatus.linux || 'COMING SOON'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-zinc-900 border-4 border-zinc-700 p-6 shadow-[8px_8px_0px_0px_#fff]">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ccff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            INFORMATION
          </h2>

          <div className="space-y-6">
            <div className="border-l-4 border-[#ccff00] pl-4">
              <h3 className="font-bold text-[#ccff00] mb-2">ABOUT THIS RELEASE</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                This is a verified release from <span className="text-[#ccff00] font-bold">{torrent.uploader}</span>.
                The files have been scanned and verified by our community moderators. Always ensure you have
                adequate antivirus protection before running any downloaded software.
              </p>
            </div>

            <div className="border-l-4 border-[#ff00ff] pl-4">
              <h3 className="font-bold text-[#ff00ff] mb-2">INSTALLATION INSTRUCTIONS</h3>
              <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
                <li>Click the <span className="text-white font-bold">Download for Windows</span> button to get the <span className="text-[#ccff00]">.exe</span> file</li>
                <li>Once downloaded, locate the <span className="text-[#ccff00]">.exe</span> file and double-click to run it</li>
                <li>If Windows SmartScreen appears, click <span className="text-white font-bold">"More info"</span> → <span className="text-white font-bold">"Run anyway"</span></li>
                <li>Wait for the download/installation process to complete — do not close the window</li>
                <li>Once finished, the application will be ready to use</li>
              </ol>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-bold text-red-500 mb-2">⚠️ DISCLAIMER</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                This platform is for educational purposes only. Users are responsible for ensuring
                they have the legal right to download and use the content. The platform administrators
                are not responsible for any misuse.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TorrentDetails;
