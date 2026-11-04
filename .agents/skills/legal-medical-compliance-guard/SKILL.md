---
name: legal-medical-compliance-guard
description: >-
  Strażnik zgodności prawnej, konsumenckiej, medycznej i RODO w projekcie HappyBirth.
  Weryfikuje dane spółki KLARSOLUTIONS sp. z o.o. (KRS 0001268396), zgodność z prawem konsumenckim
  (Art. 38 ust. 1 pkt 13), Dyrektywą Omnibus, RODO (Art. 9 - dane o zdrowiu) oraz polskim prawem
  okołoporodowym (Rozporządzenie MZ z 23.10.2025 r., Dz.U. 2025 poz. 1525).
---

# Legal & Medical Compliance Guard (HappyBirth)

## 1. Oficjalne Dane Spółki (Single Source of Truth)
Na podstawie Pełnego Odpisu z Krajowego Rejestru Sądowego (stan na dzień 24.09.2026 r., sygnatura PO.VIII NS-REJ.KRS/30505/26/551):

* **Firma:** KLARSOLUTIONS SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ
* **Forma prawna:** Spółka z ograniczoną odpowiedzialnością (wpis prawomocny 23.09.2026 r., spółka NIE jest w organizacji)
* **Numer KRS:** `0001268396`
* **NIP:** `7812118273`
* **REGON:** `54578277900000` (w obrocie: `545782779`)
* **Sąd rejestrowy:** Sąd Rejonowy Poznań - Nowe Miasto i Wilda w Poznaniu, VIII Wydział Gospodarczy Krajowego Rejestru Sądowego
* **Siedziba i adres:** ul. Śląska 14, 60-614 Poznań, Polska
* **Kapitał zakładowy:** 5 000,00 PLN (opłacony w całości)
* **Reprezentacja:** Do składania oświadczeń w imieniu spółki jest upoważniony każdy z członków zarządu samodzielnie. Prezes Zarządu: Michał W.
* **Kluczowy kod PKD:** `85.59.B` (Kursy i szkolenia związane ze zdobywaniem wiedzy, umiejętności i kwalifikacji zawodowych w formach pozaszkolnych)

---

## 2. Prawa Konsumenta i Dyrektywa Omnibus (UOKiK)

### 2.1. Zrzeczenie się prawa do odstąpienia od umowy (Treści Cyfrowe)
Zgodnie z **art. 38 ust. 1 pkt 13 Ustawy z dnia 30 maja 2014 r. o prawach konsumenta**:
- Prawo odstąpienia od umowy zawartej poza lokalem przedsiębiorstwa lub na odległość NIE przysługuje konsumentowi w odniesieniu do umów o dostarczanie treści cyfrowych niedostarczanych na nośniku materialnym, za które konsument jest zobowiązany do zapłaty ceny, jeżeli przedsiębiorca rozpoczął świadczenie za wyraźną i uprzednią zgodą konsumenta.
- **Wymóg wdrożeniowy w procesie zakupu (Stripe / Koszyk):**
  Przed dokonaniem płatności kupujący musi zaznaczyć pole (lub zostać jednoznacznie poinformowany):
  *„Wyrażam zgodę na rozpoczęcie świadczenia usługi i dostarczenie treści cyfrowych przed upływem terminu do odstąpienia od umowy i przyjmuję do wiadomości, że wraz z uzyskaniem dostępu do platformy kursowej tracę prawo do odstąpienia od umowy.”*
- **Potwierdzenie na trwałym nośniku:** Po zakupie system wysyła e-mail z potwierdzeniem zawarcia umowy oraz regulaminem w formacie PDF.

### 2.2. Przejrzystość Cenowa (Omnibus)
- Cena regularna kursu wynosi **489,00 zł brutto** (jednorazowa płatność).
- Kategoryczny zakaz stosowania sztucznych cen przekreślonych (np. *„999 zł -> 489 zł”*) bez rzeczywistej historii sprzedaży po cenie wyższej w okresie ostatnich 30 dni.
- Rabaty i akcje promocyjne mogą być realizowane wyłącznie za pośrednictwem indywidualnych kodów rabatowych (np. w Stripe Checkout).

---

## 3. Ochrona Danych Osobowych i RODO (Art. 9 RODO)

1. **Kwalifikacja prawna terminu porodu:**
   Data przewidywanego porodu lub wiek ciążowy stanowią informację ujawniającą stan zdrowia kobiety (art. 9 ust. 1 RODO – szczególna kategoria danych).
2. **Kaganiec na formularze i zbieranie danych:**
   - W publicznych formularzach (np. zapis na listę oczekujących, pobranie bezpłatnej lekcji) **kategorycznie zakazuje się** wymagania podania terminu porodu.
   - Do zapisu wymagany jest wyłącznie adres e-mail i ewentualnie imię.
3. **Piksele śledzące i Meta Conversions API:**
   - Wszelkie identyfikatory zdrowotne są wycięte z parametrów zdarzeń przesyłanych do platform reklamowych.
   - W strefie kursantki (`/strefa/*`) obowiązuje bezwzględny zakaz ładowania bibliotek Facebook Pixel, TikTok Pixel, Google Ads Tag czy Hotjar.

---

## 4. Prawo Medyczne i Rzetelność Merytoryczna

1. **Obowiązujący akt prawny (Stan na 2026 rok):**
   - **Rozporządzenie Ministra Zdrowia z dnia 23 października 2025 r. zmieniające rozporządzenie w sprawie standardu organizacyjnego opieki okołoporodowej (Dz.U. 2025 poz. 1525)**, weszło w życie **7 maja 2026 r.** (nowelizacja rozporządzenia z 16 sierpnia 2018 r.).
   - Kategoryczny zakaz używania w komunikacji marketingowej i na stronie zwrotu „Standard MZ 2024” (akt taki nie istnieje – jest to halucynacja).
2. **Zgodność z MDR (Medical Device Regulation):**
   - Narzędzia pomocnicze w platformie (np. Notatnik Czasu Skurczów w `/strefa/licznik`) muszą zachować status czystego narzędzia pomiarowo-edukacyjnego (stoper / log pomiarów).
   - Narzędzie NIE MOŻE stawiać diagnoz klinicznych ani wydawać nakazów w stylu: *„Rozpoczęła się druga faza porodu, jedź natychmiast do szpitala”*.
   - Komunikaty muszą mieć charakter neutralno-informacyjny: *„Skurcze powtarzają się regularnie co X minut. Jeśli czujesz taką potrzebę lub planowałaś to z lekarzem/położną, skonsultuj się ze szpitalem.”*
