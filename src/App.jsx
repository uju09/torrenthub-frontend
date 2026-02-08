import { useState } from 'react';
import { Marquee, Header, SearchBar, TorrentCard, Footer } from './components';
import { torrents } from './data/torrents';

function App() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(activeFilter === filter ? null : filter);
  };

  const filteredTorrents = torrents.filter((torrent) => {
    const matchesFilter = !activeFilter || torrent.category === activeFilter ||
      (activeFilter === 'GAMES' && torrent.category === 'GAME');
    const matchesSearch = !searchTerm ||
      torrent.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-void-black text-white font-mono min-h-screen flex flex-col">
      <Marquee />
      <Header />
      <SearchBar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        activeFilter={activeFilter}
      />

      <main className="flex-grow p-6 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTorrents.map((torrent) => (
            <TorrentCard key={torrent.id} torrent={torrent} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
