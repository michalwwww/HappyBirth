import React from 'react';

const PL_MAP: Record<string, string> = {
  ą: 'a',
  ć: 'c',
  ę: 'e',
  ł: 'l',
  ń: 'n',
  ó: 'o',
  ś: 's',
  ź: 'z',
  ż: 'z',
  '\u00A0': ' ',
};

/**
 * Normalizacja 1:1 (zachowuje dokładnie tę samą długość stringa `s.length`),
 * dzięki czemu indeksy dopasowań odpowiadają 1:1 oryginalnemu tekstowi.
 */
export function norm1to1(s: string): string {
  return s.toLowerCase().replace(/[ąćęłńóśźż\u00A0]/g, (c) => PL_MAP[c] || c);
}

/**
 * Normalizacja zapytania i tekstu do wyszukiwania (zamienia też wielokrotne spacje i interpunkcję).
 */
export function normSearch(s: string): string {
  return norm1to1(s)
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOP_WORDS = new Set([
  'a',
  'i',
  'o',
  'u',
  'w',
  'z',
  'na',
  'do',
  'po',
  'od',
  'za',
  'we',
  'ze',
  'ku',
  'dla',
  'jak',
  'co',
  'to',
  'czy',
  'lub',
  'albo',
  'oraz',
  'sie',
]);

/**
 * Grupy synonimów i oboczności tematycznych w języku polskim (już po normSearch).
 * Pozwalają dopasować odmiany z wymianą samogłosek (np. ból/bóle, sen/snu, wózek/wózka,
 * kolka/kolek, butelka/butelek) oraz synonimy (tata/ojciec/partner, oddech/oddychanie).
 */
const SYNONIMY_GRUPY: string[][] = [
  ['tata', 'taty', 'tacie', 'tate', 'ojciec', 'ojca', 'ojcu', 'partner', 'osoba towarzyszaca', 'osoby towarzyszacej'],
  ['oddech', 'oddych', 'oddychanie', 'oddechu', 'oddechowe'],
  ['sen', 'snu', 'snie', 'snem', 'spanie', 'spania', 'bezsennosc', 'zasypian'],
  ['wozek', 'wozka', 'wozki', 'wozku', 'wozkow'],
  ['lozeczko', 'lozeczka', 'lozeczku', 'lozeczkow', 'materac'],
  ['kolka', 'kolki', 'kolek', 'kolce', 'brzuszek'],
  ['butelka', 'butelki', 'butelek', 'karmienie butelka'],
  ['laktator', 'laktatory', 'laktatora', 'odciaganie pokarmu', 'kolektor'],
  ['piers', 'piersi', 'piersia', 'laktacja', 'laktacji', 'przystawienie', 'chwyt'],
  ['kapiel', 'kapieli', 'wanienka', 'wanienki', 'mycie'],
  ['pepek', 'pepka', 'kikut', 'kikuta'],
  ['pieluszka', 'pieluszki', 'pieluch', 'pieluszek', 'przewijanie', 'przewijak'],
  ['noworodek', 'noworodka', 'noworodkow', 'noworodkowa', 'noworodkowe', 'niemowle', 'maluch', 'maluszek'],
  ['bol', 'bole', 'bolu', 'bolow', 'bolach', 'lagodzenie'],
  ['kregoslup', 'kregoslupa', 'plecy', 'plecow', 'miednica', 'miednicy'],
  ['cwiczenia', 'cwiczen', 'cwiczenie', 'fizjoterapia', 'ruch', 'aktywnosc'],
  ['torba', 'torby', 'torbe', 'pakowanie', 'szpital', 'szpitala'],
  ['badania', 'badan', 'badanie', 'kalendarz badan', 'usg', 'morfologia', 'krwi'],
  ['wody', 'wod', 'wody plodowe', 'odejda', 'zwiastuny', 'skurcze'],
  ['pierwsza pomoc', 'rko', 'zakrztuszenie', 'resuscytacja', 'bezpieczenstwo'],
  ['szczepienia', 'szczepienie', 'szczepionki', 'kalendarz szczepien'],
  ['zoltaczka', 'rumien', 'spadek wagi', 'stany przejsciowe'],
  ['ulewanie', 'ciemieniucha', 'potowki'],
  ['polog', 'pologu', 'pologowe', 'regeneracja', 'gojenie', 'baby blues', 'emocje'],
  ['mdlosci', 'nudnosci', 'zgaga', 'dolegliwosci'],
];

/**
 * Wyznacza rdzeń słowa polskiego (po normalizacji bez znaków diakrytycznych)
 * do elastycznego dopasowania odmian (np. "szczepienie" -> "szczepien", "butelki" -> "butelk").
 */
export function rdzenSlowa(token: string): string {
  if (token.length <= 3) return token;
  const koncowki = [
    'owaniem',
    'owania',
    'owanie',
    'owaniu',
    'owych',
    'owymi',
    'owego',
    'owemu',
    'owej',
    'owa',
    'owe',
    'owy',
    'ami',
    'ach',
    'om',
    'ow',
    'iem',
    'ego',
    'emu',
    'ych',
    'ymi',
    'iej',
    'ej',
    'ia',
    'iu',
    'ie',
    'ek',
    'ka',
    'ki',
    'ce',
    'ko',
    'ku',
    'a',
    'e',
    'i',
    'o',
    'u',
    'y',
  ];
  for (const k of koncowki) {
    if (token.endsWith(k) && token.length - k.length >= 4) {
      return token.slice(0, token.length - k.length);
    }
  }
  if (token.length >= 5 && /[aeiouy]$/.test(token)) {
    return token.slice(0, -1);
  }
  return token;
}

/**
 * Zwraca listę wariantów (rdzeni i synonimów) dla pojedynczego słowa zapytania.
 */
export function wariantyTokenu(token: string): string[] {
  const warianty = new Set<string>([token]);
  const r = rdzenSlowa(token);
  if (r.length >= 3) warianty.add(r);

  for (const grupa of SYNONIMY_GRUPY) {
    const pasujeDoGrupy = grupa.some(
      (el) => el === token || (token.length >= 3 && (el.startsWith(token) || token.startsWith(el))) || (r.length >= 4 && el.startsWith(r))
    );
    if (pasujeDoGrupy) {
      for (const el of grupa) {
        warianty.add(el);
        const rel = rdzenSlowa(el);
        if (rel.length >= 3) warianty.add(rel);
      }
    }
  }
  return Array.from(warianty);
}

/**
 * Rozbija zapytanie użytkownika na znaczące tokeny wyszukiwania.
 */
export function tokenizujZapytanie(rawQuery: string): string[] {
  const pelne = normSearch(rawQuery);
  if (!pelne) return [];
  const slowa = pelne.split(' ').filter(Boolean);
  if (slowa.length <= 1) return slowa;
  const znaczace = slowa.filter((s) => !STOP_WORDS.has(s));
  return znaczace.length > 0 ? znaczace : slowa;
}

/**
 * Dodatkowe słowa kluczowe dla lekcji 1..52 w Programie (niewidoczne w DOM,
 * używane wyłącznie przez indeks wyszukiwarki, aby rodzice wpisujący potoczne
 * hasła takie jak "tata", "ojciec", "mdłości", "zgaga", "pępek", "pieluszki",
 * "przewijanie", "oddech", "skurcze" od razu trafiali na właściwą lekcję).
 */
export const DODATKOWE_SLOWO_KLUCZOWE_LEKCJI: Record<number, string> = {
  1: 'wiek ciazy termin porodu mdlosci nudnosci pierwsze objawy dwie kreski',
  2: 'drugi trymestr sluch wzrok ruchy maluszka',
  3: 'trzeci trymestr koncowka ciazy przygotowania',
  4: 'rodzina dziadkowie ogloszenie ciazy',
  5: 'kalkulator ciazy telefon mity ciazowe przesady',
  6: 'kurs online jak ogladac nauka w domu dla dwojga',
  7: 'cialo w ciazy hormony waga skora',
  8: 'wech smak zachcianki zapachy',
  9: 'zgaga mdlosci nudnosci obrzeki opuchlizna skurcze lydek zaparcia zmeczenie',
  10: 'infekcje higiena bielizna',
  11: 'badania krwi mocz usg glukoza krzywa cukrowa morfologia',
  12: 'kiedy do szpitala objawy niepokojace izba przyjec',
  13: 'kopniaki liczenie ruchow ulozenie glowkowe miednicowe',
  14: 'poduszka ciazowa rogal wietrzenie sypialnia',
  15: 'lewy bok bezsennosc zasypianie w ciazy',
  16: 'bol kregoslupa plecow miednicy rwa kulszowa rozciaganie pilka',
  17: 'samolot samochod wakacje sport spacer basen',
  18: 'porzadki dzwiganie chemia domowa',
  19: 'baza isofix pasy bezpieczna podroz autem',
  20: 'gondola spacerowka kola amortyzacja',
  21: 'meble przewijak komoda oswietlenie kacik',
  22: 'posciel spiworek twardosc materaca bezpieczny sen',
  23: 'termometr sol fizjologiczna gaziki krem na odparzenia paznokcie',
  24: 'body pajacyki rozmiar 56 62 pieluszki tetrowe rozek kocyk pranie',
  25: 'stojak wkladka temperatura wody mycie',
  26: 'preferencje porodowe dokument do szpitala prawa rodzącej',
  27: 'lista do szpitala rzeczy dla mamy dla taty dla dziecka dokumenty',
  28: 'plan b przygotowanie na kazda sytuacje sala porodowa',
  29: 'odejscie wod plodowych skurcze porodowe kiedy jechac',
  30: 'oddech oddychanie przepona relaksacja woda prysznic immersja',
  31: 'tata ojciec partner wsparcie masaz plecow pozycje wertykalne pilka',
  32: 'tata ojciec partner chusta masaz relaks',
  33: 'wsparcie medyczne komfort na sali porodowej',
  34: 'fazy porodu pierwszy drugi trzeci czwarty okres kontakt skora do skory',
  35: 'krocze rana higiena po porodzie wietrzenie podklady',
  36: 'krwawienie laktacja a plodnosc nastroj smutek emocje wsparcie',
  37: 'miesnie kegla rozejscie miesnia prostego brzucha blizna powrot do formy',
  38: 'doswiadczenie mamy relacja z porodu',
  39: 'indukcja wywolywanie porodu doswiadczenie mamy',
  40: 'pierwsza doba skora noworodka ocena po urodzeniu',
  41: 'odruch moro ssanie chwytny kichanie czkawka placz',
  42: 'spanie na plecach bez poduszki temperatura w pokoju smoczek',
  43: 'zakrztuszenie zachlysniecie bezdech resuscytacja numer 112',
  44: 'mycie pepka kikut pepowinowy przewijanie pieluszki skora krem',
  45: 'wizyta patronazowa pediatra kalendarz szczepien',
  46: 'adaptacja noworodka waga fizjologiczna',
  47: 'odbijanie po jedzeniu skora glowy oliwka',
  48: 'spacery werandowanie paznokcie ubieranie na cebulke',
  49: 'przystawianie do piersi pozycja klasyczna spod pachy lezaca brodawki',
  50: 'nawal pokarmowy zastoj zapalenie piersi malo pokarmu kryzys laktacyjny',
  51: 'odciaganie przechowywanie mleka mrozenie smoczek butelka',
  52: 'placz wieczorny brzuszek gazy masaz brzuszka noszenie tulenie',
};

/**
 * Sprawdza, czy zapytanie dotyczy konkretnego numeru lekcji (np. "11", "lekcja 11", "#11").
 */
export function rozpoznajNumerLekcji(rawQuery: string): number | null {
  const m = norm1to1(rawQuery)
    .trim()
    .match(/^(?:lekcja|lekcji|lekcje|odcinek|film|nr|#)?\s*0*(\d{1,2})$/);
  if (!m) return null;
  const nr = Number(m[1]);
  return nr >= 1 && nr <= 52 ? nr : null;
}

/**
 * Sprawdza, czy zapytanie dotyczy konkretnego numeru modułu (np. "moduł 4", "modul 4").
 */
export function rozpoznajNumerModulu(rawQuery: string): number | null {
  const m = norm1to1(rawQuery)
    .trim()
    .match(/^modu[lł]\s*0*(\d)$/);
  if (!m) return null;
  const nr = Number(m[1]);
  return nr >= 1 && nr <= 8 ? nr : null;
}

/**
 * Sprawdza, czy znormalizowany tekst zawiera pojedynczy token zapytania (bezpośrednio, po rdzeniu lub synonimie).
 */
export function czyTokenPasuje(normTekst: string, token: string): boolean {
  if (!token) return true;
  if (normTekst.includes(token)) return true;
  const slowaTekstu = normTekst.split(' ').filter(Boolean);
  const warianty = wariantyTokenu(token);
  for (const w of warianty) {
    if (w.includes(' ')) {
      if (normTekst.includes(w)) return true;
      continue;
    }
    if (w.length <= 2) {
      if (slowaTekstu.includes(w)) return true;
    } else {
      if (slowaTekstu.some((s) => s.startsWith(w) || (s.length >= 4 && w.startsWith(s)))) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Sprawdza, czy tekst (wraz z opcjonalnymi słowami kluczowymi) pasuje do pełnego zapytania użytkownika.
 */
export function czyTekstPasuje(rawQuery: string, ...polaTekstowe: (string | undefined)[]): boolean {
  const tokeny = tokenizujZapytanie(rawQuery);
  if (tokeny.length === 0) return true;
  const lacznyTekst = normSearch(polaTekstowe.filter(Boolean).join(' '));
  return tokeny.every((tok) => czyTokenPasuje(lacznyTekst, tok));
}

/**
 * Podświetla w `tekst` wszystkie fragmenty pasujące do zapytania `rawQuery` (wielowyrazowo oraz po rdzeniach słów).
 * Zachowuje 100% oryginalnych znaków i polskich liter z `tekst`.
 */
export function podswietlTekst(tekst: string, rawQuery: string): React.ReactNode {
  const qClean = rawQuery.trim();
  if (!qClean || !tekst) return tekst;

  const n = norm1to1(tekst);
  const przedzialy: [number, number][] = [];

  // 1. Najpierw sprawdź dokładne wystąpienie całej frazy (z tolerancją na twarde spacje)
  const qNorm = norm1to1(qClean).replace(/\s+/g, ' ');
  if (qNorm.length >= 2) {
    let idx = 0;
    while ((idx = n.indexOf(qNorm, idx)) !== -1) {
      let koniec = idx + qNorm.length;
      while (koniec < n.length && /[\p{L}\p{N}]/u.test(n[koniec])) koniec++;
      przedzialy.push([idx, koniec]);
      idx = koniec;
    }
  }

  // 2. Podświetl poszczególne tokeny oraz ich rdzenie/odmiany w tekście
  const tokeny = tokenizujZapytanie(qClean);
  for (const tok of tokeny) {
    if (tok.length < 2) continue;
    const rdzen = rdzenSlowa(tok);
    const wzorce = Array.from(new Set([tok, ...(rdzen.length >= 3 ? [rdzen] : [])]));

    // Szukamy słów w `n`
    const regSlowa = /[\p{L}\p{N}]+/gu;
    let m: RegExpExecArray | null;
    while ((m = regSlowa.exec(n)) !== null) {
      const slowo = m[0];
      const start = m.index;
      const end = start + slowo.length;
      const pasuje = wzorce.some(
        (w) => slowo === w || (w.length >= 3 && slowo.startsWith(w)) || (slowo.length >= 4 && w.startsWith(slowo))
      );
      if (pasuje) {
        przedzialy.push([start, end]);
      }
    }
  }

  if (przedzialy.length === 0) return tekst;

  // Scal nakładające się przedziały
  przedzialy.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  const scalone: [number, number][] = [przedzialy[0]];
  for (let i = 1; i < przedzialy.length; i++) {
    const ost = scalone[scalone.length - 1];
    const biez = przedzialy[i];
    if (biez[0] <= ost[1]) {
      ost[1] = Math.max(ost[1], biez[1]);
    } else {
      scalone.push(biez);
    }
  }

  const czesci: React.ReactNode[] = [];
  let kursor = 0;
  for (const [start, end] of scalone) {
    if (start > kursor) {
      czesci.push(tekst.slice(kursor, start));
    }
    czesci.push(React.createElement('mark', { key: start }, tekst.slice(start, end)));
    kursor = end;
  }
  if (kursor < tekst.length) {
    czesci.push(tekst.slice(kursor));
  }
  return React.createElement(React.Fragment, null, ...czesci);
}
