import { useState, useEffect } from 'react';

const API_KEY = 'b9bd48a6';
const BASE_URL = 'https://www.omdbapi.com/';

/**
 * Custom Hook: useFetch
 * 
 * OMDB API-dən məlumat çəkmək üçün xüsusi hook.
 * 
 * Xüsusiyyətlər:
 * - useEffect ilə data fetch
 * - AbortController vasitəsilə sorğunun ləğvi (Race condition müdafiəsi)
 * - Error handling (OMDb API xətaları, Şəbəkə xətaları, 500/404)
 * - Clean state reseti (axtarış boşaldıqda)
 *
 * @param {string} query - Axtarış sözü
 * @param {number} page - Səhifə nömrəsi
 */
export function useFetch(query, page = 1) {
  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const trimmedQuery = query ? query.trim() : '';
    if (!trimmedQuery) {
      setData([]);
      setTotalResults(0);
      setError(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchMovies() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(trimmedQuery)}&page=${page}`,
          { signal }
        );

        if (!response.ok) {
          throw new Error(`Server xətası: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();

        if (json.Response === 'True') {
          setData(json.Search || []);
          setTotalResults(parseInt(json.totalResults, 10) || 0);
          setError(null);
        } else {
          setData([]);
          setTotalResults(0);
          
          if (json.Error === 'Too many results.') {
            setError('Həddən çox nəticə tapıldı. Lütfən axtarış sözünü daha dəqiq yazın.');
          } else if (json.Error === 'Movie not found!') {
            setError(null); // Boş nəticə kimi ResultsList özü göstərəcək
          } else {
            setError(json.Error || 'Nəticə tapılmadı.');
          }
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        setError(err.message || 'Məlumat çəkilərkən naməlum xəta baş verdi.');
        setData([]);
        setTotalResults(0);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchMovies();

    return () => {
      controller.abort();
    };
  }, [query, page]);

  return { data, totalResults, loading, error };
}
