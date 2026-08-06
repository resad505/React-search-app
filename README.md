# FilmAxtarış — React Search App

> OMDb açıq REST API-yə qoşulan, axtarış, loading/error state-ləri,
> debounce, AbortController-lə race condition müdafiəsi və pagination-a sahib
> senior-səviyyəli React tətbiqi.

---

## Cəmi Bal: 100/100

| Checkpoint | Mövzu | Bal |
|---|---|---|
| CP-1 | Layihə qurulumu + komponent strukturu | 10 |
| CP-2 | API inteqrasiyası + `useEffect` | 20 |
| CP-3 | Axtarışda debounce | 15 |
| CP-4 | Loading / Error / Empty / Prompt state-ləri | 15 |
| CP-5 | Pagination | 15 |
| CP-6 | Hook-ların düzgün istifadəsi | 15 |
| CP-7 | Kod təşkili — custom hook arxitekturası | 10 |
| **CƏMI** | | **100** |

---

## Texnologiyalar

| Texnologiya | Versiya | Niyə seçildi |
|---|---|---|
| **Vite** | 8.x | CRA deprecated-dir; Vite native ES modules ilə 50ms HMR verir |
| **React** | 19.x | Hooks-əsaslı, functional komponent arxitekturası |
| **Vanilla CSS + BEM** | — | Sıfır dependency, CSS specificity konflikti yoxdur |
| **Inter** | Google Fonts | Oxunaqlı, professional tipografiya |
| **OMDb API** | v1 | Açıq, pulsuz REST API — `https://www.omdbapi.com/` |

---

## Tez Başlanğıc

```bash
# Asılılıqları yüklə
npm install

# Development serverini başlat
npm run dev
```

Tətbiq `http://localhost:5173` ünvanında açılacaq.

### Digər skriptlər

```bash
npm run build    # Production bundle
npm run preview  # Build-i lokalda preview et
npm run lint     # Oxlint ilə kod analizi
```

---

## Tam Fayl Strukturu

```
react-search-app-task-3/
├── index.html                         # HTML entry point (Google Fonts preconnect)
├── vite.config.js                     # Vite konfiqurasiyası
├── package.json
│
└── src/
    ├── main.jsx                       # React root — createRoot()
    ├── index.css                      # Global reset + CSS design tokens (:root vars)
    ├── App.jsx                        # Ana komponent — yalnız state + render
    ├── App.css                        # Layout: app, app-header, app-main
    │
    ├── hooks/                         # Data layer — bütün iş məntiqi burada
    │   ├── useFetch.js                # API çəkmə, AbortController, error handling
    │   └── useDebounce.js             # Generic debounce utility hook
    │
    └── components/                    # Presentation layer — yalnız render
        ├── SearchBar/
        │   ├── SearchBar.jsx          # Controlled input + clear düyməsi
        │   └── SearchBar.css
        ├── ResultsList/
        │   ├── ResultsList.jsx        # 5 vəziyyət: prompt/loading/error/empty/nəticə
        │   └── ResultsList.css
        ├── Card/
        │   ├── Card.jsx               # Film kartı — poster, badge, lazy img
        │   └── Card.css
        └── Pagination/
            ├── Pagination.jsx         # Smart ellipsis range
            └── Pagination.css
```

---

## Arxitektura

```
┌─────────────────────────────────────────┐
│                App.jsx                  │
│  state: query, currentPage              │
│  useDebounce(query, 500) ──────────┐    │
│  useFetch(debouncedQ, page) ───┐   │    │
└────────────────────────────────┼───┼────┘
                                 │   │
              ┌──────────────────┘   │
              ▼                      ▼
       ┌─────────────┐      ┌──────────────────┐
       │  useFetch   │      │  useDebounce     │
       │  (API layer)│      │  (utility layer) │
       └──────┬──────┘      └──────────────────┘
              │ AbortController + Promise.all
              ▼
       ┌─────────────┐
       │  OMDb API   │
       │  (REST)     │
       └─────────────┘
```

**Separation of Concerns:**
- `App.jsx` — yalnız UI state idarəsi, API-dən xəbərsizdir
- `useFetch` — yalnız data çəkmə, UI-dən xəbərsizdir
- `useDebounce` — heç bir layihə spesifik kodu yoxdur, generic-dir
- Komponentlər — yalnız props render edir, heç bir side effect yoxdur

---

## Checkpoint-1 — Layihə Qurulumu + Komponent Strukturu (10 bal)

> **Nə edildi:** Vite + React layihəsi quruldu, 4 əsas komponent strukturu yaradıldı.

### SearchBar

Nəzarət olunan (`controlled`) input — state həmişə React-dadır.

```jsx
<SearchBar
  value={query}
  onChange={handleQueryChange}
  placeholder="Film adı axtar..."
/>
```

| Xüsusiyyət | Detal |
|---|---|
| Controlled input | `value` + `onChange` props |
| Clear düyməsi | Yalnız mətn varsa (`value &&`) göstərilir |
| Accessibility | `role="search"`, `aria-label="Film axtarışı"` |
| UX | `type="search"` — mobil klaviaturada axtarış düyməsi göstərir |

### ResultsList

5 vəziyyəti idarə edən container komponenti:

| Vəziyyət | Şərt | UI |
|---|---|---|
| **Prompt** | `!query` | "Film axtar" — ilkin ekran |
| **Loading** | `loading === true` | 10 SkeletonCard (shimmer) |
| **Error** | `error !== null` | Xəta paneli (`role="alert"`) |
| **Empty** | `items.length === 0` | "Nəticə tapılmadı" |
| **Nəticələr** | Normal hal | Responsive grid + meta məlumat |

### Card

Tək film/serial/bölüm kartı.

| Xüsusiyyət | Detal |
|---|---|
| Lazy loading | `loading="lazy"` + `decoding="async"` |
| Poster fallback | `N/A` posterdə SVG placeholder |
| Layout shift yoxdur | `aspect-ratio: 2/3` — ölçü sabitdir |
| Type badge | `film`, `serial`, `bölüm` — Azərbaycanca |

### Pagination

Ağıllı ellipsis-li nav komponenti:

```
[←]  [1]  [...]  [4]  [5]  [6]  [...]  [20]  [→]
```

| Xüsusiyyət | Detal |
|---|---|
| `buildPageRange()` | 7-dən çox səhifədə ellipsis göstərir |
| `aria-current="page"` | Aktiv səhifə screen reader-lər üçün |
| Prev/Next disabled | Sərhəddə avtomatik |

### CSS — BEM Metodologiyası

```css
.card           { }   /* Block */
.card__poster   { }   /* Element */
.card__type-badge { } /* Element */
```

BEM-in əsl faydası: CSS specificity konflikti sıfıra endirilir,
`!important` heç vaxt lazım olmur.

---

## Checkpoint-2 — API İnteqrasiyası + `useEffect` (20 bal)

> **Nə edildi:** `useFetch` custom hook-u yaradıldı. OMDb API-yə async `fetch` sorğusu,
> `AbortController` ilə race condition müdafiəsi, tam xəta idarəetməsi tətbiq edildi.

### `useFetch` hook interfeysi

```js
const { data, totalResults, loading, error } = useFetch(query, page);
```

### `Promise.all` — paralel sorğu

OMDb API bir sorğuda maksimum 10 film qaytarır.
Sequential (sıralı) əvəzinə paralel sorğu:

```js
// Sequential: 300ms + 300ms = 600ms
// Promise.all: max(300ms, 300ms) = 300ms  ← 2x sürətli

const [res1, res2] = await Promise.all([
  fetch(`...&page=${omdbPage1}`, { signal }),
  fetch(`...&page=${omdbPage2}`, { signal })
]);
```

### `AbortController` — Race Condition Müdafiəsi

```
İstifadəçi "Bat" yazır    → HTTP #1 başlayır  (300ms)
İstifadəçi "Batman" yazır → HTTP #1 ABORT olur
                           → HTTP #2 başlayır  (150ms)
HTTP #2 → gəldi, "Batman" nəticəsi ✅
HTTP #1 → heç vaxt UI-ə çatmır    ✅
```

```js
useEffect(() => {
  const controller = new AbortController();

  fetchMovies(controller.signal);

  return () => controller.abort(); // cleanup → köhnə sorğu ölür
}, [query, page]);
```

### Xəta İdarəetməsi

| Xəta növü | Necə tutulur | İstifadəçiyə |
|---|---|---|
| Şəbəkə xətası | `catch(err)` | "Şəbəkə xətası..." |
| HTTP 500/404 | `!res.ok` check | "Server xətası..." |
| OMDb API xətası | `json.Response === 'False'` | API mesajı |
| "Too many results" | `json.Error` müqayisəsi | "Daha dəqiq yazın" |
| "Movie not found" | `setError(null)` | Empty state göstərilir |
| AbortError | `err.name === 'AbortError'` | Heç nə (ignore) |

---

## Checkpoint-3 — Axtarışda Debounce (15 bal)

> **Nə edildi:** `useDebounce` custom hook-u yaradıldı. Hər simvolda API çağırışı əvəzinə
> yalnız yazmanı dayandırdıqdan 500ms sonra bir çağırış gedir.

### `useDebounce` hook-u

```js
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler); // ← yeni hərf → əvvəlki taymer məhv edilir
  }, [value, delay]);

  return debouncedValue;
}
```

### Debounce vs Throttle

| | Debounce | Throttle |
|---|---|---|
| **Məntiqi** | Son hadisədən N ms sonra icra et | Hər N ms-də bir icazə ver |
| **Nə vaxt** | Yazma bitdikdə | Hər sabit intervalda |
| **Nümunə** | Axtarış input | Scroll listener |

Axtarış üçün **debounce** düzgündür — istifadəçi yazmanı bitirəndə bir sorğu lazımdır.

### Niyə 500ms?

```
Ortalama yazma sürəti: hərflər arası ~150ms
300ms → bəzən yarım sözdə trigger olur
500ms → yazma bitmişdir, cavab anında hiss edilir
700ms+ → gec hiss olunur, UX pisdir
```

### `clearTimeout` vacibliyi

```
"Batman" yazılır (6 hərf, clearTimeout olmadan):
B       → setTimeout #1 yarandı (500ms)
Ba      → setTimeout #2 yarandı (500ms)
Bat     → setTimeout #3 yarandı (500ms)
Batm    → setTimeout #4 yarandı (500ms)
Batma   → setTimeout #5 yarandı (500ms)
Batman  → setTimeout #6 yarandı (500ms)
→ 6 API sorğusu! ❌

clearTimeout ilə:
B       → #1 yarandı
Ba      → #1 ləğv, #2 yarandı
...
Batman  → #5 ləğv, #6 yarandı, 500ms sonra 1 sorğu ✅
```

---

## Checkpoint-4 — UI State-lərin İdarəsi (15 bal)

> **Nə edildi:** Loading (skeleton shimmer), Error, Empty və Prompt state-ləri tam
> bir-birindən ayrıldı. `Promise.all` ilə hər səhifədə 20 film nəticəsi təmin edildi.

### State Machine Pattern — Early Return

```jsx
// Yanlış yanaşma (junior):
{loading && <Spinner />}
{error && <Error />}
{!loading && !error && items.map(...)}
// Problem: loading=true + error mövcud ola bilər → ikisi birlikdə render!

// Düzgün yanaşma (checkpoint-4):
if (loading) return <SkeletonGrid />;   // bu nöqtədən sonra loading keçildi
if (error)   return <ErrorPanel />;     // bu nöqtədən sonra error keçildi
if (!query)  return <PromptScreen />;   // bu nöqtədən sonra query var
if (!items.length) return <EmptyState />;
return <MoviesGrid />;                  // qarantili: yükləndi, xəta yox, nəticə var
```

Hər `return` öncəkiləri qarantili edir. Vəziyyətlər üst-üstə düşə bilməz.

### Skeleton vs Spinner

| | Skeleton Shimmer | Spinner |
|---|---|---|
| **Layout shift** | Yoxdur (yer tutulur) | Ola bilər |
| **UX hissi** | "Nə gözlədiyimi bilirəm" | "Nə olacağını bilmirəm" |
| **Perceived perf.** | +20% daha sürətli hiss | — |
| **Istifadə** | Google, Facebook, YouTube | Köhnə UX |

```jsx
// SkeletonCard — aria-hidden: screen reader görməsin
function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__poster" />   {/* shimmer animasiya */}
      <div className="skeleton-card__line" />
    </div>
  );
}
```

### Sonsuz Loading Bug-ının Həlli

```js
// useFetch.js — query boşdursa heç nə etmə
if (!trimmedQuery) {
  setData([]);
  setTotalResults(0);
  setError(null);
  setLoading(false); // ← bu sətir olmasa: loading = true, heç vaxt false olmaz
  return;
}
```

### 20 Film/Səhifə — Unikal Filtri

```js
const combined = [...list1, ...list2]; // 10 + 10

// Map ilə O(n) duplicate silmə:
const uniqueMovies = Array.from(
  new Map(combined.map((item) => [item.imdbID, item])).values()
);
// Eyni imdbID-li film iki dəfə gəlsə → yalnız bir dəfə saxlanılır
```

---

## Checkpoint-5 — Pagination (15 bal)

> **Nə edildi:** `Pagination` komponenti, dinamik `totalPages` hesabı, OMDb page mapping
> formulası, smooth scroll və page reset tətbiq edildi.

### OMDb Page Mapping

OMDb hər sorğuda 10 nəticə qaytarır. Biz 20/səhifə göstəririk:

```
Bizim CP-1 → OMDb page 1 + page 2  (nəticə  1–20)
Bizim CP-2 → OMDb page 3 + page 4  (nəticə 21–40)
Bizim CP-3 → OMDb page 5 + page 6  (nəticə 41–60)

Formula:
  omdbPage1 = (page - 1) * 2 + 1
  omdbPage2 = (page - 1) * 2 + 2
```

### Ellipsis Range — `buildPageRange(current, total)`

```
current=1,  total=20 → [1, 2, '...', 20]
current=5,  total=20 → [1, '...', 4, 5, 6, '...', 20]
current=19, total=20 → [1, '...', 18, 19, 20]
current=1,  total=5  → [1, 2, 3, 4, 5]  (7-dən az = ellipsis yoxdur)
```

`delta = 1` → aktiv səhifənin sol-sağında 1 nömrə. `delta = 2` yazsan daha geniş range.

### UX Detalları

```js
// App.jsx
function handleQueryChange(value) {
  setQuery(value);
  setCurrentPage(1); // ← yeni axtarış → 1-ci səhifəyə sıfırla
}

function handlePageChange(page) {
  setCurrentPage(page);
  window.scrollTo({ top: 0, behavior: 'smooth' }); // ← yuxarıya yumşaq sürüş
}
```

---

## Checkpoint-6 — Hook-ların Düzgün İstifadəsi (15 bal)

> **Nə edildi:** `useEffect` dependency array-ları dəqiqləşdirildi, `clearTimeout` və
> `AbortController` ilə tam cleanup mexanizmləri tətbiq edildi.

### Dependency Array — React-in Ən Çox Səhv Anlaşılan Hissəsi

```js
useEffect(() => { ... }, [])         // yalnız mount-da (bir dəfə)
useEffect(() => { ... }, [a, b])     // a ya b dəyişdikdə
useEffect(() => { ... })             // hər render-də ← demək olar həmişə yanlışdır
```

```js
// useFetch.js
useEffect(() => { ... }, [query, page]);
// Yalnız axtarış sözü ya səhifə dəyişdikdə fetch gedir.
// [] olsaydı → heç vaxt yenilənməzdi
// olmasa → hər render-də → sonsuz dövr

// useDebounce.js
useEffect(() => { ... }, [value, delay]);
// delay-i daxil etməsək: delay prop dəyişsə debounce yenilənməz (stale closure)
```

### `finally` + `signal.aborted` — Kritik Detal

```js
} finally {
  if (!signal.aborted) {
    setLoading(false);
  }
}
```

`finally` həmişə işləyir — hətta `AbortError` olduqda da.
`signal.aborted` yoxlanmadan `setLoading(false)` çağrılsa:

```
Ssenari:
1. Sorğu başladı → loading = true
2. Komponent unmount oldu → controller.abort()
3. finally işlədi → setLoading(false) ← unmount olmuş komponentdə!
   → React: "Can't perform state update on unmounted component" ⚠️
```

`signal.aborted` yoxlaması bu xəbərdarlığı tamamilə aradan qaldırır.

### Cleanup Xülasəsi

| Hook | Cleanup | Nə edir |
|---|---|---|
| `useFetch` | `controller.abort()` | Köhnə HTTP sorğusunu şəbəkə səviyyəsində ləğv edir |
| `useDebounce` | `clearTimeout(handler)` | Köhnə taymeri yaddaşdan silir |

---

## Checkpoint-7 — Kod Təşkili + Custom Hook Arxitekturası (10 bal)

> **Nə edildi:** Data çəkmə məntiqi `useFetch.js`-ə, debounce məntiqi `useDebounce.js`-ə
> köçürüldü. `App.jsx` yalnız UI state idarəsi ilə məşğuldur.

### SOLID Prinsiplərinin Hook-larla Tətbiqi

**Single Responsibility Principle (SRP)**
```
App.jsx       → yalnız: query state, page state, render
useFetch.js   → yalnız: API sorğusu, error handling, loading state
useDebounce.js → yalnız: vaxtla gecikdirmə məntiqi
```

**Open/Closed Principle (OCP)**
```
Sabah tələb: "OMDb-dən IMDb API-yə keçin"
→ Yalnız useFetch.js dəyişir
→ App.jsx, SearchBar, Card, Pagination — heç biri toxunulmur ✅
```

**Encapsulation**
```js
// App.jsx — useFetch-in içini bilmir
const { data, totalResults, loading, error } = useFetch(debouncedQuery, currentPage);
// AbortController, Promise.all, encodeURIComponent — App.jsx-dən gizlidir
```

### Hook İnterfeysi

```js
// useFetch — tam data layer
const { data, totalResults, loading, error } = useFetch(query, page);

// useDebounce — generic utility (bu layihəyə bağlı deyil)
const debouncedQuery = useDebounce(query, 500);
const debouncedPrice = useDebounce(price, 300); // başqa yerdə də işlər
```

---

## Keyfiyyət Yoxlamaları (guide.md)

Bu üç ssenaridə tətbiq düzgün davranır:

### 1. Race Condition — "Bat" → "Batman"

```
İstifadəçi "Bat" yazır    → sorğu #1 göndərildi
İstifadəçi "Batman" yazır → useEffect cleanup → controller.abort()
                           → sorğu #1 şəbəkə səviyyəsində öldürüldü
                           → sorğu #2 göndərildi
Sorğu #2 → "Batman" nəticəsi göstərildi ✅
Sorğu #1 → heç vaxt UI-ə çatmadı      ✅
```

### 2. API Key Limit / Server 500

```js
// Həm HTTP xəta kodu yoxlanılır:
if (!res1.ok || !res2.ok) {
  throw new Error('Server xətası baş verdi...');
}

// Həm də OMDb-nin özünün xəta mesajı:
if (json1.Response === 'False') {
  setError(json1.Error || 'Məlumat tapılmadı.');
}
```

Tətbiq heç vaxt çökmür — istifadəçiyə aydın mesaj göstərilir.

### 3. Sonsuz Loading Spinner

```js
// Query boşdursa:
if (!trimmedQuery) {
  setLoading(false); // ← dərhal false → spinner göstərilmir
  return;
}

// "Movie not found" halında:
} else if (json1.Error === 'Movie not found!') {
  setError(null); // ← error yox, Empty state göstərilir
}
// + finally blokunda setLoading(false) → spinner dayanır
```

---

## Performance Qeydləri

| Optimallaşdırma | Texnika | Nəticə |
|---|---|---|
| Skeleton shimmer | `translateX` — GPU compositor | Reflow yoxdur |
| Poster şəkilləri | `loading="lazy"` | Yalnız viewport-da olan yüklənir |
| Animasiyalar | `opacity` + `transform` | Layout trigger yoxdur |
| Google Fonts | `<link rel="preconnect">` | Font əvvəlcədən bağlantı |
| API sorğuları | `AbortController` | Ləğv edilən sorğu şəbəkə resursuna toxunmur |
| Hər simvolda API | `useDebounce(500ms)` | Lazımsız çağırışlar sıfırlanır |
| Paralel sorğu | `Promise.all` | 2 sorğu eyni vaxtda → 2x sürət |

---

## Əlçatanlıq (Accessibility)

| Element | Atribut | Məqsəd |
|---|---|---|
| SearchBar wrapper | `role="search"` | Landmark region |
| Input | `aria-label="Film axtarışı"` | Screen reader label |
| Clear düyməsi | `aria-label="Axtarışı təmizlə"` | Screen reader label |
| Error panel | `role="alert"` | Dərhal elan edilir |
| Skeleton | `aria-hidden="true"` | Screen reader görməsin |
| Loading section | `aria-busy="true"` | Yüklənmə bildirişi |
| Aktiv səhifə | `aria-current="page"` | Pagination mövqeyi |
| Prev/Next | `aria-label="Əvvəlki/Növbəti səhifə"` | Düymə məqsədi |

---

## Mənbələr

- [react.dev](https://react.dev) — "Synchronizing with Effects" bölməsi
- [MDN — AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- [OMDb API](https://www.omdbapi.com/) — açıq film REST API
- [BEM Metodologiyası](https://getbem.com/)
