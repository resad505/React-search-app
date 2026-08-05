import { useState } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import ResultsList from './components/ResultsList/ResultsList';
import Pagination from './components/Pagination/Pagination';
import { useFetch } from './hooks/useFetch';
import './App.css';

/**
 * Checkpoint-2: API inteqrasiyası + useEffect ilə data çəkmə.
 * 
 * Bu mərhələdə:
 *  - Real OMDb API inteqrasiyası
 *  - Custom `useFetch` hook (AbortController və cleanup funksiyası ilə)
 *  - Race condition müdafiəsi
 *  - Loading, error və empty state-lər üçün real API məlumatları
 */

const ITEMS_PER_PAGE = 10; // OMDb API hər səhifədə 10 nəticə qaytarır

function App() {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Custom hook vasitəsilə API-dən real məlumat çəkilməsi
  const { data, totalResults, loading, error } = useFetch(query, currentPage);

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  function handleQueryChange(value) {
    setQuery(value);
    setCurrentPage(1); // Axtarış sözü dəyişdikdə 1-ci səhifəyə qayıt
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
        {/* SearchBar */}
        <SearchBar value={query} onChange={handleQueryChange} />

        {/* Nəticələr (Real API State-ləri) */}
        <ResultsList
          items={data}
          loading={loading}
          error={error}
          query={query}
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
