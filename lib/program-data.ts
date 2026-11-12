// Program kursu: 52 lekcje w 8 modułach, cztery pasma. Wygenerowane z program.json strony v1
// (tytuły publiczne po filtrze językowym, czasy z panelu strefy). Nie edytować ręcznie: generuj.py.
export interface Pasmo { id: 'p1' | 'p2' | 'p3' | 'p4'; nazwa: string; zakres: string; moduly: number[] }
export interface Modul { nr: number; nazwa: string; pasmo: Pasmo['id']; opis: string; lekcje: number[]; sekundy: number }
export interface Lekcja { nr: number; modul: number; tytul: string; sekundy: number }

export const PASMA: Pasmo[] = [
  {
    "id": "p1",
    "nazwa": "Dwie kreski",
    "zakres": "tydzień 1 do 13",
    "moduly": [
      1,
      2
    ]
  },
  {
    "id": "p2",
    "nazwa": "Wreszcie lepiej",
    "zakres": "tydzień 14 do 27",
    "moduly": [
      3
    ]
  },
  {
    "id": "p3",
    "nazwa": "Torba spakowana",
    "zakres": "tydzień 28 do porodu",
    "moduly": [
      4,
      5
    ]
  },
  {
    "id": "p4",
    "nazwa": "Pierwszy rok",
    "zakres": "od dnia zero do pierwszych urodzin",
    "moduly": [
      6,
      7,
      8
    ]
  }
];

export const MODULY: Modul[] = [
  {
    "nr": 1,
    "nazwa": "Twoja ciąża tydzień po tygodniu",
    "pasmo": "p1",
    "opis": "Jak zmienia się ciało i jak rozwija się dziecko, trymestr po trymestrze. Do tego nowina dla bliskich, aplikacje i mity.",
    "lekcje": [
      1,
      2,
      3,
      4,
      5
    ],
    "sekundy": 1097
  },
  {
    "nr": 2,
    "nazwa": "Zdrowie, profilaktyka i samopoczucie",
    "pasmo": "p1",
    "opis": "Kalendarz badań, samopoczucie na co dzień i sygnały, o których warto wiedzieć wcześniej.",
    "lekcje": [
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ],
    "sekundy": 2056
  },
  {
    "nr": 3,
    "nazwa": "Komfort i aktywność na co dzień",
    "pasmo": "p2",
    "opis": "Sen, ruch, podróże i domowe obowiązki. Ćwiczenia pokazane krok po kroku.",
    "lekcje": [
      13,
      14,
      15,
      16,
      17,
      18
    ],
    "sekundy": 2279
  },
  {
    "nr": 4,
    "nazwa": "Projekt „Gniazdo”, wyprawka i pokój dziecka",
    "pasmo": "p3",
    "opis": "Wózek, fotelik, łóżeczko, apteczka i ubrania. Co kupić na start, a z czym poczekać.",
    "lekcje": [
      19,
      20,
      21,
      22,
      23,
      24,
      25
    ],
    "sekundy": 2626
  },
  {
    "nr": 5,
    "nazwa": "Godzina „Zero”, świadomy i aktywny poród",
    "pasmo": "p3",
    "opis": "Plan porodu, torba do szpitala, okresy porodu, ruch i oddech, rola osoby towarzyszącej i przygotowanie na każdy scenariusz.",
    "lekcje": [
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34
    ],
    "sekundy": 3243
  },
  {
    "nr": 6,
    "nazwa": "Połóg, regeneracja i fizjoterapia mamy",
    "pasmo": "p4",
    "opis": "Pierwsze tygodnie po porodzie: regeneracja, emocje, bezpieczny powrót do ruchu i historie dwóch mam.",
    "lekcje": [
      35,
      36,
      37,
      38,
      39
    ],
    "sekundy": 1901
  },
  {
    "nr": 7,
    "nazwa": "Opieka nad noworodkiem i bezpieczeństwo",
    "pasmo": "p4",
    "opis": "Pierwsze dni dziecka, kąpiel i pielęgnacja, bezpieczny sen, szczepienia i pierwsza pomoc.",
    "lekcje": [
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48
    ],
    "sekundy": 2648
  },
  {
    "nr": 8,
    "nazwa": "Karmienie, laktacja i kolki",
    "pasmo": "p4",
    "opis": "Pozycje do karmienia, technika przystawienia, akcesoria i sposoby na trudniejsze wieczory.",
    "lekcje": [
      49,
      50,
      51,
      52
    ],
    "sekundy": 1440
  }
];

export const LEKCJE: Lekcja[] = [
  {
    "nr": 1,
    "modul": 1,
    "tytul": "I trymestr: początek nowego życia i pierwsze tygodnie",
    "sekundy": 333
  },
  {
    "nr": 2,
    "modul": 1,
    "tytul": "II trymestr: czas rozwoju zmysłów i pierwszych ruchów",
    "sekundy": 156
  },
  {
    "nr": 3,
    "modul": 1,
    "tytul": "III trymestr: wielkie odliczanie do narodzin",
    "sekundy": 94
  },
  {
    "nr": 4,
    "modul": 1,
    "tytul": "Wielka nowina: jak informować bliskich i świętować ciążę",
    "sekundy": 258
  },
  {
    "nr": 5,
    "modul": 1,
    "tytul": "Cyfrowa pomoc i fakty: aplikacje ciążowe oraz mity",
    "sekundy": 256
  },
  {
    "nr": 6,
    "modul": 2,
    "tytul": "Szkoła rodzenia online: Twój bezpieczny i wygodny start",
    "sekundy": 259
  },
  {
    "nr": 7,
    "modul": 2,
    "tytul": "Zmiany fizjologiczne w Twoim ciele: co jest normą?",
    "sekundy": 195
  },
  {
    "nr": 8,
    "modul": 2,
    "tytul": "Zmysły na wysokich obrotach: zmiana odczuwania zapachów",
    "sekundy": 134
  },
  {
    "nr": 9,
    "modul": 2,
    "tytul": "Dolegliwości ciążowe: jak sobie z nimi radzić?",
    "sekundy": 537
  },
  {
    "nr": 10,
    "modul": 2,
    "tytul": "Higiena intymna w ciąży: profilaktyka infekcji",
    "sekundy": 86
  },
  {
    "nr": 11,
    "modul": 2,
    "tytul": "Kalendarz badań w ciąży: Twoja kompletna lista",
    "sekundy": 469
  },
  {
    "nr": 12,
    "modul": 2,
    "tytul": "Pytania do ekspertki: sygnały alarmowe i kiedy jechać do szpitala",
    "sekundy": 376
  },
  {
    "nr": 13,
    "modul": 3,
    "tytul": "Ruchy dziecka i ułożenie: czego spodziewać się od 20. tygodnia?",
    "sekundy": 376
  },
  {
    "nr": 14,
    "modul": 3,
    "tytul": "Zdrowy sen w ciąży: dobór materaca i mikroklimat sypialni",
    "sekundy": 329
  },
  {
    "nr": 15,
    "modul": 3,
    "tytul": "Pozycje do snu i sposoby na bezsenność w ciąży",
    "sekundy": 206
  },
  {
    "nr": 16,
    "modul": 3,
    "tytul": "Fizjoterapia w ciąży: zestaw ćwiczeń na bóle kręgosłupa",
    "sekundy": 729
  },
  {
    "nr": 17,
    "modul": 3,
    "tytul": "Odpoczynek, podróże i bezpieczna aktywność w ciąży",
    "sekundy": 236
  },
  {
    "nr": 18,
    "modul": 3,
    "tytul": "Sprzątanie domu w ciąży: zasady bezpieczeństwa dla mamy",
    "sekundy": 403
  },
  {
    "nr": 19,
    "modul": 4,
    "tytul": "Wózek i fotelik samochodowy: instruktaż obsługi i montażu",
    "sekundy": 430
  },
  {
    "nr": 20,
    "modul": 4,
    "tytul": "Jak wybrać idealny wózek dla dziecka? Praktyczne wskazówki",
    "sekundy": 524
  },
  {
    "nr": 21,
    "modul": 4,
    "tytul": "Aranżacja pokoju dla dziecka: funkcjonalność i wygoda",
    "sekundy": 444
  },
  {
    "nr": 22,
    "modul": 4,
    "tytul": "Bezpieczne łóżeczko: wybór materaca i profilaktyka SIDS",
    "sekundy": 268
  },
  {
    "nr": 23,
    "modul": 4,
    "tytul": "Apteczka i kosmetyczka noworodka: co naprawdę warto kupić?",
    "sekundy": 360
  },
  {
    "nr": 24,
    "modul": 4,
    "tytul": "Kompletna wyprawka domowa: ubrania, tekstylia i akcesoria",
    "sekundy": 481
  },
  {
    "nr": 25,
    "modul": 4,
    "tytul": "Wanienka do kąpieli: przegląd modeli i praktyczne porady",
    "sekundy": 119
  },
  {
    "nr": 26,
    "modul": 5,
    "tytul": "Plan porodu krok po kroku: jak przygotować dokument?",
    "sekundy": 639
  },
  {
    "nr": 27,
    "modul": 5,
    "tytul": "Torba do szpitala: pakowanie w 3 krokach",
    "sekundy": 168
  },
  {
    "nr": 28,
    "modul": 5,
    "tytul": "Rodzaje porodów: poród naturalny i przygotowanie na każdy scenariusz",
    "sekundy": 414
  },
  {
    "nr": 29,
    "modul": 5,
    "tytul": "Gdy wody odejdą: instrukcja postępowania w dniu porodu",
    "sekundy": 140
  },
  {
    "nr": 30,
    "modul": 5,
    "tytul": "Aktywny poród: niefarmakologiczne metody łagodzenia bólu",
    "sekundy": 442
  },
  {
    "nr": 31,
    "modul": 5,
    "tytul": "Fizjoterapia na porodówce: pozycje i ćwiczenia z partnerem",
    "sekundy": 297
  },
  {
    "nr": 32,
    "modul": 5,
    "tytul": "Chusta rebozo: łagodzenie bólów porodowych z pomocą partnera",
    "sekundy": 127
  },
  {
    "nr": 33,
    "modul": 5,
    "tytul": "Metody łagodzenia bólu dostępne w szpitalu",
    "sekundy": 540
  },
  {
    "nr": 34,
    "modul": 5,
    "tytul": "Cztery okresy porodu: przewodnik po etapach narodzin",
    "sekundy": 476
  },
  {
    "nr": 35,
    "modul": 6,
    "tytul": "Pielęgnacja po porodzie: higiena i gojenie w pierwszych tygodniach",
    "sekundy": 129
  },
  {
    "nr": 36,
    "modul": 6,
    "tytul": "Fizjologia połogu: odchody połogowe, płodność i baby blues",
    "sekundy": 196
  },
  {
    "nr": 37,
    "modul": 6,
    "tytul": "Fizjoterapia po porodzie: bezpieczne ćwiczenia brzucha i dna miednicy",
    "sekundy": 336
  },
  {
    "nr": 38,
    "modul": 6,
    "tytul": "Wywiad po porodzie: historia Ani o powrocie do sprawności",
    "sekundy": 650
  },
  {
    "nr": 39,
    "modul": 6,
    "tytul": "Wywiad po porodzie: historia Karoliny o porodzie wywoływanym i regeneracji",
    "sekundy": 590
  },
  {
    "nr": 40,
    "modul": 7,
    "tytul": "Wygląd noworodka po porodzie: skala Apgar i pierwsze chwile",
    "sekundy": 148
  },
  {
    "nr": 41,
    "modul": 7,
    "tytul": "Zachowania i odruchy noworodka: co jest normą fizjologiczną?",
    "sekundy": 191
  },
  {
    "nr": 42,
    "modul": 7,
    "tytul": "Zasady profilaktyki śmierci łóżeczkowej (SIDS)",
    "sekundy": 58
  },
  {
    "nr": 43,
    "modul": 7,
    "tytul": "Pierwsza pomoc noworodkowa (RKO): instruktaż ratowania życia",
    "sekundy": 154
  },
  {
    "nr": 44,
    "modul": 7,
    "tytul": "Kąpiel i pielęgnacja noworodka krok po kroku",
    "sekundy": 793
  },
  {
    "nr": 45,
    "modul": 7,
    "tytul": "Szczepienia ochronne dziecka: kalendarz i przygotowanie do wizyty",
    "sekundy": 372
  },
  {
    "nr": 46,
    "modul": 7,
    "tytul": "Stany przejściowe noworodka: żółtaczka, spadek wagi i rumień",
    "sekundy": 277
  },
  {
    "nr": 47,
    "modul": 7,
    "tytul": "Typowe problemy noworodkowe: ulewanie, ciemieniucha i potówki",
    "sekundy": 244
  },
  {
    "nr": 48,
    "modul": 7,
    "tytul": "Pytania do ekspertki: pielęgnacja noworodka",
    "sekundy": 411
  },
  {
    "nr": 49,
    "modul": 8,
    "tytul": "Pozycje do karmienia piersią: technika i prawidłowy chwyt",
    "sekundy": 349
  },
  {
    "nr": 50,
    "modul": 8,
    "tytul": "Trudności w laktacji: najczęstsze sytuacje i jak sobie radzić",
    "sekundy": 218
  },
  {
    "nr": 51,
    "modul": 8,
    "tytul": "Akcesoria do karmienia: laktatory, butelki i kolektory pokarmu",
    "sekundy": 286
  },
  {
    "nr": 52,
    "modul": 8,
    "tytul": "Kolki niemowlęce: przyczyny, masaż i sposoby na ulgę",
    "sekundy": 587
  }
];

export const SUMA_SEKUND = 17290;
