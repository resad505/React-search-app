import { useState } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import ResultsList from './components/ResultsList/ResultsList';
import Pagination from './components/Pagination/Pagination';
import './App.css';

/**
 * Checkpoint-1: Layihə qurulumu + komponent strukturu.
 *
 * Bu mərhələdə:
 *  - SearchBar, ResultsList, Card, Pagination komponentləri var
 *  - State idarəetməsi useState ilə qurulub
 *  - Mock data ilə render işləyir
 *
 * Checkpoint-2-də: API inteqrasiyası, useEffect, useFetch custom hook əlavə ediləcək
 */

/* ── Checkpoint-1 üçün mock data ── */
const MOCK_ITEMS = [
  {
    imdbID: 'tt0111161',
    Title: 'The Shawshank Redemption',
    Year: '1994',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
    Type: 'movie',
  },
  {
    imdbID: 'tt0068646',
    Title: 'The Godfather',
    Year: '1972',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
    Type: 'movie',
  },
  {
    imdbID: 'tt0468569',
    Title: 'The Dark Knight',
    Year: '2008',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
    Type: 'movie',
  },
  {
    imdbID: 'tt0110912',
    Title: 'Pulp Fiction',
    Year: '1994',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
    Type: 'movie',
  },
  {
    imdbID: 'tt1375666',
    Title: 'Inception',
    Year: '2010',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
    Type: 'movie',
  },
  {
    imdbID: 'tt0816692',
    Title: 'Interstellar',
    Year: '2014',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
    Type: 'movie',
  },
  {
    imdbID: 'tt0109830',
    Title: 'Forrest Gump',
    Year: '1994',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
    Type: 'movie',
  },
  {
    imdbID: 'tt0137523',
    Title: 'Fight Club',
    Year: '1999',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg',
    Type: 'movie',
  },
  {
    imdbID: 'tt0167260',
    Title: 'The Lord of the Rings: The Return of the King',
    Year: '2003',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BNzA5ZDJhZWMtOWQ5NS00NDIwLTk4OTUtODg3NDIwMzc5NTU3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
    Type: 'movie',
  },
  {
    imdbID: 'tt0120737',
    Title: 'The Lord of the Rings: The Fellowship of the Ring',
    Year: '2001',
    Poster:
      'https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg',
    Type: 'movie',
  },
];

const ITEMS_PER_PAGE = 5;

function App() {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  /* Checkpoint-1: real API state-ləri placeholder olaraq */
  const loading = false;
  const error = null;

  /* Mock axtarış — query boş deyilsə hamısını göstər */
  const filteredItems = query
    ? MOCK_ITEMS.filter((m) =>
        m.Title.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function handleQueryChange(value) {
    setQuery(value);
    setCurrentPage(1); // axtarış dəyişdikdə 1-ci səhifəyə qayıt
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

        {/* Nəticələr */}
        <ResultsList
          items={paginatedItems}
          loading={loading}
          error={error}
          query={query}
          total={totalItems}
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
