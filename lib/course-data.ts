import { Stage, Lesson, MedicineCabinetItem } from './types';

export const CLOUDFLARE_CUSTOMER_DOMAIN = "customer-6d9sm694eja9tkvc.cloudflarestream.com";

export const stages: Stage[] = [
  {
    "id": "stage-01",
    "num": "01",
    "slug": "dwie-kreski",
    "title": "Dwie kreski",
    "subtitle": "Twoja ciąża tydzień po tygodniu (I–III trymestr)",
    "weeks": "Tydzień 1 – 40",
    "color": "#C33C6A",
    "accentBg": "#F9E6EC",
    "tint": "#F9E6EC",
    "deep": "#B22E5D",
    "description": "Jak zmienia się ciało i jak rozwija się dziecko, trymestr po trymestrze. Do tego nowina dla bliskich, aplikacje i mity."
  },
  {
    "id": "stage-02",
    "num": "02",
    "slug": "zdrowie-i-profilaktyka",
    "title": "Zdrowie i badania",
    "subtitle": "Zdrowie, profilaktyka i samopoczucie w ciąży",
    "weeks": "Tydzień 1 – 27",
    "color": "#8E6A14",
    "accentBg": "#FBF1D6",
    "tint": "#FBF1D6",
    "deep": "#76580F",
    "description": "Kalendarz badań, prowadzenie ciąży, samopoczucie na co dzień, higiena intymna i sygnały, o których warto wiedzieć wcześniej."
  },
  {
    "id": "stage-03",
    "num": "03",
    "slug": "wreszcie-lepiej",
    "title": "Komfort i aktywność",
    "subtitle": "Sen, ruch, dno miednicy i fizjoterapia na co dzień",
    "weeks": "Tydzień 14 – 36",
    "color": "#7A6786",
    "accentBg": "#EFE5D8",
    "tint": "#EFE5D8",
    "deep": "#6E5C7D",
    "description": "Sen na lewym boku, bezpieczny ruch, podróże, ćwiczenia mięśni dna miednicy i odciążenie kręgosłupa pokazane krok po kroku."
  },
  {
    "id": "stage-04",
    "num": "04",
    "slug": "torba-spakowana",
    "title": "Projekt „Gniazdo”",
    "subtitle": "Wyprawka, wózek, fotelik i pokój dziecka",
    "weeks": "Tydzień 28 – 37",
    "color": "#AA4F16",
    "accentBg": "#FBE9DB",
    "tint": "#FBE9DB",
    "deep": "#9A4612",
    "description": "Wózek, bezpieczny fotelik samochodowy, łóżeczko, domowa apteczka i ubranka. Co kupić na start, a z czym spokojnie poczekać."
  },
  {
    "id": "stage-05",
    "num": "05",
    "slug": "zaczelo-sie",
    "title": "Godzina „Zero”",
    "subtitle": "Świadomy i aktywny poród, ZZO oraz cesarskie cięcie",
    "weeks": "Tydzień 37 – 42",
    "color": "#DA0271",
    "accentBg": "#FBE0EA",
    "tint": "#FBE0EA",
    "deep": "#C00265",
    "description": "Plan porodu, torba do szpitala, okresy porodu, ruch i oddech, rola osoby towarzyszącej, znieczulenie ZZO i cięcie cesarskie."
  },
  {
    "id": "stage-06",
    "num": "06",
    "slug": "pierwsza-noc",
    "title": "Połóg i regeneracja",
    "subtitle": "Połóg, regeneracja i fizjoterapia mamy",
    "weeks": "1 – 6 tydzień po porodzie",
    "color": "#B22E5D",
    "accentBg": "#FBEFF3",
    "tint": "#FBEFF3",
    "deep": "#B22E5D",
    "description": "Pierwsze tygodnie po porodzie: fizjologia połogu, czuła regeneracja tkanek, emocje i Baby Blues, powrót do ruchu oraz historie mam."
  },
  {
    "id": "stage-07",
    "num": "07",
    "slug": "nie-spi",
    "title": "Opieka nad noworodkiem",
    "subtitle": "Kąpiel, pielęgnacja, bezpieczny sen i pierwsza pomoc",
    "weeks": "1 – 12 miesiąc życia",
    "color": "#3F758F",
    "accentBg": "#E4F0F5",
    "tint": "#E4F0F5",
    "deep": "#386A82",
    "description": "Pierwsze dni dziecka, skala Apgar, kąpiel i pielęgnacja pępka, bezpieczny sen, stany przejściowe, szczepienia i pierwsza pomoc."
  },
  {
    "id": "stage-08",
    "num": "08",
    "slug": "karmienie",
    "title": "Karmienie i laktacja",
    "subtitle": "Karmienie piersią, laktacja bez bólu i kolki",
    "weeks": "Od 1. doby życia",
    "color": "#0078AD",
    "accentBg": "#E0F3FB",
    "tint": "#E0F3FB",
    "deep": "#006A99",
    "description": "Pozycje do karmienia, technika przystawienia bez bólu, nawał pokarmowy, dobór laktatora i sposoby na kolki niemowlęce."
  }
];

export const lessons: Lesson[] = [
  {
    "id": "lekcja-01",
    "lessonNumber": 1,
    "filmNumber": 1,
    "title": "I Trymestr – Początek nowego życia i pierwsze tygodnie",
    "description": "Jak liczyć wiek ciąży, co dzieje się w Twoim ciele w pierwszych 14 tygodniach i jak radzić sobie z porannymi mdłościami dzięki małym, czułym nawykom.",
    "stageId": "stage-01",
    "stageTitle": "Dwie kreski",
    "stageColor": "#C33C6A",
    "cloudflareUid": "f8d8d8f24b917a32961efea785c9324b",
    "durationSeconds": 333,
    "durationFormatted": "5:33",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/f8d8d8f24b917a32961efea785c9324b/thumbnails/thumbnail.jpg",
    "isFreePreview": true,
    "attachments": [
      {
        "id": "att-1-1",
        "name": "Karta Pracy · Lekcja 1",
        "type": "pdf",
        "size": "1.4 MB"
      }
    ]
  },
  {
    "id": "lekcja-02",
    "lessonNumber": 2,
    "filmNumber": 2,
    "title": "II Trymestr – Czas energii, zmysłów i pierwszych ruchów",
    "description": "Rozwój zmysłów maluszka między 15. a 28. tygodniem, pierwsze delikatne muśnięcia oraz łagodne sposoby na trawienie i zbilansowaną dietę.",
    "stageId": "stage-01",
    "stageTitle": "Dwie kreski",
    "stageColor": "#C33C6A",
    "cloudflareUid": "4bc39467fbba88462fa0912a81503fb3",
    "durationSeconds": 156,
    "durationFormatted": "2:36",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/4bc39467fbba88462fa0912a81503fb3/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-03",
    "lessonNumber": 3,
    "filmNumber": 3,
    "title": "III Trymestr – Spokojne odliczanie do narodzin",
    "description": "Przygotowanie do wielkiego finału (tygodnie 31–40), dojrzewanie maluszka i ten wyjątkowy moment, w którym warto zamknąć walizkę do porodu.",
    "stageId": "stage-01",
    "stageTitle": "Dwie kreski",
    "stageColor": "#C33C6A",
    "cloudflareUid": "a30f272e429d9e547c7bc2a897a06d7a",
    "durationSeconds": 94,
    "durationFormatted": "1:34",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/a30f272e429d9e547c7bc2a897a06d7a/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-04",
    "lessonNumber": 4,
    "filmNumber": 4,
    "title": "Wielka nowina – jak dzielić się radością z bliskimi",
    "description": "Kiedy i jak przekazać wieść rodzinie, jak celebrować ten czas we dwoje i stawiać zdrowe granice z uśmiechem.",
    "stageId": "stage-01",
    "stageTitle": "Dwie kreski",
    "stageColor": "#C33C6A",
    "cloudflareUid": "6aec02ba767bce6ea354929bcac89125",
    "durationSeconds": 258,
    "durationFormatted": "4:18",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/6aec02ba767bce6ea354929bcac89125/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-05",
    "lessonNumber": 5,
    "filmNumber": 5,
    "title": "Cyfrowe wsparcie – sprawdzone aplikacje i obalanie ciążowych mitów",
    "description": "Które aplikacje ciążowe naprawdę pomagają, a które sieją niepotrzebny chaos. Spokojne fakty zamiast forów internetowych.",
    "stageId": "stage-01",
    "stageTitle": "Dwie kreski",
    "stageColor": "#C33C6A",
    "cloudflareUid": "43034b5685370ace27315ee26e3b6411",
    "durationSeconds": 256,
    "durationFormatted": "4:16",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/43034b5685370ace27315ee26e3b6411/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-06",
    "lessonNumber": 6,
    "filmNumber": 6,
    "title": "Szkoła rodzenia online – Twój bezpieczny i wygodny start",
    "description": "Jak uczyć się we własnym tempie, o dowolnej porze na kanapie, angażując partnera bez presji i dojazdów.",
    "stageId": "stage-02",
    "stageTitle": "Zdrowie i badania",
    "stageColor": "#8E6A14",
    "cloudflareUid": "ab0d90bf8a42fcf4d7e4debf10509f73",
    "durationSeconds": 259,
    "durationFormatted": "4:19",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/ab0d90bf8a42fcf4d7e4debf10509f73/thumbnails/thumbnail.jpg",
    "isFreePreview": true,
    "attachments": []
  },
  {
    "id": "lekcja-07",
    "lessonNumber": 7,
    "filmNumber": 7,
    "title": "Zmiany w ciele przyszłej mamy – co jest w pełni naturalne?",
    "description": "Powiększający się brzuszek, hormony, zmiana środka ciężkości i sygnały wysyłane przez ciało – dlaczego warto zaufać naturze.",
    "stageId": "stage-02",
    "stageTitle": "Zdrowie i badania",
    "stageColor": "#8E6A14",
    "cloudflareUid": "36090fe82c03944df21223b001113f98",
    "durationSeconds": 195,
    "durationFormatted": "3:15",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/36090fe82c03944df21223b001113f98/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-08",
    "lessonNumber": 8,
    "filmNumber": 8,
    "title": "Zmysły na wysokich obrotach – zapachy, smaki i emocje",
    "description": "Dlaczego ulubiona kawa nagle pachnie inaczej i jak oswajać wahania nastroju z wyrozumiałością dla samej siebie.",
    "stageId": "stage-02",
    "stageTitle": "Zdrowie i badania",
    "stageColor": "#8E6A14",
    "cloudflareUid": "0454963ecde1bee58fa12aa2b2f513ce",
    "durationSeconds": 134,
    "durationFormatted": "2:14",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/0454963ecde1bee58fa12aa2b2f513ce/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-09",
    "lessonNumber": 9,
    "filmNumber": 9,
    "title": "Dolegliwości ciążowe – sprawdzone, łagodne sposoby na ulgę",
    "description": "Zgaga, obrzęki nóg, skurcze łydek – domowe, niefarmakologiczne metody, które przynoszą natychmiastowe wytchnienie.",
    "stageId": "stage-02",
    "stageTitle": "Zdrowie i badania",
    "stageColor": "#8E6A14",
    "cloudflareUid": "80a3893c925771b809f87c39a6ddf8b6",
    "durationSeconds": 537,
    "durationFormatted": "8:57",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/80a3893c925771b809f87c39a6ddf8b6/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-10",
    "lessonNumber": 10,
    "filmNumber": 10,
    "title": "Czuła troska o ciało – komfort, skóra i kobiecość w ciąży",
    "description": "Bezpieczna pielęgnacja, nawilżanie brzuszka, dobór bielizny i profilaktyka, która daje poczucie lekkości każdego dnia.",
    "stageId": "stage-02",
    "stageTitle": "Zdrowie i badania",
    "stageColor": "#8E6A14",
    "cloudflareUid": "dc7311a22c7545a1aa5b4310e26a4dd3",
    "durationSeconds": 86,
    "durationFormatted": "1:26",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/dc7311a22c7545a1aa5b4310e26a4dd3/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-11",
    "lessonNumber": 11,
    "filmNumber": 11,
    "title": "Spokojna ciąża – kalendarz zalecanych badań i spotkań",
    "description": "Kompletna, czytelna checklista badań i wizyt – wiesz dokładnie, kiedy zaplanować USG i badania krwi bez żadnego stresu.",
    "stageId": "stage-02",
    "stageTitle": "Zdrowie i badania",
    "stageColor": "#8E6A14",
    "cloudflareUid": "9d3f5e1b9ee6826fe9d0a19d085d8b64",
    "durationSeconds": 469,
    "durationFormatted": "7:49",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/9d3f5e1b9ee6826fe9d0a19d085d8b64/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": [
      {
        "id": "att-11-1",
        "name": "Karta Pracy · Lekcja 11",
        "type": "pdf",
        "size": "1.4 MB"
      }
    ]
  },
  {
    "id": "lekcja-12",
    "lessonNumber": 12,
    "filmNumber": 51,
    "title": "Kiedy ruszać do szpitala? – sygnały, które warto znać dla spokoju",
    "description": "Praktyczny przewodnik z położną: jak odróżnić skurcze przepowiadające od porodowych i kiedy spokojnie wziąć torbę.",
    "stageId": "stage-02",
    "stageTitle": "Zdrowie i badania",
    "stageColor": "#8E6A14",
    "cloudflareUid": "eea7e6f75b1bab451f2f120e98d2c3ff",
    "durationSeconds": 376,
    "durationFormatted": "6:16",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/eea7e6f75b1bab451f2f120e98d2c3ff/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-13",
    "lessonNumber": 13,
    "filmNumber": 12,
    "title": "Ruchy maluszka – czego spodziewać się od 20. tygodnia?",
    "description": "Od pierwszych motylków w brzuchu po regularne harce – jak poznawać dobowy rytm aktywności i odpoczynku Twojego dziecka.",
    "stageId": "stage-03",
    "stageTitle": "Komfort i aktywność",
    "stageColor": "#7A6786",
    "cloudflareUid": "7252fa19691fc33a9ff1c435a8eed5fe",
    "durationSeconds": 376,
    "durationFormatted": "6:16",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/7252fa19691fc33a9ff1c435a8eed5fe/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-14",
    "lessonNumber": 14,
    "filmNumber": 13,
    "title": "Regenerujący sen w ciąży – wygoda, mikroklimat i relaks",
    "description": "Jak przygotować sypialnię, dobrać poduszkę ciążową i wyciszyć gonitwę myśli przed snem, by budzić się wypoczętą.",
    "stageId": "stage-03",
    "stageTitle": "Komfort i aktywność",
    "stageColor": "#7A6786",
    "cloudflareUid": "8e0f033cf50fd850258eed4f85b51743",
    "durationSeconds": 329,
    "durationFormatted": "5:29",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/8e0f033cf50fd850258eed4f85b51743/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-15",
    "lessonNumber": 15,
    "filmNumber": 14,
    "title": "Pozycje do snu – jak spać wygodnie i bezpiecznie dla malucha",
    "description": "Dlaczego lewy bok jest tak polecany, jak podpierać biodra i co zrobić, gdy sen przerywają częste wizyty w toalecie.",
    "stageId": "stage-03",
    "stageTitle": "Komfort i aktywność",
    "stageColor": "#7A6786",
    "cloudflareUid": "9d80f3d86cccb3ec5faeaa1ba946fea0",
    "durationSeconds": 206,
    "durationFormatted": "3:26",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/9d80f3d86cccb3ec5faeaa1ba946fea0/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-16",
    "lessonNumber": 16,
    "filmNumber": 15,
    "title": "Ulga dla kręgosłupa – bezpieczne ćwiczenia i rozluźnianie pleców",
    "description": "Proste, fizjoterapeutyczne ruchy na macie i piłce, które odciążają odcinek lędźwiowy i przynoszą ulgę spiętym mięśniom.",
    "stageId": "stage-03",
    "stageTitle": "Komfort i aktywność",
    "stageColor": "#7A6786",
    "cloudflareUid": "4a219b5d8985a19b178518db924b9faa",
    "durationSeconds": 729,
    "durationFormatted": "12:09",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/4a219b5d8985a19b178518db924b9faa/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-17",
    "lessonNumber": 17,
    "filmNumber": 16,
    "title": "Czas dla siebie – relaks, spacery i bezpieczne podróże",
    "description": "Aktywność fizyczna dopasowana do trymestru, pasy w samochodzie, wakacje z brzuszkiem i ładowanie baterii przed porodem.",
    "stageId": "stage-03",
    "stageTitle": "Komfort i aktywność",
    "stageColor": "#7A6786",
    "cloudflareUid": "dae310a2b02ccf845d13197d5950cc59",
    "durationSeconds": 236,
    "durationFormatted": "3:56",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/dae310a2b02ccf845d13197d5950cc59/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-18",
    "lessonNumber": 18,
    "filmNumber": 17,
    "title": "Domowa przestrzeń – jak dbać o swoje siły i kręgosłup",
    "description": "Zasady ergonomii na co dzień: jak schylać się, nosić zakupy i delegować zadania partnerowi, by chronić dno miednicy.",
    "stageId": "stage-03",
    "stageTitle": "Komfort i aktywność",
    "stageColor": "#7A6786",
    "cloudflareUid": "e239f37b88abf2b75e3de1d871418312",
    "durationSeconds": 403,
    "durationFormatted": "6:43",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/e239f37b88abf2b75e3de1d871418312/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": [
      {
        "id": "att-18-1",
        "name": "Karta Pracy · Lekcja 18",
        "type": "pdf",
        "size": "1.4 MB"
      }
    ]
  },
  {
    "id": "lekcja-19",
    "lessonNumber": 19,
    "filmNumber": 18,
    "title": "Bezpieczna podróż – wybór i montaż pierwszego fotelika",
    "description": "Kąt nachylenia, baza ISOFIX, prawidłowe zapinanie pasów i bezpieczny powrót ze szpitala do domu w pełnym komforcie.",
    "stageId": "stage-04",
    "stageTitle": "Projekt „Gniazdo”",
    "stageColor": "#AA4F16",
    "cloudflareUid": "569c3d62bd604913aee762e621fb04de",
    "durationSeconds": 430,
    "durationFormatted": "7:10",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/569c3d62bd604913aee762e621fb04de/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-20",
    "lessonNumber": 20,
    "filmNumber": 19,
    "title": "Wózek idealny – praktyczny przewodnik dla przyszłych rodziców",
    "description": "Gondola, amortyzacja, waga stelaża i koła – na co zwrócić uwagę, dopasowując wózek do Waszego stylu życia i spacerów.",
    "stageId": "stage-04",
    "stageTitle": "Projekt „Gniazdo”",
    "stageColor": "#AA4F16",
    "cloudflareUid": "1e6a516e495831efed753fa92a8fd603",
    "durationSeconds": 524,
    "durationFormatted": "8:44",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/1e6a516e495831efed753fa92a8fd603/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-21",
    "lessonNumber": 21,
    "filmNumber": 20,
    "title": "Przytulny kącik maluszka – funkcjonalność, spokój i wygoda",
    "description": "Przewijak na odpowiedniej wysokości, oświetlenie ułatwiające nocne karmienie i organizacja przestrzeni przyjaznej rodzicom.",
    "stageId": "stage-04",
    "stageTitle": "Projekt „Gniazdo”",
    "stageColor": "#AA4F16",
    "cloudflareUid": "bf8f08aba8a65f7ea8ff4254d956e504",
    "durationSeconds": 444,
    "durationFormatted": "7:24",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/bf8f08aba8a65f7ea8ff4254d956e504/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-22",
    "lessonNumber": 22,
    "filmNumber": 21,
    "title": "Bezpieczne łóżeczko – materac i zasady spokojnego snu maluszka",
    "description": "Wybór twardego materaca, optymalna temperatura w pokoju i zasady snu, które dają rodzicom pełen spokój w nocy.",
    "stageId": "stage-04",
    "stageTitle": "Projekt „Gniazdo”",
    "stageColor": "#AA4F16",
    "cloudflareUid": "1a9c2975327e603d8081b6341943558f",
    "durationSeconds": 268,
    "durationFormatted": "4:28",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/1a9c2975327e603d8081b6341943558f/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-23",
    "lessonNumber": 23,
    "filmNumber": 22,
    "title": "Wyprawkowa kosmetyczka i apteczka – co naprawdę warto mieć",
    "description": "Minimalizm z rozsądkiem: sól fizjologiczna, gaziki, krem ochronny i termometr – bez wydawania fortuny na zbędne gadżety.",
    "stageId": "stage-04",
    "stageTitle": "Projekt „Gniazdo”",
    "stageColor": "#AA4F16",
    "cloudflareUid": "475bb1e09e30cee402d4424e399f8ffb",
    "durationSeconds": 360,
    "durationFormatted": "6:00",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/475bb1e09e30cee402d4424e399f8ffb/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-24",
    "lessonNumber": 24,
    "filmNumber": 23,
    "title": "Kompletna wyprawka domowa – ubranka, otulacze i tekstylia",
    "description": "Rozmiary 56 czy 62? Naturalne materiały, pajacyki z suwakiem, rożki i pieluszki bambusowe – lista niezbędników na start.",
    "stageId": "stage-04",
    "stageTitle": "Projekt „Gniazdo”",
    "stageColor": "#AA4F16",
    "cloudflareUid": "05e122e50774f6f96d7416fd663a483c",
    "durationSeconds": 481,
    "durationFormatted": "8:01",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/05e122e50774f6f96d7416fd663a483c/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-25",
    "lessonNumber": 25,
    "filmNumber": 40,
    "title": "Kącik kąpielowy – wanienka, komfort i przygotowanie do rytuału",
    "description": "Stojak na wanienkę, termometr do wody, miękki ręcznik z kapturkiem i tworzenie wieczornego rytuału bliskości.",
    "stageId": "stage-04",
    "stageTitle": "Projekt „Gniazdo”",
    "stageColor": "#AA4F16",
    "cloudflareUid": "1c235b5735ca98f4d73cec632fe2b4af",
    "durationSeconds": 119,
    "durationFormatted": "1:59",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/1c235b5735ca98f4d73cec632fe2b4af/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": [
      {
        "id": "att-25-1",
        "name": "Karta Pracy · Lekcja 25",
        "type": "pdf",
        "size": "1.4 MB"
      }
    ]
  },
  {
    "id": "lekcja-26",
    "lessonNumber": 26,
    "filmNumber": 25,
    "title": "Twój Plan Porodu – jak stworzyć dokument wspierający Twoje wybory",
    "description": "Wspólnie przejdziemy przez 16 kluczowych punktów: od ochrony krocza, przez pozycje wertykalne, po dwugodzinny kontakt skóra do skóry.",
    "stageId": "stage-05",
    "stageTitle": "Godzina „Zero”",
    "stageColor": "#DA0271",
    "cloudflareUid": "ea898b3a4f5e4b7e23d212d595b13f47",
    "durationSeconds": 639,
    "durationFormatted": "10:39",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/ea898b3a4f5e4b7e23d212d595b13f47/thumbnails/thumbnail.jpg",
    "isFreePreview": true,
    "attachments": [
      {
        "id": "att-26-1",
        "name": "Karta Pracy · Lekcja 26",
        "type": "pdf",
        "size": "1.4 MB"
      }
    ]
  },
  {
    "id": "lekcja-27",
    "lessonNumber": 27,
    "filmNumber": 26,
    "title": "Torba do szpitala – pakowanie w 3 strefach bez zbędnego stresu",
    "description": "Podział bagażu: strefa porodu (woda, pomadka, przekąski), strefa mamy na oddziale i strefa maluszka. Przejrzysta lista.",
    "stageId": "stage-05",
    "stageTitle": "Godzina „Zero”",
    "stageColor": "#DA0271",
    "cloudflareUid": "1f6c80e6f0051eb884e19a7bb6b81803",
    "durationSeconds": 168,
    "durationFormatted": "2:48",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/1f6c80e6f0051eb884e19a7bb6b81803/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-28",
    "lessonNumber": 28,
    "filmNumber": 27,
    "title": "Drogi narodzin – poród naturalny i cesarskie cięcie bez tajemnic",
    "description": "Jak przebiega fizjologiczny poród siłami natury, a jak wygląda planowane i nieplanowane cesarskie cięcie. Wiedza, która usuwa lęk.",
    "stageId": "stage-05",
    "stageTitle": "Godzina „Zero”",
    "stageColor": "#DA0271",
    "cloudflareUid": "1b5195ea3b2bb8f207e8b1dddec8ce71",
    "durationSeconds": 414,
    "durationFormatted": "6:54",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/1b5195ea3b2bb8f207e8b1dddec8ce71/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-29",
    "lessonNumber": 29,
    "filmNumber": 28,
    "title": "Gdy odejdą wody – spokojna instrukcja krok po kroku w dniu porodu",
    "description": "Jak rozpoznać wody płodowe, na jaki kolor zwrócić uwagę, kiedy wziąć ciepły prysznic i bez pośpiechu ruszyć do szpitala.",
    "stageId": "stage-05",
    "stageTitle": "Godzina „Zero”",
    "stageColor": "#DA0271",
    "cloudflareUid": "4d8681e85878c30e0ea33e7811a2e405",
    "durationSeconds": 140,
    "durationFormatted": "2:20",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/4d8681e85878c30e0ea33e7811a2e405/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-30",
    "lessonNumber": 30,
    "filmNumber": 29,
    "title": "Aktywny poród – ruch, oddech i naturalne łagodzenie skurczów",
    "description": "Jak współpracować ze swoim ciałem: pozycje wertykalne, ruchy bioder na piłce, prysznic oraz kojący masaż pleców.",
    "stageId": "stage-05",
    "stageTitle": "Godzina „Zero”",
    "stageColor": "#DA0271",
    "cloudflareUid": "008e24bd7f5fc89e74ffeacb60f6ebe2",
    "durationSeconds": 442,
    "durationFormatted": "7:22",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/008e24bd7f5fc89e74ffeacb60f6ebe2/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-31",
    "lessonNumber": 31,
    "filmNumber": 30,
    "title": "Wsparcie partnera na porodówce – pozycje wertykalne i masaż",
    "description": "Konkretne techniki dla taty: podtrzymywanie w przysiadzie, masaż kości krzyżowej dłońmi i tworzenie intymnej, bezpiecznej przestrzeni.",
    "stageId": "stage-05",
    "stageTitle": "Godzina „Zero”",
    "stageColor": "#DA0271",
    "cloudflareUid": "6be2c4a21f49b7c6ccc59a0f1946acaa",
    "durationSeconds": 297,
    "durationFormatted": "4:57",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/6be2c4a21f49b7c6ccc59a0f1946acaa/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-32",
    "lessonNumber": 32,
    "filmNumber": 31,
    "title": "Magia chusty Rebozo – techniki odciążania brzucha i pleców z partnerem",
    "description": "Tradycyjna meksykańska chusta w praktyce: kołysanie miednicy, rozluźnianie mięśni i natychmiastowa ulga w lędźwiach podczas skurczu.",
    "stageId": "stage-05",
    "stageTitle": "Godzina „Zero”",
    "stageColor": "#DA0271",
    "cloudflareUid": "de4eedf477e58dc60ebd9f1061e13994",
    "durationSeconds": 127,
    "durationFormatted": "2:07",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/de4eedf477e58dc60ebd9f1061e13994/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-33",
    "lessonNumber": 33,
    "filmNumber": 32,
    "title": "Medyczne wsparcie w skurczach – znieczulenie ZZO, gaz i łagodzenie bólu",
    "description": "Wszystko o dostępnych metodach szpitalnych: znieczulenie zewnątrzoponowe, gaz rozweselający i zasady bezpiecznego podania.",
    "stageId": "stage-05",
    "stageTitle": "Godzina „Zero”",
    "stageColor": "#DA0271",
    "cloudflareUid": "1d6ccdc8860f1a9a4459d1d07391550d",
    "durationSeconds": 540,
    "durationFormatted": "9:00",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/1d6ccdc8860f1a9a4459d1d07391550d/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-34",
    "lessonNumber": 34,
    "filmNumber": 33,
    "title": "Fazy narodzin – przewodnik po etapach porodu i kryzysie 7 cm",
    "description": "Od rozwierania szyjki macicy, przez moment przełomowy, aż po wyczekiwaną chwilę powitania dziecka i pierwsze przytulenie.",
    "stageId": "stage-05",
    "stageTitle": "Godzina „Zero”",
    "stageColor": "#DA0271",
    "cloudflareUid": "0867a820fde9b11b8d5499700bee8e71",
    "durationSeconds": 476,
    "durationFormatted": "7:56",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/0867a820fde9b11b8d5499700bee8e71/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-35",
    "lessonNumber": 35,
    "filmNumber": 37,
    "title": "Czuła regeneracja po porodzie – gojenie tkanek po cc i ochrona krocza",
    "description": "Praktyczne zasady komfortu w połogu: higiena, wietrzenie, delikatna pielęgnacja i bezpieczna mobilizacja blizny.",
    "stageId": "stage-06",
    "stageTitle": "Połóg i regeneracja",
    "stageColor": "#B22E5D",
    "cloudflareUid": "640176e052d62d597475cad4205794d1",
    "durationSeconds": 129,
    "durationFormatted": "2:09",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/640176e052d62d597475cad4205794d1/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-36",
    "lessonNumber": 36,
    "filmNumber": 38,
    "title": "Pierwsze tygodnie połogu – fizjologia, emocje i oswajanie Baby Blues",
    "description": "Czego spodziewać się po powrocie do domu: oczyszczanie macicy, burza hormonalna, czułość dla siebie i wsparcie bliskich.",
    "stageId": "stage-06",
    "stageTitle": "Połóg i regeneracja",
    "stageColor": "#B22E5D",
    "cloudflareUid": "080ceb2cab9bca47481293fc3f64b176",
    "durationSeconds": 196,
    "durationFormatted": "3:16",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/080ceb2cab9bca47481293fc3f64b176/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-37",
    "lessonNumber": 37,
    "filmNumber": 46,
    "title": "Bezpieczny powrót do sprawności – ćwiczenia dna miednicy i brzucha",
    "description": "Fizjoterapia uroginekologiczna po 6. tygodniu: aktywacja mięśnia poprzecznego, prawidłowy oddech i regeneracja kresy białej.",
    "stageId": "stage-06",
    "stageTitle": "Połóg i regeneracja",
    "stageColor": "#B22E5D",
    "cloudflareUid": "464903222d97db10e975dd97a49c5a7d",
    "durationSeconds": 336,
    "durationFormatted": "5:36",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/464903222d97db10e975dd97a49c5a7d/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-38",
    "lessonNumber": 38,
    "filmNumber": 52,
    "title": "Szczere historie mam – narodziny przez cesarskie cięcie i powrót do formy",
    "description": "Inspirująca opowieść Ani: szybka pionizacja, pierwsze karmienie maluszka i kluczowa rola partnera w pierwszych dobach.",
    "stageId": "stage-06",
    "stageTitle": "Połóg i regeneracja",
    "stageColor": "#B22E5D",
    "cloudflareUid": "bead8f3f16b41c0aa611df30526ce6db",
    "durationSeconds": 650,
    "durationFormatted": "10:50",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/bead8f3f16b41c0aa611df30526ce6db/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-39",
    "lessonNumber": 39,
    "filmNumber": 53,
    "title": "Szczere historie mam – wspierana akcja porodowa i regeneracja w domu",
    "description": "Prawdziwa rozmowa o elastyczności planu porodu, radzeniu sobie z nieprzewidzianym scenariuszem i radości z pierwszych chwil razem.",
    "stageId": "stage-06",
    "stageTitle": "Połóg i regeneracja",
    "stageColor": "#B22E5D",
    "cloudflareUid": "d2006cbad7d2c6ed190577b49e645285",
    "durationSeconds": 590,
    "durationFormatted": "9:50",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/d2006cbad7d2c6ed190577b49e645285/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": [
      {
        "id": "att-39-1",
        "name": "Karta Pracy · Lekcja 39",
        "type": "pdf",
        "size": "1.4 MB"
      }
    ]
  },
  {
    "id": "lekcja-40",
    "lessonNumber": 40,
    "filmNumber": 34,
    "title": "Pierwsze chwile maluszka – wygląd noworodka, skala Apgar i dotyk",
    "description": "Dlaczego maluszek ma rączki w piąstkach, co oznacza maź płodowa i jak ocenia się pierwsze minuty życia w kontakcie skóra do skóry.",
    "stageId": "stage-07",
    "stageTitle": "Opieka nad noworodkiem",
    "stageColor": "#3F758F",
    "cloudflareUid": "21baa2cafef2f7731b4a36c6464ee6e8",
    "durationSeconds": 148,
    "durationFormatted": "2:28",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/21baa2cafef2f7731b4a36c6464ee6e8/thumbnails/thumbnail.jpg",
    "isFreePreview": true,
    "attachments": []
  },
  {
    "id": "lekcja-41",
    "lessonNumber": 41,
    "filmNumber": 35,
    "title": "Odruchy i zachowania noworodka – co jest w pełni naturalne?",
    "description": "Czkawka, kichanie, drżenie bródki i odruch Moro – poznaj język ciała niemowlęcia, by z pełnym spokojem patrzeć na jego rozwój.",
    "stageId": "stage-07",
    "stageTitle": "Opieka nad noworodkiem",
    "stageColor": "#3F758F",
    "cloudflareUid": "5ea98f36b8adf89a1e3c9a670e317026",
    "durationSeconds": 191,
    "durationFormatted": "3:11",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/5ea98f36b8adf89a1e3c9a670e317026/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": [
      {
        "id": "att-41-1",
        "name": "Karta Pracy · Lekcja 41",
        "type": "pdf",
        "size": "1.4 MB"
      }
    ]
  },
  {
    "id": "lekcja-42",
    "lessonNumber": 42,
    "filmNumber": 36,
    "title": "Bezpieczny sen maluszka – złote zasady spokojnej nocy",
    "description": "Prawidłowa pozycja na plecach, lekki śpiworek zamiast kocyka, czyste łóżeczko i warunki sprzyjające głębokiemu, bezpiecznemu snowi.",
    "stageId": "stage-07",
    "stageTitle": "Opieka nad noworodkiem",
    "stageColor": "#3F758F",
    "cloudflareUid": "fe6729ee7d0ba57ec0717bc04dc5f32b",
    "durationSeconds": 58,
    "durationFormatted": "0:58",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/fe6729ee7d0ba57ec0717bc04dc5f32b/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-43",
    "lessonNumber": 43,
    "filmNumber": 39,
    "title": "Pierwsza pomoc i bezpieczeństwo – praktyczny instruktaż dla rodziców",
    "description": "Krok po kroku: co zrobić w przypadku zakrztuszenia pokarmem, gorączki oraz jak zachować zimną krew i pewność działania.",
    "stageId": "stage-07",
    "stageTitle": "Opieka nad noworodkiem",
    "stageColor": "#3F758F",
    "cloudflareUid": "a4d347d5cd2b18cad5c1dcbade6d5598",
    "durationSeconds": 154,
    "durationFormatted": "2:34",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/a4d347d5cd2b18cad5c1dcbade6d5598/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-44",
    "lessonNumber": 44,
    "filmNumber": 41,
    "title": "Pierwsza kąpiel krok po kroku – bezpieczny chwyt i wieczorny rytuał",
    "description": "Temperatura wody 37°C, pewne trzymanie maluszka na przedramieniu, mycie fałdek i sucha pielęgnacja pępka bez stresu.",
    "stageId": "stage-07",
    "stageTitle": "Opieka nad noworodkiem",
    "stageColor": "#3F758F",
    "cloudflareUid": "da9e1a2801f8e9469fccbdd2b9d8a67d",
    "durationSeconds": 793,
    "durationFormatted": "13:13",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/da9e1a2801f8e9469fccbdd2b9d8a67d/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-45",
    "lessonNumber": 45,
    "filmNumber": 47,
    "title": "Spokojne wizyty u pediatry – kalendarz profilaktyki i opieki",
    "description": "Przewodnik po pierwszych wizytach patronażowych, bilansach maluszka i przygotowaniu do szczepień bez pośpiechu.",
    "stageId": "stage-07",
    "stageTitle": "Opieka nad noworodkiem",
    "stageColor": "#3F758F",
    "cloudflareUid": "6abd5545230ca985f3461ce88cac3c7e",
    "durationSeconds": 372,
    "durationFormatted": "6:12",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/6abd5545230ca985f3461ce88cac3c7e/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-46",
    "lessonNumber": 46,
    "filmNumber": 48,
    "title": "Pierwsze dni w domu – naturalne adaptacje noworodka bez paniki",
    "description": "Fizjologiczny spadek wagi, adaptacja skóry, żółtaczka fizjologiczna – co jest całkowitą normą w pierwszych dwóch tygodniach.",
    "stageId": "stage-07",
    "stageTitle": "Opieka nad noworodkiem",
    "stageColor": "#3F758F",
    "cloudflareUid": "2e6438b0eb0336b69f8dbc2b8bfdf3cc",
    "durationSeconds": 277,
    "durationFormatted": "4:37",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/2e6438b0eb0336b69f8dbc2b8bfdf3cc/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-47",
    "lessonNumber": 47,
    "filmNumber": 49,
    "title": "Codzienna pielęgnacja – ulewanie, ciemieniucha i troska o skórę",
    "description": "Pionizacja po karmieniu, pielęgnacja skóry głowy i naturalne sposoby na małe wyzwania pierwszych miesięcy.",
    "stageId": "stage-07",
    "stageTitle": "Opieka nad noworodkiem",
    "stageColor": "#3F758F",
    "cloudflareUid": "1e112867f1ffa8f506114ae738b3d931",
    "durationSeconds": 244,
    "durationFormatted": "4:04",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/1e112867f1ffa8f506114ae738b3d931/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-48",
    "lessonNumber": 48,
    "filmNumber": 50,
    "title": "Pytania do położnej – odpowiedzi na najczęstsze wątpliwości o maluszku",
    "description": "Trądzik niemowlęcy, kupki, spacery o każdej porze roku i obcinanie miękkich paznokietków – rozwiewamy codzienne dylematy.",
    "stageId": "stage-07",
    "stageTitle": "Opieka nad noworodkiem",
    "stageColor": "#3F758F",
    "cloudflareUid": "9ab1c67287a8c756d5288e515d8dcca3",
    "durationSeconds": 411,
    "durationFormatted": "6:51",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/9ab1c67287a8c756d5288e515d8dcca3/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-49",
    "lessonNumber": 49,
    "filmNumber": 42,
    "title": "Czułe karmienie piersią – technika, pozycje i prawidłowy chwyt",
    "description": "Jak przystawiać dziecko w pozycji klasycznej, krzyżowej i spod pachy (po cesarce), by karmienie było w pełni komfortowe i przyjemne.",
    "stageId": "stage-08",
    "stageTitle": "Karmienie i laktacja",
    "stageColor": "#0078AD",
    "cloudflareUid": "b7b2bd16c73c8386d92746e1e85337ba",
    "durationSeconds": 349,
    "durationFormatted": "5:49",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/b7b2bd16c73c8386d92746e1e85337ba/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": [
      {
        "id": "att-49-1",
        "name": "Karta Pracy · Lekcja 49",
        "type": "pdf",
        "size": "1.4 MB"
      }
    ]
  },
  {
    "id": "lekcja-50",
    "lessonNumber": 50,
    "filmNumber": 43,
    "title": "Laktacja bez stresu – nawał pokarmowy, lekkość piersi i troska o brodawki",
    "description": "Co zrobić w 3.–4. dobie: ciepłe i chłodne okłady, delikatny masaż, pielęgnacja brodawek i wsparcie partnera w karmieniu.",
    "stageId": "stage-08",
    "stageTitle": "Karmienie i laktacja",
    "stageColor": "#0078AD",
    "cloudflareUid": "2cbde448f7f7100d2f869d82c0f4b0f9",
    "durationSeconds": 218,
    "durationFormatted": "3:38",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/2cbde448f7f7100d2f869d82c0f4b0f9/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-51",
    "lessonNumber": 51,
    "filmNumber": 44,
    "title": "Akcesoria do karmienia – laktatory, butelki i spokojne karmienie",
    "description": "Dobór laktatora, butelki wspierające naturalny odruch ssania, przechowywanie mleka i karmienie butelką z czułością i bliskością.",
    "stageId": "stage-08",
    "stageTitle": "Karmienie i laktacja",
    "stageColor": "#0078AD",
    "cloudflareUid": "9d7b561b50b1e4ade2e31a1323b2b4af",
    "durationSeconds": 286,
    "durationFormatted": "4:46",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/9d7b561b50b1e4ade2e31a1323b2b4af/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  },
  {
    "id": "lekcja-52",
    "lessonNumber": 52,
    "filmNumber": 45,
    "title": "Brzuszkowe dolegliwości niemowląt – kolki, czuły masaż i sposoby na ulgę",
    "description": "Jak odróżnić wieczorny płacz ze zmęczenia od bólu brzuszka: masaż Shantala, termofor z pestek wiśni, noszenie i kojący biały szum.",
    "stageId": "stage-08",
    "stageTitle": "Karmienie i laktacja",
    "stageColor": "#0078AD",
    "cloudflareUid": "55e54d728445b43328229705b0ca141a",
    "durationSeconds": 587,
    "durationFormatted": "9:47",
    "thumbnailUrl": "https://customer-6d9sm694eja9tkvc.cloudflarestream.com/55e54d728445b43328229705b0ca141a/thumbnails/thumbnail.jpg",
    "isFreePreview": false,
    "attachments": []
  }
];

export const medicineCabinetItems: MedicineCabinetItem[] = [
  {
    "id": "med-1",
    "tag": "Mdłości i zgaga",
    "title": "Sposoby na poranne mdłości i refluks",
    "category": "Ciąża · Objawy",
    "stageId": "stage-01",
    "lessonId": "lekcja-01",
    "previewText": "Częste małe posiłki, woda z imbirem, unikanie leżenia po jedzeniu i bezpieczne nawyki."
  },
  {
    "id": "med-2",
    "tag": "Badania i USG",
    "title": "Kalendarz badań w ciąży i wymaz GBS",
    "category": "Zdrowie · Profilaktyka",
    "stageId": "stage-02",
    "lessonId": "lekcja-11",
    "previewText": "Checklista badań od morfologii po test glukozy i kluczowy wymaz GBS przed porodem."
  },
  {
    "id": "med-3",
    "tag": "Ból pleców",
    "title": "Zestaw ćwiczeń na kręgosłup i oddech",
    "category": "Fizjoterapia",
    "stageId": "stage-03",
    "lessonId": "lekcja-15",
    "previewText": "Mobilizacja miednicy na piłce, bezpieczny klęk podparty i oddech torem dolnożebrowym."
  },
  {
    "id": "med-4",
    "tag": "Wyprawka szpitalna",
    "title": "Torba do szpitala w 3 strefach",
    "category": "Przygotowanie",
    "stageId": "stage-05",
    "lessonId": "lekcja-27",
    "previewText": "Podział bagażu: strefa porodu, oddział położniczy dla Mamy oraz wyprawka dla Noworodka."
  },
  {
    "id": "med-5",
    "tag": "Odejście wód",
    "title": "Gdy wody odejdą – co robić krok po kroku",
    "category": "Poród · Start",
    "stageId": "stage-05",
    "lessonId": "lekcja-29",
    "previewText": "Ocena koloru wód, prysznic, chód bociana i zasada 5-1-1 przed wyjazdem na izbę przyjęć."
  },
  {
    "id": "med-6",
    "tag": "Łagodzenie bólu",
    "title": "Pozycje wertykalne i masaż krzyża",
    "category": "Poród · Niefarmakologiczne",
    "stageId": "stage-05",
    "lessonId": "lekcja-30",
    "previewText": "Ruch ułatwiający wstawianie główki, worki sako, chusta Rebozo i rola partnera."
  },
  {
    "id": "med-7",
    "tag": "Znieczulenie ZZO",
    "title": "Medyczne wsparcie w skurczach – ZZO i gaz",
    "category": "Poród · Medycyna",
    "stageId": "stage-05",
    "lessonId": "lekcja-33",
    "previewText": "Kiedy podaje się ZZO (4-5 cm), jak działa gaz rozweselający i bezpieczne metody na sali."
  },
  {
    "id": "med-8",
    "tag": "Regeneracja i gojenie",
    "title": "Czuła pielęgnacja i regeneracja tkanek po porodzie",
    "category": "Połóg · Regeneracja",
    "stageId": "stage-06",
    "lessonId": "lekcja-35",
    "previewText": "Wietrzenie, delikatne mycie, unikanie podrażnień i bezpieczna mobilizacja blizny."
  },
  {
    "id": "med-9",
    "tag": "Karmienie piersią",
    "title": "Prawidłowy chwyt i pozycje karmienia",
    "category": "Laktacja",
    "stageId": "stage-08",
    "lessonId": "lekcja-49",
    "previewText": "Chwyt asymetryczny brodawki, pozycja spod pachy po cięciu cesarskim i nawał."
  },
  {
    "id": "med-10",
    "tag": "Kolki niemowlęce",
    "title": "Masaż brzuszka i ulga w kolce",
    "category": "Noworodek · Dolegliwości",
    "stageId": "stage-08",
    "lessonId": "lekcja-52",
    "previewText": "Prawidłowa technika masażu, termofor z pestek wiśni, pionizacja i spokój rodzica."
  },
  {
    "id": "med-11",
    "tag": "Pierwsza pomoc",
    "title": "Pierwsza pomoc noworodka i bezpieczne zachłyśnięcia",
    "category": "Bezpieczeństwo · SOS",
    "stageId": "stage-07",
    "lessonId": "lekcja-43",
    "previewText": "Praktyczny instruktaż ratowania życia: 5 oddechów, 30 uciśnięć dwoma palcami i zimna krew."
  },
  {
    "id": "med-12",
    "tag": "Kąpiel i pępek",
    "title": "Pierwsza kąpiel i delikatna pielęgnacja pępka",
    "category": "Pielęgnacja",
    "stageId": "stage-07",
    "lessonId": "lekcja-44",
    "previewText": "Temperatura wody 37°C, pewny chwyt, sucha pielęgnacja pępka bez alkoholu."
  }
];

export function getLessonById(id: string): Lesson | undefined {
  return lessons.find((l) => l.id === id || l.lessonNumber === parseInt(id, 10));
}

export function getStageById(stageId: string): Stage | undefined {
  return stages.find((s) => s.id === stageId || s.slug === stageId);
}

export function getLessonsByStage(stageId: string): Lesson[] {
  return lessons.filter((l) => l.stageId === stageId);
}

export function getAdjacentLessons(lessonId: string): { prev?: Lesson; next?: Lesson } {
  const idx = lessons.findIndex((l) => l.id === lessonId);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? lessons[idx - 1] : undefined,
    next: idx < lessons.length - 1 ? lessons[idx + 1] : undefined,
  };
}

export function getStageDisplayTitle(stage?: Stage): string {
  if (!stage) return 'Moduł edukacyjny';
  switch (stage.num) {
    case '01':
      return 'Twoja ciąża tydzień po tygodniu (Lekcje 1–5)';
    case '02':
      return 'Zdrowie, profilaktyka i samopoczucie (Lekcje 6–12)';
    case '03':
      return 'Komfort i aktywność na co dzień (Lekcje 13–18)';
    case '04':
      return 'Projekt „Gniazdo”, wyprawka i pokój dziecka (Lekcje 19–25)';
    case '05':
      return 'Godzina „Zero”, świadomy i aktywny poród (Lekcje 26–34)';
    case '06':
      return 'Połóg, regeneracja i fizjoterapia mamy (Lekcje 35–39)';
    case '07':
      return 'Opieka nad noworodkiem i bezpieczeństwo (Lekcje 40–48)';
    case '08':
      return 'Karmienie, laktacja i kolki (Lekcje 49–52)';
    default:
      return stage.subtitle || stage.title;
  }
}

export function getStageShortBadge(stage?: Stage): string {
  if (!stage) return 'Moduł';
  switch (stage.num) {
    case '01': return '1. Ciąża (1–5)';
    case '02': return '2. Zdrowie (6–12)';
    case '03': return '3. Aktywność (13–18)';
    case '04': return '4. Wyprawka (19–25)';
    case '05': return '5. Poród (26–34)';
    case '06': return '6. Połóg (35–39)';
    case '07': return '7. Noworodek (40–48)';
    case '08': return '8. Karmienie (49–52)';
    default: return stage.title;
  }
}

export function getStageFullDescription(stage?: Stage): string {
  if (!stage) return '';
  switch (stage.num) {
    case '01': return 'Jak zmienia się ciało i jak rozwija się dziecko, trymestr po trymestrze. Do tego nowina dla bliskich, aplikacje i mity.';
    case '02': return 'Kalendarz badań, prowadzenie ciąży, samopoczucie na co dzień, higiena intymna i sygnały, o których warto wiedzieć wcześniej.';
    case '03': return 'Sen na lewym boku, bezpieczny ruch, podróże, ćwiczenia mięśni dna miednicy i odciążenie kręgosłupa pokazane krok po kroku.';
    case '04': return 'Wózek, bezpieczny fotelik samochodowy, łóżeczko, domowa apteczka i ubranka. Co kupić na start, a z czym spokojnie poczekać.';
    case '05': return 'Plan porodu, torba do szpitala, okresy porodu, ruch i oddech, rola osoby towarzyszącej, znieczulenie ZZO i cięcie cesarskie.';
    case '06': return 'Pierwsze tygodnie po porodzie: fizjologia połogu, czuła regeneracja tkanek, emocje i Baby Blues, powrót do ruchu oraz historie mam.';
    case '07': return 'Pierwsze dni dziecka, skala Apgar, kąpiel i pielęgnacja pępka, bezpieczny sen, stany przejściowe, szczepienia i pierwsza pomoc.';
    case '08': return 'Pozycje do karmienia, technika przystawienia bez bólu, nawał pokarmowy, dobór laktatora i sposoby na kolki niemowlęce.';
    default: return stage.description;
  }
}
