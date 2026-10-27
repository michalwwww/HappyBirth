# HAPPYBIRTH.PL — Skonsolidowany Plan Wykonawczy (Zatwierdzony Zakres Operacyjny)

> **Status dokumentu:** ZATWIERDZONY ZAKRES BAZOWY (po selekcji właściciela z dnia 27.10.2026 r.)  
> **Operator prawny:** **KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ**, ul. Śląska 14, 60-614 Poznań (`NIP: 7812118273`, `KRS: 0001268396`, `REGON: 545782779`)  
> **Parametry bazowe produktu:** Cena **489,00 zł brutto** (płatność jednorazowa) | Okres dostępu: **18 miesięcy (548 dni) od momentu zakupu** | Zawartość: **52 lekcje wideo 4K (288 min / ~5h) w 8 modułach** + Notatnik Rodzica PDF i checklisty | Dostęp dla partnera: **Bezpłatny (w cenie)**.

---

## 1. Mapa Zatwierdzonego Zakresu (28 Elementów Wykonawczych)

Z trzech raportów źródłowych wyodrębniono i doprecyzowano wyłącznie elementy oznaczone jako **`ZOSTAW`** wraz z czterema modyfikacjami architektonicznymi właściciela:
1. **Trójpodział kanałów współpracy (`D4a` + `C4`):**
   - **`/partnerzy`** — prosta, elegancka strona B2B dla **marek, producentów wyprawki, dystrybutorów, klinik i sponsorów**.
   - **`/afiliacja`** — dedykowana strona programu afiliacyjnego dla **położnych, fizjoterapeutek, mikrotwórczyń i liderów opinii** (model `D1b`: 2-Tier Capped CPA).
   - **Boks poleceń w panelu kursantki (`C4`)** — program poleceń dla mam-kursantek oparty na **prezencie cyfrowym (np. e-book z przepisami na szybkie i zdrowe obiady PDF)** zamiast prowizji pieniężnej (zero tarcia podatkowego).
2. **Synchronizacja karencji prowizji (`D2a`) z natychmiastową utratą prawa odstąpienia (`E1`):**
   - Prezent dla kursantki (`C4`) odblokowuje się **natychmiast (0 dni czekania)** po opłaceniu kursu przez poleconą koleżankę.
   - Prowizja dla afilianta komercyjnego (`D1b`) przechodzi w status zatwierdzony (`ELIGIBLE`) z chwilą zalogowania się klientki do kursu (`first_content_accessed_at IS NOT NULL`) + krótki bufor techniczny anty-fraud/chargeback (7–14 dni), bez zbędnego zamrażania środków pod nieistniejący już zwrot konsumencki.
3. **Synergia Tarczy Prawnej (`E1` + `E2`):**
   - Drugi checkbox w koszyku (**Art. 38 ust. 1 pkt 13 u.p.k.** + potwierdzenie na trwałym nośniku) wyłącza prawo do odstąpienia od umowy z chwilą rozpoczęcia korzystania z kursu, natomiast obowiązkowy od **19.06.2026 r.** przycisk **„Odstąp od umowy” (`/odstap-od-umowy`)** realizuje wymóg formalny UOKiK, obsługuje odstąpienia częściowe (np. z niewykorzystanego dodatku usługowego z *Order Bumpa*) i automatycznie odrzuca bezpodstawne żądania zwrotu po rozpoczęciu kursu.

---

## 2. GRUPA A: Fundament Produktowy, Oferta i Blokery Startu (P0)

### `[A1]` Parametry Bazowe Oferty i Dane Operatora
- **Cena bazowa:** **489,00 zł brutto** (płatność jednorazowa: BLIK, karty płatnicze, szybkie przelewy, Apple Pay, Google Pay; brak ukrytych subskrypcji; pełna obsługa faktury VAT 23%).
- **Okres dostępu:** **18 miesięcy (548 dni) od momentu zakupu** — pełny dostęp do wszystkich materiałów od razu po opłaceniu.
- **Dostęp dla dwojga:** Partner korzysta z kursu bezpłatnie (oglądanie na Smart TV, komputerze, tablecie i smartfonie).
- **Operator prawny:** **KLARSOLUTIONS Sp. z o.o.**, ul. Śląska 14, 60-614 Poznań, NIP: `7812118273`, KRS: `0001268396`, REGON: `545782779`.

### `[A2]` Struktura Merytoryczna VOD (8 Modułów / 52 Lekcje 4K / 288 Minut)
Kurs nagrany z dyplomowanymi położnymi, doradczyniami laktacyjnymi i fizjoterapeutkami z poznańskiej szkoły rodzenia **Mama Gaja** (działającej od 2012 r.) zgodnie ze Standardem Opieki Okołoporodowej:

| Etap Fizjologiczny | Moduł | Tytuł Modułu | Lekcje | Czas | Suma Etapu |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Etap I:** Tydz. 1–13 *(„Dwie kreski”)* | **Moduł 1** | Twoja ciąża tydzień po tygodniu | 5 | 18 min | **52 min** (12 lekcji) |
| **Etap I:** Tydz. 1–13 *(„Dwie kreski”)* | **Moduł 2** | Zdrowie, profilaktyka i samopoczucie | 7 | 34 min | *(jw.)* |
| **Etap II:** Tydz. 14–27 *(„Wreszcie lepiej”)* | **Moduł 3** | Komfort i aktywność na co dzień | 6 | 38 min | **38 min** (6 lekcji) |
| **Etap III:** Tydz. 28–poród *(„Torba spakowana”)* | **Moduł 4** | Projekt „Gniazdo”, wyprawka i kącik | 7 | 44 min | **98 min** (16 lekcji) |
| **Etap III:** Tydz. 28–poród *(Filar Porodu)* | **Moduł 5** | Godzina „Zero”, aktywny poród | 9 | 54 min | *(jw.)* |
| **Etap IV:** Po porodzie *(„Pierwszy rok”)* | **Moduł 6** | Połóg, regeneracja i fizjoterapia | 5 | 32 min | **100 min** (18 lekcji) |
| **Etap IV:** Po porodzie *(„Pierwszy rok”)* | **Moduł 7** | Opieka nad noworodkiem i bezpieczeństwo | 9 | 44 min | *(jw.)* |
| **Etap IV:** Po porodzie *(„Pierwszy rok”)* | **Moduł 8** | Karmienie, laktacja i wsparcie | 4 | 24 min | *(jw.)* |
| **RAZEM** | **8 Modułów** | **Kompletny program + Notatnik Rodzica PDF i checklisty** | **52** | **288 min** | **288 min (~5h)** |

### `[A3]` Pozycjonowanie USP: Micro-Learning + Arbitraż 18 Miesięcy
- **Przewaga czasu dostępu (18 mies. vs. 9 mies. / 1 mies.):** Konkurencja (*Zaufaj Położnej*, *Rodzimy Razem*) ogranicza dostęp do 9 miesięcy (lub 1 miesiąca), co przy zakupie w 16. tygodniu ciąży wygasa, gdy niemowlę ma 3 miesiące. **18 miesięcy dostępu w HappyBirth.pl** pokrywa całą ciążę, poród, połóg oraz pełny pierwszy rok życia dziecka, będąc o 110 zł tańszym od pakietów VIP konkurencji (599 zł).
- **Przewaga formy (5–7 min w 4K vs. 35–80h maratonów):** Skondensowany *micro-learning* nie przytłacza zmęczonej przyszłej mamy ani jej partnera i jest w 100% wolny od ukrytego lokowania suplementów lub bankowania krwi pępowinowej (*Prenalen*, *PBKM*).

### `[A4]` Bloker P0: Wyłączenie Publicznego Kodu `TEST` (100%)
- Usunięcie wzmianki o kodzie `TEST` ze struktury strony głównej `happybirth.pl`.
- Bezwzględne wyłączenie lub ograniczenie wyłącznie do środowiska deweloperskiego wszelkich kuponów `100%` w produkcyjnej bramce Stripe.

### `[A5]` Bloker P0: Spójność Oferty i Dokumentów (`12 → 18 mies.`, `8 modułów`)
- Ujednolicenie zapisu **`489,00 zł brutto`** oraz **`18 miesięcy dostępu od momentu zakupu`** we wszystkich miejscach: strona główna, koszyk, FAQ, regulamin sklepu, polityka prywatności oraz e-maile transakcyjne.
- Uzgodnienie struktury **`8 modułów (w 4 etapach)`** pomiędzy stroną główną a regulaminem (zamiast dotychczasowej rozbieżności „8 modułów na stronie vs. 9 etapów w regulaminie”).

### `[A6]` Bloker P0: Odblokowanie Podstron `/program` i `/o-nas` dla AEO/SEO
- Wdrożenie statycznego renderowania HTML po stronie serwera (SSR / SSG) oraz znaczników `Schema.org` (`Course`, `Person`, `Organization`, `FAQPage`) dla podstron `/program` i `/o-nas`.
- Pełny spis 52 lekcji, opis 8 modułów, cena 489 zł, okres 18 miesięcy oraz biogramy i kwalifikacje ekspertek **Mama Gaja** muszą być w 100% widoczne w surowym kodzie HTML dla crawlerów i wyszukiwarek AI (*Perplexity, SearchGPT, Google AI Overviews, Claude*).

### `[A7]` Bloker P0: Test Zakupu End-to-End (E2E)
- Udokumentowany test pełnej ścieżki na telefonie i desktopie: użycie kodu rabatowego → płatność BLIK/karta → weryfikacja podpisu kryptograficznego i idempotencji webhooka Stripe → utworzenie konta → dostęp do 52 lekcji z datą ważności `+18 miesięcy` → wysyłka e-maila na trwałym nośniku z fakturą VAT 23% → test obsługi zwrotu (`charge.refunded`).

---

## 3. GRUPA B: Lejek Sprzedażowy i Koszyk Wysokiej Konwersji

### `[B2]` Otwarta Lekcja Próbna bez Rejestracji (*Zero-Friction Preview*)
- Wbudowanie bezpośrednio na stronie głównej komponentu `<FreeLessonPreview />` umożliwiającego odtworzenie jednej pełnowartościowej lekcji wideo (np. oddech / rola partnera w porodzie) **bez konieczności zakładania konta i bez podawania adresu e-mail**.

### `[B3]` Jednoklikowy Dodatek w Koszyku (*Order Bump* `+49,00 zł`)
- Wyeksponowanie w formularzu płatności pojedynczego pola wyboru (checkbox), które jednym kliknięciem dodaje pakiet komplementarny za **`+49,00 zł`** (np. *Indywidualny Pakiet Dokumentów Szpitalnych i Kreator Planu Porodu + Checklista Wyprawkowa PDF / szybka konsultacja*), podnosząc wartość zamówienia z `489,00 zł` do **`538,00 zł`**.

### `[B5]` Ochrona przed *Coupon Poaching* i Dyrektywa Omnibus
- **Ukrycie pola kodu rabatowego:** W koszyku pole tekstowe na kod rabatowy jest domyślnie zwinięte pod dyskretnym przyciskiem tekstowym *„Posiadasz kod rabatowy od swojej położnej lub partnera?”* (a przy wejściu z linku `?promo=KOD` rabat nalicza się automatycznie w tle). Chroni to marżę przed wychodzeniem klientek z koszyka do wyszukiwarki Google w poszukiwaniu kuponów.
- **Komunikat Omnibus:** Przy każdym naliczeniu rabatu (np. `-10%` → `440,10 zł`) obok przekreślonej ceny `489,00 zł` wyświetla się automatycznie informacja: *„Najniższa cena z 30 dni przed obniżką: 489,00 zł”*.

### `[B6a]` Technologia Koszyka: Własny Full-Stack (Next.js + Stripe API)
- Bezpośrednia integracja własnego koszyka w Next.js ze Stripe Checkout / Payment Element oraz API fakturowym (Fakturownia / inFakt), bez zewnętrznych pośredników koszykowych pobierających 1–3% prowizji od obrotu.

---

## 4. GRUPA C: Platforma Kursowa LMS, Certyfikaty i Prezent za Polecenie

### `[C1]` Automatyczne Konto po Zakupie i Strażnik 18 Miesięcy (*18-Month Access Guard*)
- Automatyczne tworzenie/aktywacja konta po odebraniu webhooka `checkout.session.completed` na podstawie e-maila z zamówienia.
- Ustawienie w bazie `access_granted_at = NOW()` oraz `access_expires_at = NOW() + INTERVAL '18 months'` (`548 dni`).
- Egzekwowanie dostępu przez polityki Row Level Security (RLS): $$\text{CurrentDate} \le \text{PurchaseDate} + 548\text{ dni}$$ oraz wyświetlanie licznika ważności dostępu w nagłówku panelu kursantki.
- Zapisywanie przy pierwszym otwarciu jakiejkolwiek lekcji znacznika czasu `first_content_accessed_at = NOW()` (dowód rozpoczęcia dostarczania treści cyfrowych).

### `[C2]` Streaming Wideo HLS (`Signed JWT URLs`) i *Auto-Resume* (co 15s)
- Strumieniowanie lekcji w jakości 4K przez protokół HLS (`Cloudflare Stream` lub `Bunny.net`) zabezpieczone kryptograficznymi tokenami JWT ważnymi przez 120 minut.
- Obsługa Picture-in-Picture, AirPlay oraz Chromecast (oglądanie na Smart TV, komputerze i telefonie).
- Funkcja *Auto-Resume*: automatyczny zapis aktualnej sekundy oglądania co 15 sekund w tabeli `lesson_progress`, pozwalający wznowić lekcję dokładnie w miejscu przerwania.

### `[C3]` Test Końcowy i Generator Imiennych Certyfikatów PDF
- Odblokowanie po przerobieniu modułów krótkiego testu końcowego (10 pytań jednokrotnego wyboru z zakresu porodu, laktacji i pielęgnacji noworodka; próg zaliczenia min. 80%).
- Automatyczne wygenerowanie przez endpoint `/api/certificate` (`@react-pdf/renderer`) imiennego **Certyfikatu Ukończenia Szkoły Rodzenia Online HappyBirth.pl** w formacie PDF (imię i nazwisko, data, unikalny numer certyfikatu, dane organizatora Klarsolutions Sp. z o.o.).

### `[C4]` Wbudowany Boks Poleceń w Panelu Kursantki — Model „Prezent za Polecenie” (Przepisy na Obiad PDF)
- **Mechanizm bezgotówkowy (0% tarcia podatkowego, 0 zł kosztu krańcowego):** Każda kursantka w swoim panelu otrzymuje indywidualny kod polecający dla koleżanki z grupy ciążowej/szpitalnej (np. `MAMA-XXXX`).
- **Korzyść dla koleżanki:** **10% zniżki** na zakup kursu (`440,10 zł` zamiast `489,00 zł`).
- **Korzyść dla polecającej kursantki (Prezent zamiast prowizji pieniężnej):** W tej samej sekundzie, w której koleżanka opłaci kurs z użyciem kodu, w panelu polecającej kursantki automatycznie odblokowuje się sekcja **„Twój Prezent Bonusowy”** z ekskluzywnym materiałem cyfrowym do pobrania:
  - **E-book PDF: „Szybkie i Odżywcze Obiady w 15 Minut dla Przyszłej Mamy i w Czasie Laktacji (Przepisy + Gotowe Listy Zakupów)”** *(lub kolejne bonusy przy następnych poleceniach)*.
- **Zgodność z UOKiK (`E4`):** Przycisk „Kopiuj mój kod dla koleżanki” automatycznie kopiuje przyjazną wiadomość z przejrzystą informacją: *„Z moim kodem masz 10% zniżki na szkołę rodzenia online HappyBirth.pl, a ja otrzymam w prezencie e-booka z przepisami na szybkie obiady #współpraca”*.

---

## 5. GRUPA D: System Afiliacyjny oraz Rozdzielenie Stron `/afiliacja` i `/partnerzy`

### `[D1b]` Model Prowizyjny dla Partnerów Komercyjnych: 2-Tier Capped CPA („Daj 10%, Odbierz 20%–30% + 5% Broker”)
Model przeznaczony dla położnych, fizjoterapeutek uroginekologicznych, doradczyń laktacyjnych, mikrotwórczyń, twórców dla ojców i blogerów:
1. **Poziom 1 (Tier 1 — Sprzedaż bezpośrednia):**
   - Partner przekazuje odbiorczyniom kod rabatowy **`-10%`** (obniżający cenę kursu z `489,00 zł` do **`440,10 zł brutto`**) lub link afiliacyjny.
   - Stawki prowizji Tier 1:
     - **20%** od opłaconej kwoty z kodem (`88,02 zł`) — stawka bazowa dla mikrotwórczyń i partnerów standardowych,
     - **25%** (`122,25 zł` przy pełnej cenie `489 zł` lub `110,03 zł` przy kodzie `-10%`) — stawka dla wydawców treści, blogerów i twórców wideo,
     - **30%** z kodem (`132,03 zł`) — stawka specjalna dla zweryfikowanych położnych, fizjoterapeutek uroginekologicznych i doradczyń laktacyjnych.
2. **Poziom 2 (Tier 2 — Broker Override `5%`):**
   - Położna oddziałowa, liderka środowiska medycznego lub agencja może zaprosić do programu inne położne/twórczynie.
   - Od każdej sprzedaży zrealizowanej bezpośrednio przez zaproszonego partnera Poziomu 1, Broker (Poziom 2) otrzymuje **5% prowizji pasywnej (`22,00 zł` przy zakupie z kodem lub `24,45 zł` przy cenie pełnej)**.
   - **Twarde bezpieczniki anty-MLM:** Struktura jest bezwzględnie odcięta na drugim poziomie (brak poziomu 3 i kolejnych), dołączenie jest w 100% darmowe, a za samą rekrutację partnera nie przysługuje żadne wynagrodzenie.
3. **Ochrona marży Klarsolutions Sp. z o.o.:**
   - W scenariuszu maksymalnego obciążenia ($\text{Przychód po rabacie} = 440,10\text{ zł}$, $\text{Tier 1} = 110,03\text{ zł}$, $\text{Tier 2} = 22,00\text{ zł}$, $\text{Stripe} \approx 8,80\text{ zł}$) suma prowizji i opłat wynosi `140,83 zł`, co pozostawia **`299,27 zł` (68,0% marży brutto)** dla spółki na każdym sprzedanym kursie.

### `[D2]` + `[D2a]` Podwójna Atrybucja Hybrydowa (*Link + Kod*) i Odblokowanie Prowizji Zsynchronizowane z Art. 38 pkt 13
- **Reguły atrybucji:**
  1. Śledzenie kliknięć przez link referencyjny (`?ref=`) w oknie **30 dni** (ciasteczko First-Party `hb_aff_ref` z flagami `HttpOnly`, `Secure`, `SameSite=Lax`).
  2. **Nadrzędność kodu:** Imienny kod afiliacyjny świadomie wpisany w koszyku ma **zawsze pierwszeństwo** nad wcześniejszym linkiem innego partnera.
  3. **Reguły Anty-Fraud:** Kod wygasły, zablokowany, kod `TEST` (100%), *self-referral* (zakup z własnego linku/kodu) oraz zamówienia zwrócone (`charge.refunded`) nie generują prowizji.
- **Zoptymalizowany cykl życia prowizji (zgodny z natychmiastowym świadczeniem z `E1`):**
  1. `PENDING` — w momencie opłacenia zamówienia.
  2. `ELIGIBLE` (Zatwierdzona) — po spełnieniu warunku rozpoczęcia świadczenia przez klientkę (`first_content_accessed_at IS NOT NULL`, co na mocy Art. 38 ust. 1 pkt 13 u.p.k. wygasza 14-dniowe prawo odstąpienia) oraz upływie krótkiego buforu technicznego anty-fraud/chargeback (7–14 dni lub na koniec miesiąca rozliczeniowego).
  3. `PAID` — po wypłacie na podstawie zatwierdzonego dokumentu rozliczeniowego.

### `[D4a-1]` Nowa Podstrona **`https://happybirth.pl/afiliacja`** (Program Afiliacyjny dla Położnych i Twórców)
Responsywna strona rekrutacyjna dla partnerów polecających (bez konieczności budowania na start ciężkiego panelu):
- **Sekcje strony `/afiliacja`:**
  1. Dla kogo (położne, fizjoterapeutki uroginekologiczne, doradczynie laktacyjne, mikrotwórczynie parentingowe, twórcy dla ojców, lokalne szkoły rodzenia).
  2. Jak działa współpraca i model **Daj 10% rabatu odbiorcom, odbierz 20%–30% prowizji (+5% Broker Tier 2)**.
  3. Zasady atrybucji (30 dni okno linku, pierwszeństwo kodu wpisanego w koszyku, brak MLM i brak opłat startowych).
  4. Etyka i zasady komunikacji (obowiązkowe oznaczenie `#reklama` / `#współpraca`, zakaz obietnic medycznych).
  5. FAQ dla partnerów oraz **Formularz zgłoszeniowy do programu afiliacyjnego** (imię i nazwisko / nazwa, e-mail, rola/specjalizacja, link do profilu lub miejsce praktyki, akceptacja polityki prywatności).

### `[D4a-2]` Nowa Podstrona **`https://happybirth.pl/partnerzy`** (Strona B2B dla Marek, Producentów, Dystrybutorów i Sponsorów)
Zamiast błędu `404` lub przekierowania, pod adresem `/partnerzy` działa dedykowana, wizerunkowa wizytówka B2B dla partnerów biznesowych i sponsorów:
- **Sekcje strony `/partnerzy`:**
  1. **Nagłówek Hero B2B:** *„Zostań Partnerem Strategicznym HappyBirth.pl — dotrzyj do przyszłych rodziców w najbardziej decyzyjnym momencie ich życia”*.
  2. **Dlaczego marki wybierają współpracę z HappyBirth.pl:**
     - Precyzyjny moment zakupowy: rodzice kompletujący wyprawkę, wózek, fotelik, łóżeczko i apteczkę (szczególnie w ramach *Modułu 4: Projekt „Gniazdo”, wyprawka i kącik* oraz *Kalkulatora Wyprawki PDF*).
     - Długofalowa relacja: **18 miesięcy dostępu** oznacza obecność marki w życiu rodziców od pierwszych tygodni ciąży aż do końca 1. roku życia dziecka.
     - Zaufanie kliniczne i selekcja jakościowa: współpracujemy wyłącznie z markami i producentami, których produkty spełniają rygorystyczne kryteria bezpieczeństwa położnych i fizjoterapeutek ze szkoły **Mama Gaja**.
  3. **Obszary współpracy dla marek, producentów i sponsorów:**
     - **Partnerstwo Merytoryczne i Produktowe:** ekspozycja bezpiecznych, rekomendowanych produktów w materiałach dodatkowych PDF, checklistach wyprawkowych i lekcjach praktycznych.
     - **Strefa Benefitów i Rabatów dla Kursantek:** umieszczenie dedykowanej oferty powitalnej / kodu zniżkowego Twojej marki wewnątrz zamkniętej Strefy Rodziców dla kupujących kurs.
     - **Pakiety Licencyjne B2B dla Klinik, Szpitali i Pracodawców:** pakiety dostępów do kursu jako benefit pracowniczy dla przyszłych rodziców w firmach lub pakiet edukacyjny dla pacjentek klinik medycznych.
  4. **Prosty Formularz Kontaktowy dla Marek i Sponsorów:** Nazwa firmy / marki, Imię i nazwisko osoby reprezentującej, E-mail służbowy, Telefon, Wybór obszaru współpracy (*Producent wyprawki / Sponsoring merytoryczny / Benefity dla kursantek / Licencje B2B dla klinik i firm*), Krótki opis propozycji + zgoda RODO + przycisk przekierowujący dla twórców i położnych (*„Szukasz programu prowizyjnego dla położnych i twórców? Przejdź do zakładki /afiliacja →”*).

---

## 6. GRUPA E: Zgodność Prawna 2026, RODO, Anty-Ban i Bezpieczeństwo

### `[E1]` Ochrona przed Zwrotami Treści Cyfrowych (Art. 38 ust. 1 pkt 13 u.p.k.) + Trwały Nośnik
- **Dwa osobne, niezaznaczone domyślnie checkboxy w koszyku** (blokujące przycisk płatności do momentu zaznaczenia obu):
  1. *Checkbox 1:* Akceptacja Regulaminu Sklepu `happybirth.pl` (operator: Klarsolutions Sp. z o.o., ul. Śląska 14, Poznań) i Polityki Prywatności.
  2. *Checkbox 2 (Art. 38 ust. 1 pkt 13 u.p.k.):* *„Żądam natychmiastowego rozpoczęcia dostarczania treści cyfrowych przed upływem 14-dniowego terminu do odstąpienia od umowy i przyjmuję do wiadomości, że z chwilą uzyskania dostępu do platformy kursowej tracę prawo do odstąpienia od umowy zgodnie z art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta.”*
- **Rejestr dowodowy w bazie (`orders`):** zapis `waiver_art38_accepted = TRUE`, dokładnego czasu UTC (`waiver_art38_timestamp`), adresu IP kupującego, dosłownej treści checkboxa, sumy kontrolnej `SHA-256` regulaminu oraz momentu pierwszego otwarcia lekcji (`first_content_accessed_at`).
- **Trwały Nośnik (Durable Medium Mailer):** natychmiast po opłaceniu zamówienia system wysyła e-mail potwierdzający zawarcie umowy wraz z wyraźnym potwierdzeniem udzielenia zgody na utratę prawa odstąpienia oraz załącznikiem PDF z Regulaminem i fakturą VAT 23%.

### `[E2]` Jednoklikowy Przycisk „Odstąp od umowy” (Wymóg od 19.06.2026 r.) Współpracujący z Tarczą `E1`
- **Widoczność i brak *dark patterns*:** W stopce strony głównej oraz w panelu klienta znajduje się stały link o dokładnej nazwie **„Odstąp od umowy”** prowadzący do `/odstap-od-umowy` (dostępny bez konieczności logowania i bez ekranów zniechęcających).
- **Struktura formularza `/odstap-od-umowy`:** Imię i nazwisko, Adres e-mail użyty przy zakupie, Numer zamówienia, Wybór zakresu odstąpienia (całe zamówienie lub częściowe odstąpienie od niewykonanej usługi dodatkowej z *Order Bumpa*) oraz przycisk **„Potwierdź odstąpienie od umowy”**.
- **Automatyczna logika obronna backendu:**
  1. Natychmiast po kliknięciu wysyła na e-mail klienta automatyczne potwierdzenie wpływu zgłoszenia (wymóg z 19.06.2026 r.).
  2. Sprawdza w bazie status zamówienia:
     - **Jeżeli klientka wyraziła zgodę `E1` (`waiver_art38_accepted = TRUE`) i rozpoczęła korzystanie z kursu (`first_content_accessed_at IS NOT NULL`):** system **NIE wykonuje zwrotu środków za kurs**, lecz rejestruje zgłoszenie ze statusem `auto_rejected_due_to_art38 = TRUE` i odsyła uprzejme powiadomienie prawne o wygaśnięciu prawa do odstąpienia na mocy art. 38 ust. 1 pkt 13 u.p.k.
     - **Jeżeli zgłoszenie dotyczy wyłącznie niewykonanej jeszcze konsultacji z *Order Bumpa* (`+49 zł`) lub zamówienia, w którym dostęp nie został jeszcze w ogóle otwarty:** kieruje do realizacji zwrotu odpowiedniej części kwoty i koryguje prowizję afiliacyjną.

### `[E4]` Wymogi UOKiK dot. Oznaczania Reklam i Zakaz Obietnic Medycznych
- Wszystkie materiały dla afiliantów i kod polecający w panelu kursantki zawierają wbudowane oznaczenie **`#reklama`** lub **`#współpraca`**.
- Bezwzględny zakaz stosowania na stronie i w kreacjach partnerów obietnic medycznych (*„gwarantowany poród bez bólu”*, *„zastępuje opiekę położnej/lekarza”*). Kurs jest komunikowany jako profesjonalny materiał edukacyjny przygotowany przez specjalistki, który wspiera, a nie zastępuje opiekę medyczną.

### `[E5]` Izolacja Danych Wrażliwych o Ciąży (RODO) + Sterylna Śluza Reklam (*Policy Scanner*)
- **Zero danych medycznych w analityce reklamowej i afiliacyjnej:** Informacje o tygodniu ciąży, przewidywanym terminie porodu oraz postępie oglądanych lekcji **nigdy nie są wysyłane** do pikseli reklamowych (Meta/TikTok/Google) ani nie są widoczne dla partnerów afiliacyjnych (partner widzi wyłącznie zagregowaną liczbę kliknięć, użyć kodu i kwotę prowizji).
- **Sterylna Śluza Treści (*Policy Scanner*):** Teksty na publicznym Landing Page'u i w kreacjach reklamowych są weryfikowane skanerem zgodności pod kątem 10 reguł Meta Ads / MDR (brak drastycznych opisów chirurgicznych, farmakologicznych i obietnic klinicznych).

---

## 7. GRUPA F: Outreach Partnerski, Mikro-Narzędzia Lead Magnet i Temporalny CRM

### `[F2]` Lista 30 Kontaktów i Bezpośredni Outreach (20 Wiadomości DM)
- Przygotowanie ręcznie zweryfikowanej listy **30 dopasowanych podmiotów**:
  - 10 ekspertek okołoporodowych (położne środowiskowe, fizjoterapeutki uroginekologiczne, doradczynie laktacyjne),
  - 10 mikrotwórczyń parentingowych (wysoka jakość dyskusji i zaufanie ważniejsze niż sam zasięg),
  - 5 administratorów grup i społeczności dla przyszłych rodziców,
  - 5 lokalnych szkół rodzenia / partnerów B2B (nieposiadających własnej platformy VOD).
- Wysłanie **20 spersonalizowanych wiadomości bezpośrednich (maks. 90 słów)** bez masowego scrapowania i bez spamu, z darmowym dostępem recenzenckim do kursu i zaproszeniem do współpracy na zasadach `/afiliacja` lub `/partnerzy`.

### `[F3]` Interaktywne Mikro-Narzędzia Webowe (*Lead Magnet Engine*)
Wdrożenie na `happybirth.pl` dwóch bezpłatnych mikro-aplikacji webowych przyciągających ruch z wyszukiwarek i mediów społecznościowych:
1. **Generator Planu Porodu PDF** (zgodnego ze Standardem Opieki Okołoporodowej, opartego na wiedzy z Modułu 5 — umieszczony za bezpieczną śluzą po podaniu adresu e-mail).
2. **Interaktywny Kalkulator Wyprawki i Torby do Szpitala PDF** (*„Co kupić na start, a z czym poczekać”* na bazie Modułu 4 — również stanowiący naturalną powierzchnię dla partnerów strategicznych ze strony `/partnerzy`).
- Pobranie spersonalizowanego pliku PDF wymaga podania **adresu e-mail** oraz **przewidywanego terminu porodu / aktualnego tygodnia ciąży** (za wyraźną zgodą RODO na komunikację edukacyjno-handlową).

### `[F4]` Hiper-Personalizacja E-mail/SMS oparta na Tygodniu Ciąży (Etapy I–IV)
Automatyczny lejek edukacyjno-sprzedażowy przeliczający co tydzień aktualny tydzień ciąży subskrybentki i wysyłający mikro-poradnik dopasowany dokładnie do jej etapu fizjologicznego:
- **Etap I (Tydz. 1–13):** Mikro-poradnik z Modułów 1–2 + argument, że dzięki **18-miesięcznemu dostępowi od zakupu** kurs kupiony już na początku ciąży posłuży przez wszystkie trymestry i cały pierwszy rok życia dziecka.
- **Etap II (Tydz. 14–27):** Mikro-poradnik z Modułu 3 (komfort, bezpieczna aktywność, kręgosłup i oddech).
- **Etap III (Tydz. 28–poród):** Mikro-poradnik z Modułów 4–5 (wyprawka bez przepłacania, torba do szpitala, aktywny poród i rola partnera).
- **Etap IV (Po porodzie / Pierwszy rok):** Mikro-poradnik z Modułów 6–8 (połóg, pierwsza pomoc, kąpiel i laktacja).
- Każda wiadomość domyka sprzedaż kursu w cenie **489,00 zł (18 mies. dostępu)**.

---

## 8. GRUPA H: Dopasowana Biblioteka Promptów Wykonawczych (`[H3]`)

Poniższe prompty zostały **oczyszczone i zaktualizowane ściśle pod 28 zatwierdzonych elementów** (uwzględniając cenę `489 zł`, dostęp `18 miesięcy od zakupu`, prezent z przepisami na obiad w `C4`, rozdzielenie `/partnerzy` dla marek B2B i `/afiliacja` dla programu `D1b` oraz synergię `E1 + E2`).

### Prompt 1 — Audyt Spójności Oferty i Blokery P0 (`A1–A7`)
```text
Jesteś audytorem produktu cyfrowego. Przeanalizuj repozytorium HappyBirth oraz publiczną stronę happybirth.pl.
Kontekst:
- Operator prawny: KLARSOLUTIONS Sp. z o.o., ul. Śląska 14, 60-614 Poznań (NIP: 7812118273, KRS: 0001268396, REGON: 545782779).
- Produkt: Kurs Szkoły Rodzenia Online VOD (52 lekcje 4K, 288 minut w 8 modułach i 4 etapach, ekspertki Mama Gaja).
- Cena bazowa: 489,00 zł brutto (płatność jednorazowa, dostęp dla kursantki i partnera).
- Okres dostępu: 18 miesięcy (548 dni) od momentu zakupu.

Wykonaj bez wdrażania zmian:
1) Znajdź wszystkie wystąpienia ceny, okresu dostępu (12 vs 18 miesięcy), liczby modułów/etapów (8 modułów vs 9 etapów w regulaminie), kodów rabatowych oraz informacji o odstąpieniu od umowy.
2) Sprawdź obecność i działanie publicznego kodu rabatowego TEST (100%) na stronie głównej i w logice koszyka.
3) Sprawdź renderowanie podstron /program oraz /o-nas pod kątem widoczności statycznego kodu HTML dla wyszukiwarek AI (AEO/SEO) oraz stan ścieżek /partnerzy i /afiliacja.
4) Wskaż dokładne pliki i linie kodu wymagające aktualizacji w tabeli P0/P1 wraz z kryteriami testu akceptacyjnego GO/NO-GO.
```

### Prompt 2 — Wdrożenie Pakietu P0, Koszyka i Podstron `/partnerzy` oraz `/afiliacja` (`A1–A6`, `B2`, `B3`, `B5`, `B6a`, `D4a`)
```text
Pracujesz w repozytorium HappyBirth (Next.js). Wdróż zatwierdzony pakiet zmian:
1) Ujednolić parametry oferty we wszystkich komponentach: cena 489,00 zł brutto, dostęp 18 miesięcy (548 dni) od momentu zakupu, 8 modułów (52 lekcje 4K, 288 min), dane operatora KLARSOLUTIONS Sp. z o.o. (ul. Śląska 14, 60-614 Poznań, NIP: 7812118273).
2) Wyłącz produkcyjny kod TEST (100%) i usuń wzmianki o nim z interfejsu strony.
3) Zapewnij statyczne renderowanie HTML (SSR/SSG + Schema.org) dla podstron /program (pełny opis 8 modułów i 52 lekcji) oraz /o-nas (biogramy ekspertek Mama Gaja).
4) Na stronie głównej osadź otwartą lekcję próbną wideo działającą bez logowania i bez podawania e-maila (<FreeLessonPreview />).
5) W komponencie koszyka (Checkout):
   - Dodaj jednoklikowy Order Bump (+49,00 zł) za pakiet dodatkowy (Kreator Planu Porodu PDF + Checklista Szpitalna).
   - Ukryj pole kodu rabatowego pod dyskretnym przyciskiem „Posiadasz kod od swojej położnej lub partnera?” (oraz obsługuj automatyczne naliczanie rabatu -10% z parametru ?promo=).
   - Przy naliczeniu rabatu wyświetlaj komunikat Dyrektywy Omnibus: „Najniższa cena z 30 dni przed obniżką: 489,00 zł”.
   - Dodaj dwa osobne, niezaznaczone domyślnie checkboxy wymagane do odblokowania przycisku płatności: (a) Akceptacja Regulaminu i Polityki Prywatności, (b) Żądanie natychmiastowego dostarczenia treści cyfrowych przed upływem 14 dni z potwierdzeniem utraty prawa do odstąpienia od umowy zgodnie z art. 38 ust. 1 pkt 13 ustawy o prawach konsumenta.
6) Zbuduj dwie odrębne, responsywne podstrony współpracy:
   - /partnerzy — elegancka strona B2B dla marek, producentów wyprawki, dystrybutorów, klinik i sponsorów (dlaczego warto, standard jakości Mama Gaja, formy współpracy: wyprawka w Module 4, benefity dla kursantek, licencje B2B + formularz kontaktowy dla marek).
   - /afiliacja — strona programu afiliacyjnego dla położnych, fizjoterapeutek i twórców (model Daj 10% rabatu, odbierz 20–30% prowizji + 5% Broker Tier 2, 30 dni okno linku, pierwszeństwo kodu w koszyku, zasady oznaczania #współpraca + formularz zgłoszeniowy).
```

### Prompt 3 — Tarcza Prawna `E1` + `E2`: Trwały Nośnik i Przycisk „Odstąp od umowy” (Wymóg od 19.06.2026 r.)
```text
Zaimplementuj współpracujący ze sobą moduł ochrony prawnej sprzedaży treści cyfrowych (Art. 38 ust. 1 pkt 13 u.p.k.) oraz jednoklikowego odstąpienia od umowy (wymóg od 19.06.2026 r.):
1) W /api/checkout oraz /api/webhooks/stripe:
   - Waliduj serwerowo, że waiver_art38_accepted === true.
   - Zapisuj w rekordzie zamówienia: waiver_art38_timestamp, adres IP klienta, dokładny tekst zaznaczonego checkboxa, hash SHA-256 wersji regulaminu oraz przy pierwszym otwarciu lekcji w panelu kursantki: first_content_accessed_at = NOW().
   - Natychmiast po opłaceniu zamówienia wysyłaj e-mail stanowiący potwierdzenie na trwałym nośniku (potwierdzenie zawarcia umowy, potwierdzenie wyrażenia zgody z art. 38 ust. 1 pkt 13 u.p.k. na utratę prawa odstąpienia oraz załącznik PDF z Regulaminem i fakturą VAT 23%).
2) W stopce strony i w panelu klienta umieść widoczny link o dokładnej treści „Odstąp od umowy” prowadzący do /odstap-od-umowy:
   - Formularz dostępny bez wymogu logowania i bez dark patterns (pola: Imię i nazwisko, E-mail, Numer zamówienia, Wybór zakresu: całe zamówienie lub częściowe odstąpienie od dodatku z Order Bumpa + przycisk „Potwierdź odstąpienie od umowy”).
   - Po wysłaniu formularza system natychmiast odsyła na e-mail potwierdzenie wpływu oświadczenia na trwałym nośniku.
   - Jednocześnie backend sprawdza bazę: jeśli dla kursu waiver_art38_accepted === true oraz first_content_accessed_at IS NOT NULL, system NIE zleca zwrotu w Stripe za kurs, lecz oznacza zgłoszenie jako auto_rejected_due_to_art38 i informuje konsumenta o wygaśnięciu prawa odstąpienia na mocy art. 38 ust. 1 pkt 13 u.p.k.
```

### Prompt 4 — Platforma LMS, Certyfikaty PDF i Boks Poleceń „Prezent za Polecenie” (`C1–C4`)
```text
Zaimplementuj funkcje panelu kursantki (/kurs lub /strefa):
1) Strażnik 18 miesięcy (Access Guard): sprawdzaj przy każdej sesji access_expires_at > NOW() (18 miesięcy / 548 dni od zakupu) i wyświetlaj w nagłówku datę ważności dostępu.
2) Odtwarzacz HLS (Cloudflare Stream / Bunny.net z tokenami Signed JWT URLs ważnymi 120 min) z zapisem postępu co 15 sekund (Auto-Resume) oraz rejestracją first_content_accessed_at przy pierwszym uruchomieniu lekcji.
3) Test końcowy (10 pytań, próg 80%) i endpoint /api/certificate generujący imienny certyfikat ukończenia Szkoły Rodzenia Online HappyBirth.pl w PDF.
4) Wbudowany Boks Poleceń Koleżeńskich (Model „Prezent za Polecenie” zamiast prowizji pieniężnej):
   - Każda kursantka widzi swój unikalny kod rabatowy (-10% zniżki dla jej koleżanki na zakup kursu).
   - Przycisk „Kopiuj kod dla koleżanki” kopiuje gotową wiadomość z oznaczeniem #współpraca.
   - Gdy inna osoba opłaci kurs z użyciem tego kodu, webhook płatności natychmiast odblokowuje w panelu polecającej kursantki sekcję „Twój Prezent Bonusowy” z plikiem PDF do pobrania: „Szybkie i Zdrowe Obiady w 15 Minut dla Przyszłej Mamy i w Czasie Laktacji (Przepisy + Lista Zakupów PDF)”.
```

### Prompt 5 — Atrybucja Afiliacyjna 2-Tier Capped CPA (`D1b`, `D2`, `D2a`) i Izolacja RODO (`E5`)
```text
Zaimplementuj serwerowy moduł atrybucji i naliczania prowizji dla partnerów z programu /afiliacja:
1) Reguły atrybucji:
   - Ostatni klik partnerski (?ref=) w oknie 30 dni (ciasteczko First-Party hb_aff_ref HttpOnly).
   - Kod afiliacyjny wpisany w koszyku ma zawsze pierwszeństwo nad linkiem.
   - Blokada naliczania prowizji dla kodu TEST (100%), kodów wygasłych, self-referral oraz zamówień zwróconych.
2) Model 2-Tier Capped CPA:
   - Poziom 1 (Tier 1): stawka partnera (domyślnie 20% przy kodzie -10%, 25% dla twórców/wydawców, 30% dla położnych i fizjoterapeutek).
   - Poziom 2 (Tier 2 Broker Override): jeśli partner Poziomu 1 został zaproszony przez Brokera (referred_by_broker_id), nalicz dodatkowe 5% dla Brokera (twarda blokada powyżej 2. poziomu, zero wynagrodzenia za samą rekrutację).
3) Cykl prowizji zsynchronizowany z Art. 38 pkt 13:
   - Status PENDING po płatności -> zmiana na ELIGIBLE po zalogowaniu klientki do kursu (first_content_accessed_at IS NOT NULL) i upływie buforu anty-fraud (7–14 dni).
4) Ścisła izolacja RODO: do panelu afilianta i do narzędzi reklamowych nigdy nie przekazuj imion, adresów e-mail, tygodnia ciąży, terminu porodu ani postępu lekcji kursantek.
```

### Prompt 6 — Mikro-Narzędzia Lead Magnet i Lejek Tygodnia Ciąży (`F2`, `F3`, `F4`)
```text
Przygotuj specyfikację i komponenty dla pozyskiwania leadów oraz komunikacji bezpośredniej HappyBirth.pl:
1) Dwa interaktywne mikro-narzędzia webowe generujące spersonalizowany PDF po podaniu adresu e-mail i tygodnia ciąży / terminu porodu:
   - Generator Planu Porodu Zgodnego ze Standardem Opieki Okołoporodowej (na bazie Modułu 5).
   - Interaktywny Kalkulator Wyprawki i Torby do Szpitala „Co kupić na start, a z czym poczekać” (na bazie Modułu 4).
2) Sekwencja 4 spersonalizowanych wiadomości e-mail dopasowanych do aktualnego etapu ciąży subskrybentki:
   - Etap I (tydz. 1–13 „Dwie kreski”): wskazówki z Modułów 1–2 + argument 18 miesięcy dostępu od zakupu.
   - Etap II (tydz. 14–27 „Wreszcie lepiej”): wskazówki z Modułu 3.
   - Etap III (tydz. 28–poród „Torba spakowana”): wskazówki z Modułów 4–5.
   - Etap IV („Pierwszy rok”): wskazówki z Modułów 6–8.
3) Szablony bezpośrednich wiadomości outreach (maks. 90 słów) dla: (a) położnych i fizjoterapeutek (zaproszenie do /afiliacja ze stawką 30%), (b) mikrotwórczyń parentingowych (/afiliacja), (c) marek i producentów wyprawki dziecięcej (zaproszenie do /partnerzy).
```
