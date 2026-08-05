import { useState, useEffect } from 'react';

/**
 * Custom Hook: useDebounce
 *
 * Mətni verilmiş gecikmə (delay) müddəti qədər saxlayır (debounce).
 * Hər simvol yazıldıqda dərhal API çağırışının olmaması üçün istifadə olunur (Checkpoint-3).
 *
 * @param {any} value - Debounce ediləcək dəyər
 * @param {number} delay - Gecikmə vaxtı (ms ilə, defolt: 500ms)
 * @returns {any} debouncedValue
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
