import { useState, useEffect } from 'react';

const API_KEY = 'b9bd48a6';
const BASE_URL = 'https://www.omdbapi.com/';

/**
 * Custom Hook: useFetch (Checkpoint-4 və Checkpoint-2)
 * 
 * OMDB API-dən məlumat çəkir. Paralel 2 sorğu (Promise.all) göndərərək
 * hər səhifədə 10 yerinə 20 film nəticəsi göstərir!
 * 
 * Xüsusiyyətlər:
 * - 20 film nəticəsi (2 paralel OMDb səhifəsi)
 * - Loading, Error, Empty state-lərin dəqiq idarəsi
 * - AbortController vasitəsilə sorğuların ləğvi (Race condition müdafiəsi)
 * - Boş axtarış zamanı sonsuz dövr etməyən clean state reseti
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
    
    // Axtarış boşdursa dərhal resə et (Loading sonsuz fırlanmır!)
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
        // Hər görünən səhifə üçün OMDb-dən paralel 2 səhifə çəkilir (10 + 10 = 20 film)
        const omdbPage1 = (page - 1) * 2 + 1;
        const omdbPage2 = (page - 1) * 2 + 2;

        const [res1, res2] = await Promise.all([
          fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(trimmedQuery)}&page=${omdbPage1}`, { signal }),
          fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(trimmedQuery)}&page=${omdbPage2}`, { signal })
        ]);

        if (!res1.ok || !res2.ok) {
          throw new Error('Server xətası baş verdi. Lütfən bir az sonra yenidən cəhd edin.');
        }

        const json1 = await res1.json();
        const json2 = await res2.json();

        if (json1.Response === 'True') {
          const list1 = json1.Search || [];
          const list2 = json2.Response === 'True' ? json2.Search || [] : [];
          
          // İki səhifənin nəticələri birləşdirilir (20 nəticə)
          const combined = [...list1, ...list2];

          // Unikal ID-lər üzrə filtrləyirik ki, təkrarlanma olmasın
          const uniqueMovies = Array.from(
            new Map(combined.map((item) => [item.imdbID, item])).values()
          );

          setData(uniqueMovies);
          setTotalResults(parseInt(json1.totalResults, 10) || 0);
          setError(null);
        } else {
          // OMDb API xətası (məs: "Movie not found!", "Too many results.")
          setData([]);
          setTotalResults(0);

          if (json1.Error === 'Too many results.') {
            setError('Həddən çox nəticə tapıldı. Lütfən axtarış sözünü daha dəqiq yazın.');
          } else if (json1.Error === 'Movie not found!') {
            setError(null); // Boş nəticə ekranı (Empty state) göstəriləcək
          } else {
            setError(json1.Error || 'Məlumat tapılmadı.');
          }
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          return; // Sorğu ləğv olunubsa error state-ə yazmırıq
        }
        setError(err.message || 'Şəbəkə xətası baş verdi. İnternet bağlantınızı yoxlayın.');
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
