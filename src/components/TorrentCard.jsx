import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const TorrentCard = ({ torrent }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('');

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setDownloadStatus('Initiating...');

      // Call backend to initiate download
      const response = await fetch(`${API_URL}/api/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          torrentId: torrent.id,
          title: torrent.title,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setDownloadStatus('Downloading...');

        // Trigger actual file download from backend
        const downloadUrl = `${API_URL}/api/download/file/${torrent.id}`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = data.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
          setDownloadStatus('Complete!');
          setTimeout(() => {
            setDownloading(false);
            setDownloadStatus('');
          }, 2000);
        }, 1000);
      } else {
        setDownloadStatus('Error!');
        setTimeout(() => {
          setDownloading(false);
          setDownloadStatus('');
        }, 2000);
      }
    } catch (error) {
      console.error('Download error:', error);
      setDownloadStatus('Failed!');
      setTimeout(() => {
        setDownloading(false);
        setDownloadStatus('');
      }, 2000);
    }
  };

  // Define static color classes for each category
  const getCategoryStyles = () => {
    switch (torrent.category) {
      case 'SOFTWARE':
        return {
          border: 'border-[#00ffff]',
          badge: 'bg-[#00ffff]',
          icon: 'text-[#00ffff]',
          hover: 'group-hover:text-[#00ffff]',
        };
      case 'GAME':
        return {
          border: 'border-[#ff00ff]',
          badge: 'bg-[#ff00ff]',
          icon: 'text-[#ff00ff]',
          hover: 'group-hover:text-[#ff00ff]',
        };
      case 'MOVIE':
        return {
          border: 'border-yellow-400',
          badge: 'bg-yellow-400',
          icon: 'text-yellow-400',
          hover: 'group-hover:text-yellow-400',
        };
      case 'OS':
        return {
          border: 'border-purple-500',
          badge: 'bg-purple-500',
          icon: 'text-purple-500',
          hover: 'group-hover:text-purple-500',
        };
      default:
        return {
          border: 'border-[#00ffff]',
          badge: 'bg-[#00ffff]',
          icon: 'text-[#00ffff]',
          hover: 'group-hover:text-[#00ffff]',
        };
    }
  };

  const styles = getCategoryStyles();

  return (
    <div className={`group relative bg-zinc-900 border-4 ${styles.border} p-4 shadow-[8px_8px_0px_0px_#fff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-150`}>
      {torrent.isHot && (
        <div className="absolute -top-4 -right-4 bg-[#ff00ff] text-black border-2 border-black px-2 font-bold transform rotate-3">
          HOT
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <span className={`${styles.badge} text-black px-2 py-1 text-xs font-bold border border-black`}>
          {torrent.category}
        </span>
        {torrent.category === 'SOFTWARE' && (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${styles.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        )}
        {torrent.category === 'GAME' && (
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${styles.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>

      <h2 className={`text-2xl font-bold leading-tight mb-2 ${styles.hover} transition-colors`}>
        {torrent.title}
      </h2>

      <div className="text-gray-400 text-sm mb-4 border-l-2 border-gray-600 pl-2">
        <p>Size: {torrent.size}</p>
        <p>Uploaded: {torrent.uploadTime}</p>
        <p>By: <span className="text-[#ccff00]">{torrent.uploader}</span></p>
      </div>

      <div className="flex gap-4 mb-4 text-sm font-bold">
        <div className="text-[#ccff00] flex items-center gap-1">
          <span>↑</span> {torrent.seeders.toLocaleString()}
        </div>
        <div className="text-red-500 flex items-center gap-1">
          <span>↓</span> {torrent.leechers.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button className="bg-transparent border-2 border-white text-white py-2 hover:bg-white hover:text-black font-bold text-sm transition-colors">
          DETAILS
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className={`border-2 border-black py-2 font-bold text-sm flex justify-center items-center gap-2 transition-colors ${downloading
            ? 'bg-white text-black cursor-wait'
            : 'bg-[#ccff00] text-black hover:bg-[#ff00ff]'
            }`}
        >
          <span>{downloadStatus || 'DOWNLOAD'}</span>
          {!downloading && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default TorrentCard;
