import Card from '../Card/Card';
import './ResultsList.css';

/**
 * SkeletonCard — loading zamanı göstərilən placeholder.
 * Ayrı block: skeleton-card
 */
function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__poster" />
      <div className="skeleton-card__body">
        <div className="skeleton-card__line" />
        <div className="skeleton-card__line skeleton-card__line--short" />
      </div>
    </div>
  );
}

/**
 * ResultsList — 4 vəziyyəti idarə edir:
 *  1. loading  → skeleton grid
 *  2. error    → xəta mesajı
 *  3. !query   → axtarış promptu
 *  4. nəticələr → grid + meta
 *
 * Props:
 *  items   {Array}   — [{imdbID, Title, Year, Poster, Type}]
 *  loading {boolean}
 *  error   {string|null}
 *  query   {string}
 *  total   {number}
 */
function ResultsList({ items, loading, error, query, total }) {

  /* ── 1. Yüklənir ── */
  if (loading) {
    return (
      <section className="results-list" aria-label="Nəticələr yüklənir" aria-busy="true">
        <div className="results-list__skeleton-grid">
          {Array.from({ length: 10 }, (_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  /* ── 2. Xəta ── */
  if (error) {
    return (
      <section className="results-list">
        <div className="results-list__state results-list__state--error" role="alert">
          <div
            className="results-list__state-icon results-list__state-icon--error"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="results-list__state-title results-list__state-title--error">
            Xəta baş verdi
          </p>
          <p className="results-list__state-text results-list__state-text--error">{error}</p>
        </div>
      </section>
    );
  }

  /* ── 3. Axtarış edilməyib ── */
  if (!query) {
    return (
      <section className="results-list">
        <div className="results-list__state results-list__state--prompt">
          <div
            className="results-list__state-icon results-list__state-icon--prompt"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
          </div>
          <p className="results-list__state-title results-list__state-title--prompt">
            Film axtar
          </p>
          <p className="results-list__state-text">
            Yuxarıdakı axtarış çubuğuna film adı yazın
          </p>
        </div>
      </section>
    );
  }

  /* ── 4. Boş nəticə ── */
  if (items.length === 0) {
    return (
      <section className="results-list">
        <div className="results-list__state results-list__state--empty">
          <div
            className="results-list__state-icon results-list__state-icon--empty"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </div>
          <p className="results-list__state-title">Nəticə tapılmadı</p>
          <p className="results-list__state-text">
            &ldquo;{query}&rdquo; üzrə film tapılmadı. Başqa ad sınayın.
          </p>
        </div>
      </section>
    );
  }

  /* ── 5. Nəticələr ── */
  return (
    <section className="results-list" aria-label={`"${query}" üzrə axtarış nəticələri`}>
      <p className="results-list__meta">
        <strong>{total.toLocaleString()}</strong> nəticədən {items.length} göstərilir —{' '}
        &ldquo;{query}&rdquo;
      </p>
      <div className="results-list__grid">
        {items.map((item) => (
          <Card
            key={item.imdbID}
            title={item.Title}
            year={item.Year}
            poster={item.Poster}
            type={item.Type}
            imdbId={item.imdbID}
          />
        ))}
      </div>
    </section>
  );
}

export default ResultsList;
