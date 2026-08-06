# FilmAxtarış — React Search App

> **Checkpoint-1** · Layihə qurulumu + Komponent strukturu · **10 bal**

---

## Layihə haqqında

OMDb açıq API-yə qoşulan, axtarış, loading/error state-ləri və səhifələmə funksiyasına sahib React tətbiqi.  
Bu checkpoint-də layihənin bünövrəsi — Vite + React qurulumu və bütün komponent strukturu qurulub.

---

## Texnologiyalar

| Texnologiya | Versiya | Səbəb |
|---|---|---|
| **Vite** | 8.x | Ultra-sürətli HMR, minimal konfiqurasiya |
| **React** | 19.x | Hooks-əsaslı komponent arxitekturası |
| **Vanilla CSS** | — | BEM metodologiyası, sıfır asılılıq |
| **Inter** | Google Fonts | Əvvəlki layihələrlə eyni tip sistemi |

---

## Qurulum

```bash
npm install
npm run dev
```

Tətbiq `http://localhost:5173` ünvanında açılacaq.

---

## Fayl strukturu

```
src/
├── main.jsx                         # React root mount
├── index.css                        # Global reset + CSS design tokens (:root)
├── App.jsx                          # Ana komponent — state idarəsi
├── App.css                          # Layout: app, app-header, app-main blokları
└── components/
    ├── SearchBar/
    │   ├── SearchBar.jsx            # Controlled input, clear düyməsi
    │   └── SearchBar.css            # BEM: search-bar__icon/input/clear
    ├── ResultsList/
    │   ├── ResultsList.jsx          # 4 vəziyyət: loading/error/empty/nəticələr
    │   └── ResultsList.css          # BEM: results-list__state--prompt/empty/error
    ├── Card/
    │   ├── Card.jsx                 # Film kartı — poster, badge, lazy load
    │   └── Card.css                 # BEM: card__poster-wrap/body/title/year
    └── Pagination/
        ├── Pagination.jsx           # Smart ellipsis range ([1,…,4,5,6,…,12])
        └── Pagination.css           # BEM: pagination__btn--active/ellipsis
```

---

## Komponentlər

### `SearchBar`

Nəzarət olunan (`controlled`) input komponenti.

```jsx
<SearchBar
  value={query}
  onChange={handleQueryChange}
  placeholder="Film adı axtar..."
/>
```

**Xüsusiyyətlər:**
- Daxili `clear` düyməsi — mətn varsa avtomatik göstərilir
- `focus-within` ilə axtarış ikonunun rəng dəyişməsi
- `aria-label`, `role="search"` — tam əlçatanlıq

---

### `ResultsList`

4 fərqli vəziyyəti idarə edir:

| Vəziyyət | Şərt | UI |
|---|---|---|
| **Prompt** | `query` boşdur | Axtarış et mesajı |
| **Loading** | `loading={true}` | 10 ədəd skeleton kart |
| **Error** | `error` string-dir | Xəta mesajı (`role="alert"`) |
| **Empty** | `items.length === 0` | Tapılmadı mesajı |
| **Nəticələr** | Normal hal | Responsive grid + meta |

```jsx
<ResultsList
  items={paginatedItems}
  loading={loading}
  error={error}
  query={query}
  total={totalItems}
/>
```

---

### `Card`

Tək axtarış nəticəsi (film/serial/bölüm).

**Xüsusiyyətlər:**
- `loading="lazy"` + `decoding="async"` — şəkil yükləməsi optimallaşdırılıb
- `N/A` poster üçün SVG placeholder
- `aspect-ratio: 2/3` — poster ölçüsü sabitdir, layout shift yoxdur

---

### `Pagination`

Ağıllı səhifələr sırası ilə nav komponenti.

```
[←]  [1]  [...]  [4]  [5]  [6]  [...]  [12]  [→]
```

**Xüsusiyyətlər:**
- `buildPageRange()` — 7-dən çox səhifədə ellipsis göstərir
- `aria-current="page"` — aktiv səhifə screen reader-lər üçün işarələnib
- Sərhəddə olan `prev/next` düymələri `disabled` vəziyyətinə keçir

---

## CSS Metodologiyası

Bütün stillər **BEM** (Block–Element–Modifier) konvensiyası ilə yazılıb:

```
.block { }
.block__element { }
.block__element--modifier { }
```

**Nümunə:**

```css
/* Block */
.pagination { }

/* Element */
.pagination__btn { }
.pagination__ellipsis { }

/* Modifier */
.pagination__btn--active { }
```

**Qaydalar:**

- Animasiyalar `transform` + `opacity` ilə — compositor thread, reflow yoxdur
- CSS custom properties (`--var`) design token sistemi kimi

---

## Checkpoint-2 — API inteqrasiyası (fetch) & useEffect (20 bal)

> **Checkpoint-2** · API inteqrasiyası + `useEffect` + `useFetch` custom hook · **20 bal**

### Nələr edildi?

1. **Custom Hook (`useFetch`)**:
   - `src/hooks/useFetch.js` faylı yaratdıq.
   - `useEffect` daxilində OMDb REST API-yə (`https://www.omdbapi.com/`) async `fetch` sorğusu göndərilir.
   - `data`, `totalResults`, `loading`, və `error` state-ləri hook vasitəsilə qaytarılır.

2. **Race Condition Müdafiəsi (AbortController)**:
   - `useEffect` daxilində `AbortController` yaradıldı və `signal` parameteri `fetch`-ə ötürüldü.
   - İstifadəçi tez-tez axtarış sözünü dəyişdikdə və ya səhifələrə keçdikdə `cleanup` funksiyası (`controller.abort()`) köhnə sorğunu avtomatik ləğv edir.
   - Köhnə API cavabının yeni nəticəni əvəz etməsi (Race condition bug-ı) tam olaraq həll edildi.

3. **Xəta İdarəetməsi (Error Handling)**:
   - Şəbəkə xətaları, 500/404 server xətaları və OMDb API xətaları (`Response: "False"`, `"Too many results."`) tutulur və istifadəçiyə aydın mesaj göstərilir.
   - Ləğv edilən sorğular üçün (`AbortError`) xəta mesajı verilmir.

---

## Checkpoint-3 — Axtarışda Debounce (15 bal)

> **Checkpoint-3** · `useDebounce` custom hook (500ms delay) · **15 bal**

### Nələr edildi?

1. **Custom Hook (`useDebounce`)**:
   - `src/hooks/useDebounce.js` faylı yaradıldı.
   - `setTimeout` və `clearTimeout` mexanizmi ilə daxil edilən axtarış mətni 500ms ləngidilir.

2. **Şəbəkə Optimallaşdırılması (Performance)**:
   - İstifadəçi klaviaturada hərf-hərf yazarkən hər simvolda API-yə gereksiz sorğular göndərilmir.
   - Yalnız istifadəçi yazmanı dayandırdıqdan 500ms sonra tək bir API sorğusu icra edilir.

3. **Sorğunun Ləğvi (Cleanup)**:
   - `useEffect` cleanup funksiyası daxilində `clearTimeout(handler)` istifadə edilərək hər yeni simvolda köhnə taymer ləğv olunur və yaddaş sızması önlənir.

---

## Checkpoint-4 — UI State-lərin İdarə Edilməsi & Film Sayının Artırılması (15 bal)

> **Checkpoint-4** · Loading, Error, Empty, Prompt state-ləri & 20 Film/Səhifə · **15 bal**

### Nələr edildi?

1. **Filmlərin Sayının Artırılması (20 Film/Səhifə)**:
   - `useFetch` custom hook-unda `Promise.all` tətbiq olunaraq OMDb-dən paralel 2 səhifə çəkilir.
   - Hər səhifədə **10 film əvəzinə 20 film nəticəsi** təqdim olunur.
   - Təkrarlanan filmlərin qarşısı unikal `imdbID` Map filtri ilə alınır.

2. **Loading State (Skeleton Shimmer)**:
   - Sorğu göndərildikdə `ResultsList` daxilində 10 ədəd skeleton shimmer kartı göstərilir.
   - Shimmer animasiyası GPU-accelerated (`translateX`) işləyir.

3. **Error State (Xəta paneli)**:
   - Şəbəkə kəsilməsi, HTTP xətaları (500/404) və API xətaları (`Response: "False"`, `"Too many results."`) tutulur.
   - Screen reader-lər üçün `role="alert"` atributlu bildiriş paneli göstərilir.

4. **Empty State (Boş nəticə)**:
   - Axtarış üzrə heç nə tapılmadıqda ("Nəticə tapılmadı") xüsusi boş hal göstərilir, loading fırlanması sonsuz olmur.

5. **Prompt State (İlkin hal)**:
   - Axtarış mətni daxil edilmədikdə istifadəçini yönləndirən ilkin "Film axtar" ekranı təqdim edilir.

---

## Checkpoint-5 — Səhifələmə / Pagination (15 bal)

> **Checkpoint-5** · `Pagination` komponenti & Dinamik API Səhifələməsi · **15 bal**

### Nələr edildi?

1. **Dinamik Səhifələmə Hesablanması**:
   - OMDb API-dən gələn `totalResults` sayına əsasən ümumi səhifə sayı dəqiq hesablanır (`Math.ceil(totalResults / 20)`).
   - Hər görünən səhifə üçün API-yə uyğun olan OMDb `page` parametrləri göndərilir.

2. **Ağıllı Ellipsis Range (`buildPageRange`)**:
   - Səhifə sayı çox olduqda `[1, '...', 4, 5, 6, '...', 15]` formatında ağıllı diapazon göstərilir.
   - Sərhəddə olan (1-ci səhifədə `Əvvəlki` və sonuncu səhifədə `Növbəti`) düymələr avtomatik `disabled` halına keçir.

3. **İstifadəçi Təcrübəsi & State Reseti**:
   - Səhifə dəyişdikdə tətbiq avtomatik və rahat şəkildə yuxarıya (`window.scrollTo({ top: 0, behavior: 'smooth' })`) sürüşür.
   - Axtarış sözü dəyişdikdə səhifələmə avtomatik 1-ci səhifəyə sıfırlanır.
   - Aktiv səhifə düyməsi screen reader-lər üçün `aria-current="page"` atributu ilə işarələnir.

---

## Checkpoint-6 — Hook-ların Düzgün İstifadəsi (15 bal)

> **Checkpoint-6** · Dependency Array Dürüstlüyü & Clean-up Mexanizmləri · **15 bal**

### Nələr edildi?

1. **Dəqiq Dependency Array-lər**:
   - `useFetch` hook-unda `useEffect` dependency array-ı `[query, page]` olaraq dəqiq müəyyənləşdirildi. Yalnız bu arqumentlər dəyişdikdə fetch effekti yenidən icra olunur (unnecessary re-render-lər önləndi).
   - `useDebounce` hook-unda dependency array `[value, delay]` dəqiqliyi ilə saxlanıldı.

2. **Yaddaş Sızmasının Qarşısının Alınması (`clearTimeout`)**:
   - `useDebounce` daxilində `useEffect` cleanup funksiyası `return () => clearTimeout(handler);` vasitəsilə hər yeni hərf yazıldıqda evvelki taymerləri avtomatik təmizləyir.

3. **Köhnə Sorğuların Şəbəkə Səviyyəsində Ləğvi (`AbortController`)**:
   - `useFetch` daxilində sorğu başladıqda `new AbortController()` yaradılır və cleanup funksiyası `controller.abort()` vasitəsilə tamamlanmamış köhnə HTTP sorğularını şəbəkə səviyyəsində ləğv edir.
   - Sorğu ləğv edildikdə `err.name === 'AbortError'` yoxlanaraq xəta state-inin lüzumsuz yenilənməsi əngəllənir.

---

## Sürət məsləhətləri (Performance Notes)

- **Skeleton shimmer** → `translateX` ilə GPU-da işlənir
- **Poster şəkilləri** → `loading="lazy"` — yalnız görünən şəkillər yüklənir
- **Animations** → `opacity` + `transform` — compositor-only, `layout` triggeri yoxdur
- **Font preconnect** → `index.html`-də Google Fonts üçün `<link rel="preconnect">`
- **Race Condition Prevention** → `AbortController` ilə ləğv edilən sorğular şəbəkə resursuna qənaət edir
- **Debounce Optimization** → 500ms delay ilə ləğv edilən gereksiz API çağırışları
- **Parallel Page Fetching** → `Promise.all` vasitəsilə 2 paralel OMDb səhifəsi çəkilərək 20 film nümayişi




