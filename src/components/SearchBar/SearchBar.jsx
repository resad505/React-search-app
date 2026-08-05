import './SearchBar.css';

/**
 * SearchBar — idarə olunan input komponenti.
 *
 * Props:
 *  value       {string}   — cari axtarış mətni
 *  onChange    {Function} — dəyər dəyişdikdə çağrılır
 *  placeholder {string}   — placeholder mətni
 */
function SearchBar({ value, onChange, placeholder = 'Film adı axtar...' }) {
  function handleClear() {
    onChange('');
  }

  return (
    <div className="search-bar" role="search">
      {/* Search icon */}
      <span className="search-bar__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="7" />
          <line x1="16.5" y1="16.5" x2="22" y2="22" />
        </svg>
      </span>

      <input
        id="search-input"
        type="search"
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck="false"
        aria-label="Film axtarışı"
      />

      {/* Clear button — yalnız mətn varsa göstər */}
      {value && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Axtarışı təmizlə"
        >
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
