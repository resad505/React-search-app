import './Card.css';

/**
 * Card — tək axtarış nəticəsini göstərir.
 *
 * Props:
 *  title  {string} — film / serial adı
 *  year   {string} — il
 *  poster {string} — şəkil URL-i (N/A ola bilər)
 *  type   {string} — "movie" | "series" | "episode"
 *  imdbId {string} — unikal ID (key üçün xaricdə istifadə olunur)
 */
function Card({ title, year, poster, type }) {
  const hasPoster = poster && poster !== 'N/A';

  const TYPE_LABELS = {
    movie: 'Film',
    series: 'Serial',
    episode: 'Bölüm',
  };

  return (
    <article className="card">
      {/* Poster */}
      <div className="card__poster-wrap">
        {hasPoster ? (
          <img
            className="card__poster"
            src={poster}
            alt={`${title} posteri`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="card__poster-placeholder" aria-hidden="true">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="2" />
              <path d="M8 2v20M16 2v20M2 8h20M2 16h20" />
            </svg>
          </div>
        )}

        {type && type !== 'N/A' && (
          <span className="card__type-badge">
            {TYPE_LABELS[type] ?? type}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="card__body">
        <h3 className="card__title" title={title}>
          {title}
        </h3>
        {year && year !== 'N/A' && (
          <p className="card__year">{year}</p>
        )}
      </div>
    </article>
  );
}

export default Card;
