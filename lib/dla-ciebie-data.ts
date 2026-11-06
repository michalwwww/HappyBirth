// Dla Ciebie: baza wiedzy z przepisów. Wygenerowane ze Źródłownika HappyBirth (stan prawny 25.09.2026,
// standard opieki okołoporodowej w brzmieniu od 7.05.2026). Filtr kanału „strona”: bez listy twardej,
// bez obietnic, bez myślników, bez słowa „położna”. Karty wrażliwe zostają poza stroną publiczną.
// Nie edytować ręcznie: generuj.py.
export interface Cytat { tekst: string; lok: string; zrodlo: string }
export interface Lokalizator { lok: string; zrodlo: string }
export interface Karta { id: string; tytul: string; temat: string; tekst: string; zmiana: 'nowe' | 'zmienione' | null; cytaty: Cytat[]; lokalizatory: Lokalizator[]; zrodla: string[]; lekcje: number[] }
export interface Okres { id: string; etykieta: string; naglowek: string; od: number; do: number; pozycje: { tekst: string; zmiana: 'nowe' | 'zmienione' | null }[]; badania: { razem: number; zmiany: number } }
export interface Zrodlo { id: string; skrot: string; tytul: string; publikacja: string; url: string }

export const STAN_PRAWNY = '25 września 2026';

export const TEMATY: Record<string, string> = {
  "prawa": "Prawa pacjentki",
  "ciaza": "Ciąża i badania",
  "edukacja": "Edukacja przedporodowa",
  "plan": "Plan porodu",
  "porod": "Poród",
  "bol": "Łagodzenie bólu",
  "noworodek": "Noworodek",
  "karmienie": "Karmienie",
  "polog": "Połóg",
  "dostepnosc": "Dostępność"
};

export const NAJWAZNIEJSZE: { karta: string; tekst: string }[] = [
  {
    "karta": "edukacja-od-poczatku",
    "tekst": "Edukacja przedporodowa od pierwszej wizyty, także dla ojca dziecka"
  },
  {
    "karta": "co-najmniej-jedna-metoda-farmakologiczna",
    "tekst": "Każdy szpital zapewnia co najmniej jedną farmakologiczną metodę łagodzenia bólu"
  },
  {
    "karta": "metody-na-stronie-szpitala",
    "tekst": "Szpitale publikują dostępne metody łagodzenia bólu na swoich stronach"
  },
  {
    "karta": "skora-do-skory",
    "tekst": "Co najmniej dwie godziny skóra do skóry, także po porodzie operacyjnym"
  },
  {
    "karta": "jedzenie-i-picie",
    "tekst": "Lekkostrawne posiłki i klarowne płyny w czasie porodu"
  },
  {
    "karta": "laktacja-zgodnie-z-decyzja-mamy",
    "tekst": "Nowa część o standardowej opiece laktacyjnej"
  },
  {
    "karta": "hbs-hiv-badania",
    "tekst": "Badanie w kierunku HBV już na początku ciąży"
  },
  {
    "karta": "konsultacja-anestezjologiczna",
    "tekst": "Konsultacja anestezjologiczna jeszcze w ciąży"
  },
  {
    "karta": "dostepnosc-uslug",
    "tekst": "Nowa część o dostępności dla kobiet ze szczególnymi potrzebami"
  }
];

export const KARTY: Karta[] = [
  {
    "id": "cel-standardu",
    "tytul": "Po co jest standard opieki okołoporodowej",
    "temat": "prawa",
    "tekst": "Standard to rozporządzenie Ministra Zdrowia, które obowiązuje każdą placówkę prowadzącą ciążę, poród i połóg. Jego oś to dobrostan matki i dziecka oraz ograniczanie interwencji medycznych do niezbędnych. Obecne brzmienie obowiązuje od 7 maja 2026 r.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "określa poszczególne elementy organizacji opieki mającej na celu zapewnienie dobrostanu zdrowia matki i dziecka przy ograniczeniu do niezbędnych interwencji medycznych",
        "lok": "cz. I ust. 1",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      6,
      28,
      34
    ]
  },
  {
    "id": "interwencje-z-uzasadnieniem",
    "tytul": "Każda interwencja wymaga medycznego uzasadnienia",
    "temat": "prawa",
    "tekst": "Ingerencja w ciążę fizjologiczną, poród, połóg albo laktację wymaga wskazań medycznych, a powód trafia do dokumentacji. Personel omawia z rodzącą wskazania do zabiegów i skutki rezygnacji z nich.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "Ingerencja w przebieg ciąży fizjologicznej, poród, połóg lub laktację może nastąpić wyłącznie ze wskazań uzasadnionych medycznie.",
        "lok": "cz. I ust. 5",
        "zrodlo": "std-2026"
      },
      {
        "tekst": "zapoznają się z planem porodu, omawiają go z kobietą rodzącą, przedstawiają wskazania do stosowania zabiegów medycznych i konsekwencje w przypadku ich niezastosowania; w przypadku braku planu porodu zbierają wywiad dotyczący preferencji porodowych kobiety rodzącej i odnotowują je w dokumentacji; w miarę możliwości stosują postanowienia planu porodu;",
        "lok": "cz. VI ust. 2 pkt 4",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      26,
      28,
      34
    ]
  },
  {
    "id": "trzy-prawa-w-standardzie",
    "tytul": "Decyzje, miejsce porodu, osoba sprawująca opiekę",
    "temat": "prawa",
    "tekst": "Standard wymienia trzy prawa: świadomy udział w decyzjach o ciąży, porodzie, połogu i opiece nad noworodkiem, wybór miejsca porodu (w szpitalu albo poza nim) oraz wybór osoby sprawującej opiekę, w granicach możliwości organizacyjnych placówki.",
    "zmiana": null,
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. I ust. 16",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      6,
      26,
      28
    ]
  },
  {
    "id": "osoba-bliska-kto",
    "tytul": "Kim może być osoba bliska",
    "temat": "prawa",
    "tekst": "Osobą bliską jest małżonek, krewny, osoba we wspólnym pożyciu, przedstawiciel ustawowy albo każda inna osoba wskazana przez kobietę. O tym, kto nią jest, decyduje kobieta.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. I ust. 4 pkt 6",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      26,
      31,
      32
    ]
  },
  {
    "id": "osoba-bliska-ustawa",
    "tytul": "Osoba bliska przy porodzie w ustawie o prawach pacjenta",
    "temat": "prawa",
    "tekst": "Na życzenie pacjentki przy udzielaniu świadczeń może być obecna osoba bliska. Personel może odmówić tylko przy prawdopodobieństwie zagrożenia epidemicznego albo ze względu na bezpieczeństwo zdrowotne pacjentki, a odmowę wpisuje do dokumentacji.",
    "zmiana": null,
    "cytaty": [
      {
        "tekst": "Na życzenie pacjenta przy udzielaniu świadczeń zdrowotnych może być obecna osoba bliska.",
        "lok": "art. 21 ust. 1",
        "zrodlo": "upp"
      },
      {
        "tekst": "Osoba wykonująca zawód medyczny udzielająca świadczeń zdrowotnych pacjentowi może odmówić obecności osoby bliskiej przy udzielaniu świadczeń zdrowotnych, w przypadku istnienia prawdopodobieństwa wystąpienia zagrożenia epidemicznego lub ze względu na bezpieczeństwo zdrowotne pacjenta. Odmowę odnotowuje się w dokumentacji medycznej.",
        "lok": "art. 21 ust. 2",
        "zrodlo": "upp"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "upp"
    ],
    "lekcje": [
      26,
      31
    ]
  },
  {
    "id": "prawo-do-lagodzenia-bolu",
    "tytul": "Łagodzenie bólu jest prawem",
    "temat": "prawa",
    "tekst": "Prawo do leczenia bólu wynika z ustawy o prawach pacjenta, a standard mówi wprost, że kobieta rodząca ma prawo do łagodzenia bólu porodowego.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "Pacjent ma prawo do leczenia bólu.",
        "lok": "art. 20a ust. 1",
        "zrodlo": "upp"
      },
      {
        "tekst": "Kobieta rodząca ma prawo do łagodzenia bólu porodowego.",
        "lok": "cz. VII ust. 1",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026",
      "upp"
    ],
    "lekcje": [
      30,
      33
    ]
  },
  {
    "id": "godnosc-i-intymnosc",
    "tytul": "Intymność i godność",
    "temat": "prawa",
    "tekst": "Pacjentka ma prawo do poszanowania intymności i godności. Standard wymaga, by personel szanował prywatność rodzącej i jej poczucie intymności.",
    "zmiana": null,
    "cytaty": [
      {
        "tekst": "Pacjent ma prawo do poszanowania intymności i godności, w szczególności w czasie udzielania mu świadczeń zdrowotnych.",
        "lok": "art. 20 ust. 1",
        "zrodlo": "upp"
      },
      {
        "tekst": "szanują prywatność kobiety rodzącej i jej poczucie intymności;",
        "lok": "cz. VI ust. 2 pkt 3",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026",
      "upp"
    ],
    "lekcje": [
      26,
      34
    ]
  },
  {
    "id": "zgoda-na-kazde-badanie",
    "tytul": "Zgoda na każde badanie i zabieg",
    "temat": "prawa",
    "tekst": "Pacjentka może zgodzić się na świadczenie albo odmówić, po otrzymaniu informacji. Przy porodzie personel pyta o zgodę za każdym razem, przed każdym zabiegiem i badaniem.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "Pacjent ma prawo do wyrażenia zgody na udzielenie określonych świadczeń zdrowotnych lub odmowy takiej zgody, po uzyskaniu informacji w zakresie określonym w art. 9.",
        "lok": "art. 16",
        "zrodlo": "upp"
      },
      {
        "tekst": "każdorazowo uzyskują zgodę kobiety rodzącej lub jej przedstawiciela ustawowego na wykonanie zabiegów i badań, zgodnie z przepisami ustawy z dnia 6 listopada 2008 r. o prawach pacjenta i Rzeczniku Praw Pacjenta (Dz. U. z 2024 r. poz. 581);",
        "lok": "cz. VI ust. 2 pkt 7",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026",
      "upp"
    ],
    "lekcje": [
      26,
      34
    ]
  },
  {
    "id": "prawo-do-informacji",
    "tytul": "Przystępna informacja",
    "temat": "prawa",
    "tekst": "Pacjentka ma prawo do przystępnej informacji o swoim stanie zdrowia, proponowanych metodach, ich następstwach, wynikach leczenia i rokowaniu.",
    "zmiana": null,
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "art. 9 ust. 2",
        "zrodlo": "upp"
      }
    ],
    "zrodla": [
      "upp"
    ],
    "lekcje": [
      11,
      26
    ]
  },
  {
    "id": "dokumentacja-medyczna",
    "tytul": "Dostęp do dokumentacji medycznej",
    "temat": "prawa",
    "tekst": "Pacjentka ma prawo dostępu do swojej dokumentacji: do wglądu, jako wyciąg, odpis, kopia lub wydruk, drogą elektroniczną albo na nośniku danych.",
    "zmiana": null,
    "cytaty": [
      {
        "tekst": "Pacjent ma prawo do dostępu do dokumentacji medycznej dotyczącej jego stanu zdrowia oraz udzielonych mu świadczeń zdrowotnych.",
        "lok": "art. 23 ust. 1",
        "zrodlo": "upp"
      }
    ],
    "lokalizatory": [
      {
        "lok": "art. 27 ust. 1",
        "zrodlo": "upp"
      }
    ],
    "zrodla": [
      "upp"
    ],
    "lekcje": [
      27
    ]
  },
  {
    "id": "druga-opinia",
    "tytul": "Opinia innej osoby z personelu",
    "temat": "prawa",
    "tekst": "Pacjentka może poprosić, by lekarz zasięgnął opinii innego lekarza albo zwołał konsylium. Podobne prawo dotyczy opinii innej osoby wykonującej ten sam zawód medyczny. Prośbę i ewentualną odmowę odnotowuje się w dokumentacji.",
    "zmiana": null,
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "art. 6 ust. 3",
        "zrodlo": "upp"
      }
    ],
    "zrodla": [
      "upp"
    ],
    "lekcje": [
      12,
      26
    ]
  },
  {
    "id": "prawo-do-swiadczen-przy-porodzie",
    "tytul": "Świadczenia związane z porodem",
    "temat": "prawa",
    "tekst": "W przypadku porodu pacjentka ma prawo do świadczeń związanych z porodem. Przyjęcie do porodu następuje przez zgłoszenie się do wybranej placówki.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "W przypadku porodu pacjentka ma prawo do uzyskania świadczeń zdrowotnych związanych z porodem.",
        "lok": "art. 7 ust. 2",
        "zrodlo": "upp"
      },
      {
        "tekst": "Przyjęcie do porodu następuje przez zgłoszenie się do wybranego podmiotu leczniczego udzielającego świadczeń zdrowotnych w zakresie opieki okołoporodowej.",
        "lok": "cz. VIII ust. 1",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026",
      "upp"
    ],
    "lekcje": [
      29
    ]
  },
  {
    "id": "bez-ubezpieczenia",
    "tytul": "Opieka w ciąży także bez ubezpieczenia",
    "temat": "prawa",
    "tekst": "Kobieta w ciąży, przy porodzie i w połogu, z obywatelstwem polskim i miejscem zamieszkania w Polsce, ma prawo do świadczeń finansowanych ze środków publicznych także wtedy, gdy nie jest ubezpieczona.",
    "zmiana": null,
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "MZ: świadczenia bez ubezpieczenia",
        "zrodlo": "mz-swiadczenia"
      }
    ],
    "zrodla": [
      "mz-swiadczenia"
    ],
    "lekcje": [
      11
    ]
  },
  {
    "id": "rzecznik-praw-pacjenta",
    "tytul": "Gdzie zgłosić naruszenie praw",
    "temat": "prawa",
    "tekst": "Naruszenie praw pacjenta można zgłosić Rzecznikowi Praw Pacjenta, a wniosek jest bezpłatny. Komunikat RPP podaje bezpłatną infolinię 800 190 590.",
    "zmiana": null,
    "cytaty": [
      {
        "tekst": "Wniosek kierowany do Rzecznika jest wolny od opłat.",
        "lok": "art. 50 ust. 2",
        "zrodlo": "upp"
      },
      {
        "tekst": "pod nr tel. 800 190 590 lub mailowo: kancelaria@rpp.gov.pl",
        "lok": "RPP: prawa pacjentki i noworodka (2020)",
        "zrodlo": "rpp-2020"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "rpp-2020",
      "upp"
    ],
    "lekcje": [
      26
    ]
  },
  {
    "id": "dodatkowa-opieka-pielegnacyjna",
    "tytul": "Bliska osoba w szpitalu po porodzie",
    "temat": "prawa",
    "tekst": "Pacjentka w szpitalu ma prawo do dodatkowej opieki pielęgnacyjnej, czyli pomocy bliskiej osoby, która nie polega na udzielaniu świadczeń. Szpital może pobierać opłatę za związane z tym koszty, a informacja o jej wysokości musi być jawna.",
    "zmiana": null,
    "cytaty": [
      {
        "tekst": "Pacjent ma prawo do dodatkowej opieki pielęgnacyjnej.",
        "lok": "art. 34 ust. 1",
        "zrodlo": "upp"
      },
      {
        "tekst": "Informacja o wysokości opłaty, o której mowa w ust. 2, oraz sposobie jej ustalenia, a także o uprawnieniach wynikających z ust. 4, jest jawna i udostępniana w lokalu zakładu leczniczego podmiotu, o którym mowa w ust. 1.",
        "lok": "art. 35 ust. 3",
        "zrodlo": "upp"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "upp"
    ],
    "lekcje": [
      27,
      36
    ]
  },
  {
    "id": "edukacja-od-poczatku",
    "tytul": "Edukacja przedporodowa od pierwszej wizyty",
    "temat": "ciaza",
    "tekst": "Od 7 maja 2026 r. edukacja przedporodowa zaczyna się przy pierwszej wizycie, do 10. tygodnia ciąży. Wcześniej standard przewidywał jej start od 21. tygodnia. Obejmuje także ojca dziecka albo inną osobę bliską.",
    "zmiana": "nowe",
    "cytaty": [
      {
        "tekst": "Rozpoczęcie edukacji przedporodowej",
        "lok": "cz. II, tabela: do 10. tygodnia ciąży lub w chwili pierwszego zgłoszenia się, świadczenia profilaktyczne, poz. 10",
        "zrodlo": "std-2026"
      },
      {
        "tekst": "praktyczne i teoretyczne przygotowanie kobiety w ciąży oraz ojca dziecka mającego się urodzić lub innej osoby bliskiej do podejmowania zachowań prozdrowotnych w ciąży, podczas porodu i połogu oraz do rodzicielstwa, kształtowanie właściwych zachowań prozdrowotnych i przygotowanie do sprawowania opieki nad noworodkiem i niemowlęciem",
        "lok": "cz. I ust. 4 pkt 14",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      1,
      6
    ]
  },
  {
    "id": "hbs-hiv-badania",
    "tytul": "HBs i HIV na początku i na końcu ciąży",
    "temat": "ciaza",
    "tekst": "Badanie antygenu HBs (wirusowe zapalenie wątroby typu B) weszło do badań na początku ciąży. Przy przyjęciu do porodu szpital sprawdza wyniki HBs i HIV z 33. do 37. tygodnia, a gdy ich brak, wykonuje badania.",
    "zmiana": "nowe",
    "cytaty": [
      {
        "tekst": "Badanie antygenu HBs",
        "lok": "cz. II, tabela: do 10. tygodnia ciąży lub w chwili pierwszego zgłoszenia się, badania i konsultacje, poz. 12",
        "zrodlo": "std-2026"
      },
      {
        "tekst": "U każdej kobiety zgłaszającej się do porodu należy zweryfikować badania na obecność antygenu HBs oraz w kierunku zakażenia HIV (od 33. do 37. tygodnia ciąży). W razie braku aktualnych badań należy je niezwłocznie wykonać.",
        "lok": "cz. VIII ust. 6",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      11,
      27
    ]
  },
  {
    "id": "szczepienia-w-ciazy",
    "tytul": "Informacja o szczepieniach w ciąży",
    "temat": "ciaza",
    "tekst": "Na pierwszej wizycie osoba prowadząca ciążę przekazuje informację o szczepieniach zalecanych w ciąży. Ministerstwo wymienia szczepienia przeciw grypie i krztuścowi oraz profilaktykę zakażeń RSV.",
    "zmiana": "nowe",
    "cytaty": [
      {
        "tekst": "Przekazanie informacji o szczepieniach zalecanych w ciąży",
        "lok": "cz. II, tabela: do 10. tygodnia ciąży lub w chwili pierwszego zgłoszenia się, świadczenia profilaktyczne, poz. 8",
        "zrodlo": "std-2026"
      },
      {
        "tekst": "większą świadomość i korzystanie ze szczepień zalecanych dla kobiet w ciąży (szczepienia przeciw grypie, krztuścowi, profilaktyka zakażeń RSV)",
        "lok": "MZ: najważniejsze zmiany",
        "zrodlo": "mz-standardy"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "mz-standardy",
      "std-2026"
    ],
    "lekcje": [
      11
    ]
  },
  {
    "id": "test-glukozy",
    "tytul": "Test obciążenia glukozą od 24. do 28. tygodnia",
    "temat": "ciaza",
    "tekst": "Test obciążenia 75 g glukozy wykonuje się między 24. a 28. tygodniem ciąży; wcześniej okno wynosiło 24 do 26 tygodni. Oznaczenie jest trzypunktowe: na czczo, po godzinie i po dwóch godzinach.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. II, tabela: od 24. do 28. tygodnia ciąży, badania i konsultacje, poz. 1",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      11
    ]
  },
  {
    "id": "posiew-gbs",
    "tytul": "Posiew w kierunku paciorkowców grupy B",
    "temat": "ciaza",
    "tekst": "Posiew w kierunku paciorkowców grupy B wykonuje się między 35. a 37. tygodniem. Przy porodzie personel ustala na tej podstawie, czy potrzebna jest profilaktyka.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "Posiew z pochwy i odbytu w kierunku paciorkowców B-hemolizujących (od 35. do 37. tygodnia ciąży)",
        "lok": "cz. II, tabela: od 33. do 37. tygodnia ciąży, badania i konsultacje, poz. 5",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [
      {
        "lok": "cz. VIII ust. 5",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      11,
      27
    ]
  },
  {
    "id": "konsultacja-anestezjologiczna",
    "tytul": "Konsultacja anestezjologiczna jeszcze w ciąży",
    "temat": "ciaza",
    "tekst": "Kobieta, która myśli o analgezji regionalnej, może odbyć konsultację anestezjologiczną między 33. a 37. tygodniem (albo później, jeśli wcześniej się nie odbyła). Standard daje też prawo do wcześniejszego poznania miejsca porodu i dostępnych metod łagodzenia bólu.",
    "zmiana": "nowe",
    "cytaty": [
      {
        "tekst": "Konsultacja anestezjologiczna dla kobiet decydujących się na łagodzenie bólu porodowego z zastosowaniem analgezji regionalnej",
        "lok": "cz. II, tabela: od 33. do 37. tygodnia ciąży, badania i konsultacje, poz. 7",
        "zrodlo": "std-2026"
      },
      {
        "tekst": "Kobiecie w ciąży należy umożliwić wcześniejsze zapoznanie się z miejscem porodu i dostępnymi metodami łagodzenia bólu porodowego oraz konsultację anestezjologiczną na wypadek oczekiwanego przez nią zastosowania analgezji regionalnej.",
        "lok": "cz. V ust. 6",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      11,
      26,
      33
    ]
  },
  {
    "id": "po-40-tygodniu",
    "tytul": "Po 40. tygodniu ciąży",
    "temat": "ciaza",
    "tekst": "Niezwłocznie po 40. tygodniu jest wizyta z KTG i USG. Przy prawidłowych wynikach kolejna odbywa się po 7 dniach i ustala się na niej datę przyjęcia do szpitala tak, aby poród odbył się przed końcem 42. tygodnia.",
    "zmiana": null,
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. II, tabela: niezwłocznie po 40. tygodniu ciąży, świadczenia profilaktyczne, poz. 7",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      3,
      29
    ]
  },
  {
    "id": "wizyty-co-cztery-tygodnie",
    "tytul": "Jak często są wizyty w ciąży",
    "temat": "ciaza",
    "tekst": "W ciąży fizjologicznej wizyty odbywają się nie rzadziej niż co cztery tygodnie, a częściej w uzasadnionych przypadkach. Wcześniej standard mówił o 3 do 4 tygodniach.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. II ust. 2",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      11
    ]
  },
  {
    "id": "skierowanie-do-poz",
    "tytul": "Skierowanie do opieki POZ już na pierwszej wizycie",
    "temat": "ciaza",
    "tekst": "Jeśli ciążę prowadzi lekarz, ma obowiązek poinformować o opiece w ramach podstawowej opieki zdrowotnej (POZ) i skierować na edukację przedporodową oraz na opiekę w domu po porodzie. Od 2026 r. obowiązek dotyczy już pierwszej wizyty.",
    "zmiana": "nowe",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. II ust. 1 pkt 1",
        "zrodlo": "std-2026"
      },
      {
        "lok": "cz. II, tabela: do 10. tygodnia ciąży lub w chwili pierwszego zgłoszenia się, świadczenia profilaktyczne, poz. 11",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      6
    ]
  },
  {
    "id": "usg-piersi",
    "tytul": "USG piersi na początku ciąży",
    "temat": "ciaza",
    "tekst": "Standard zaleca USG piersi, najlepiej do końca 12. tygodnia ciąży, gdy są zmiany kliniczne w piersi albo obciążenie rodzinne wskazuje na wyższe ryzyko raka piersi.",
    "zmiana": "nowe",
    "cytaty": [
      {
        "tekst": "dodatkowo zaleca się, aby kobieta w ciąży (najlepiej do końca 12. tygodnia ciąży) została objęta badaniem ultrasonograficznym piersi, gdy ma zmiany kliniczne w piersi lub gdy obciążenie rodzinne wskazuje u niej na wyższe ryzyko raka piersi",
        "lok": "cz. II ust. 1 pkt 3",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      11
    ]
  },
  {
    "id": "czynniki-ryzyka-rozmowa",
    "tytul": "Rozmowa o czynnikach ryzyka i wyborze szpitala",
    "temat": "ciaza",
    "tekst": "Osoba prowadząca ciążę omawia z kobietą zidentyfikowane czynniki ryzyka, żeby mogła świadomie wybrać miejsce porodu. Wyniki, zalecenia i ustalenia trafiają do dokumentacji.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "Zidentyfikowane u kobiety w ciąży czynniki ryzyka okołoporodowego osoba sprawująca opiekę omawia z kobietą w ciąży lub z jej przedstawicielem ustawowym, tak aby zapewnić jej podjęcie świadomej decyzji odnośnie do wyboru miejsca porodu.",
        "lok": "cz. III ust. 7",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [
      {
        "lok": "cz. III ust. 8",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      12,
      28
    ]
  },
  {
    "id": "poziomy-opieki-perinatalnej",
    "tytul": "Trzy poziomy opieki perinatalnej",
    "temat": "ciaza",
    "tekst": "Szpitale mają trzy poziomy opieki. I poziom obejmuje ciążę fizjologiczną i zdrowego noworodka, II poziom także ciąże o patologii średniego stopnia, a III poziom także ciąże o najcięższej patologii.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "I poziom opieki perinatalnej obejmuje opiekę nad ciążą fizjologiczną, porodem i połogiem oraz zdrowym noworodkiem, a także krótkotrwałą opiekę nad niespodziewanie występującą patologią ciąży, II poziom opieki perinatalnej obejmuje również opiekę nad ciążą o patologii średniego stopnia, a III poziom opieki perinatalnej obejmuje ponadto opiekę nad ciążą o najcięższej patologii.",
        "lok": "cz. I ust. 6",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      27,
      28
    ]
  },
  {
    "id": "wybor-miejsca-porodu",
    "tytul": "Wybór miejsca porodu",
    "temat": "ciaza",
    "tekst": "Kobieta może wybrać miejsce porodu, w szpitalu albo poza nim, i dostać wyczerpującą informację o wskazaniach i przeciwwskazaniach. Decyzję o porodzie poza szpitalem poprzedza rozmowa o czynnikach ryzyka i ustalenie, co robić, gdy sytuacja się zmieni; te informacje trafiają do planu porodu.",
    "zmiana": "nowe",
    "cytaty": [
      {
        "tekst": "Kobiecie w ciąży należy umożliwić wybór miejsca porodu (w warunkach szpitalnych albo pozaszpitalnych) oraz przekazać wyczerpującą informację dotyczącą wybranego miejsca porodu, obejmującą wskazania i przeciwwskazania.",
        "lok": "cz. V ust. 5",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [
      {
        "lok": "cz. I ust. 14",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      26,
      28
    ]
  },
  {
    "id": "poznanie-szpitala",
    "tytul": "Wcześniejsze poznanie miejsca porodu",
    "temat": "ciaza",
    "tekst": "Kobieta w ciąży może wcześniej poznać miejsce porodu i dostępne tam metody łagodzenia bólu oraz odbyć konsultację anestezjologiczną, jeśli planuje analgezję regionalną.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "Kobiecie w ciąży należy umożliwić wcześniejsze zapoznanie się z miejscem porodu i dostępnymi metodami łagodzenia bólu porodowego oraz konsultację anestezjologiczną na wypadek oczekiwanego przez nią zastosowania analgezji regionalnej.",
        "lok": "cz. V ust. 6",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      26,
      27,
      33
    ]
  },
  {
    "id": "plan-opieki-przedporodowej",
    "tytul": "Plan opieki przedporodowej",
    "temat": "ciaza",
    "tekst": "Osoba prowadząca ciążę i kobieta ustalają plan opieki przedporodowej (wszystkie procedury z terminami) oraz plan porodu. Plan uwzględnia programy zdrowotne, w tym badania prenatalne i badania echokardiograficzne płodu.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. V ust. 1",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      11
    ]
  },
  {
    "id": "edukacja-kto-prowadzi",
    "tytul": "Kto prowadzi edukację przedporodową",
    "temat": "edukacja",
    "tekst": "Edukację przedporodową prowadzi wykwalifikowana specjalistka. Wymiar godzin dopasowuje się do potrzeb, zajęcia są teoretyczne i praktyczne, indywidualne lub grupowe. Edukacja indywidualna jest też obowiązkiem lekarza prowadzącego ciążę.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. IV ust. 1",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      6
    ]
  },
  {
    "id": "edukacja-dla-dwojga",
    "tytul": "Edukacja dla kobiety i osoby bliskiej",
    "temat": "edukacja",
    "tekst": "Ramowy program edukacji jest skierowany do kobiety w ciąży, ojca dziecka albo innej osoby bliskiej wskazanej przez kobietę.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "Ramowy program edukacji przedporodowej obejmujący ciążę, poród, połóg oraz wsparcie społeczne kobiety w ciąży, kobiety w połogu i rodziny w okresie okołoporodowym jest skierowany do kobiety w ciąży, ojca dziecka mającego się urodzić lub innej osoby bliskiej wskazanej przez kobietę w ciąży.",
        "lok": "cz. IV ust. 2",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      6
    ]
  },
  {
    "id": "program-ciaza",
    "tytul": "Ramowy program edukacji, część o ciąży",
    "temat": "edukacja",
    "tekst": "Program dla ciąży obejmuje przebieg ciąży i rozwój dziecka, opiekę i badania, styl życia, dolegliwości i sygnały do pilnego kontaktu, profilaktykę zakażeń i szczepienia, profilaktykę zaburzeń uroginekologicznych oraz prawa.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. IV ust. 3",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      1,
      2,
      3,
      7,
      8,
      9,
      10,
      11,
      12,
      16,
      17
    ]
  },
  {
    "id": "program-porod",
    "tytul": "Ramowy program edukacji, część o porodzie",
    "temat": "edukacja",
    "tekst": "Program dla porodu obejmuje plan porodu, zwiastuny porodu i stany nagłe, przyjęcie do szpitala i dokumenty, fizjologię i poród aktywny, rolę osoby bliskiej, pozycje wertykalne, łagodzenie bólu, kontakt skóra do skóry oraz wskazania i ryzyka porodu operacyjnego.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. IV ust. 4",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
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
    ]
  },
  {
    "id": "program-polog",
    "tytul": "Ramowy program edukacji, część o połogu i noworodku",
    "temat": "edukacja",
    "tekst": "Program dla połogu obejmuje przebieg połogu i zdrowie psychiczne, karmienie i wsparcie w laktacji (z rolą ojca i bliskich) oraz opiekę nad noworodkiem i niemowlęciem: pielęgnację, bezpieczeństwo w domu, pierwszą pomoc, szczepienia i rozwój w pierwszym roku.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. IV ust. 5",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      35,
      36,
      37,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      49,
      50,
      51,
      52
    ]
  },
  {
    "id": "plan-porodu-co-zawiera",
    "tytul": "Co obejmuje plan porodu",
    "temat": "plan",
    "tekst": "Plan porodu opisuje oczekiwania dotyczące miejsca i warunków, osoby bliskiej, łagodzenia bólu, zgody na zabiegi, karmienia piersią, kontaktu skóra do skóry (także tego, kto go przejmie, gdy mama nie może), pierwszego karmienia i specjalnych potrzeb.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. V ust. 2",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      26
    ]
  },
  {
    "id": "plan-porodu-zmienia-sie",
    "tytul": "Plan porodu można zmieniać",
    "temat": "plan",
    "tekst": "Plan opieki i plan porodu zmienia się razem z sytuacją zdrowotną i potrzebami kobiety. Oba trafiają do dokumentacji, także szpitalnej po zgłoszeniu się do porodu.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "Plan opieki przedporodowej i plan porodu są modyfikowane odpowiednio do sytuacji zdrowotnej kobiety w ciąży, kobiety rodzącej, kobiety po porodzie, płodu i noworodka oraz do zmieniających się potrzeb kobiety i oczekiwań w trakcie opieki przedporodowej.",
        "lok": "cz. V ust. 3",
        "zrodlo": "std-2026"
      },
      {
        "tekst": "Plan opieki przedporodowej i plan porodu osoba sprawująca opiekę dołącza do indywidualnej zewnętrznej i wewnętrznej dokumentacji medycznej kobiety w ciąży oraz do jej indywidualnej wewnętrznej dokumentacji medycznej po jej zgłoszeniu się do porodu.",
        "lok": "cz. V ust. 4",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      26
    ]
  },
  {
    "id": "plan-porodu-w-praktyce",
    "tytul": "Jak personel korzysta z planu porodu",
    "temat": "plan",
    "tekst": "Personel zapoznaje się z planem porodu i omawia go z rodzącą, wyjaśnia wskazania do zabiegów i skutki rezygnacji z nich. Bez planu zbiera wywiad o preferencjach. Postanowienia planu stosuje w miarę możliwości.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "zapoznają się z planem porodu, omawiają go z kobietą rodzącą, przedstawiają wskazania do stosowania zabiegów medycznych i konsekwencje w przypadku ich niezastosowania; w przypadku braku planu porodu zbierają wywiad dotyczący preferencji porodowych kobiety rodzącej i odnotowują je w dokumentacji; w miarę możliwości stosują postanowienia planu porodu;",
        "lok": "cz. VI ust. 2 pkt 4",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      26
    ]
  },
  {
    "id": "formularz-planu-porodu-mz",
    "tytul": "Przykładowy formularz planu porodu Ministerstwa Zdrowia",
    "temat": "plan",
    "tekst": "Ministerstwo Zdrowia udostępnia przykładowy formularz „Plan porodu i opieki poporodowej” (grudzień 2023 r.). Ma sekcje o warunkach porodu, osobie towarzyszącej, przygotowaniu, kolejnych okresach porodu, łagodzeniu bólu, pobycie na oddziale i specjalnych wymaganiach.",
    "zmiana": null,
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "Plan porodu i opieki poporodowej",
        "zrodlo": "mz-plan-porodu-i-opieki-poporodowej"
      }
    ],
    "zrodla": [
      "mz-plan-porodu-i-opieki-poporodowej"
    ],
    "lekcje": [
      26
    ]
  },
  {
    "id": "szacunek-i-decyzje",
    "tytul": "Szacunek i udział w decyzjach",
    "temat": "porod",
    "tekst": "Rodzącą traktuje się z szacunkiem i włącza w decyzje. Personel dba o postawę, słowa i ton głosu, pyta o potrzeby i oczekiwania i wykorzystuje je, by wspierać rodzącą.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. VI ust. 1",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      26,
      34
    ]
  },
  {
    "id": "przedstawienie-i-wzywanie-pomocy",
    "tytul": "Personel się przedstawia i mówi, jak wezwać pomoc",
    "temat": "porod",
    "tekst": "Osoby sprawujące opiekę witają rodzącą osobiście, przedstawiają się, wyjaśniają swoją rolę, informują, jak wzywać pomoc, i mówią, gdy opieka przechodzi na kogoś innego.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "witają kobietę rodzącą osobiście, przedstawiają się i wyjaśniają swoją rolę w opiece nad nią;",
        "lok": "cz. VI ust. 2 pkt 1",
        "zrodlo": "std-2026"
      },
      {
        "tekst": "prezentują spokojną i wzbudzającą zaufanie postawę;",
        "lok": "cz. VI ust. 2 pkt 2",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [
      {
        "lok": "cz. VI ust. 2 pkt 8",
        "zrodlo": "std-2026"
      },
      {
        "lok": "cz. VI ust. 2 pkt 9",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      34
    ]
  },
  {
    "id": "wsparcie-osoby-bliskiej",
    "tytul": "Wsparcie osoby bliskiej przy porodzie",
    "temat": "porod",
    "tekst": "Standard wymaga ciągłości opieki i możliwości korzystania ze wsparcia ojca dziecka albo innej osoby bliskiej. Personel współpracuje z osobą bliską.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "zapewnić kobiecie rodzącej ciągłość opieki;",
        "lok": "cz. VI ust. 3 pkt 1",
        "zrodlo": "std-2026"
      },
      {
        "tekst": "umożliwić kobiecie rodzącej korzystanie ze wsparcia ojca dziecka mającego się urodzić lub innej osoby bliskiej;",
        "lok": "cz. VI ust. 3 pkt 3",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [
      {
        "lok": "cz. IX ust. 3 pkt 6 lit. d",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      31,
      32
    ]
  },
  {
    "id": "ruch-i-pozycje",
    "tytul": "Ruch i wybór pozycji",
    "temat": "porod",
    "tekst": "Personel zachęca rodzącą do aktywności i pomaga znaleźć optymalne pozycje przez cały poród. W drugim okresie rodząca przyjmuje pozycję, którą uznaje za najwygodniejszą, ze szczególnym uwzględnieniem pozycji wertykalnych.",
    "zmiana": null,
    "cytaty": [
      {
        "tekst": "zachęcać kobietę rodzącą do aktywności fizycznej i pomagać jej w znajdowaniu optymalnych dla niej pozycji podczas całego porodu;",
        "lok": "cz. VI ust. 3 pkt 4",
        "zrodlo": "std-2026"
      },
      {
        "tekst": "W II okresie porodu należy umożliwić kobiecie rodzącej przyjmowanie pozycji, które uznaje ona za najwygodniejsze.",
        "lok": "cz. X ust. 3",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [
      {
        "lok": "cz. X ust. 4 pkt 6",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      30,
      31
    ]
  },
  {
    "id": "jedzenie-i-picie",
    "tytul": "Jedzenie i picie przy porodzie",
    "temat": "porod",
    "tekst": "Rodząca powinna mieć możliwość jedzenia lekkostrawnych posiłków i picia klarownych płynów, także w aktywnej fazie porodu. Posiłki konsultuje z osobą sprawującą opiekę. Wcześniej o posiłkach decydowała osoba sprawująca opiekę.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "Kobieta rodząca powinna mieć możliwość spożywania lekkostrawnych posiłków oraz przyjmowania klarownych płynów w trakcie porodu. Spożywanie posiłków kobieta rodząca konsultuje z osobą sprawującą opiekę.",
        "lok": "cz. VI ust. 4",
        "zrodlo": "std-2026"
      },
      {
        "tekst": "zapewnić kobiecie rodzącej możliwość spożywania klarownych płynów, także podczas aktywnej fazy porodu.",
        "lok": "cz. VI ust. 3 pkt 5",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      27,
      29,
      30
    ]
  },
  {
    "id": "sprzet-na-sali-porodowej",
    "tytul": "Sprzęt, z którego można korzystać",
    "temat": "porod",
    "tekst": "Rodząca może korzystać między innymi z piłki, drabinki, wanny lub prysznica, materaca i stołka porodowego, także z ruchomymi parawanami dla intymności.",
    "zmiana": "nowe",
    "cytaty": [
      {
        "tekst": "Kobiecie rodzącej w podmiocie leczniczym zapewnia się możliwość korzystania w szczególności z piłki, drabinki, wanny lub prysznica, materaca, stołka porodowego, również z wykorzystaniem ruchomych parawanów umożliwiających zapewnienie intymności.",
        "lok": "cz. I ust. 15",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      30,
      31
    ]
  },
  {
    "id": "poczatek-porodu",
    "tytul": "Jak rozpoznaje się początek porodu",
    "temat": "porod",
    "tekst": "Początek porodu rozpoznaje się po skurczach, które powodują jego postęp, czyli skracanie i rozwieranie szyjki. Personel odróżnia skurcze przepowiadające od porodowych.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "Początek porodu rozpoznaje się na podstawie czynności skurczowej macicy powodującej postęp porodu (skracanie i rozwieranie szyjki macicy), odróżniając skurcze przepowiadające od właściwych skurczów porodowych.",
        "lok": "cz. VIII ust. 3",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      29,
      34
    ]
  },
  {
    "id": "cztery-okresy-porodu",
    "tytul": "Cztery okresy porodu",
    "temat": "porod",
    "tekst": "I okres trwa od regularnych skurczów do pełnego rozwarcia, II od pełnego rozwarcia do narodzin, III obejmuje oddzielenie i urodzenie łożyska, a IV to dwie godziny po nim.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. I ust. 4 pkt 1",
        "zrodlo": "std-2026"
      },
      {
        "lok": "cz. I ust. 4 pkt 2",
        "zrodlo": "std-2026"
      },
      {
        "lok": "cz. I ust. 4 pkt 3",
        "zrodlo": "std-2026"
      },
      {
        "lok": "cz. I ust. 4 pkt 4",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      34
    ]
  },
  {
    "id": "lewatywa-i-golenie",
    "tytul": "Lewatywa i golenie tylko na życzenie",
    "temat": "porod",
    "tekst": "Przy przyjęciu do porodu lewatywę i golenie owłosienia łonowego wykonuje się wyłącznie na życzenie rodzącej.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "wykonanie lewatywy i zgolenie owłosienia łonowego wyłącznie na życzenie kobiety rodzącej,",
        "lok": "cz. IX ust. 1 pkt 2 lit. m",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      26,
      27
    ]
  },
  {
    "id": "osluchiwanie-serca-dziecka",
    "tytul": "Osłuchiwanie serca dziecka i KTG",
    "temat": "porod",
    "tekst": "W I okresie serce dziecka osłuchuje się co 15 do 30 minut przez co najmniej minutę. Ciągłe monitorowanie kardiografem stosuje się w medycznie uzasadnionych przypadkach, a w sytuacjach wątpliwych co najmniej 30 minut zapisu.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. IX ust. 3 pkt 4",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      34
    ]
  },
  {
    "id": "aktywne-uczestnictwo",
    "tytul": "Aktywny udział w porodzie",
    "temat": "porod",
    "tekst": "Personel informuje o postępie porodu, pomaga wybrać wygodne pozycje, zachęca do korzystania z udogodnień i do mówienia o potrzebach oraz współpracuje z osobą bliską.",
    "zmiana": null,
    "cytaty": [
      {
        "tekst": "aktywizowania kobiety rodzącej do czynnego udziału w porodzie przez: a) informowanie o postępie porodu, b) pomoc w wyborze wygodnych pozycji oraz zachęcanie do stosowania różnych udogodnień i form aktywności, c) zachęcanie do wyrażania swoich potrzeb związanych z porodem, d) współpracę z osobą bliską;",
        "lok": "cz. IX ust. 3 pkt 6",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      30,
      34
    ]
  },
  {
    "id": "brak-postepu-porodu",
    "tytul": "Kiedy mówi się o braku postępu porodu",
    "temat": "porod",
    "tekst": "Brak postępu w I okresie stwierdza się, gdy szyjka nie rozwiera się dalej przez cztery godziny obserwacji. Wtedy do opieki włącza się lekarz położnik.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. IX ust. 2",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      34
    ]
  },
  {
    "id": "czas-drugiego-okresu",
    "tytul": "Ile trwa drugi okres porodu",
    "temat": "porod",
    "tekst": "II okres nie powinien przekroczyć dwóch godzin, a przy analgezji regionalnej trzech. O wydłużeniu decyduje lekarz położnik po ocenie czynników ryzyka.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. X ust. 1",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      34
    ]
  },
  {
    "id": "zaciskanie-pepowiny",
    "tytul": "Kiedy zaciska się pępowinę",
    "temat": "porod",
    "tekst": "Pępowinę zaciska się po ustaniu tętnienia, nie wcześniej niż minutę po narodzinach.",
    "zmiana": null,
    "cytaty": [
      {
        "tekst": "zaciśnięcia pępowiny po ustaniu tętnienia, jednak nie wcześniej niż po upływie jednej minuty od urodzenia się dziecka;",
        "lok": "cz. XI ust. 2 pkt 7",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      26,
      34,
      40
    ]
  },
  {
    "id": "opaski-identyfikacyjne",
    "tytul": "Opaski identyfikacyjne",
    "temat": "porod",
    "tekst": "Przed odpępnieniem dziecko dostaje opaski identyfikacyjne, a mama wcześniej odczytuje i potwierdza zapisane na nich dane. Przy porodzie operacyjnym opaski zakłada się po odpępnieniu, przed wyjściem z sali.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "założenia noworodkowi przed jego odpępnieniem opasek identyfikacyjnych, po wcześniejszym odczytaniu i potwierdzeniu przez matkę zawartych na nich danych",
        "lok": "cz. XI ust. 2 pkt 5",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      40
    ]
  },
  {
    "id": "skora-do-skory",
    "tytul": "Dwie godziny skóra do skóry",
    "temat": "porod",
    "tekst": "Po porodzie dziecko trafia na brzuch mamy i zostaje tam bez przerwy co najmniej dwie godziny, jeśli pozwala na to zdrowie obojga. Przerwać kontakt można tylko na życzenie mamy albo przy zagrożeniu życia lub zdrowia. Dotyczy to także porodu operacyjnego. Gdy mama nie może, kontakt przejmuje ojciec albo inna bliska osoba.",
    "zmiana": "nowe",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. XI ust. 4",
        "zrodlo": "std-2026"
      },
      {
        "lok": "cz. XIII ust. 1 pkt 8",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      26,
      34,
      40,
      49
    ]
  },
  {
    "id": "pierwsze-karmienie",
    "tytul": "Pierwsze karmienie po porodzie",
    "temat": "porod",
    "tekst": "W IV okresie personel asystuje przy pierwszym karmieniu, pokazuje oznaki gotowości dziecka do ssania i cechy prawidłowego przystawienia oraz przekazuje zasady na pierwszą dobę.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "asystowanie przy pierwszym karmieniu piersią, zwrócenie matce uwagi na oznaki gotowości noworodka do podjęcia ssania i cechy prawidłowego przystawienia i ssania oraz przekazanie informacji na temat zasad postępowania w laktacji w pierwszej dobie połogu;",
        "lok": "cz. XII ust. 1 pkt 5",
        "zrodlo": "std-2026"
      },
      {
        "tekst": "nadzoruje pierwsze karmienie piersią,",
        "lok": "cz. XIII ust. 1 pkt 5 lit. c",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      34,
      49
    ]
  },
  {
    "id": "co-najmniej-jedna-metoda-farmakologiczna",
    "tytul": "Każdy szpital zapewnia co najmniej jedną metodę farmakologiczną",
    "temat": "bol",
    "tekst": "Każdy szpital zapewnia rodzącej dostęp do co najmniej jednej farmakologicznej metody łagodzenia bólu spośród wymienionych w standardzie (analgezja wziewna, opioidy dożylnie, analgezja regionalna i miejscowa).",
    "zmiana": "nowe",
    "cytaty": [
      {
        "tekst": "Podmiot leczniczy prowadzący szpital zapewnia kobiecie rodzącej dostęp do co najmniej jednej metody farmakologicznego łagodzenia bólu z metod, o których mowa w ust. 12.",
        "lok": "cz. VII ust. 2",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      33
    ]
  },
  {
    "id": "metody-na-stronie-szpitala",
    "tytul": "Metody łagodzenia bólu na stronie szpitala",
    "temat": "bol",
    "tekst": "Szpital publikuje na swojej stronie internetowej metody łagodzenia bólu, które są u niego dostępne, i aktualizuje tę informację co najmniej raz w roku.",
    "zmiana": "nowe",
    "cytaty": [
      {
        "tekst": "Dostępne metody łagodzenia bólu porodowego podmiot leczniczy udzielający świadczeń zdrowotnych w zakresie opieki okołoporodowej publikuje na swojej stronie internetowej i aktualizuje nie rzadziej niż raz w roku.",
        "lok": "cz. VII ust. 5",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      27,
      33
    ]
  },
  {
    "id": "informacja-o-metodach-przy-przyjeciu",
    "tytul": "Informacja i uzgodnienie metod przy przyjęciu",
    "temat": "bol",
    "tekst": "Przy przyjęciu do porodu rodząca dostaje zrozumiałą informację o przebiegu porodu i metodach łagodzenia bólu dostępnych w szpitalu. Sposób postępowania uzgadnia się z nią, z uwzględnieniem jej zdania.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "Osoby sprawujące opiekę nad kobietą rodzącą uzgadniają z nią sposób postępowania mającego na celu łagodzenie bólu porodowego, z uwzględnieniem stanu klinicznego oraz gradacji metod dostępnych i stosowanych w tym podmiocie, oraz zapewniają kobiecie rodzącej wsparcie w ich zastosowaniu, uwzględniając jej zdanie w tym zakresie.",
        "lok": "cz. VII ust. 4",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [
      {
        "lok": "cz. VII ust. 3",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      33
    ]
  },
  {
    "id": "metody-niefarmakologiczne",
    "tytul": "Niefarmakologiczne metody łagodzenia bólu",
    "temat": "bol",
    "tekst": "Standard wymienia: aktywność i pozycje (spacer, kołysanie, pozycje wertykalne ze sprzętem), techniki oddechowe i relaksację, metody fizjoterapeutyczne (masaż, okłady, TENS), immersję wodną, akupunkturę i akupresurę.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. VII ust. 9",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      30,
      31,
      32
    ]
  },
  {
    "id": "osoba-bliska-a-metody",
    "tytul": "Osoba bliska może stosować metody łagodzenia bólu",
    "temat": "bol",
    "tekst": "Niefarmakologiczne metody łagodzenia bólu stosuje osoba prowadząca poród albo osoba bliska. Dobór metody uzgadnia się z rodzącą.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. VII ust. 10",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      31,
      32
    ]
  },
  {
    "id": "analgezja-regionalna-kiedy",
    "tytul": "Kiedy można rozpocząć analgezję regionalną",
    "temat": "bol",
    "tekst": "Analgezję regionalną rozpoczyna się w I lub II okresie porodu, zgodnie z preferencjami rodzącej, i można ją kontynuować w II i III okresie. Konsultacja anestezjologa odbywa się niezwłocznie, najpóźniej 30 minut od zlecenia.",
    "zmiana": "nowe",
    "cytaty": [
      {
        "tekst": "Analgezję regionalną rozpoczyna się w I lub II okresie porodu zgodnie z preferencjami kobiety rodzącej. Analgezja regionalna powinna być kontynuowana podczas II i III okresu porodu zgodnie z preferencjami kobiety rodzącej.",
        "lok": "cz. VII ust. 21",
        "zrodlo": "std-2026"
      },
      {
        "tekst": "Analgezja regionalna jest poprzedzana konsultacją lekarza anestezjologa przeprowadzaną niezwłocznie na zlecenie lekarza położnika, jednak nie później niż 30 minut od zgłoszenia lekarzowi anestezjologowi takiego zlecenia.",
        "lok": "cz. VII ust. 22",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      33
    ]
  },
  {
    "id": "analgezja-zgoda-pisemna",
    "tytul": "Informacja i pisemna zgoda przed analgezją regionalną",
    "temat": "bol",
    "tekst": "Anestezjolog informuje o przebiegu analgezji, jej wpływie na poród i dziecko oraz o możliwych działaniach niepożądanych. Warunkiem jest pisemna zgoda rodzącej.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. VII ust. 23",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      33
    ]
  },
  {
    "id": "farmakologia-kiedy-wdrazana",
    "tytul": "Kiedy wdraża się metody farmakologiczne",
    "temat": "bol",
    "tekst": "Metody farmakologiczne wdraża się, gdy niefarmakologiczne nie dają oczekiwanego efektu albo są wskazania medyczne. Najpierw lekarz bada, ocenia natężenie bólu i uzyskuje zgodę rodzącej.",
    "zmiana": null,
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. VII ust. 37",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      33
    ]
  },
  {
    "id": "apgar-w-kontakcie",
    "tytul": "Apgar na brzuchu mamy, ważenie po dwóch godzinach",
    "temat": "noworodek",
    "tekst": "Ocena w skali Apgar odbywa się w trakcie kontaktu skóra do skóry, jeśli nie ma przeciwwskazań. Ważenie i mierzenie następuje po zakończeniu dwugodzinnego kontaktu.",
    "zmiana": "nowe",
    "cytaty": [
      {
        "tekst": "ocenia noworodka według skali Apgar; ocena ta powinna być wykonywana w trakcie nieprzerwanego kontaktu skóra do skóry, jeżeli nie występują przeciwwskazania zdrowotne u matki i dziecka,",
        "lok": "cz. XIII ust. 1 pkt 5 lit. b",
        "zrodlo": "std-2026"
      },
      {
        "tekst": "waży i mierzy noworodka po zakończonym dwugodzinnym nieprzerwanym kontakcie matki z dzieckiem,",
        "lok": "cz. XIII ust. 1 pkt 5 lit. e",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      40
    ]
  },
  {
    "id": "procedury-u-noworodka",
    "tytul": "Profilaktyka u zdrowego noworodka",
    "temat": "noworodek",
    "tekst": "U zdrowego noworodka wykonuje się profilaktykę zakażenia oczu, podaje witaminę K i szczepi zgodnie z programem szczepień ochronnych.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. XIII ust. 1 pkt 5 lit. f",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      40,
      45
    ]
  },
  {
    "id": "badanie-noworodka",
    "tytul": "Badanie lekarskie w pierwszych 12 godzinach",
    "temat": "noworodek",
    "tekst": "W ciągu pierwszych 12 godzin lekarz bada noworodka w obecności mamy albo taty. Nie robi tego w trakcie dwugodzinnego kontaktu skóra do skóry, chyba że podejrzewa zagrożenie.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "w okresie pierwszych dwunastu godzin życia noworodka lekarz oddziału neonatologicznego przeprowadza badanie kliniczne noworodka w obecności matki lub ojca; badania tego nie należy wykonywać w okresie, o którym mowa w ust. 1 pkt 8, jeżeli nie występuje podejrzenie zagrożenia życia lub zdrowia noworodka;",
        "lok": "cz. XIII ust. 2 pkt 2",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      40
    ]
  },
  {
    "id": "zgoda-na-zabiegi-u-noworodka",
    "tytul": "Zabiegi u noworodka za zgodą mamy",
    "temat": "noworodek",
    "tekst": "Zabiegi pielęgnacyjne i procedury u zdrowego noworodka wykonuje się po poinformowaniu mamy i za jej zgodą, w jej obecności, jeśli stan zdrowia mamy na to pozwala.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "wszystkie zabiegi pielęgnacyjne i procedury postępowania ze zdrowym noworodkiem są wykonywane u noworodka po przekazaniu informacji matce i uzyskaniu jej zgody zgodnie z przepisami ustawy z dnia 6 listopada 2008 r. o prawach pacjenta i Rzeczniku Praw Pacjenta, w obecności matki w sali „matka z dzieckiem”, o ile stan zdrowia matki na to pozwala;",
        "lok": "cz. XIII ust. 2 pkt 4",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      40,
      44
    ]
  },
  {
    "id": "badania-przesiewowe",
    "tytul": "Badania noworodka na oddziale",
    "temat": "noworodek",
    "tekst": "Na oddziale noworodek ma test pulsoksymetryczny, przesiewowe badanie słuchu, ocenę wędzidełka i jamy ustnej, ocenę ssania, badanie przesiewowe z kropli pobranej na bibułę i obowiązkowe szczepienia po kwalifikacji lekarskiej.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. XIII ust. 2 pkt 6",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      40,
      45,
      46
    ]
  },
  {
    "id": "dokumentacja-noworodka",
    "tytul": "Dokumentacja noworodka przy wypisie",
    "temat": "noworodek",
    "tekst": "W dniu wypisu rodzice dostają dokumentację noworodka: przebieg ciąży i porodu, pomiary, szczepienia, badania przesiewowe, ocenę wędzidełka i ssania, profilaktykę, pobyt i zalecenia.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. XIII ust. 2 pkt 8",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      40,
      45
    ]
  },
  {
    "id": "matka-z-dzieckiem",
    "tytul": "System „matka z dzieckiem”",
    "temat": "noworodek",
    "tekst": "Zdrowy noworodek po pobycie z mamą na sali porodowej trafia razem z nią na oddział w systemie „matka z dzieckiem”.",
    "zmiana": null,
    "cytaty": [
      {
        "tekst": "zdrowy noworodek po pobycie wraz z matką w sali porodowej jest przekazywany do oddziału położniczego zorganizowanego w systemie „matka z dzieckiem”;",
        "lok": "cz. XIII ust. 2 pkt 1",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      40
    ]
  },
  {
    "id": "zgloszenie-porodu-do-poz",
    "tytul": "Szpital zgłasza poród do POZ",
    "temat": "noworodek",
    "tekst": "Szpital do dnia wypisu przekazuje zgłoszenie o porodzie do podstawowej opieki zdrowotnej, żeby mogły rozpocząć się wizyty domowe.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. XIII ust. 2 pkt 10",
        "zrodlo": "std-2026"
      },
      {
        "lok": "cz. XV ust. 6",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      36
    ]
  },
  {
    "id": "laktacja-zgodnie-z-decyzja-mamy",
    "tytul": "Opieka laktacyjna zgodnie z decyzją mamy",
    "temat": "karmienie",
    "tekst": "Opieka laktacyjna odbywa się zgodnie z decyzją mamy o sposobie żywienia. Mama, która nie karmi piersią, dostaje informacje o hamowaniu laktacji, akcesoriach i przygotowaniu mleka modyfikowanego.",
    "zmiana": "nowe",
    "cytaty": [
      {
        "tekst": "Opieka laktacyjna jest sprawowana zgodnie z decyzją matki dotyczącą sposobu żywienia dziecka.",
        "lok": "cz. XIV ust. 2",
        "zrodlo": "std-2026"
      },
      {
        "tekst": "Matce, która podjęła decyzję o niekarmieniu dziecka w sposób naturalny, należy udzielić informacji o metodach hamowania laktacji zgodnie z aktualną wiedzą na temat laktacji, doborze akcesoriów do karmienia oraz sposobie ich używania i preparatach do początkowego żywienia niemowląt, w tym o sposobie ich przygotowania i podawania.",
        "lok": "cz. XIV ust. 8",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      49,
      50,
      51
    ]
  },
  {
    "id": "przygotowanie-do-karmienia",
    "tytul": "Przygotowanie do karmienia już w ciąży",
    "temat": "karmienie",
    "tekst": "W ciąży opieka laktacyjna w POZ obejmuje edukację o znaczeniu karmienia piersią, czynnikach ryzyka wczesnego zakończenia karmienia, inicjacji karmienia w kontakcie skóra do skóry i ocenie jakości karmienia.",
    "zmiana": "nowe",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. XIV ust. 3",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      49
    ]
  },
  {
    "id": "jak-czesto-karmic",
    "tytul": "Jak często karmić w pierwszych dniach",
    "temat": "karmienie",
    "tekst": "Na początku dziecko przystawia się do piersi do kilkunastu razy na dobę. Jeśli się nie budzi, budzi się je po 3 do 4 godzinach od początku ostatniego karmienia; w pierwszej dobie wybudzanie nie jest wymagane.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. XIV ust. 5 pkt 3",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      49,
      50
    ]
  },
  {
    "id": "bez-smoczkow-na-poczatku",
    "tytul": "Smoczki i butelki na początku laktacji",
    "temat": "karmienie",
    "tekst": "W okresie stabilizowania się laktacji nie stosuje się smoczków do uspokajania noworodka ani butelek ze smoczkiem.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "niestosowanie w okresie stabilizowania się laktacji smoczków w celu uspokajania noworodka oraz butelek ze smoczkiem;",
        "lok": "cz. XIV ust. 5 pkt 7",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      49,
      51
    ]
  },
  {
    "id": "odciaganie-przy-rozdzieleniu",
    "tytul": "Odciąganie mleka, gdy mama i dziecko są rozdzieleni",
    "temat": "karmienie",
    "tekst": "Gdy mama i dziecko są rozdzieleni, szpital informuje o stymulacji laktacji, zapewnia sprzęt do pozyskiwania mleka i uczy z niego korzystać. Personel wyjaśnia rolę siary i za zgodą mamy pobiera ją dla dziecka.",
    "zmiana": "nowe",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. XIV ust. 5 pkt 8",
        "zrodlo": "std-2026"
      },
      {
        "lok": "cz. XIV ust. 5 pkt 6",
        "zrodlo": "std-2026"
      },
      {
        "lok": "cz. XIV ust. 4 pkt 4",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      50,
      51
    ]
  },
  {
    "id": "mleko-z-banku",
    "tytul": "Mleko z banku mleka kobiecego",
    "temat": "karmienie",
    "tekst": "Noworodkowi, który nie ma dostępu do mleka mamy, zwłaszcza wcześniakowi, zaleca się mleko z banku mleka kobiecego. Rekomenduje się też stymulację laktacji u mamy.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "zalecenie noworodkowi, który nie ma dostępu do mleka matki biologicznej, w szczególności noworodkowi przedwcześnie urodzonemu, w tym o znacznej niedojrzałości, który nie może być karmiony mlekiem matki biologicznej, podawania mleka z banku mleka kobiecego; rekomendowane jest prowadzenie działań na rzecz stymulacji laktacji u matki noworodka;",
        "lok": "cz. XIV ust. 5 pkt 9",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      50
    ]
  },
  {
    "id": "wsparcie-w-karmieniu-w-szpitalu",
    "tytul": "Wsparcie w karmieniu przez całą dobę",
    "temat": "karmienie",
    "tekst": "W szpitalu wsparcie w karmieniu jest dostępne przez 24 godziny na dobę, a na oddziale pomaga edukator do spraw laktacji. Przed wypisem omawia się wszystkie wątpliwości.",
    "zmiana": "nowe",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. XIV ust. 5 pkt 11",
        "zrodlo": "std-2026"
      },
      {
        "lok": "cz. XIV ust. 5 pkt 15",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      50
    ]
  },
  {
    "id": "mleko-modyfikowane-w-szpitalu",
    "tytul": "Mleko modyfikowane w szpitalu",
    "temat": "karmienie",
    "tekst": "W szpitalu preparat do początkowego żywienia niemowląt podaje się na zlecenie lekarza i zgodnie z decyzją mamy, po rozmowie o takim żywieniu i jego konsekwencjach.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "podawanie preparatów do początkowego żywienia niemowląt wyłącznie na zlecenie lekarza i zgodnie z podjętą decyzją matki, po wcześniejszym udzieleniu jej porady o takim żywieniu",
        "lok": "cz. XIV ust. 5 pkt 12",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      51
    ]
  },
  {
    "id": "karmienie-w-domu",
    "tytul": "Opieka laktacyjna w domu",
    "temat": "karmienie",
    "tekst": "W domu wykwalifikowana specjalistka POZ ocenia karmienie i laktację, zachęca do karmienia, udziela porad, pomaga w trudnościach, prowadzi edukację o odżywianiu mamy i ocenia, jak dziecko przybiera na wadze.",
    "zmiana": "nowe",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. XIV ust. 6",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      50
    ]
  },
  {
    "id": "wizyty-domowe-po-porodzie",
    "tytul": "Co najmniej cztery wizyty domowe",
    "temat": "polog",
    "tekst": "Po porodzie przysługują co najmniej cztery wizyty domowe w ramach podstawowej opieki zdrowotnej. Pierwsza odbywa się najpóźniej w ciągu 48 godzin od zgłoszenia (bez sobót, niedziel i świąt). Jeśli dziecko wraca ze szpitala później, są co najmniej dwie wizyty po jego powrocie.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. XV ust. 7",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      35,
      36,
      44
    ]
  },
  {
    "id": "polog-szesc-tygodni",
    "tytul": "Ile trwa połóg",
    "temat": "polog",
    "tekst": "Połóg zaczyna się po porodzie i trwa sześć tygodni. W tym czasie cofają się zmiany spowodowane ciążą i porodem.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. I ust. 4 pkt 12",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      35,
      36
    ]
  },
  {
    "id": "zakres-wizyt-domowych",
    "tytul": "Czego dotyczą wizyty domowe",
    "temat": "polog",
    "tekst": "Podczas wizyt domowych wykwalifikowana specjalistka POZ doradza w pielęgnacji dziecka, uczy kąpieli i pielęgnacji pępka, informuje o szczepieniach i badaniach oraz doradza w profilaktyce zaburzeń dna miednicy.",
    "zmiana": "nowe",
    "cytaty": [
      {
        "tekst": "udziela porad na temat opieki nad dzieckiem i jego pielęgnacji;",
        "lok": "cz. XV ust. 10 pkt 3",
        "zrodlo": "std-2026"
      },
      {
        "tekst": "udziela instruktażu w zakresie czynności higienicznych u noworodka, w tym techniki kąpieli noworodka, pielęgnowania skóry, pielęgnacji kikuta pępowiny i dna pępka;",
        "lok": "cz. XV ust. 10 pkt 8",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [
      {
        "lok": "cz. XV ust. 10 pkt 9",
        "zrodlo": "std-2026"
      },
      {
        "lok": "cz. XV ust. 10 pkt 12",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      36,
      37,
      44,
      45
    ]
  },
  {
    "id": "wsparcie-dla-osoby-bliskiej-w-pologu",
    "tytul": "Osoba bliska w połogu",
    "temat": "polog",
    "tekst": "Specjalistka POZ ocenia, jakie wsparcie może dać ojciec dziecka lub inna osoba bliska, informuje ją o zmianach fizycznych i emocjonalnych po porodzie i przygotowuje do pomocy.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "ocenia możliwości udzielania kobiecie w połogu pomocy i wsparcia ze strony ojca dziecka lub innej osoby bliskiej;",
        "lok": "cz. XV ust. 10 pkt 5",
        "zrodlo": "std-2026"
      },
      {
        "tekst": "udziela osobie bliskiej informacji na temat zmian fizycznych i reakcji emocjonalnych zachodzących u kobiety w połogu i przygotowuje osobę bliską do udzielenia pomocy i wsparcia kobiecie w połogu oraz wskazuje instytucje, w których osoba bliska może uzyskać stosowną pomoc.",
        "lok": "cz. XV ust. 10 pkt 20",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      36,
      38,
      39
    ]
  },
  {
    "id": "dentysta-i-lekarz-po-polagu",
    "tytul": "Dentysta i lekarz po porodzie",
    "temat": "polog",
    "tekst": "Podczas wizyt domowych dowiecie się o potrzebie wizyty u dentysty do 6. tygodnia od urodzenia dziecka i u lekarza po zakończeniu połogu.",
    "zmiana": "zmienione",
    "cytaty": [
      {
        "tekst": "informuje o potrzebie odbycia wizyty u lekarza dentysty do 6. tygodnia od urodzenia dziecka oraz u lekarza położnika po zakończeniu połogu;",
        "lok": "cz. XV ust. 10 pkt 10",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      36
    ]
  },
  {
    "id": "dno-miednicy",
    "tytul": "Dno miednicy i ruch po porodzie",
    "temat": "polog",
    "tekst": "Opieka w połogu obejmuje porady w profilaktyce zaburzeń dna miednicy i nietrzymania moczu, gazów i stolca oraz instruktaż ćwiczeń. Przy problemach poza tym zakresem można skorzystać z rehabilitacji ze skierowania lekarza.",
    "zmiana": "nowe",
    "cytaty": [
      {
        "tekst": "motywuje do prowadzenia gimnastyki oraz udziela instruktażu odnośnie do kinezyterapii w połogu;",
        "lok": "cz. XV ust. 10 pkt 18",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [
      {
        "lok": "cz. XV ust. 10 pkt 12",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      37
    ]
  },
  {
    "id": "po-wizytach-domowych",
    "tytul": "Co po wizytach domowych",
    "temat": "polog",
    "tekst": "Po wizytach domowych opiekę nad dzieckiem przejmuje pielęgniarka POZ, a opiekę nad mamą, także w karmieniu, kontynuuje podstawowa opieka zdrowotna.",
    "zmiana": "zmienione",
    "cytaty": [],
    "lokalizatory": [
      {
        "lok": "cz. XV ust. 12",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": [
      45
    ]
  },
  {
    "id": "dostepnosc-uslug",
    "tytul": "Dostępność dla kobiet ze szczególnymi potrzebami",
    "temat": "dostepnosc",
    "tekst": "Nowa część XVII: placówki zapewniają między innymi komunikację w polskim języku migowym, stronę zgodną z WCAG 2.1 i dłuższe wizyty dla kobiet ze szczególnymi potrzebami, a także pętle indukcyjne i wstęp dla psa asystującego.",
    "zmiana": "nowe",
    "cytaty": [
      {
        "tekst": "komunikowanie się w polskim języku migowym, na przykład przez wykorzystanie aplikacji online tłumaczących na żywo na polski język migowy i z polskiego języka migowego na język polski;",
        "lok": "cz. XVII ust. 2 pkt 6",
        "zrodlo": "std-2026"
      },
      {
        "tekst": "stronę internetową, która jest dostępna cyfrowo, co oznacza, że jest zgodna ze standardem WCAG 2.1 i ma deklarację dostępności sporządzoną zgodnie z wymogami ustawy z dnia 4 kwietnia 2019 r. o dostępności cyfrowej stron internetowych i aplikacji mobilnych podmiotów publicznych (Dz. U. z 2023 r. poz. 1440);",
        "lok": "cz. XVII ust. 2 pkt 11",
        "zrodlo": "std-2026"
      }
    ],
    "lokalizatory": [
      {
        "lok": "cz. XVII ust. 2 pkt 14",
        "zrodlo": "std-2026"
      }
    ],
    "zrodla": [
      "std-2026"
    ],
    "lekcje": []
  }
];

export const OKRESY: Okres[] = [
  {
    "id": "tyg-1-10",
    "etykieta": "do 10. tygodnia",
    "naglowek": "Do 10. tygodnia ciąży lub w chwili pierwszego zgłoszenia się",
    "od": 1,
    "do": 10,
    "pozycje": [
      {
        "tekst": "Badanie podmiotowe i przedmiotowe",
        "zmiana": null
      },
      {
        "tekst": "Pomiar ciśnienia tętniczego",
        "zmiana": null
      },
      {
        "tekst": "Badanie gruczołów sutkowych",
        "zmiana": null
      },
      {
        "tekst": "Określenie wzrostu, masy ciała i wskaźnika BMI",
        "zmiana": null
      },
      {
        "tekst": "Ocena ryzyka ciążowego",
        "zmiana": null
      },
      {
        "tekst": "Propagowanie zdrowego stylu życia",
        "zmiana": null
      },
      {
        "tekst": "Przekazanie informacji o możliwości wykonania badań w kierunku chorób uwarunkowanych genetycznie",
        "zmiana": null
      },
      {
        "tekst": "Przekazanie informacji o szczepieniach zalecanych w ciąży",
        "zmiana": "nowe"
      },
      {
        "tekst": "Rozmowa o stylu życia, odżywianiu i używkach, w razie potrzeby skierowanie do ośrodka pomocy",
        "zmiana": "zmienione"
      },
      {
        "tekst": "Rozpoczęcie edukacji przedporodowej",
        "zmiana": "nowe"
      },
      {
        "tekst": "Gdy ciążę prowadzi lekarz: skierowanie na edukację przedporodową w podstawowej opiece zdrowotnej",
        "zmiana": "nowe"
      }
    ],
    "badania": {
      "razem": 12,
      "zmiany": 4
    }
  },
  {
    "id": "tyg-11-14",
    "etykieta": "11 do 14",
    "naglowek": "Od 11. do 14. tygodnia ciąży",
    "od": 11,
    "do": 14,
    "pozycje": [
      {
        "tekst": "Badanie podmiotowe i przedmiotowe",
        "zmiana": null
      },
      {
        "tekst": "Pomiar ciśnienia tętniczego",
        "zmiana": null
      },
      {
        "tekst": "Pomiar masy ciała",
        "zmiana": null
      },
      {
        "tekst": "Ocena ryzyka ciążowego",
        "zmiana": null
      },
      {
        "tekst": "Ocena ryzyka i nasilenia objawów depresji",
        "zmiana": null
      },
      {
        "tekst": "Propagowanie zdrowego stylu życia",
        "zmiana": null
      },
      {
        "tekst": "Edukacja przedporodowa",
        "zmiana": "nowe"
      }
    ],
    "badania": {
      "razem": 1,
      "zmiany": 0
    }
  },
  {
    "id": "tyg-15-20",
    "etykieta": "15 do 20",
    "naglowek": "Od 15. do 20. tygodnia ciąży",
    "od": 15,
    "do": 20,
    "pozycje": [
      {
        "tekst": "Badanie podmiotowe i przedmiotowe",
        "zmiana": null
      },
      {
        "tekst": "Pomiar ciśnienia tętniczego",
        "zmiana": null
      },
      {
        "tekst": "Pomiar masy ciała",
        "zmiana": null
      },
      {
        "tekst": "Ocena ryzyka ciążowego",
        "zmiana": null
      },
      {
        "tekst": "Propagowanie zdrowego stylu życia",
        "zmiana": null
      },
      {
        "tekst": "Edukacja przedporodowa",
        "zmiana": "nowe"
      }
    ],
    "badania": {
      "razem": 2,
      "zmiany": 0
    }
  },
  {
    "id": "tyg-18-22",
    "etykieta": "18 do 22",
    "naglowek": "Od 18. do 22. tygodnia ciąży",
    "od": 18,
    "do": 22,
    "pozycje": [],
    "badania": {
      "razem": 1,
      "zmiany": 0
    }
  },
  {
    "id": "tyg-21-26",
    "etykieta": "21 do 26",
    "naglowek": "Od 21. do 26. tygodnia ciąży",
    "od": 21,
    "do": 26,
    "pozycje": [
      {
        "tekst": "Badanie podmiotowe i przedmiotowe",
        "zmiana": null
      },
      {
        "tekst": "Ocena czynności serca płodu",
        "zmiana": null
      },
      {
        "tekst": "Pomiar ciśnienia tętniczego",
        "zmiana": null
      },
      {
        "tekst": "Pomiar masy ciała",
        "zmiana": null
      },
      {
        "tekst": "Ocena ryzyka ciążowego",
        "zmiana": null
      },
      {
        "tekst": "Propagowanie zdrowego stylu życia",
        "zmiana": null
      },
      {
        "tekst": "Edukacja przedporodowa",
        "zmiana": null
      },
      {
        "tekst": "Jeśli nie było jeszcze edukacji w podstawowej opiece zdrowotnej: ponowne skierowanie przez lekarza",
        "zmiana": "nowe"
      }
    ],
    "badania": {
      "razem": 2,
      "zmiany": 1
    }
  },
  {
    "id": "tyg-24-28",
    "etykieta": "24 do 28",
    "naglowek": "Od 24. do 28. tygodnia ciąży",
    "od": 24,
    "do": 28,
    "pozycje": [],
    "badania": {
      "razem": 2,
      "zmiany": 2
    }
  },
  {
    "id": "tyg-27-32",
    "etykieta": "27 do 32",
    "naglowek": "Od 27. do 32. tygodnia ciąży",
    "od": 27,
    "do": 32,
    "pozycje": [
      {
        "tekst": "Badanie podmiotowe i przedmiotowe",
        "zmiana": null
      },
      {
        "tekst": "Ocena czynności serca płodu",
        "zmiana": null
      },
      {
        "tekst": "Pomiar ciśnienia tętniczego",
        "zmiana": null
      },
      {
        "tekst": "Pomiar masy ciała",
        "zmiana": null
      },
      {
        "tekst": "Ocena ryzyka ciążowego",
        "zmiana": null
      },
      {
        "tekst": "Propagowanie zdrowego stylu życia",
        "zmiana": null
      },
      {
        "tekst": "Edukacja przedporodowa z uwzględnieniem analgezji kobiety rodzącej",
        "zmiana": "nowe"
      }
    ],
    "badania": {
      "razem": 4,
      "zmiany": 0
    }
  },
  {
    "id": "tyg-33-37",
    "etykieta": "33 do 37",
    "naglowek": "Od 33. do 37. tygodnia ciąży",
    "od": 33,
    "do": 37,
    "pozycje": [
      {
        "tekst": "Badanie podmiotowe i przedmiotowe",
        "zmiana": null
      },
      {
        "tekst": "Badanie położnicze",
        "zmiana": null
      },
      {
        "tekst": "Ocena czynności serca płodu",
        "zmiana": null
      },
      {
        "tekst": "Pomiar ciśnienia tętniczego",
        "zmiana": null
      },
      {
        "tekst": "Ocena ruchów płodu",
        "zmiana": null
      },
      {
        "tekst": "Badanie gruczołów sutkowych",
        "zmiana": null
      },
      {
        "tekst": "Pomiar masy ciała",
        "zmiana": null
      },
      {
        "tekst": "Ocena ryzyka ciążowego ze wskazaniem zalecanego miejsca odbywania porodu (poziom referencji)",
        "zmiana": null
      },
      {
        "tekst": "Ocena ryzyka i nasilenia objawów depresji",
        "zmiana": null
      },
      {
        "tekst": "Propagowanie zdrowego stylu życia",
        "zmiana": null
      },
      {
        "tekst": "Edukacja przedporodowa",
        "zmiana": "nowe"
      }
    ],
    "badania": {
      "razem": 7,
      "zmiany": 2
    }
  },
  {
    "id": "tyg-38-39",
    "etykieta": "38 do 39",
    "naglowek": "Od 38. do 39. tygodnia ciąży",
    "od": 38,
    "do": 39,
    "pozycje": [
      {
        "tekst": "Badanie podmiotowe i przedmiotowe",
        "zmiana": null
      },
      {
        "tekst": "Badanie położnicze",
        "zmiana": null
      },
      {
        "tekst": "Ocena ruchów płodu",
        "zmiana": null
      },
      {
        "tekst": "Ocena czynności serca płodu",
        "zmiana": null
      },
      {
        "tekst": "Pomiar ciśnienia tętniczego",
        "zmiana": null
      },
      {
        "tekst": "Pomiar masy ciała",
        "zmiana": null
      },
      {
        "tekst": "Ocena ryzyka ciążowego",
        "zmiana": null
      },
      {
        "tekst": "Propagowanie zdrowego stylu życia",
        "zmiana": null
      },
      {
        "tekst": "Edukacja przedporodowa",
        "zmiana": "nowe"
      }
    ],
    "badania": {
      "razem": 3,
      "zmiany": 1
    }
  },
  {
    "id": "tyg-40-42",
    "etykieta": "po 40. tygodniu",
    "naglowek": "Niezwłocznie po 40. tygodniu ciąży",
    "od": 40,
    "do": 42,
    "pozycje": [
      {
        "tekst": "Badanie podmiotowe i przedmiotowe",
        "zmiana": null
      },
      {
        "tekst": "Badanie położnicze",
        "zmiana": null
      },
      {
        "tekst": "Ocena ruchów płodu",
        "zmiana": null
      },
      {
        "tekst": "Pomiar ciśnienia tętniczego",
        "zmiana": null
      },
      {
        "tekst": "Pomiar masy ciała",
        "zmiana": null
      },
      {
        "tekst": "Ocena ryzyka ciążowego",
        "zmiana": null
      },
      {
        "tekst": "Przy prawidłowych wynikach kolejna wizyta po 7 dniach",
        "zmiana": null
      },
      {
        "tekst": "Edukacja przedporodowa",
        "zmiana": "nowe"
      }
    ],
    "badania": {
      "razem": 3,
      "zmiany": 1
    }
  }
];

export const ZRODLA: Zrodlo[] = [
  {
    "id": "std-2026",
    "skrot": "Standard opieki okołoporodowej",
    "tytul": "Standard organizacyjny opieki okołoporodowej (załącznik do rozporządzenia Ministra Zdrowia z 16 sierpnia 2018 r., w brzmieniu nadanym rozporządzeniem z 23 października 2025 r.)",
    "publikacja": "Dz.U. 2025 poz. 1525, ogłoszone 6 listopada 2025 r.",
    "url": "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20250001525"
  },
  {
    "id": "upp",
    "skrot": "Ustawa o prawach pacjenta",
    "tytul": "Ustawa z dnia 6 listopada 2008 r. o prawach pacjenta i Rzeczniku Praw Pacjenta",
    "publikacja": "t.j. Dz.U. 2024 poz. 581, ostatnia zmiana Dz.U. 2026 poz. 791; wersja obowiązująca od 1 lipca 2026 r.",
    "url": "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20090520417"
  },
  {
    "id": "mz-standardy",
    "skrot": "MZ: najważniejsze zmiany",
    "tytul": "Standardy opieki okołoporodowej. Najważniejsze informacje o zmianach wynikających z wejścia w życie znowelizowanego standardu",
    "publikacja": "",
    "url": "https://www.gov.pl/web/zdrowie/standardy-opieki-okoloporodowej"
  },
  {
    "id": "pacjent-2026",
    "skrot": "pacjent.gov.pl: nowe uprawnienia",
    "tytul": "Nowe uprawnienia w opiece okołoporodowej",
    "publikacja": "",
    "url": "https://pacjent.gov.pl/aktualnosc/nowe-uprawnienia-w-opiece-okoloporodowej"
  },
  {
    "id": "rpp-2025",
    "skrot": "RPP: nowe standardy",
    "tytul": "Nowe standardy opieki okołoporodowej: większe wsparcie i podmiotowość kobiety w ciąży",
    "publikacja": "",
    "url": "https://www.gov.pl/web/rpp/nowe-standardy-opieki-okoloporodowej--wieksze-wsparcie-i-podmiotowosc-kobiety-w-ciazy"
  },
  {
    "id": "mz-plan-porodu-i-opieki-poporodowej",
    "skrot": "Plan porodu i opieki poporodowej",
    "tytul": "Plan porodu i opieki poporodowej",
    "publikacja": "",
    "url": "https://www.gov.pl/attachment/160bb524-2ade-4056-8683-2170c40d7c47"
  },
  {
    "id": "mz-swiadczenia",
    "skrot": "MZ: świadczenia bez ubezpieczenia",
    "tytul": "Dzieci, a także kobiety w okresie ciąży, porodu i połogu mają prawo do świadczeń opieki zdrowotnej finansowanych ze środków publicznych",
    "publikacja": "",
    "url": "https://www.gov.pl/web/zdrowie/dzieci-a-takze-kobiety-w-okresie-ciazy-porodu-i-pologu-maja-prawo-do-swiadczen-opieki-zdrowotnej-finansowanych-ze-srodkow-publicznych"
  },
  {
    "id": "rpp-2020",
    "skrot": "RPP: prawa pacjentki i noworodka (2020)",
    "tytul": "Prawa pacjentki i noworodka",
    "publikacja": "",
    "url": "https://www.gov.pl/web/rpp/prawa-pacjentki-i-noworodka"
  }
];
