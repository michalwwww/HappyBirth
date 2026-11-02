# HappyBirth · Dashboard Operacyjny Project Managera (SSOT)
**Stan na dzień:** 2 listopada 2026 r., godz. 12:25 CET  
**Rola:** Technical & Commercial Project Manager  
**Tryb wdrożenia:** Pełne wdrożenie produkcyjne kodu, funkcji Edge i bazy D1 w **Trybie Weryfikacyjnym Stripe (`TEST MODE` — `sk_test_...` / `pk_test_...`)** przed przełączeniem na klucze Live.

---

## 1. Tablica Statusu Wdrożenia (Master Plan 27.10–02.11.2026)

| ID | Zakres Operacyjny | Właściciel | Status | Weryfikacja Techniczna / DoD |
|:---|:---|:---:|:---:|:---|
| **A1–A3** | Parametry oferty: **489,00 zł brutto** (VAT 23% wliczony), **18 miesięcy (548 dni)** dostępu od zakupu, **8 modułów / 52 lekcje 4K (288 min)** | Michał / Antigravity | **WDROŻONE (PASS)** | Dane z odpisu KRS (`KLARSOLUTIONS Sp. z o.o.`, `KRS: 0001268396`, `NIP: 7812118273`, `REGON: 545782779`) i parametry oferty zsynchronizowane w całej aplikacji, regulaminie i `llms.txt`. |
| **A4** | Wyłączenie publicznych kodów darmowych (`TEST`, `TEST100`, `FREE`, `100%`) | Michał / Antigravity | **WDROŻONE (PASS)** | Blokada w `lib/promo.ts`, `/api/stripe/checkout`, `/api/stripe/verify-session` oraz w funkcjach Edge (`functions/api/stripe/*`). |
| **A6** | Odblokowanie podstron `/program` i `/o-nas` dla AEO/SEO + `sitemap.xml` + `llms.txt` | Michał / Antigravity | **WDROŻONE (PASS)** | Statyczny HTML z pełnym spisem 52 lekcji, 8 modułów i biogramami ekspertek ze szkoły rodzenia **Mama Gaja**. |
| **B2–B5** | Otwarta Lekcja 1 bez logowania (`<FreeLessonPreview />`), Order Bump `+49,00 zł` i ochrona Omnibus (`489,00 zł`) | Michał / Antigravity | **WDROŻONE (PASS)** | Lekcja 1 dostępna publicznie; lekcje `02–52` za paywallem Edge HMAC-SHA256; Order Bump podnosi koszyk z `489,00 zł` do `538,00 zł`. |
| **C1–C4** | Strażnik 18 miesięcy (`548 dni`), Auto-Resume co 15s, Certyfikat PDF (`min. 80%`) i Boks Poleceń (`MAMA-XXXX`) | Michał / Antigravity | **WDROŻONE (PASS)** | Kod `MAMA-XXXX` daje koleżance `-10%` (`440,10 zł`) i w 0 sekund odblokowuje e-book PDF *„Szybkie i Odżywcze Obiady w 15 Minut”*. |
| **D1b–D4a** | Trójpodział współpracy (`/partnerzy` B2B + `/afiliacja` 2-Tier Capped CPA `20–30% + 5% Broker`) | Michał / Antigravity | **WDROŻONE (PASS)** | 30-dniowe ciasteczko `hb_aff_ref` (`HttpOnly`), nadrzędność kodu wpisanego w koszyku nad linkiem `?ref=`, blokada self-referral. |
| **E1–E5** | Tarcza Prawna Art. 38 ust. 1 pkt 13 u.p.k. + przycisk `/odstap-od-umowy` (wymóg 19.06.2026) + Izolacja RODO/Ad-Bot | Michał / Antigravity | **WDROŻONE (PASS)** | Dwa niezaznaczone domyślnie checkboxy w koszyku, rejestr dowodowy SHA-256 w `orders`, automatyczna odmowa zwrotu po otwarciu kursu (`first_content_accessed_at IS NOT NULL`), blokada `403` dla botów reklamowych w `/strefa`, `/partnerzy`, `/afiliacja`. |
| **F2–F4** | Mikro-narzędzia Lead Magnet (`/plan-porodu`, `/kalkulator-wyprawki`), sekwencja 4 maili CRM i pakiet Outreach (30 podmiotów) | Michał / Antigravity | **WDROŻONE (PASS)** | Gotowe generatory A4 do druku/PDF, endpoint `/api/leads` oraz pakiet w `wersja_27_10_2026/PAKIET_OUTREACH_F2_ORAZ_SEKWENCJA_CRM_F4.md`. |
| **D1 DB** | Migracja schematu 13 tabel Cloudflare D1 (`local` + `remote`) | Michał / Antigravity | **WDROŻONE (PASS)** | Wszystkie 13 tabel i kolumny (`users`, `enrollments`, `orders`, `withdrawal_requests`, `lesson_progress`, `certificates`, `student_referrals`, `affiliates`, `affiliate_commissions`, `partnership_inquiries`, `auth_tokens`, `contraction_sessions`, `leads`) zsynchronizowane lokalnie i zdalnie. |
| **STRIPE** | Weryfikacja płatności w trybie testowym (`sk_test_...` / `pk_test_...`) | Zespół | **AKTYWNY TRYB TESTOWY** | Kasa i weryfikacja sesji (`cs_test_...`) działają w trybie testowym Stripe. Po zatwierdzeniu testów E2E przez zespół — podmiana na klucze `sk_live_...` / `pk_live_...`. |

---

## 2. Inwentaryzacja Techniczna i Kompilacja

- **Next.js 15 Build (`npm run build`):** `PASS` (0 błędów TypeScript/ESLint, **93/93 strony statyczne SSG**).
- **Eksport statyczny + Edge Functions (`npm run export:pages`):** `PASS` (katalog `out/` + pełna obsługa Cloudflare Pages Functions w `functions/api/*` oraz `functions/_middleware.ts`).
- **Weryfikacja programu kursu (`scripts/verify-course.ts`):** `PASS` (52 unikalne lekcje VOD z przypisanymi identyfikatorami Cloudflare Stream).

---

## 3. Checklista Przełączenia na Produkcję (Go-Live Switch)

Po zakończeniu testów weryfikacyjnych przez zespół, aby przełączyć bramkę na płatności rzeczywiste:
1. W panelu Cloudflare Pages (`Settings -> Environment variables`) podmienić `STRIPE_SECRET_KEY` na `sk_live_...`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` na `pk_live_...`, `NEXT_PUBLIC_STRIPE_PRICE_ID` na produkcyjny identyfikator ceny `489,00 PLN` oraz `STRIPE_WEBHOOK_SECRET` na klucz produkcyjnego webhooka (`https://happybirth.pl/api/stripe/webhook`).
2. Upewnić się, że w Cloudflare Pages ustawiony jest klucz `RESEND_API_KEY` dla domeny `happybirth.pl` (wysyłka potwierdzeń na trwałym nośniku i magic linków).
3. Wykonać jedną rzeczywistą transakcję kontrolną BLIK/karta i potwierdzić odbiór maila z potwierdzeniem Art. 38 ust. 1 pkt 13 u.p.k.
