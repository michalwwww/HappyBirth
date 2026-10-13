# HappyBirth · Dashboard Operacyjny Project Managera (SSOT)
**Stan na dzień:** 4 października 2026 r., godz. 20:20 CEST  
**Rola:** Technical & Commercial Project Manager  
**Cel nadrzędny:** Bezpieczne otwarcie sprzedaży komercyjnej (Launch Day: 15 października 2026 r. / T-11 dni)

---

## 1. Tablica Statusu Sprintu Przedstartowego

```
[4 PAŹDZIERNIKA 2026] ────► [15 PAŹDZIERNIKA 2026] ────► [2 LISTOPADA 2026]
 Dziś (T-11)                 Planowany Start            Termin Rezerwowy
 Stan: Na ścieżce             Wariant Realny (Sprint 100)  Wariant Pesymistyczny
```

| ID | Data Docelowa | Zadanie Operacyjne | Właściciel | Status | Uwagi i Zależności |
|:---|:---|:---|:---:|:---:|:---|
| **KRS** | 04.10.2026 | Uzupełnienie danych rejestrowych spółki | PM / Michał | **ZROBIONE** | Dane z odpisu KRS (KRS 0001268396, NIP 7812118273, REGON 545782779) wdrożone w `dane.json` i Next.js. |
| **B1** | 05.10.2026 | Konfiguracja poczty domenowej `happybirth.pl` | Michał | **W TOKU** | Rekordy Cloudflare DNS: MX, SPF, DKIM, DMARC; utworzenie skrzynki `kontakt@happybirth.pl`. |
| **S3** | 06.10.2026 | Weryfikacja produkcyjna Stripe (KLARSOLUTIONS) | Michał | **ZAPLANOWANE** | BLIK i karty w PLN, produkt 489 zł brutto, webhook, konto bankowe spółki. |
| **B5/S4** | 07.10.2026 | Zabezpieczenie Strefy Kursantki (Cloudflare Stream) | Michał | **ZAPLANOWANE** | Podpisane wygasające tokeny wideo; `robots.txt` z `Disallow: /strefa/*`; 0 pikseli w strefie. |
| **G1** | 09.10.2026 | Złożenie wniosków o granty chmurowe | Zespół | **ZAPLANOWANE** | Cloudflare for Startups, Google for Startups Cloud. |
| **S6** | 12.10.2026 | E-maile transakcyjne w Resend | Michał | **ZAPLANOWANE** | Potwierdzenie zamówienia z PDF (trwały nośnik, art. 38 pkt 13), magic link, zaproszenie partnera. |
| **S7** | 13.10.2026 | Próba generalna E2E (Dry Run) + 1 płatność live | Zespół | **ZAPLANOWANE** | Pełna transakcja od wejścia na landing do odtworzenia lekcji w strefie. |
| **GO** | 15.10.2026 | **OFICJALNY START SPRZEDAŻY (Sprint 100)** | Zespół | **KAMIEŃ MILOWY** | Przełączenie na tryb sprzedaży, mail do listy, uruchomienie organicznych kanałów. |

---

## 2. Inwentaryzacja Zasobów i Jakości Kodu

### 2.1. Główny Silnik Aplikacji (Next.js 15 App Router)
- **Kompilacja (`npm run build`):** Zakończona sukcesem (0 błędów, 85 wygenerowanych statycznie stron SSG).
- **Trasy:** 52 lekcje wideo, strefa kursantki, apteczka, licznik skurczów, standard medyczny, partner.
- **Bezpieczeństwo sesji:** Bezstanowe ciasteczka HTTP-only HMAC-SHA256.
- **Baza danych:** Cloudflare D1 (lokalna/zdalna synchronizowana przez Wrangler).

### 2.2. Pakiet Przekazania od Maćka (`HappyBirth-przekazanie-2026-10-03`)
- **Generator stron (`build.py`):** Działa poprawnie (zbudowane 9 stron w `strona/public`).
- **Walidator zgodności (`zgodnosc.py`):** **34 na 35 reguł spełnionych** (jedyna blokada: brak numeru telefonu w stopce).
- **Usunięte placeholdery w `dane.json`:**
  - KRS: `0001268396` (potwierdzone w KRS)
  - NIP: `7812118273` (potwierdzone w KRS)
  - REGON: `545782779` (potwierdzone w KRS)
  - Kapitał: `5 000 zł` (potwierdzone w KRS)
  - Sąd: `Sąd Rejonowy Poznań - Nowe Miasto i Wilda w Poznaniu, VIII Wydział Gospodarczy KRS`
  - E-mail: `kontakt@happybirth.pl`
- **Pozostała blokada formalna:** Pole `[telefon]` wymaga przypisania fizycznego numeru VoIP.

---

## 3. Decyzje Operacyjne (Rekomendacje PM dla Michała i Maćka)

| Nr | Kwestia | Stan Dotychczasowy | Rekomendacja PM | Uzasadnienie Biznesowe / Prawne |
|:---:|:---|:---|:---|:---|
| **D1** | **Topologia serwowania** | Dwa repozytoria (Statyczny landing Maćka vs Monolit Next.js Michała) | **Podział domenowy:** Landing na `happybirth.pl` (Cloudflare Pages), Strefa na `strefa.happybirth.pl` (Next.js) | Gwarantuje zerowy czas ładowania (TTFB < 50ms) dla klientek i robotów reklamowych oraz całkowitą sterylną izolację strefy od skryptów publicznych. |
| **D2** | **Czas dostępu do kursu** | Rozbieżność w dokumentach: 12 vs 18 miesięcy | **18 miesięcy** | Klientka kupująca kurs w 12. tygodniu ciąży potrzebuje dostępu przez resztę ciąży (6 m-cy) + pierwszy rok życia dziecka (12 m-cy). Marginalny koszt w Cloudflare Stream (~4 zł), kluczowy argument sprzedażowy. |
| **D3** | **Numer telefonu w stopce** | Placeholder `[telefon]` blokuje publikację | **Zakup wirtualnego numeru VoIP** (np. FCN / EasyCall) | Wymóg art. 12 Ustawy o prawach konsumenta (łatwy kontakt). Poczta głosowa poza godzinami 10:00-14:00 odsyła do `kontakt@happybirth.pl`. |
| **D4** | **Termin porodu a RODO** | Zakusy zbierania daty w publicznym formularzu leada | **Formularz zbiera wyłącznie e-mail** | Data porodu stanowi informację o stanie zdrowia (art. 9 RODO). Meta kategorycznie blokuje health data w CAPI od 2025 r. |
| **D5** | **Akt prawny w komunikacji** | Fikcyjny zwrot „Standard MZ 2024” w starszych notatkach | **Rozporządzenie MZ z 23.10.2025 r. (Dz.U. 2025 poz. 1525)** | Nowelizacja weszła w życie 7 maja 2026 r. Posługiwanie się zmyślonym aktem „2024” grozi karami UOKiK i banem reklamowym. |

---

## 4. Zadania na Poniedziałek, 5 Października 2026
1. **Zadanie B1 (DNS & Poczta):**
   - Skonfigurować w panelu Cloudflare rekordy DNS dla `happybirth.pl`:
     - MX -> serwer pocztowy (np. Google Workspace lub Proton/Migadu)
     - SPF -> `v=spf1 include:... ~all`
     - DKIM -> klucz 2048-bit
     - DMARC -> `v=DMARC1; p=quarantine; pct=100; rua=mailto:dmarc@happybirth.pl`
   - Utworzyć skrzynkę `kontakt@happybirth.pl`.
2. **Zakup i konfiguracja numeru VoIP:**
   - Wybrać operatora (np. FCN.pl, abonament ~10 zł/m-c), wygenerować numer poznański (strefa 61) lub ogólnokrajowy.
   - Wpisać numer do `dane.json`, zrekompilować landing (`build.py`) i odblokować regułę K2 w `zgodnosc.py`.
