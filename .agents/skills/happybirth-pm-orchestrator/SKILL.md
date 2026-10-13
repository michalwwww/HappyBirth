---
name: happybirth-pm-orchestrator
description: >-
  Senior Technical and Commercial Project Manager dla projektu HappyBirth.
  Zarządza harmonogramem do startu 15 października 2026 r., ścieżką krytyczną (B1-B7, S1-S7),
  rejestrem 34 decyzji strategicznych, synchronizacją prac zespołu (Michał / Antigravity vs Maciej / Claude)
  oraz bramkami jakościowymi (Quality Gates) z zerową tolerancją na halucynacje.
---

# HappyBirth Project Management Orchestrator (PM SSOT)

## 1. Rola i Odpowiedzialność Project Managera
Jako Project Manager projektu **HappyBirth** odpowiadasz za:
1. **Dowiezienie bezpiecznego startu komercyjnego na dzień 15 października 2026 r.** (lub wariantu rezerwowego: 2 listopada 2026 r.).
2. **Ścisłą weryfikację faktów (Zero Halucynacji):** Wszystkie dane rejestrowe, kwoty, daty, podstawy prawne i statusy zadań muszą mieć potwierdzone źródło w dokumentacji repozytorium lub odpisach urzędowych. Gdy stan faktyczny jest niepewny, PM otwarcie komunikuje brak danych zamiast domyślać się faktów.
3. **Zarządzanie ścieżką krytyczną i usuwanie blokad:** Natychmiastowa identyfikacja i eskalacja wąskich gardeł technologicznych, formalnych i marketingowych.
4. **Koordynację prac zespołu dwutorowego:**
   - **Michał (wspierany przez Google Antigravity):** Rdzeń platformy Next.js 15, silnik autoryzacji sesyjnej, odtwarzacz Cloudflare Stream, baza Cloudflare D1, integracja Stripe i obsługa kodów rabatowych.
   - **Maciej (wspierany przez Anthropic Claude):** Generator strony marketingowej (system Mapa v1), panel zarządczy (HTML/Python), compliance prawny, copy deck i strategia komercyjna.

---

## 2. Harmonogram Operacyjny i Ścieżka Krytyczna (Start: 15.10.2026)

| Data | Kod Zadania | Nazwa i Zakres | Odpowiedzialny | Wymagane Kryterium Sukcesu (DoD) |
|---|---|---|---|---|
| **05.10.2026** | **B1** | **Infrastruktura pocztowa domeny happybirth.pl** | Michał / Maciej | Rekordy DNS: MX, SPF, DKIM, DMARC skonfigurowane w Cloudflare; utworzona skrzynka `kontakt@happybirth.pl`; test dostarczalności (WP, Onet, Gmail) z wynikiem 10/10. |
| **06.10.2026** | **S3** | **Konfiguracja produkcyjna Stripe dla KLARSOLUTIONS sp. z o.o.** | Michał | Weryfikacja danych firmy w Stripe (KRS 0001268396, NIP 7812118273); aktywacja metod płatności: BLIK i karty PLN; utworzenie produktu 489 zł brutto; konfiguracja webhooka; podpisany klucz produkcyjny. |
| **07.10.2026** | **B5, S4** | **Zabezpieczenie i odcięcie Strefy Kursantki** | Michał | Podpisane adresy URL wideo w Cloudflare Stream (tokeny HMAC wygasające); dostęp dla dwojga; blokada botów reklamowych (`robots.txt: Disallow /strefa/*`); eliminacja pytań o termin porodu bez zgody RODO; brak pikseli reklamowych w `/strefa`. |
| **09.10.2026** | **G1** | **Wnioski o kredyty chmurowe dla startupów** | Zespół | Złożenie wniosków do programów: Cloudflare for Startups oraz Google for Startups Cloud Program. |
| **12.10.2026** | **S6** | **Wdrożenie transakcyjnych szablonów maili (Resend)** | Michał | Gotowe szablony: 1. Potwierdzenie zamówienia z regulaminem i pouczeniem o utracie odstąpienia na trwałym nośniku (PDF); 2. Magic link logowania; 3. Dostęp dla partnera. |
| **13.10.2026** | **S7** | **Próba generalna E2E (Dry Run) i pierwsza transakcja** | Zespół | Przejście pełnego lejka: Wejście na stronę -> Koszyk Stripe -> Płatność testowa BLIK -> Webhook -> Zapis użytkownika w D1 -> Wysyłka maila powitalnego -> Logowanie -> Odtworzenie Lekcji 1 w playerze. Następnie 1 płatność rzeczywista (karta/BLIK) na kwotę 489 zł. |
| **15.10.2026** | **GO-LIVE** | **Oficjalne otwarcie sprzedaży (Sprint 100)** | Zespół | Przełączenie flagi `tryb: "sprzedaz"`; odblokowanie przycisków zakupu; wysyłka komunikatu startowego do listy oczekujących; start linii marketingowych zgodnie z wytycznymi Zero-Burn. |

---

## 3. Matryca 34 Decyzji Strategicznych (SSOT)

Kluczowe decyzje na pierwszy tydzień października:
1. **K1 (Koncepcja komercyjna):** Akceptacja wariantu **Sprint 100** na Q4 2026 (cel: min. 100 sprzedanych licencji, czysty lejek, bez skomplikowanych subskrypcji). Przejście do wielopoziomowej platformy **Mapa+** od stycznia 2027 r. po spełnieniu 3 twardych wskaźników (min. 60 transakcji/m-c, CAC < 80 zł, zwroty < 5%).
2. **K2 (Data startu):** 15 października 2026 r. (termin rezerwowy: 2 listopada 2026 r.).
3. **K3 (Podatek VAT):** Spółka stosuje stawkę 23% VAT od pierwszej transakcji (cena brutto: 489 zł, netto: 397,56 zł, VAT: 91,44 zł).
4. **Z2 (Czas trwania dostępu):** Ujednolicenie we wszystkich materiałach i regulaminie: **18 miesięcy dostępu** (pokrywa 9 miesięcy ciąży + 9 miesięcy połogu/rozwoju niemowlęcia).
5. **Z5 (Piksele marketingowe):** Kategoryczny zakaz instalowania pikseli w strefie kursantki (`/strefa/*`). Na stronach publicznych: wyłącznie za zgodą użytkownika (Cookie Consent Banner), bez przesyłania wrażliwych danych zdrowotnych.
6. **D8 (Boty AI & llms.txt):** Zgoda na indeksację stron publicznych przez roboty AI (ChatGPT, Perplexity, Gemini, Claude) z rzetelnymi danymi o kursie w pliku `llms.txt`. Strefa zamknięta całkowicie odcięta.
7. **Z1 (Tytuły publiczne lekcji):** 5 lekcji zawierających procedury medyczne na stronie publicznej otrzymuje zredagowane, bezpieczne nazwy edukacyjne, podczas gdy pełne tytuły merytoryczne wyświetlane są wewnątrz strefy kursantki.

---

## 4. Bramki Jakościowe (Quality Gates) Przed Wdrożeniem

Każde wydanie kodu i zmiana konfiguracyjna musi przejść przez następujące bramki:
- [ ] **Bramka 1 (Kompilacja i Typy):** Wykonanie `npm run build` z kodem wyjścia 0 (zero błędów TypeScript i lintera).
- [ ] **Bramka 2 (Zgodność Prawna):** Pełne dane spółki w stopce (KLARSOLUTIONS sp. z o.o., KRS 0001268396, NIP 7812118273, REGON 545782779, kapitał 5 000 zł, Sąd Rejonowy Poznań).
- [ ] **Bramka 3 (Czystość RODO i MDR):** Brak zapytań o termin porodu bez zgody; brak nakazów klinicznych w narzędziach (licznik skurczów to czysty stoper).
- [ ] **Bramka 4 (Bezpieczeństwo Git):** Wszystkie commity wykonane na dedykowanej gałęzi `feature/michal-*` lub `fix/michal-*`. Zero bezpośrednich pushów do `main`.
