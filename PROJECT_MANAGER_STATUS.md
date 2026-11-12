# HappyBirth · Dashboard Operacyjny Project Managera (SSOT)
**Stan na dzień:** 4 listopada 2026 r., godz. 21:45 CET  
**Rola:** Technical & Commercial Project Manager  
**Tryb wdrożenia:** **PEŁNY TRYB PRODUKCYJNY (`LIVE MODE` — `acct_1UY4JZEH677qRgtB`, `cs_live_...`)** wdrożony z twardą izolacją subdomen na `https://happybirth.pl`, `https://strefa.happybirth.pl`, `https://partnerzy.happybirth.pl` oraz `https://afiliacja.happybirth.pl`.

---

## 1. Tablica Statusu Wdrożenia (Master Plan 27.10–04.11.2026)

| ID | Zakres Operacyjny | Właściciel | Status | Weryfikacja Techniczna / DoD |
|:---|:---|:---:|:---:|:---|
| **A1–A3** | Parametry oferty: **489,00 zł brutto** (VAT 23% wliczony), **18 miesięcy (548 dni)** dostępu od zakupu, **8 modułów / 52 lekcje 4K (288 min)** | Michał / Antigravity | **WDROŻONE (PASS)** | Dane z odpisu KRS (`KLARSOLUTIONS Sp. z o.o.`, `KRS: 0001268396`, `NIP: 7812118273`, `REGON: 545782779`) i parametry oferty zsynchronizowane w całej aplikacji, regulaminie, `llms.txt` oraz `llms-full.txt`. |
| **A4** | Wyłączenie publicznych kodów darmowych (`TEST`, `TEST100`, `FREE`, `100%`) i blokada prowizji od `VIP100` / `0 PLN` | Michał / Antigravity | **WDROŻONE (PASS)** | Blokada w `lib/promo.ts`, `/api/stripe/checkout`, `/api/stripe/verify-session`, `functions/api/stripe/webhook.ts` oraz `app/api/stripe/webhook/route.ts` (dynamiczna baza kursu z odjęciem Order Bumpa i wielowalutowością). |
| **A6** | Odblokowanie podstron `/program`, `/o-nas` oraz nowego hubu E-E-A-T `/dla-ciebie` dla AEO/SEO/GEO + `sitemap.xml` (`2026-11-04`) + `llms.txt` | Michał / Antigravity | **WDROŻONE (PASS)** | Statyczny HTML z pełnym spisem 52 lekcji, 8 modułów, biogramami ekspertek **Mama Gaja** oraz kompendium 21 praw ze Standardu Opieki Okołoporodowej 2026 (Dz.U. 2025 poz. 1525) z bezpośrednimi linkami do ISAP Sejm. |
| **B2–B5** | Otwarta Lekcja 1 bez logowania (`<FreeLessonPreview />`), Order Bump `+49,00 zł` i ochrona częściowego zwrotu (`[D5a]`) | Michał / Antigravity | **WDROŻONE (PASS)** | Lekcja 1 dostępna publicznie; lekcje `02–52` za paywallem Edge HMAC-SHA256; częściowy zwrot Order Bumpa (`charge.refunded` partial) nie odbiera dostępu do 52 lekcji kursu głównego. |
| **C1–C4** | Strażnik 18 miesięcy (`548 dni`), Auto-Resume co 15s, Certyfikat PDF (`min. 80%`) i Boks Poleceń (`MAMA-XXXX`) | Michał / Antigravity | **WDROŻONE (PASS)** | Kod `MAMA-XXXX` daje koleżance `-10%` (`440,10 zł`) i w 0 sekund odblokowuje e-book PDF *„Szybkie i Odżywcze Obiady w 15 Minut”*. |
| **D1b–D4a** | Ścisła izolacja subdomen (`partnerzy.happybirth.pl` B2B + `afiliacja.happybirth.pl` 2-Tier Capped CPA `20–30% + 5% Broker`) — usunięcie podstron `/afiliacja` i `/partnerzy` z `happybirth.pl` | Michał / Antigravity | **WDROŻONE (PASS)** | Na `happybirth.pl` ścieżki `/afiliacja*`, `/partnerzy*`, `/marketing*`, `/challenge*` zwracają twarde `404 Not Found` (`noindex`). Zamknięto lukę statycznego eksportu `.html`/`.txt` w `functions/_middleware.ts`. |
| **E1–E5** | Tarcza Prawna Art. 38 ust. 1 pkt 13 u.p.k. + przycisk `/odstap-od-umowy` (wymóg 19.06.2026) + Izolacja RODO/Ad-Bot | Michał / Antigravity | **WDROŻONE (PASS)** | Dwa niezaznaczone domyślnie checkboxy w koszyku, rejestr dowodowy SHA-256 w `orders`, automatyczna odmowa zwrotu po otwarciu kursu (`first_content_accessed_at IS NOT NULL`), blokada `403` dla botów reklamowych na subdomenach operacyjnych. |
| **F2–F4** | Mikro-narzędzia Lead Magnet (`/plan-porodu`, `/kalkulator-wyprawki`), pełna sekwencja 4 maili CRM (`0h`, `+48h`, `+96h`, `+168h` przez Resend `scheduled_at`) i pakiet Outreach | Michał / Antigravity | **WDROŻONE (PASS)** | Gotowe generatory A4 do druku/PDF, pełne harmonogramowanie 4 maili w `functions/api/leads.ts` i `app/api/leads/route.ts` z nagłówkami RFC 8058 (`List-Unsubscribe`). |
| **D1 DB** | Migracja schematu 13 tabel Cloudflare D1 (`local` + `remote`) | Michał / Antigravity | **WDROŻONE (PASS)** | Wszystkie 13 tabel i kolumny (`users`, `enrollments`, `orders`, `withdrawal_requests`, `lesson_progress`, `certificates`, `student_referrals`, `affiliates`, `affiliate_commissions`, `partnership_inquiries`, `auth_tokens`, `contraction_sessions`, `leads`) zsynchronizowane lokalnie i zdalnie. |
| **STRIPE** | Produkcyjna bramka płatności (`LIVE MODE` — `acct_1UY4JZEH677qRgtB`, BLIK, Karty, Apple/Google Pay) | Michał / Antigravity | **WDROŻONE (LIVE PASS)** | Produkt główny (`prod_VZDFMnoll6uY6Q`, `price_1UY4pQEH677qRgtBYLHWVdfK` — 489,00 PLN inclusive), Order Bump (`prod_VZDFzNYoE5DbXf`, `price_1UY4pREH677qRgtBqCutkzSJ` — 49,00 PLN inclusive), 11 kodów `-10%` oraz webhook `we_1UY4r5EH677qRgtBzLcQJUCF` aktywne na `https://happybirth.pl/api/stripe/webhook`. |
| **RESEND** | Poczta transakcyjna dla domeny `happybirth.pl` (`DKIM`, `SPF`, `DMARC` — `Verified`) | Michał / Antigravity | **WDROŻONE (LIVE PASS)** | Klucz `RESEND_API_KEY` oraz nadawca `Szkoła Rodzenia HappyBirth <kontakt@happybirth.pl>` aktywne dla Magic Linków, potwierdzeń na trwałym nośniku oraz 4-mailowej sekwencji CRM (`scheduled_at`). |

---

## 2. Architektura Izolacji Subdomen (Anti-Ban & Security Firewall)

1. **`https://happybirth.pl` (Domena główna B2C / E-E-A-T / Meta & Google Ads Landing):**
   - Dostępne wyłącznie strony konsumenckie: `/`, `/dla-ciebie`, `/program`, `/o-nas`, `/plan-porodu`, `/kalkulator-wyprawki`, `/regulamin`, `/polityka-prywatnosci`, `/odstap-od-umowy`.
   - Ścieżki `/afiliacja`, `/partnerzy`, `/marketing`, `/challenge` (w tym `.html` i `.txt`) są całkowicie zablokowane i zwracają `404 Not Found` (zero przekierowań `301` łączących domenę konsumencką z programem CPA).
2. **`https://strefa.happybirth.pl` (Portal VOD i Narzędzia Medyczne Kursantki):**
   - Chroniona sesją HMAC-SHA256 (`hb_session`), nagłówkiem `X-Robots-Tag: noindex, nofollow, noarchive` oraz zaporą `403` dla crawlerów reklamowych (`Facebot`, `AdsBot-Google`, `Bytespider`).
   - Zero skryptów Meta Pixel / TikTok Pixel (ochrona danych o zdrowiu — Art. 9 RODO).
3. **`https://partnerzy.happybirth.pl` (Subdomena B2B dla Marek, Klinik i Pracodawców):**
   - Serwuje wyłącznie wizytówkę B2B na `/` (brak podstron `/afiliacja` czy `/strefa` — każda inna ścieżka zwraca `404`).
4. **`https://afiliacja.happybirth.pl` (Subdomena Programu Prowizyjnego dla Położnych i Twórców):**
   - Serwuje wyłącznie stronę programu afiliacyjnego na `/` (brak podstron `/partnerzy` czy `/strefa` — każda inna ścieżka zwraca `404`).
