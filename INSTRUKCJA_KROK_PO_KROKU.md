# Instrukcja Wykonania Krok po Kroku — Jak Zbudować Maszynę HappyBirth
**Dla:** Michała, Macieja i zespołu projektu HappyBirth  
**Język:** Prosty, naturalny, bez żargonu i bez lania wody  
**Wersja:** 1.1 (Zaktualizowana o bezpieczniki przed oflagowaniem Meta/Google i zgodność z MDR)  
**Cel:** Przejść od planu do pierwszej sprzedaży i dominacji na rynku w 7 bezpiecznych krokach.

---

## Przegląd Całej Drogi (Spis Kroków)

* [KROK 1: Zabezpiecz tyły (Karta wirtualna, telefon VoIP, legalna stopka)](#krok-1-zabezpiecz-tyły-dzień-1)
* [KROK 2: Daj coś za darmo i zbieraj kontakty (Sterylny Plan Porodu PDF)](#krok-2-darmowy-magnes-na-klientki-sterylny-plan-porodu-dzień-2)
* [KROK 3: Zbuduj „Sterylną Stronę” pod reklamy (Bez zakazanych słów)](#krok-3-sterylna-strona-pod-reklamy-dzień-3)
* [KROK 4: Uruchom bezpieczne reklamy z kagańcem (35 zł dziennie)](#krok-4-uruchom-reklamy-z-twardym-kagańcem-dzień-4)
* [KROK 5: Ustaw automatyczne maile (Żeby nie wpadały do SPAM-u)](#krok-5-ustaw-automatyczną-pocztę-bez-spamu-dzień-5)
* [KROK 6: Włącz Apple Pay i bezpieczny notatnik skurczów](#krok-6-płatności-1-kliknięciem-i-bezpieczny-notatnik-dzień-6)
* [KROK 7: Podepnij położne i polecenia (Darmowy ruch z gabinetów)](#krok-7-partnerstwa-z-położnymi-i-skalowanie-dzień-7)

---

## KROK 1: Zabezpiecz tyły (Dzień 1)
*Zanim wydasz choćby złotówkę na reklamę, musisz mieć pewność, że żaden bank ani urząd Cię nie zablokuje.*

### Co robisz:
1. **Załóż kartę wirtualną z limitem**:
   - Otwórz aplikację bankową (np. Revolut Business, mBank).
   - Wygeneruj nową kartę wirtualną i ustaw na niej **sztywny limit dzienny: 150 zł**.
   - Podepnij tylko tę kartę do konta reklamowego na Facebooku i TikToku.
   - *Dlaczego?* Nawet jeśli algorytm Mety oszaleje i spróbuje pobrać 5000 zł, bank fizycznie odrzuci transakcję powyżej 150 zł. Śpisz spokojnie.
2. **Kup wirtualny numer telefonu (VoIP)**:
   - Zarejestruj numer stacjonarny w usłudze VoIP (np. FCN.pl lub Zadarma – koszt ~10–15 zł/miesiąc).
   - Wpisz go w stopce strony: *Infolinia techniczna: pon.–pt. 10:00–14:00*.
   - Włącz tam pocztę głosową z komunikatem, że najszybszą pomoc uzyskają mailowo pod adresem: `kontakt@happybirth.pl`.
   - *Dlaczego?* Stripe, Google i prawo konsumenckie wymagają telefonu na stronie. Ty masz święty spokój w nocy, a wymóg prawny jest spełniony.
3. **Uzupełnij stopkę strony**:
   - Wpisz w pliku stopki pełne dane: Nazwę firmy, NIP, adres, link do regulaminu z informacją o natychmiastowym dostępie (Art. 38) i cenę stałą: 489 zł.

---

## KROK 2: Darmowy magnes na klientki — Sterylny Plan Porodu (Dzień 2)
*Nie zaczynaj od wciskania drogiego kursu. Daj im oficjalny dokument, ale zrób to tak, by boty Mety Cię nie oflagowały.*

### Co robisz:
1. **Zastosuj zasadę Sterylnej Śluzy na `/plan-porodu`**:
   - Publiczna strona `/plan-porodu` **NIE MOŻE** ładować w kodzie JavaScript żadnych pytań o: *nacięcie krocza, znieczulenie ZZO, amniotomię, kaniulację czy cesarkę*. Boty Mety skanują pliki JS strony!
   - Na publicznym ekranie bot widzi **WYŁĄCZNIE czysty formularz administracyjno-prawny**:
     - Nagłówek: *„Oficjalny Wzór Praw Pacjenta MZ 2024 — Szablon Dokumentu do Szpitala”*.
     - Pola: Imię, E-mail, Przewidywany termin porodu.
2. **Gdzie trafia właściwy Plan Porodu z opcjami medycznymi?**:
   - Po kliknięciu „Wyślij” klientka natychmiast otrzymuje gotowy plik PDF na swoją skrzynkę mailową przez Resend, LUB
   - Zostaje przekierowana do zamkniętej strefy (`/strefa/plan-porodu`), gdzie boty Mety nie mają wstępu (`robots.txt: Disallow`) i gdzie nie ma żadnych pikseli marketingowych.
3. **Efekt**:
   - Bot Mety ocenia stronę jako legalną, edukacyjną dokumentację urzędową (zero czerwonych flag).
   - Kobieta dostaje kompletny, medyczny dokument gotowy do druku.
   - W bazie D1 masz zapisanego leada z dokładną datą porodu.

---

## KROK 3: „Sterylna Strona” pod reklamy (Dzień 3)
*Strona, na którą trafiają ludzie z Facebooka i TikToka, musi być czysta jak sala operacyjna przed inspekcją.*

### Co robisz:
1. **Utwórz dedykowany adres `/lp/spokojny-porod`**:
   - To podstrona dedykowana wyłącznie dla osób klikających w reklamę.
   - **Schowaj górne menu (Zasada zamkniętych drzwi)**: brak linków do bloga, brak YouTube'a, brak rozpraszaczy. Tylko dwa wyjścia: kup kurs (489 zł) albo pobierz darmowy plan porodu.
2. **Zastosuj twardy filtr językowy (Słowa zakazane vs Bezpieczne)**:
   - Usuń z publicznego programu kursu i opisów słowa, które wyzwalają filtry Google i Mety:
     - ❌ *„Znieczulenie ZZO, gaz rozweselający, cięcie cesarskie”* ➡️  **„Świadomość procedur szpitalnych, metody łagodzenia napięcia i przygotowanie na każdy scenariusz”**.
     - ❌ *„Laktacja bez bólu”* (nielegalny claim UOKiK) ➡️  **„Komfortowa laktacja — technika, pozycje i wsparcie”**.
     - ❌ *„Chwyt asymetryczny brodawki”* ➡️  **„Prawidłowa technika przystawienia maluszka”**.
     - ❌ *„Unikniesz nacięcia krocza i powikłań”* ➡️  **„Aktywna ochrona krocza i pozycje wertykalne”**.

---

## KROK 4: Uruchom reklamy z twardym kagańcem (Dzień 4)
*Zaczynamy od mikro-budżetów. Żadnego szastania pieniędzmi.*

### Co robisz:
1. **Nagraj proste, estetyczne wideo**:
   - Kadr: Położna z uśmiechem mówi do kamery (jasny pokój, czysty dźwięk).
   - Tekst w pierwszych 3 sekundach: *„Pakujesz torbę do szpitala? Oto 3 rzeczy, o których większość mam dowiaduje się dopiero na porodówce. Pobierz bezpłatny, oficjalny wzór dokumentów szpitalnych zgodny z wytycznymi Ministerstwa Zdrowia 2024”*.
   - Obrazki: Pakowanie torby, partner ćwiczący oddech w ubraniu, wózek, aplikacja w telefonie.
   - Zakaz: Żadnych nagich ciał, widocznych brodawek przy karmieniu ani scen ze szpitalnych sal zabiegowych!
2. **Ustawienia kampanii w Menadżerze Reklam Meta**:
   - Cel: **Kontakty (Leady)** na stronę `/plan-porodu` LUB **Sprzedaż** na `/lp/spokojny-porod`.
   - Grupa docelowa: **Tylko Kobiety, Wiek: 22–37 lat, Lokalizacja: Polska**.
   - **Odznacz** ptaszek przy opcji „Rozszerzenie grupy odbiorców Advantage+” (żeby Facebook nie pokazywał reklamy emerytom!).
   - Budżet: Ustaw **budżet na poziomie zestawu reklam (ABO)** na kwotę **35 zł dziennie**.
3. **Zasada bezpiecznika (Circuit Breaker)**:
   - Jeśli reklama wydała 70 zł i nikt nie pobrał planu porodu ani nie kliknął zakupu – **wyłączasz ją jednym kliknięciem** i zmieniasz wideo/nagłówek.

---

## KROK 5: Ustaw automatyczną pocztę bez SPAM-u (Dzień 5)
*Najczęstszy błąd w Polsce: klient płaci, a mail z hasłem ląduje w koszu na WP.pl lub Onecie.*

### Co robisz:
1. **Ustaw rekordy DNS w Cloudflare**:
   - Wejdź do panelu domeny w Cloudflare.
   - Wklej 3 wpisy uwierzytelniające pocztę: **SPF, DKIM oraz DMARC**.
   - *Dlaczego?* To cyfrowy paszport Twojej domeny. Poczta WP.pl i Onet widzą, że jesteś legalną firmą, a nie spamerem, i wpuszczają Twoje maile prosto do Głównej skrzynki.
2. **Uruchom sekwencję mailową wg terminu porodu**:
   - Dziewczyna pobrała Plan Porodu, ma termin za 4 tygodnie i jeszcze nie kupiła kursu.
   - Po 24 godzinach system wysyła jej krótką, ciepłą wiadomość:  
     *„Cześć Kasiu! Został Wam tylko miesiąc. Zamiast spędzać kolejne weekendy na forach internetowych, obejrzyjcie z partnerem 52 krótkie lekcje w HappyBirth i wejdźcie na porodówkę ze spokojem”*.

---

## KROK 6: Płatności 1-kliknięciem i bezpieczny notatnik (Dzień 6)
*Usuwamy przeszkody techniczne w telefonie kursantki i zabezpieczamy prawo.*

### Co robisz:
1. **Wgraj plik weryfikacji Apple Pay**:
   - Umieść w folderze `public/.well-known/` plik autoryzacyjny `apple-developer-merchantid-domain-association` ze Stripe.
   - *Efekt*: Kobieta trzymająca iPhone’a klika jeden przycisk, przykłada palec lub twarz (FaceID) i kurs jest kupiony w 2 sekundy bez wpisywania numerów kart.
2. **Bezpieczny Licznik Skurczów (Zgodność z unijnym rozporządzeniem MDR)**:
   - Narzędzie działa wyłącznie jako **„Cyfrowy Notatnik Czasu Skurczów”** (zwykły stoper).
   - **Kategoryczny zakaz nakazów klinicznych**: Usuwamy wszelkie komunikaty typu: *„Czas ruszać do szpitala! Skierujcie się z partnerem na izbę przyjęć”*.
   - Zamiast tego bezpieczna notatka: *„Zarejestrowano 3 regularne skurcze. Skonsultuj się telefonicznie ze swoją położną lub lekarzem prowadzącym”*.
   - Działa offline (PWA) w szpitalnej sali bez zasięgu.

---

## KROK 7: Partnerstwa z położnymi i skalowanie (Dzień 7+)
*Gdy maszyna działa i zarabia z reklam, uruchamiasz darmowy ruch od lekarzy.*

### Co robisz:
1. **Wydrukuj eleganckie bloczki kuponowe z kodem QR**:
   - Zaoferuj zaprzyjaźnionym położnym POZ i gabinetom ginekologicznym bloczki z kuponami: *„Rabat -10% na szkołę rodzenia HappyBirth dla pacjentek gabinetu”*.
2. **Ustaw prowizję partnerską**:
   - Położna poleca kurs swojej pacjentce. Pacjentka płaci taniej (kod rabatowy), a położna otrzymuje automatycznie np. 50 zł prowizji od każdego zakupu.
   - *Efekt*: Zyskujesz dziesiątki poleceń od najbardziej zaufanych autorytetów medycznych w Polsce bez płacenia za reklamy na Facebooku!

---

### Podsumowanie: Od Czego Zaczynasz Dzisiaj?

1. Dziś: **KROK 1** (karta wirtualna 150 zł, telefon VoIP i czysta stopka).
2. Jutro: **KROK 2 & 3** (upewnienie się, że `/plan-porodu` i opisy są w 100% sterylne dla bota Mety).
3. W weekend: Pierwsza bezpieczna kampania testowa za 35 zł.
