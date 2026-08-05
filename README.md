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
- Webkit prefiksi yoxdur — yalnız standart CSS
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

> **Checkpoint-3** · `useDebounce` custom hook · **15 bal**

### Nələr edildi?
- `src/hooks/useDebounce.js` faylı yaradıldı.
- İstifadəçi daxil etdiyi mətni 500ms ləngitmə ilə (`setTimeout` + `clearTimeout`) emal edir.
- Hər hərf yazıldıqda gereksiz API çağırışlarının qarşısı alındı, şəbəkə trafiki optimallaşdırıldı.

---

## Checkpoint-4 — UI State-lərin İdarə Edilməsi (15 bal)

> **Checkpoint-4** · Loading, Error, Empty və Prompt state-ləri · **15 bal**

### Nələr edildi?
- **Loading State**: `ResultsList` daxilində 10 ədəd skeleton shimmer kartı göstərilir.
- **Error State**: Şəbəkə, API və server xətaları `role="alert"` ilə xüsusi xəta konteynerində təqdim edilir.
- **Empty State**: Axtarış üzrə heç nə tapılmadıqda ("Nəticə tapılmadı") xüsusi boş hal göstərilir, loading sonsuz fırlanmır.
- **Prompt State**: Axtarış mətni daxil edilmədikdə istifadəçini yönləndirən ilkin ekran göstərilir.

---

## Checkpoint-5 — Səhifələmə / Pagination (15 bal)

> **Checkpoint-5** · `Pagination` komponenti & API Səhifələməsi · **15 bal**

### Nələr edildi?
- OMDb API-dən gələn `totalResults` dəyərinə əsasən dinamik səhifə sayı hesablanır (`Math.ceil(totalResults / 10)`).
- Səhifə dəyişdikdə `useFetch` avtomatik olaraq həmin səhifənin məlumatlarını çəkir və səhifənin yuxarısına rahat `smooth` scroll edir.
- Axtarış sözü dəyişdikdə səhifələmə avtomatik 1-ci səhifəyə sıfırlanır.

---

## Checkpoint-6 — Hook-ların Düzgün İstifadəsi (15 bal)

> **Checkpoint-6** · Dependency Array dürüstlüyü & Cleanup mexanizmi · **15 bal**

### Nələr edildi?
- `useEffect` hook-larının dependency array-ləri (`[query, page]`, `[value, delay]`) dəqiq müəyyən edildi.
- `useDebounce` daxilində `clearTimeout` cleanup-ı ilə yaddaş sızmasının (memory leak) qarşısı alındı.
- `useFetch` daxilində `controller.abort()` cleanup-ı ilə köhnə sorğuların ləğvi təmin olundu.

---

## Checkpoint-7 — Kod Təşkili & Keyfiyyət Yoxlamaları (10 bal)

> **Checkpoint-7** · Senior Kod Arxitekturası & Clean Code · **10 bal**

### Nələr edildi?
- Kod arxitekturası modulyar custom hook-lara (`useFetch`, `useDebounce`) bölündü.
- BEM metodologiyası, Semantik HTML və A11y (əlçatanlıq) standartları tam tətbiq edildi.
- Race Condition, API Limiting və Boş state idarəetməsi kimi keyfiyyət yoxlamalarından keçdi.

---

## Sürət və Performans Məsləhətləri (Performance Notes)

- **Skeleton shimmer** → `translateX` ilə GPU-da işlənir
- **Poster şəkilləri** → `loading="lazy"` — yalnız görünən şəkillər yüklənir
- **Animations** → `opacity` + `transform` — compositor-only, `layout` triggeri yoxdur
- **Font preconnect** → `index.html`-də Google Fonts üçün `<link rel="preconnect">`
- **Race Condition Prevention** → `AbortController` ilə ləğv edilən sorğular şəbəkə resursuna qənaət edir
- **Debounce Optimization** → 500ms delay ilə ləğv edilən gereksiz API çağırışları


