# INSTRUKCJA STARTU KAMPANII & RUNBOOK OPERACYJNY (SOP)
## Projekt: HappyBirth · Szkoła Rodzenia Online VOD
**Data przygotowania:** 17 września 2026 r.  
**Cel:** Czyste, bezpieczne uruchomienie nowych kont reklamowych, integracja tokenów API z Antigravity oraz wdrożenie 3 pierwszych kampanii z twardym kagańcem budżetowym (max 70 zł CPA).

---

## CZĘŚĆ 1: BHP Nowych Kont (Jak założyć konta bez powiązań z długiem Mama Gaja)

Pamiętaj o złotej zasadzie: **Zero powiązań z zadłużonym kontem.** Meta potrafi zbanować nowe konto w 5 sekund, jeśli wykryje tę samą kartę, ten sam profil FB lub ciasteczka w przeglądarce.

### Krok 1.1: Karta Płatnicza (Hardware Kill-Switch)
1. Zaloguj się do swojej bankowości (np. **Revolut Business** lub banku firmowego).
2. Wygeneruj **nową, czystą kartę wirtualną** (nigdy wcześniej nieużywaną w Meta Ads).
3. Ustaw na niej **twardy dzienny limit wydatków: 150–200 PLN**.
   *(Nawet gdyby algorytm Mety oszalał, bank fizycznie odrzuci transakcję powyżej tej kwoty).*

### Krok 1.2: Czysty Profil Przeglądarki
1. W przeglądarce Chrome/Brave kliknij swój awatar w prawym górnym rogu ➔ **Dodaj nowy profil** (nazwij go np. *HappyBirth-AdOps*).
2. Dzięki temu pracujesz w sterylnym środowisku bez starych ciasteczek i sesji po Mama Gaja.

### Krok 1.3: Czysty Profil Zarządczy na Facebooku
1. Do zarządzania kontem reklamowym użyj czystego profilu prywatnego (np. wspólnika, Macieja lub osoby, która nigdy nie miała blokad reklamowych).
2. Profil musi mieć włączone **uwierzytelnianie dwuskładnikowe (2FA)**.

---

## CZĘŚĆ 2: Zakładanie Meta Business Portfolio & Generowanie Dostępów

### Krok 2.1: Założenie Nowego Portfolio Biznesowego
1. Wejdź na adres: **https://business.facebook.com/overview**
2. Kliknij **Utwórz konto** (Create Account):
   - Nazwa firmy: **HappyBirth**
   - Twoje imię i nazwisko
   - Firmowy adres e-mail (np. `kontakt@happybirth.pl` lub Twój dedykowany e-mail)
3. Potwierdź link aktywacyjny w odebranej wiadomości e-mail.

### Krok 2.2: Weryfikacja Domeny `happybirth.pl` w Cloudflare (2 minuty)
1. W Business Managerze wejdź w: **Ustawienia firmy ➔ Bezpieczeństwo marki ➔ Domeny**.
2. Kliknij **Dodaj ➔ Utwórz nową domenę** i wpisz: `happybirth.pl`.
3. Wybierz metodę: **Wpis DNS TXT w rekordzie domeny**. Skopiuj podany ciąg znaków (zaczynający się od `facebook-domain-verification=...`).
4. Zaloguj się do panelu **Cloudflare DNS** dla domeny `happybirth.pl`:
   - Dodaj rekord: Typ: `TXT`, Nazwa: `@`, Zawartość: wklej skopiowany kod z Mety, TTL: `Auto`.
5. Wróć do Mety i kliknij zielony przycisk **Zweryfikuj domenę**. Status zmieni się na: *Zweryfikowano*.

### Krok 2.3: Utworzenie Konta Reklamowego
1. W Business Managerze wejdź w: **Konta ➔ Konta reklamowe ➔ Dodaj ➔ Utwórz nowe konto reklamowe**.
2. Ustawienia:
   - Nazwa: **HappyBirth Ads 2026**
   - Strefa czasowa: **(GMT+01:00) Warszawa** (krytyczne dla poprawnego zliczania dób!)
   - Waluta: **PLN - Złoty polski**
3. Dodaj metodę płatności: podepnij przygotowaną wirtualną kartę z Revoluta z limitem 150 zł.
4. Skopiuj **Identyfikator konta reklamowego** (ciąg cyfr, np. `act_1234567890`).

### Krok 2.4: Utworzenie Piksela & Wygenerowanie Tokena Meta CAPI
1. Wejdź w: **Ustawienia firmy ➔ Źródła danych ➔ Zestawy danych (lub Piksele) ➔ Dodaj**.
2. Nazwij go: **HappyBirth Pixel**. Skopiuj **Pixel ID** (np. `9876543210`).
3. Kliknij **Otwórz w Menedżerze zdarzeń** (Events Manager).
4. Przejdź do zakładki **Ustawienia (Settings)**:
   - Zjedź do sekcji **API Konwersji (Conversions API)**.
   - W sekcji *Ręczna konfiguracja* kliknij niebieski link: **Wygeneruj token dostępu (Generate access token)**.
   - Skopiuj wygenerowany długi token (zaczynający się od `EAAG...`).

---

## CZĘŚĆ 3: Gdzie wkleić klucze w projekcie HappyBirth?

Otwórz plik `.env.local` w katalogu `d:\Antygravity2.0\HappyBirth\.env.local` i uzupełnij:

```env
# Meta Ads Server-Side Tracking (Conversions API - CAPI)
META_PIXEL_ID=twoj_pixel_id_tutaj
META_CAPI_ACCESS_TOKEN=twoj_wygenerowany_token_eaag_tutaj
META_AD_ACCOUNT_ID=act_twoj_identyfikator_konta_tutaj
```

Gdy tylko zapiszesz te 3 linijki:
1. Każda sprzedaż 489 zł ze Stripe natychmiast wyśle serwerowy event `Purchase` do Mety.
2. Nasz silnik Growth Engine i serwer MCP uzyska uprawnienia do odczytu kosztów i automatycznego pauzowania kampanii przy przekroczeniu 70 zł CPA.

---

## CZĘŚĆ 4: Precyzyjny Plan Pierwszych 3 Kampanii Testowych

Nie puszczamy pustego konta na wielki budżet. Zaczynamy od 3 małych, precyzyjnych testów (łączny budżet startowy: **100 zł / dzień**).

---

### KAMPANIA #1: Magnes Leadowy (Darmowy Plan Porodu PDF)
* **Rola:** Błyskawiczne nakarmienie nowego piksela 50–100 konwersjami za grosze i zebranie bazy ciężarnych do mailingu.
* **Cel w Meta Ads:** **Kontakty (Leads)**.
* **Budżet:** **30 PLN / dzień** (Budżet na poziomie zestawu - ABO).
* **Targetowanie (Żelazny Kaganiec):**
  - Lokalizacja: Polska.
  - Płeć: **Tylko Kobiety**.
  - Wiek: **23 – 36 lat**.
  - Zainteresowania: Ciąża, Badania prenatalne, Szkoła rodzenia, Ginekologia.
  - **Advantage Audience Expansion: WYŁĄCZONE (Odznaczone!)**.
* **Kreacja:**
  - Format: Pojedyncza grafika lub krótkie wideo z podglądem arkusza PDF.
  - Nagłówek: **Oficjalny Szablon Planu Porodu PDF (Standard MZ 2024)**
  - Tekst główny (Copy):
    > *Zgodnie ze Standardem Opieki Okołoporodowej w Polsce masz prawo przedstawić w szpitalu swoje świadome preferencje. Wygenerujcie z partnerem czytelny, jednostronicowy Plan Porodu w 3 minuty i weźcie ze sobą na izbę przyjęć. Pobierz bezpłatny wzór PDF do druku.*
  - URL docelowy: `https://happybirth.pl/plan-porodu`
  - Przycisk CTA: **Pobierz (Download)**.

---

### KAMPANIA #2: Zakupowa · Wideo Kąt: Partner & Masaż Porodowy
* **Rola:** Bezpośrednia sprzedaż kursu 489 zł oparta na uldze w bólu i zaangażowaniu partnera.
* **Cel w Meta Ads:** **Sprzedaż (Sales)** ➔ Zdarzenie konwersji: **Zakup (Purchase)**.
* **Strategia stawek (Bidding):**
  - Opcja: **Cost per result goal (Cost Cap) = 70,00 PLN**.
* **Budżet:** **40 PLN / dzień** (ABO).
* **Targetowanie:**
  - Płeć: **Tylko Kobiety** (lub zestaw B: Kobiety i Mężczyźni 24–38 lat).
  - Wiek: **23 – 37 lat**.
  - Zainteresowania: Wyprawka dla noworodka, Poród naturalny, Szkoła rodzenia.
* **Kreacja:**
  - Format: Wideo pionowe Reels (9:16) — 20–30 sekund wycięte z lekcji z fizjoterapeutką / położną pokazującą chwyty masażu kości krzyżowej.
  - Hook (Pierwsze 3 sekundy wideo): *„3 chwyty masażu pleców dla partnera, które uśmierzają skurcze porodowe.”*
  - Nagłówek: **52 lekcje wideo 4K dla dwojga · Dostęp na 12 miesięcy**
  - Tekst główny (Copy):
    > *Nie stój bezradnie na porodówce. W HappyBirth uczymy partnera konkretnych zadań: jak masować lędźwie, jak wspierać oddechem i jak zadbać o mamę w pierwszych dobach w domu. Oglądacie we dwoje na kanapie w telefonie lub na TV. Dołącz do kursu z gwarancją spokoju.*
  - URL docelowy: `https://happybirth.pl/#cena?utm_source=meta&utm_medium=cpc&utm_campaign=partner_masaz&utm_content=reels_chwyty`
  - Przycisk CTA: **Kup teraz / Zarejestruj się**.

---

### KAMPANIA #3: Zakupowa · Karuzela: NFZ vs HappyBirth (Kanapa)
* **Rola:** Przełamanie obiekcji rodziców, którzy nie mają czasu na dojazdy do stacjonarnej szkoły rodzenia.
* **Cel w Meta Ads:** **Sprzedaż (Sales) ➔ Zakup (Purchase)** z limitem **Cost Cap 70 PLN**.
* **Budżet:** **30 PLN / dzień** (ABO).
* **Targetowanie:**
  - Wiek: **24 – 36 lat, Kobiety, Polska**.
* **Kreacja:**
  - Format: Karuzela 3-kartowa (Dwa Światy).
  - Karta 1: *Szkoła stacjonarna: korki po pracy, sztywne godziny, brak wiedzy o połogu.*
  - Karta 2: *HappyBirth: na kanapie przy herbacie we dwoje, 52 lekcje 4K, dostęp przez 12 msc po porodzie.*
  - Karta 3: *W cenie: Licznik skurczów SOS + Plan Porodu + Strefa dla Taty.*
  - Nagłówek: **Spokojny poród we własnym rytmie · 489 zł dla dwojga**
  - URL docelowy: `https://happybirth.pl/#cena?utm_source=meta&utm_medium=cpc&utm_campaign=karuzela_porownanie`
  - Przycisk CTA: **Kup teraz**.

---

## CZĘŚĆ 5: Poranna Check-lista w 5 Krokach (Twój Start Rano)

1. [ ] **Krok 1 (5 min):** Wygeneruj wirtualną kartę Revolut z limitem 150 zł.
2. [ ] **Krok 2 (10 min):** Załóż Business Portfolio na `business.facebook.com` z czystego profilu.
3. [ ] **Krok 3 (3 min):** Dodaj wpis DNS TXT w Cloudflare i zweryfikuj domenę `happybirth.pl`.
4. [ ] **Krok 4 (5 min):** Wygeneruj Pixel ID i Access Token CAPI, a następnie wklej je do pliku `.env.local`.
5. [ ] **Krok 5 (15 min):** Skonfiguruj w Ads Managerze Kampanię #1 (Magnes Leadowy za 30 zł) według powyższych szablonów tekstów.

Gdy to zrobisz, bot Antigravity w `HappyBirth-Growth-Engine` automatycznie przejmie wartę i będzie 24/7 pilnował, aby koszt nie przekroczył ani grosza powyżej ustalonego limitu!
