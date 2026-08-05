Qiymətləndirmə meyarları

Layihə qurulumu (Vite + React), komponent strukturu (SearchBar, ResultsList, Card, Pagination) (10 bal)
API inteqrasiyası (fetch/axios), useEffect ilə data çəkmə (20 bal)
Axtarışda debounce (hər hərfdə API çağırışı olmamalı) (15 bal)
Loading, error və boş (empty) state-lərin ayrı-ayrı göstərilməsi (15 bal)
Pagination və ya infinite scroll (15 bal)
Hook-ların düzgün istifadəsi (dependency array, cleanup funksiyası ilə köhnə sorğunun ləğvi) (15 bal)
Kod təşkili (data çəkmə üçün custom hook, məs. useFetch) (10 bal)

Keyfiyyət yoxlamaları

Race condition: istifadəçi "Bat" yazır, sonra sürətlə "Batman" yazır — "Bat" üçün API cavabı gecikib "Batman" nəticəsini əvəz edə bilər. AbortController və ya "köhnə cavabı görməzdən gəl" məntiqi olmadan bu bug yaranacaq. Bu, junior React inkişaf etdiricilərini ayıran klassik test nöqtəsidir.
API key limiti aşıldıqda və ya API 500 qaytardıqda tətbiq çökməməli, istifadəçiyə aydın mesaj göstərilməlidir.
Axtarış nəticəsi boşdursa, "loading" spinner sonsuz dövr etməməlidir.

Mənbələr

react.dev — rəsmi React sənədləşdirməsi ("Synchronizing with Effects" bölməsi)
YouTube: Web Dev Simplified və ya Codevolution — React Hooks seriyaları
freeCodeCamp — React kursu
MDN Web Docs — AbortController sənədləşdirməsi

Məqsəd

Açıq REST API-yə (məsələn OMDb, ya oxşar açıq API) qoşulan, axtarış, loading/error state-ləri və səhifələmə (pagination) olan React tətbiqi qurmaq.

checkpoint-1:Layihə qurulumu (Vite + React), komponent strukturu (SearchBar, ResultsList, Card, Pagination) Qiymətləndirmə: 10 bal. Bu mərhələdə gördüyünüz işi tələb olunan formada təqdim edin.
checkpoint-2:API inteqrasiyası (fetch/axios), useEffect ilə data çəkmə Qiymətləndirmə: 20 bal. Bu mərhələdə gördüyünüz işi tələb olunan formada təqdim edin.
checkpoint-3:Axtarışda debounce (hər hərfdə API çağırışı olmamalı) Qiymətləndirmə: 15 bal. Bu mərhələdə gördüyünüz işi tələb olunan formada təqdim edin.
checkpoint-4:
checkpoint-5:
checkpoint-6:
checkpoint-7: