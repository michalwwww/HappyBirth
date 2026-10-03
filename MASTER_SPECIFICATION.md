# HappyBirth · Master Architecture & Growth Specification (2026)
**Wersja dokumentu:** 1.1 (Zaktualizowana o twarde reguły Anti-Flagging & MDR Compliance — Wrzesień 2026)  
**Autorzy / Architekci:** Zespół HappyBirth (Michał / Google Antigravity & Maciej / Claude)  
**Status:** Canonical Single Source of Truth (SSOT)

---

## SPIS TREŚCI
1. [Filozofia Projektowa: Od Czego Wychodzimy?](#1-filozofia-projektowa-od-czego-wychodzimy)
2. [Topologia Stron i Ścieżek Ruchu (Next.js 15 App Router)](#2-topologia-stron-i-ścieżek-ruchu-nextjs-15-app-router)
3. [Protokół Sterylnej Śluzy i Ochrony Przed Oflagowaniem (Anti-Ban & Anti-Flagging)](#3-protokół-sterylnej-śluzy-i-ochrony-przed-oflagowaniem-anti-ban--anti-flagging)
4. [Standard Budowy Strony, UX i Bezpieczna Anatomia Sekcji](#4-standard-budowy-strony-ux-i-bezpieczna-anatomia-sekcji)
5. [Infolinia i Kontakt Telefoniczny (Wymogi Prawne vs Operacje)](#5-infolinia-i-kontakt-telefoniczny-wymogi-prawne-vs-operacje)
6. [Ekosystem Znaczników i Nowa Era AI (Schema.org & llms.txt)](#6-ekosystem-znaczników-i-nowa-era-ai-schemaorg--llmstxt)
7. [Zaawansowane Zaplecze Techniczne i Analityka (CAPI, PWA, KSeF)](#7-zaawansowane-zaplecze-techniczne-i-analityka-capi-pwa-ksef)
8. [Status Narzędzi: Plan Porodu i Licznik Czasu Skurczów (MDR Compliance)](#8-status-narzędzi-plan-porodu-i-licznik-czasu-skurczów-mdr-compliance)
9. [Dźwignie Wzrostu i Monetyzacji (Growth & Monetization Loops)](#9-dźwignie-wzrostu-i-monetyzacji-growth--monetization-loops)
10. [Zgodność Prawna, Podatki i Bezpieczeństwo Medyczne](#10-zgodność-prawna-podatki-i-bezpieczeństwo-medyczne)
11. [Atomowe Detale Wdrożeniowe (Apple Pay, DRM, Wizerunek, D1 Backup)](#11-atomowe-detale-wdrożeniowe-apple-pay-drm-wizerunek-d1-backup)
12. [Sprintowa Roadmapa Realizacji (Od Chaosu do Nr 1)](#12-sprintowa-roadmapa-realizacji-od-chaosu-do-nr-1)

---

## 1. Filozofia Projektowa: Od Czego Wychodzimy?

W branży edukacji okołoporodowej sukces zależy od harmonijnego zestrojenia trzech przeciwstawnych sił:

```
                          ┌─────────────────────────────┐
                          │   KORZEŃ: PSYCHOLOGIA MAMY  │
                          │   Spokój, redukcja lęku,    │
                          │   wsparcie partnera, 12 m-cy│
                          └──────────────┬──────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
  ┌─────────────────────────────┐                 ┌─────────────────────────────┐
  │   KAGANIEC: POLICY & PRAWO  │                 │ INŻYNIERIA: NEXT.JS ROUTING │
  │   Meta Ads Sensitive Health │                 │ Pełne rozdzielenie ścieżek  │
  │   UOKiK, MDR, Art. 38       │                 │ Walled Garden w /strefa     │
  └─────────────────────────────┘                 └─────────────────────────────┘
```

1. **Korzeń (Komunikacja)**: Przyszła mama nie kupuje „plików wideo”, lecz **poczucie bezpieczeństwa, opanowanie w godzinie zero i zaangażowanego partnera**.
2. **Kaganiec (Policy & Regulacje)**: Meta/TikTok rygorystycznie banują za *Personal Attributes*, terminy chirurgiczne i nazwy leków. Prawo unijne (MDR) penalizuje programy wydające nakazy kliniczne, a UOKiK zakazuje obietnic bez pokrycia („poród bez bólu”).
3. **Inżynieria (Routing)**: Zamiast jednej chaotycznej strony tworzymy **odrębne ścieżki (Silosy)** zoptymalizowane pod specyficzne źródła ruchu.

---

## 2. Topologia Stron i Ścieżek Ruchu (Next.js 15 App Router)

```
app/
├── (public)/                         # ŚRODOWISKO PUBLICZNE (Piksel Meta, TikTok, GTM włączone)
│   ├── page.tsx                      # Strona Główna / Hub Zaufania Marki
│   ├── lp/                           # STERILIZED AD LANDINGS (PAID SOCIAL)
│   │   ├── spokojny-porod/page.tsx   # LP pod Meta Ads (Kobiety 22-37, 0 zakazanych słów, brak linków ucieczki)
│   │   └── dla-taty/page.tsx         # LP pod reklamy dla partnerów (konkret, wsparcie)
│   ├── plan-porodu/page.tsx          # STERYLNA ŚLUZA LEAD MAGNETU (Tylko formularz zapisu! 0 pytań medycznych w kodzie)
│   ├── szkola-rodzenia-online/       # HIGH-INTENT GOOGLE SEARCH ADS LANDING
│   │   └── page.tsx                  # Cena, program, akredytacje, natychmiastowy start
│   ├── wiedza/                       # SEO HUBS (Google E-E-A-T, Schema MedicalWebPage)
│   │   ├── standard-porodu/page.tsx  # Prawa pacjenta, Standard MZ
│   │   ├── torba-do-szpitala/page.tsx# Interaktywna lista wyprawkowa
│   │   └── skurcze-porodowe/page.tsx # Kiedy kontaktować się z położną (edukacja)
│   ├── polonia/page.tsx              # Kampania dla Polek w UK, Niemczech, Holandii
│   ├── partnerzy/page.tsx            # B2B dla położnych i gabinetów ginekologicznych
│   ├── kontakt/page.tsx              # Dane rejestrowe, infolinia VoIP, formularz
│   ├── regulamin/page.tsx            # Regulamin z klauzulą Art. 38 pkt 13
│   └── polityka-prywatnosci/page.tsx # RODO, klauzule cookies, brak pikseli w strefie
│
├── api/                              # SERWEROWE ENDPOINTY
│   ├── stripe/checkout/route.ts      # Tworzenie sesji z atrybucją UTM i parametrami
│   ├── stripe/webhook/route.ts       # Źródło prawdy -> Trigger Meta CAPI Server-Side
│   ├── leads/route.ts                # Zapis leada w Cloudflare D1 + trigger maila Resend z PDF
│   └── auth/                         # Bezhasłowe sesje HMAC-SHA256
│
└── strefa/                           # WALLED GARDEN (STREFA KURSANTKI)
                                      # ⚠️ KATEGORYCZNY ZAKAZ TRACKERÓW META/TIKTOK! (robots.txt: Disallow)
    ├── page.tsx                      # Dashboard kursantki, wskaźnik tygodnia ciąży
    ├── lekcje/page.tsx               # 9 etapów / 52 lekcje VOD (Cloudflare Stream)
    ├── lekcja/[id]/page.tsx          # Odtwarzacz z dynamicznym znakiem wodnym i notatkami
    ├── plan-porodu/page.tsx          # PEŁNY KREATOR Z OPCJAMI MEDYCZNYMI (Bezpiecznie odcięty od crawlerów Mety)
    ├── partner/page.tsx              # Ściągawka dla taty (masaż, oddech, techniki)
    ├── apteczka/page.tsx             # Sprawdzona apteczka domowa i szpitalna
    └── licznik/page.tsx              # Notatnik Czasu Skurczów (Czysty stoper bez diagnoz klinicznych)
```

---

## 3. Protokół Sterylnej Śluzy i Ochrony Przed Oflagowaniem (Anti-Ban & Anti-Flagging)

Roboty reklamowe Meta Ads i Google Ads używają silników OCR oraz analizatorów plików JavaScript (Headless Chrome) do wyszukiwania słów kluczowych uznawanych za *Sensitive Health & Medical Procedures*.

### 3.1. Zasada Całkowitego Odcięcia Kodu Medycznego na `/plan-porodu`
* **Zagrożenie**: Statyczne zaimportowanie komponentu `BirthPlanGenerator` na publicznej stronie `/plan-porodu` powoduje wyciek terminów medycznych (*episiotomia, ZZO, kaniulacja, cięcie cesarskie*) w wynikowej paczce JS (`bundle chunk`), co skutkuje banem konta reklamowego.
* **Rozwiązanie architektoniczne**:
  - Na publicznej stronie `/plan-porodu` **NIGDY nie ładujemy komponentu z pytaniami medycznymi**.
  - Strona publiczna zawiera **WYŁĄCZNIE sterylny formularz** (Imię, E-mail, Termin porodu) w czystym języku prawno-edukacyjnym (*„Szablon Praw Pacjenta MZ 2024”*).
  - Po kliknięciu „Wyślij”:
    1. Gotowy, spersonalizowany plik PDF jest generowany serwerowo i przesyłany na skrzynkę e-mail kursantki przez Resend, LUB
    2. Użytkowniczka zostaje przekierowana do zamkniętej strefy `/strefa/plan-porodu`, która jest chroniona dyrektywą `Disallow: /strefa/*` w `robots.txt` i pozbawiona pikseli Mety.

### 3.2. Słownik Bezpiecznego Języka (Safe Copywriting Filter)
Na wszystkich stronach publicznych (`/`, `/marketing`, `/lp/*`) obowiązuje filtr leksykalny:

| ❌ Sformułowanie Zakazane (Ryzyko Bana / UOKiK) |  Bezpieczny Odpowiednik Edukacyjny |
| :--- | :--- |
| *„Cięcie cesarskie, znieczulenie ZZO, gaz rozweselający”* | **„Świadomość procedur szpitalnych i opieka w każdym scenariuszu”** |
| *„Chwyt asymetryczny brodawki, nawał”* | **„Prawidłowa technika przystawienia maluszka i pozycje karmienia”** |
| *„Laktacja bez bólu”* (Nielegalny claim medyczny) | **„Komfortowa laktacja – technika, pozycje i wsparcie”** |
| *„Unikniesz nacięcia krocza i powikłań”* | **„Ochrona krocza i fizjologiczne pozycje wertykalne”** |
| *„Poród bez bólu / bez komplikacji”* | **„Spokojny poród, techniki oddechowe i opanowanie stresu”** |

---

## 4. Standard Budowy Strony, UX i Bezpieczna Anatomia Sekcji

```
[POZIOM 01] ANNOUNCEMENT TOP-BAR
            • Treść: "Standard MZ 2024 · Dostęp natychmiastowy po zakupie · Dla Dwojga"
            • Kolor: Akcent #FAE3EB / Dark #3B0D36, tekst #EC008C

[POZIOM 02] STICKY NAVBAR (DESKTOP & MOBILE)
            • Lewo: Logo HappyBirth + sygnet jakości
            • Środek: Kotwice [#program] [#dla-taty] [#narzedzia] [#eksperci] [#faq]
            • Prawo: Przycisk "Zaloguj" + CTA "Kup kurs (349 zł)"
            • Mobile: Hamburger Drawer (powierzchnia dotyku min. 48x48px w Thumb Zone)
            • Na landingach płatnych (/lp/*): Menu całkowicie usunięte (Leaky Bucket Shield)

[POZIOM 03] HERO SECTION (PIERWSZE 5 SEKUND)
            • Badge zaufania: "Rekomendacja Certyfikowanych Położnych"
            • H1: Spokojny poród i pewność w pierwszych dniach życia malucha
            • Podtytuł: Kompletny kurs szkoły rodzenia online dla dwojga. 52 lekcje VOD.
            • Przyciski: [Kupuję kurs — 349 zł] oraz [Zobacz darmową lekcję]
            • Cloudflare Stream Player (Zwiastun 4K)
            • 3 mikro-bullety: Natychmiastowy start | 12 m-cy dostępu | Dostęp dla dwojga

[POZIOM 04] PAIN & PROBLEM (TRADYCYJNA VS NOWOCZESNA SZKOŁA RODZENIA)
            • Kontrast: Dojazdy w korkach i zmęczenie vs. Spokojna nauka na kanapie we dwoje
            • Eliminacja lęku przed szpitalem i chaosem informacyjnym

[POZIOM 05] BEZPIECZNY PROGRAM (9 ETAPÓW / 52 LEKCJE VOD)
            • Akordeon z bezpiecznym słownictwem:
              01. Zanim (Badania wstępne, kalkulator tygodnia)
              02. Dwie kreski (I Trymestr, mdłości, wybór lekarza)
              03. Wreszcie lepiej (II & III Trymestr, ruchy dziecka, profilaktyka kręgosłupa)
              04. Torba spakowana (Wyprawka, bezpieczny wózek, fotelik R129, apteczka)
              05. Zaczęło się (Poród fizjologiczny, oddech, pozycje wertykalne, masaż z partnerem)
              06. Plan B (Przygotowanie na każdy scenariusz, procedury szpitalne, spokój w kryzysie)
              07. Pierwsza noc w domu (Czuła regeneracja w połogu, emocje, Baby Blues, dno miednicy)
              08. Karmienie (Komfortowa laktacja, technika przystawienia, wsparcie w nawale)
              09. Nie śpi (Noworodek, bezpieczna kąpiel, pielęgnacja pępka, pierwsza pomoc)
            • Oznaczenie bezpłatnej lekcji demonstracyjnej (Lekcja 1)

[POZIOM 06] MODUŁ „STREFA DLA TATY”
            • Praktyczne instrukcje: Rola w skurczu, ucisk kości krzyżowej, prawa pacjentki w szpitalu

[POZIOM 07] CYFROWY NIEZBĘDNIK (WARTOŚĆ DODANA)
            • Szablon Praw Pacjenta i Plan Porodu PDF (Standard MZ)
            • Cyfrowy Notatnik Czasu Skurczów
            • Interaktywna Apteczka Mamy i Noworodka

[POZIOM 08] EKSPERCI I AUTORYTET MEDYCZNY (GOOGLE E-E-A-T)
            • Zdjęcia i biogramy położnych, lekarzy i fizjoterapeutek z numerami PWZL / PWZF

[POZIOM 09] OPINIE I SOCIAL PROOF (DYREKTYWA OMNIBUS)
            • Autentyczne opinie rodziców oznaczone: "Opinia potwierdzona zakupem"

[POZIOM 10] TRANSPARENTNY BOX OFERTOWY
            • Cena stała: 349 zł brutto (brak sztucznych obniżek)
            • 52 lekcje VOD, 12 miesięcy dostępu, 2 konta bez dopłat
            • Płatności: BLIK, Apple Pay, Google Pay, Przelewy24, Karty przez Stripe
            • Zgoda prawna: Klauzula Art. 38 pkt 13

[POZIOM 11] FAQ (AKORDEON PYTAŃ I ODPOWIEDZI + SCHEMA FAQPAGE)

[POZIOM 12] FINAL CTA

[POZIOM 13] MEGA-FOOTER PRAWNY (TRUST & COMPLIANCE)
            • Dane rejestrowe, NIP, infolinia techniczna VoIP, regulamin, RODO, disclaimer medyczny
```

---

## 5. Infolinia i Kontakt Telefoniczny (Wymogi Prawne vs Operacje)

* **Wymóg prawny**: Zgodnie z art. 12 ust. 1 pkt 3 Ustawy o prawach konsumenta, wytycznymi UOKiK oraz wymogami Stripe i Google Ads, sklep internetowy musi posiadać numer telefonu do kontaktu.
* **Rozwiązanie**: Wirtualny numer VoIP (FCN/Zadarma) w stopce:  
  *„Infolinia techniczna: +48 22 XXX XX XX (poniedziałek – piątek, godz. 10:00 – 14:00). W sprawach pilnych prosimy o kontakt e-mail: kontakt@happybirth.pl”*.  
  Po godzinach pracy automatyczna sekretarka informuje o priorytetowej obsłudze mailowej.

---

## 6. Ekosystem Znaczników i Nowa Era AI (Schema.org & llms.txt)

* **`public/llms.txt`**: Czysty Markdown dla robotów SearchGPT, Perplexity i Gemini. Podaje twarde fakty: szkoła rodzenia online dla par, 52 lekcje, 349 zł, Standard MZ 2024.
* **JSON-LD**:
  - `EducationalOrganization`: Informacje o wydawcy edukacyjnym.
  - `Course` & `CourseInstance`: 52 lekcje, 15 godzin, cena 349 PLN.
  - `FAQPage`: Rozwijane pytania i odpowiedzi w wynikach Google.
  - `MedicalWebPage`: Recenzje medyczne (`reviewedBy`) z numerami PWZL autorek pod kątem Google YMYL.

---

## 7. Zaawansowane Zaplecze Techniczne i Analityka (CAPI, PWA, KSeF)

1. **Meta Conversions API (CAPI)**:
   - W `/api/stripe/webhook` przy zdarzeniu `checkout.session.completed`:
   - Serwer wysyła zdarzenie `Purchase` bezpośrednio do Graph API Mety z zahashowanym mailem (SHA-256), kwotą i parametrem `event_id` do deduplikacji.
2. **Automatyczne Fakturowanie**:
   - Webhook Stripe wywołuje API systemu księgowego (Fakturownia/inFakt) pod KSeF i generuje fakturę PDF dołączaną do maila powitalnego.
3. **PWA (Progressive Web App)**:
   - Service Worker buforuje narzędzia w pamięci smartfona, gwarantując działanie offline na sali porodowej.
4. **Dostarczalność Poczty (SPF/DKIM/DMARC)**:
   - Rekordy DNS w Cloudflare zabezpieczają przed wpadaniem haseł i materiałów do folderu SPAM w poczcie WP.pl i Onet.pl.

---

## 8. Status Narzędzi: Plan Porodu i Licznik Czasu Skurczów (MDR Compliance)

### 8.1. Plan Porodu (Główny Filar Narzędziowy)
* Na publicznym `/plan-porodu` działa wyłącznie sterylny formularz zapisu (0 terminów medycznych w kodzie JS).
* Pełny interaktywny kreator znajduje się w zamkniętej strefie `/strefa/plan-porodu` lub trafia do rodziców jako czysty plik PDF na e-mail.

### 8.2. Licznik Skurczów (Neutralizacja Ryzyka MDR 2017/745)
* **Kategoryczny zakaz nakazów klinicznych**: Narzędzie NIE MOŻE wyświetlać komunikatów typu: *„Czas ruszać do szpitala! Skierujcie się z partnerem na izbę przyjęć”* (kwalifikacja jako oprogramowanie medyczne SaMD).
* **Bezpieczna forma**: Narzędzie działa wyłącznie jako **„Cyfrowy Notatnik Czasu Skurczów”** (stoper mierzący czas i odstęp).
* Po zarejestrowaniu regularnych skurczów wyświetla neutralny komunikat:  
  *„Zarejestrowano 3 regularne skurcze. Skonsultuj się telefonicznie ze swoją położną lub szpitalem”*.

---

## 9. Dźwignie Wzrostu i Monetyzacji (Growth & Monetization Loops)

1. **Kup jako Prezent na Baby Shower**: Opcja zakupu z eleganckim Voucherem Prezentowym PDF do koperty.
2. **Order Bump przy Kasie (+49 zł / +39 zł)**: Wodoodporne fiszki porodowe dla taty lub audio-afirmacje relaksacyjne MP3.
3. **Program B2B dla Położnych (`/partnerzy`)**: Prowizja 50 zł za polecenie kursu + bloczki kuponów z kodem QR do gabinetów.
4. **Dedykowany Lejek dla Emigrantek (`/polonia`)**: Kampania dla Polek w UK, Niemczech i Holandii.
5. **Retencja (Drugie Dziecko)**: Odnowienie po 11 miesiącach za 89 zł i oferta powtórkowa po 2 latach.

---

## 10. Zgodność Prawna, Podatki i Bezpieczeństwo Medyczne

1. **Dyrektywa Omnibus**: Stała cena 349 zł brutto. Brak sztucznych promocji bez historii 30 dni.
2. **Art. 38 pkt 13 Ustawy o prawach konsumenta**: Wymuszona zgoda na natychmiastowe świadczenie treści cyfrowych.
3. **Stawka VAT**: Zwolnienie podmiotowe (art. 113 ust. 1 do 200k zł/rok) lub 23% VAT przy pełnym obrocie.
4. **Medical Liability Disclaimer**: Informacja przed lekcjami i w stopce: materiały mają charakter edukacyjny i nie zastępują pomocy lekarskiej w stanach zagrożenia życia.

---

## 11. Atomowe Detale Wdrożeniowe (Apple Pay, DRM, Wizerunek, D1 Backup)

1. **Apple Pay Domain Association**: Plik weryfikacyjny w `public/.well-known/apple-developer-merchantid-domain-association`.
2. **Dynamiczny Znak Wodny**: Półprzezroczysty e-mail kursantki przemieszczający się po odtwarzaczu Cloudflare Stream (ochrona przed piractwem).
3. **Umowy o Wizerunek i Prawa Autorskie**: Podpisane umowy przeniesienia autorskich praw majątkowych z każdą ekspertką.
4. **Harmonogram Kopiowania Bazy D1**: Automatyczny nocny eksport bazy SQLite.

---

## 12. Sprintowa Roadmapa Realizacji (Od Chaosu do Nr 1)

### 🚀 Sprint 1: Sterylna Śluza i Zabezpieczenia (Dni 1–3)
* [ ] Zabezpieczenie `/plan-porodu` (usunięcie importu `BirthPlanGenerator` z publicznego kodu JS).
* [ ] Wprowadzenie filtra językowego w `lib/course-data.ts` (zamiana ZZO, gazu, brodawek, bez bólu).
* [ ] Uruchomienie dedykowanego, sterylnego landing page'a `/lp/spokojny-porod`.
* [ ] Zabezpieczenie stopki (dane spółki, infolinia VoIP).

### 🎯 Sprint 2: Tracking Server-Side & Start Reklam (Dni 4–7)
* [ ] Weryfikacja Meta CAPI w webhooku Stripe.
* [ ] Podpięcie karty wirtualnej z limitem dziennym 150 zł.
* [ ] Uruchomienie pierwszych 3 zestawów reklamowych ABO (po 35 zł/dzień) na kobiety 22–37 lat.

### 📚 Sprint 3: E-mail Drip & SEO Hubs (Dni 8–14)
* [ ] Konfiguracja automatycznego mailingu w Resend dopasowanego do terminu porodu (`due_date`).
* [ ] Publikacja silosów wiedzy w `/wiedza/*` pod Google E-E-A-T.
* [ ] Uruchomienie PWA z trybem offline.

### 🤝 Sprint 4: B2B, Vouchery i Skalowanie (Dni 15–20)
* [ ] Generator Voucherów Prezentowych na Baby Shower.
* [ ] Aktywacja programu partnerskiego dla położnych `/partnerzy`.
* [ ] Kampania `/polonia` dla Polek za granicą.
