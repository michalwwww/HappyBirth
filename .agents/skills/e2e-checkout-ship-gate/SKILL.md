---
name: e2e-checkout-ship-gate
description: >-
  Przedprodukcyjna bramka weryfikacyjna (Pre-Production Ship Gate) dla platformy HappyBirth.
  Wzorowana na wzorcach Senior QA i Ship Gate z bibliotek Claude Skills i GitHub Standards.
  Egzekwuje automatyczny audyt ścieżki krytycznej: weryfikację ceny 489 zł brutto,
  kompilację Next.js bez regresji, brak wycieków danych wrażliwych do pikseli reklamowych,
  spójność prawną i testy E2E przed dopuszczeniem kodu na produkcję.
---

# Pre-Production E2E Ship Gate (HappyBirth)

## 1. Rola i Zasada Działania Ship Gate
Skill **Ship Gate** działa jako bezwzględny strażnik przedwdrożeniowy (Deployment Circuit Breaker).
Żadna zmiana nie może zostać wdrożona na produkcję, ani sprzedaż nie może zostać uruchomiona, jeśli chociaż jeden warunek z poniższej listy nie zostanie spełniony z wynikiem **PASS**.

---

## 2. Matryca Weryfikacji Przedstartowej (Ship Checklist)

### Bramka A: Integralność Cenowa i Konsumencka (Omnibus & UOKiK)
- [ ] **A1 (Jednolita cena):** Cena regularna wynosi dokładnie **489 zł brutto** we wszystkich komponentach (`app/page.tsx`, `api/stripe/checkout`, `dane.json`, `o-nas`, regulamin).
- [ ] **A2 (Brak fałszywych promocji):** Brak przekreślonych cen i etykiet promocji bez 30-dniowej historii sprzedaży. Rabaty działają wyłącznie przez autoryzowane kody promocyjne.
- [ ] **A3 (Klauzula Art. 38 pkt 13):** Checkbox lub jednoznaczne oświadczenie o zrzeczeniu się prawa do odstąpienia z chwilą odblokowania kursu jest obecny w kasie i na potwierdzeniu mailowym.

### Bramka B: Sterylna Śluza i Prywatność (RODO Art. 9 & Anti-Ban)
- [ ] **B1 (Zero pytań o ciążę):** Formularze publiczne (`/`, `/marketing`, `/plan-porodu`) zbierają wyłącznie adres e-mail i imię. Brak pól `termin porodu` w kodzie publicznym.
- [ ] **B2 (Zero pikseli w strefie kursantki):** W trasach `/strefa/*` brak skryptów Meta Pixel, TikTok Pixel, Google Ads Tag czy Hotjar.
- [ ] **B3 (Robots.txt):** Plik `robots.txt` dla subdomeny `strefa.happybirth.pl` zawiera `Disallow: /`.

### Bramka C: Płatności i Odporność Transakcyjna (Stripe & D1)
- [ ] **C1 (Klucze Stripe):** Podpięte produkcyjne klucze Stripe powiązane z NIP `7812118273` (KLARSOLUTIONS sp. z o.o.).
- [ ] **C2 (Obsługa BLIK):** Webhook poprawnie przetwarza asynchroniczne zdarzenie `checkout.session.completed`.
- [ ] **C3 (Idempotencja):** Wielokrotne wysłanie tego samego zdarzenia webhooka nie powoduje zdublowania wpisów w bazie Cloudflare D1 ani powtórnej wysyłki maila.
- [ ] **C4 (Okres dostępu):** Użytkowniczka otrzymuje dostęp na **18 miesięcy** od dnia pomyślnej płatności.

### Bramka D: Kompilacja i Jakość Kodu (Zero Regresji)
- [ ] **D1 (Kompilacja TypeScript):** Polecenie `npm run build` kończy się kodem 0 (85/85 stron SSG, zero błędów typowania).
- [ ] **D2 (Weryfikacja generatora Mapa):** Polecenie `python build.py` generuje 9 stron statycznych, a `walidacja.py` raportuje 0 blokad technicznych.
- [ ] **D3 (Dane spółki):** KRS `0001268396`, NIP `7812118273`, REGON `545782779`, kapitał `5 000 PLN`, Sąd Rejonowy w Poznaniu obecne w stopce na każdej podstronie.

---

## 3. Protokół Eskalacji w Razie Awarii
Jeżeli w trakcie testów E2E wystąpi błąd:
1. Natychmiastowe zatrzymanie procedury deploymentu.
2. Odnotowanie błędu w `PROJECT_MANAGER_STATUS.md` ze statusem **BLOKADA**.
3. Przygotowanie poprawki na gałęzi `fix/michal-*` i ponowne przejście pełnego audytu Ship Gate.
