import './Pagination.css';

/**
 * Səhifə nömrələrini hesablayan yardımçı funksiya.
 * Nəticə: [1, '...', 4, 5, 6, '...', 12] kimi massiv qaytarır.
 */
function buildPageRange(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const delta = 1; // aktiv səhifənin hər tərəfindən neçə nömrə göstərəcəyik

  const range = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  range.push(1);

  if (left > 2) range.push('...');

  for (let i = left; i <= right; i++) {
    range.push(i);
  }

  if (right < total - 1) range.push('...');

  range.push(total);

  return range;
}

/**
 * Pagination — səhifəyə nəzarət edir.
 *
 * Props:
 *  currentPage {number}   — aktiv səhifə (1-dən başlayır)
 *  totalPages  {number}   — cəmi səhifə sayı
 *  onPageChange {Function} — (pageNumber) => void
 */
function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = buildPageRange(currentPage, totalPages);

  return (
    <nav className="pagination" aria-label="Səhifələr">
      {/* Əvvəlki */}
      <button
        type="button"
        className="pagination__btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Əvvəlki səhifə"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Nömrələr */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`ellipsis-${idx}`} className="pagination__ellipsis" aria-hidden="true">
            &hellip;
          </span>
        ) : (
          <button
            key={page}
            type="button"
            className={`pagination__btn${page === currentPage ? ' pagination__btn--active' : ''}`}
            onClick={() => page !== currentPage && onPageChange(page)}
            aria-label={`Səhifə ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Növbəti */}
      <button
        type="button"
        className="pagination__btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Növbəti səhifə"
      >
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
}

export default Pagination;
