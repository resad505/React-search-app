import { useState } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import ResultsList from './components/ResultsList/ResultsList';
import Pagination from './components/Pagination/Pagination';
import { useFetch } from './hooks/useFetch';
import { useDebounce } from './hooks/useDebounce';
import './App.css';

/**
 * Senior Level React Search App
 * 
 * Özəlliklər:
 *  - Checkpoint 1: Vite + React qurulumu, BEM CSS, Komponent arxitekturası
 *  - Checkpoint 2: API inteqrasiyası, useEffect, AbortController (Race condition)
 *  - Checkpoint 3: Axtarışda Debounce (500ms delay ilə daxil edilən mətnin gecikdirilməsi)
 *  - Checkpoint 4: Loading (Skeleton), Error, Empty və Prompt state-lərin idarə edilməsi
 *  - Checkpoint 5: Səhifələmə (Pagination) idarəetməsi
 *  - Checkpoint 6: Cleanup funksiyaları, useEffect dependency array dürüstlüyü
 *  - Checkpoint 7: Custom hook-lar (`useFetch`, `useDebounce`), Senior kod arxitekturası
 */

const ITEMS_PER_PAGE = 10;

function App() {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Axtarış sözünü 500ms debounce edirik (Hər hərfdə API çağırışının qarşısını alır)
  const debouncedQuery = useDebounce(query, 500);

  // Debounced query və current page ilə API-dən məlumat çəkilib idarə olunur
  const { data, totalResults, loading, error } = useFetch(debouncedQuery, currentPage);

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  function handleQueryChange(value) {
    setQuery(value);
    setCurrentPage(1); // Yeni axtarış zamanı 1-ci səhifəyə sıfırla
  }

  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="app-header">
        <div className="app-header__inner">
          <div className="app-header__brand">
            <div className="app-header__logo" aria-hidden="true">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <h1 className="app-header__title">FilmAxtarış</h1>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="app-main">
        {/* SearchBar (Dərhal yazılır - UI hissiyyatı yüksəkdir) */}
        <SearchBar value={query} onChange={handleQueryChange} />

        {/* Nəticələr (Debounced query üzərindən gələn data/loading/error) */}
        <ResultsList
          items={data}
          loading={loading}
          error={error}
          query={debouncedQuery}
          total={totalResults}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </div>
  );
}

export default App;
