---
name: stripe-checkout-resilience
description: >-
  Ekspert integracji Stripe i polskiego BLIK-a dla platformy HappyBirth.
  Zapewnia odporność na awarie transakcyjne, idempotencję webhooków, asynchroniczną
  obsługę BLIK (2-minutowy timeout autoryzacji), inclusive VAT (489 zł brutto) oraz
  atomowe odblokowywanie dostępu kursantki w Cloudflare D1. Wzorowany na standardach
  SaaS Scaffolder i Stripe Architecture Best Practices.
---

# Stripe Checkout Resilience & BLIK Architecture

## 1. Architektura Płatności dla Kursu HappyBirth (489 zł)
* **Cena bazowa:** `489,00 PLN` brutto (jednorazowa płatność, brak subskrypcji).
* **Konfiguracja podatkowa (Tax Behavior):**
  - Spółka KLARSOLUTIONS sp. z o.o. jest zarejestrowanym podatnikiem VAT.
  - `tax_behavior: 'inclusive'` (23% VAT wliczony w cenę: kwota netto `397,56 zł`, VAT `91,44 zł`).
  - Tax Code dla kursów edukacyjnych online: `txcd_10000000` (Digital Goods / Educational Content).
* **Obsługiwane metody płatności w Stripe Checkout:**
  - `blik` (podstawowa metoda w Polsce, ok. 70% transakcji e-commerce)
  - `card` (Visa, Mastercard z 3D Secure / SCA)
  - `p24` (Przelewy24 jako zapasowy rail bankowy)
  - Portfele mobilne: Apple Pay, Google Pay

---

## 2. Obsługa Asynchronicznej Natury Polskiego BLIK-a
W przeciwieństwie do natychmiastowych kart kredytowych, BLIK w Stripe Checkout jest metodą **asynchroniczną**:
1. Użytkowniczka podaje 6-cyfrowy kod BLIK na stronie Stripe Checkout.
2. Stripe wysyła żądanie do Polskiego Standardu Płatności (PSP).
3. Użytkowniczka ma **do 120 sekund** na zatwierdzenie powiadomienia push w aplikacji bankowej.
4. **Złota reguła integracji:** NIGDY nie polegamy na synchronicznym przekierowaniu do `success_url` jako dowodzie zapłaty. Jedynym źródłem prawdy (SSOT) jest zdarzenie webhooka `checkout.session.completed` ze statusem `payment_status: 'paid'`.

---

## 3. Protokół Idempotencji i Webhook Security (Cloudflare D1)
1. **Weryfikacja podpisu:** Każde przychodzące żądanie do `/api/stripe/webhook` MUSI być zweryfikowane kryptograficznie za pomocą `stripe.webhooks.constructEvent(payload, sig, endpointSecret)`.
2. **Idempotentny zapis transakcji:**
   - Zdarzenia webhooka mogą zostać doręczone wielokrotnie (at-least-once delivery).
   - W tabeli bazy danych D1 (`orders` / `users`) transakcja jest identyfikowana przez unikalny klucz `stripe_session_id`.
   - Przed wykonaniem operacji odblokowania dostępu sprawdzamy, czy zamówienie o danym `stripe_session_id` nie zostało już przetworzone.
3. **Atomowe odblokowanie dostępu:**
   - W ramach jednej transakcji bazy D1 tworzony/aktualizowany jest rekord użytkownika (`email`, `status: 'active'`, `access_expires_at: now + 18 miesięcy`).
   - Następuje wyzwolenie asynchronicznego żądania do Resend z potwierdzeniem umowy na trwałym nośniku (PDF).
