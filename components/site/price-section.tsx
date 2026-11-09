'use client';

// Zakup na stronie głównej, runda X4 (05.11.2026): moduł według zrzutu z notatkami Macieja,
// w kolorach palety i krojach strony. Runda X5: obie kolumny mają tę samą wysokość i są wypełnione.
//   Lewa kolumna: odznaka, tytuł (jedno zdanie kursywą, jak cytat), lead, karta „Co dokładnie
//   otrzymujesz” (pięć punktów) i karta z położną (cytat, opis, dwa znaczniki).
//   Prawa kolumna: podsumowanie zamówienia: cena z trzema cechami, kod rabatowy i waluta,
//   NIEZBĘDNIK z dopasowaniem pakietu dla rodzących za granicą, dwie wymagane zgody,
//   KUPUJĘ DOSTĘP TERAZ z kwotą, informacja o płatności i dane sprzedawcy.
// Wszystkie przyciski DOŁĄCZ na stronie prowadzą tu, do przycisku zakupu (kotwica #kup).
// Logika płatności jak w gałęzi Michała (main z 04.11.2026): Stripe Checkout przez /api/stripe/checkout
// z tym samym zestawem pól (waluta, wersja pakietu, zgody, kod -10%, atrybucja UTM), kody 100%
// tylko w trybie deweloperskim. Treść obu zgód jest identyczna z zapisem w Stripe (lib/legal-shield.ts).
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import type { Language } from '@/lib/i18n';
import type { HomeCopy } from '@/lib/site-copy';
import { fill } from '@/lib/site-copy';
import {
  is100PercentPromo,
  is10PercentAffiliatePromo,
  activateStudentAccessLocally,
  detectClientOrderBumpEdition,
  GLOBAL_PRICING_CONFIG,
  ORDER_BUMP_GLOBAL_CATALOG,
  type SupportedCurrency,
} from '@/lib/promo';
import { IconUsmiech } from './icons';

const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ad_id', 'fbclid', 'gclid', 'ref'];

function zbierzUtm(): Record<string, string> {
  const wynik: Record<string, string> = {};
  try {
    const q = new URLSearchParams(window.location.search);
    UTM.forEach((k) => {
      const v = q.get(k);
      if (v) { wynik[k] = v; try { sessionStorage.setItem(`hb_${k}`, v); } catch { /* prywatne okno */ } }
    });
    UTM.forEach((k) => {
      if (!wynik[k]) { try { const s = sessionStorage.getItem(`hb_${k}`); if (s) wynik[k] = s; } catch { /* brak */ } }
    });
  } catch { /* brak window */ }
  return wynik;
}

// kwota w groszach (centach) na tekst: pełne kwoty bez końcówki ,00
function kwotaTekst(minor: number, waluta: SupportedCurrency): string {
  const v = minor / 100;
  const calkowita = Number.isInteger(v);
  const pl = (calkowita ? String(v) : v.toFixed(2).replace('.', ',')).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const en = calkowita ? String(v) : v.toFixed(2);
  switch (waluta) {
    case 'gbp': return `£${en}`;
    case 'eur': return `${pl} €`;
    case 'usd': return `$${en}`;
    case 'aud': return `$${en} AUD`;
    case 'aed': return `${en} AED`;
    default: return `${pl} zł`;
  }
}

// kwota z groszami (na przycisku zakupu, jak w projekcie: 489,00 zł)
function kwotaPelna(minor: number, waluta: SupportedCurrency): string {
  const v = minor / 100;
  const pl = v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
  const en = v.toFixed(2);
  switch (waluta) {
    case 'gbp': return `£${en}`;
    case 'eur': return `${pl}\u00A0€`;
    case 'usd': return `$${en}`;
    case 'aud': return `$${en}\u00A0AUD`;
    case 'aed': return `${en}\u00A0AED`;
    default: return `${pl}\u00A0zł`;
  }
}

const WALUTY: SupportedCurrency[] = ['pln', 'gbp', 'eur', 'usd'];


// słowa z liczbą i dywizem (14-dniowego) nie łamią się na dywizie; tekst zgody zostaje bez zmian
function bezLamania(tekst: string): React.ReactNode[] {
  return tekst.split(/(\d+-\p{L}+)/u).map((cz, i) => (i % 2 ? <span className="hb-bez-lamania" key={i}>{cz}</span> : cz));
}

// wersje Niezbędnika (dawniej Pakiet PORODÓWKA) dla rodzących za granicą, w kolejności z przełącznika Michała
const EDYCJE: { key: string; pl: string; en: string; ru: string }[] = [
  { key: 'pl', pl: 'Polska', en: 'Poland', ru: 'Польша' },
  { key: 'pl-uk', pl: 'Polki w UK i Irlandii (PL↔EN)', en: 'Polish mums in the UK and Ireland (PL↔EN)', ru: 'Польки в Великобритании и Ирландии (PL↔EN)' },
  { key: 'pl-de', pl: 'Polki w Niemczech, Austrii i Szwajcarii (PL↔DE)', en: 'Polish mums in Germany, Austria and Switzerland (PL↔DE)', ru: 'Польки в Германии, Австрии и Швейцарии (PL↔DE)' },
  { key: 'pl-nl', pl: 'Polki w Holandii (PL↔NL)', en: 'Polish mums in the Netherlands (PL↔NL)', ru: 'Польки в Нидерландах (PL↔NL)' },
  { key: 'en-us', pl: 'USA i Kanada', en: 'USA and Canada', ru: 'США и Канада' },
  { key: 'en-au', pl: 'Australia', en: 'Australia', ru: 'Австралия' },
  { key: 'en-ae', pl: 'Dubaj i ZEA', en: 'Dubai and UAE', ru: 'Дубай и ОАЭ' },
  { key: 'es', pl: 'Hiszpania i Ameryka Łacińska', en: 'Spain and Latin America', ru: 'Испания и Латинская Америка' },
  { key: 'pt-br', pl: 'Brazylia', en: 'Brazil', ru: 'Бразилия' },
];

export function PriceSection({ t, lang }: { t: HomeCopy['cena']; lang: Language }) {
  const [zgodaReg, setZgodaReg] = useState(false);
  const [zgodaArt38, setZgodaArt38] = useState(false);
  const [brakZgod, setBrakZgod] = useState(false);
  const [bump, setBump] = useState(false);
  const [waluta, setWaluta] = useState<SupportedCurrency>('pln');
  const [edycja, setEdycja] = useState<string | null>(null);
  const [smart, setSmart] = useState(() => detectClientOrderBumpEdition({ countryCode: 'PL', uiLang: 'pl' }));
  const [kod, setKod] = useState('');
  const [aktywny, setAktywny] = useState<string | null>(null);
  const [rabat, setRabat] = useState<0 | 10 | 100>(0);
  // kod spoza wzorców z lib/promo.ts (np. kod polecający z bazy): sprawdza go serwer przy płatności
  const [oczekujacy, setOczekujacy] = useState<string | null>(null);
  const [kodBlad, setKodBlad] = useState<string | null>(null);
  const [otwarty, setOtwarty] = useState<'kod' | 'waluta' | 'pakiet' | null>(null);
  const [blad, setBlad] = useState<string | null>(null);
  const [ladowanie, setLadowanie] = useState(false);

  // wersja pakietu: wybór ręczny, zapisany wybór albo kraj z ciasteczka Cloudflare i strefy czasowej
  useEffect(() => {
    let zapis: string | null = null;
    try { zapis = localStorage.getItem('hb_order_bump_edition_override'); } catch { /* brak pamięci */ }
    const wynik = detectClientOrderBumpEdition({ uiLang: lang, manualEditionOverride: edycja || zapis });
    setSmart(wynik);
    try { localStorage.setItem('hb_detected_edition', wynik.editionKey); } catch { /* brak pamięci */ }
  }, [lang, edycja]);

  // Kod: wzorce z lib/promo.ts dają od razu cenę z rabatem (10%, a w trybie deweloperskim 100%).
  // Inny kod nie jest odrzucany, bo serwer zna też kody z bazy (afiliacja, polecenia): idzie do
  // sprawdzenia przy płatności. Zwraca kod, który trafi do /api/stripe/checkout.
  const ocenKod = useCallback((surowy: string): string => {
    const c = surowy.trim().toUpperCase();
    setKodBlad(null);
    if (!c) { setAktywny(null); setRabat(0); setOczekujacy(null); return ''; }
    if (is10PercentAffiliatePromo(c)) { setAktywny(c); setRabat(10); setOczekujacy(null); return c; }
    if (is100PercentPromo(c)) { setAktywny(c); setRabat(100); setOczekujacy(null); return c; }
    setAktywny(null);
    setRabat(0);
    setOczekujacy(c);
    fetch(`/api/affiliate/dashboard?validate_code=${encodeURIComponent(c)}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.valid && d?.discountPercent === 10) {
          setAktywny(c);
          setRabat(10);
          setOczekujacy(null);
        }
      })
      .catch(() => {});
    return c;
  }, []);

  // kod z adresu (?promo=KOD), np. z linku położnej
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search).get('promo');
      if (!p) return;
      setKod(p.trim().toUpperCase());
      setOtwarty('kod');
      ocenKod(p);
    } catch { /* brak window */ }
  }, [ocenKod]);

  // powrót przyciskiem Wstecz ze strony płatności (strona z pamięci przeglądarki): przycisk znów aktywny
  useEffect(() => {
    const wroc = (e: PageTransitionEvent) => { if (e.persisted) setLadowanie(false); };
    window.addEventListener('pageshow', wroc);
    return () => window.removeEventListener('pageshow', wroc);
  }, []);

  const cfg = GLOBAL_PRICING_CONFIG[waluta] || GLOBAL_PRICING_CONFIG.pln;
  const kursMinor = rabat === 100 ? 0 : rabat === 10 ? cfg.discounted10MinorUnits : cfg.baseMinorUnits;
  const bumpMinor = cfg.orderBumpMinorUnits;
  const zBumpem = bump && rabat !== 100;
  const razemMinor = kursMinor + (zBumpem ? bumpMinor : 0);
  const bumpCena = kwotaTekst(bumpMinor, waluta);

  const nazwaRynku = (key: string) => {
    const e = EDYCJE.find((x) => x.key === key);
    return e ? e[lang] || e.pl : ORDER_BUMP_GLOBAL_CATALOG[key]?.targetMarket || key;
  };
  const zagraniczna = smart.editionKey !== 'pl';

  const zastosuj = () => {
    if (!kod.trim()) { setKodBlad(t.kod.pusty); return; }
    ocenKod(kod);
  };

  const usunKod = () => { setAktywny(null); setRabat(0); setOczekujacy(null); setKod(''); setKodBlad(null); };

  const wybierzEdycje = (key: string) => {
    setEdycja(key);
    try {
      localStorage.setItem('hb_order_bump_edition_override', key);
      localStorage.setItem('hb_detected_edition', key);
    } catch { /* brak pamięci */ }
  };

  const kup = async () => {
    if (ladowanie) return;
    setBlad(null);
    if (!zgodaReg || !zgodaArt38) {
      setBrakZgod(true);
      setBlad(t.bladZgody);
      document.getElementById(!zgodaReg ? 'hb-zgoda-reg' : 'hb-zgoda-art38')?.focus();
      return;
    }
    setBrakZgod(false);
    // kod wpisany, ale niezastosowany, oceniamy teraz; wysyłamy tylko kod widoczny w polu
    const c = aktywny || oczekujacy || ocenKod(kod);
    if (is100PercentPromo(c) && c !== 'VIP100') {
      activateStudentAccessLocally(c, bump);
      window.location.href = `/strefa?session_id=promo_test_100&payment=success&promo=${encodeURIComponent(c)}`;
      return;
    }
    // dostęp do Niezbędnika odblokowuje strefa po potwierdzeniu płatności (verify-session, /api/auth/me)
    try {
      setLadowanie(true);
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: 'kurs-glowny-happybirth',
          currency: waluta,
          orderBumpEdition: smart.editionKey,
          utm: { ...zbierzUtm(), order_bump_edition: smart.editionKey },
          promoCode: c || undefined,
          includeOrderBump: bump,
          termsAccepted: true,
          waiverArt38Accepted: true,
          // strona płatności Stripe po angielsku albo rosyjsku dla wersji EN i RU; PL bez zmian (język z waluty)
          ...(lang !== 'pl' ? { locale: lang } : {}),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data && data.url) { window.location.href = data.url; return; }
      if (res.status === 400 && c) {
        // serwer odrzucił kod: pokazujemy pole kodu z przyciskiem Usuń kod
        setOtwarty('kod');
        setKodBlad(t.kod.blad);
        setBlad(t.kod.blad);
      } else {
        setBlad((data && data.error) || t.bladPlatnosci);
      }
    } catch {
      setBlad(t.bladPolaczenia);
    }
    setLadowanie(false);
  };

  const [przed, regulamin, srodek, polityka, po] = t.zgodaRegulamin;
  const przelacz = (co: 'kod' | 'waluta' | 'pakiet') => setOtwarty((o) => (o === co ? null : co));

  return (
    <div className="hb-oferta">
      {/* LEWA KOLUMNA: co i od kogo */}
      <div className="hb-oferta-lewa">
        <p className="hb-oferta-odznaka"><i aria-hidden="true" />{t.odznaka}</p>
        <h3 className="hb-oferta-tytul">{t.tytul}</h3>
        <p className="hb-oferta-lead">{t.lead}</p>

        <div className="hb-oferta-karta hb-pakiet">
          <div className="hb-karta-glowa">
            <p className="hb-karta-tyt hb-akcent">{fill(t.pakietTyt, { cena: kwotaTekst(cfg.baseMinorUnits, waluta) })}</p>
          </div>
          <ul className="hb-pakiet-lista">
            {t.pakiet.map((p) => (
              <li key={p.t}>
                <i aria-hidden="true" className="hb-ptaszek" />
                <span><b>{p.t}</b><span>{p.o}</span></span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hb-oferta-karta hb-dosw">
          <figure className="hb-oferta-foto">
            <img
              alt={t.fotoAlt}
              height={543}
              loading="lazy"
              sizes="(max-width: 560px) 116px, 150px"
              src="/img/onas-4-notes-640.webp"
              srcSet="/img/onas-4-notes-640.webp 640w, /img/onas-4-notes-960.webp 960w"
              width={960}
            />
            <figcaption className="hb-od-roku">{t.odRoku}</figcaption>
          </figure>
          <div className="hb-dosw-tresc">
            <p className="hb-dosw-cytat">„{t.cytat}”</p>
            <p className="hb-dosw-opis">{t.doswOpis}</p>
            <ul className="hb-dosw-chipy">
              {t.chipy.map((c) => <li key={c}><i aria-hidden="true" className="hb-ptaszek hb-ptaszek-maly" />{c}</li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* PRAWA KOLUMNA: podsumowanie zamówienia */}
      <div className="hb-oferta-karta hb-podsumowanie">
        <div className="hb-karta-glowa">
          <p className="hb-karta-tyt">{t.podsumowanie}</p>
          <p className="hb-karta-znak hb-akcent">{t.brutto}</p>
        </div>

        <div className="hb-cena-wiersz">
          <p aria-live="polite" className="hb-kwota">{kwotaTekst(razemMinor, waluta)}</p>
          <ul className="hb-cena-cechy">
            {t.cenaOpis.map((c, i) => (i === 0 ? <li key={c}><b>{c}</b></li> : <li key={c}>{c}</li>))}
          </ul>
        </div>
        {zBumpem && <p className="hb-kwota-notka">{fill(t.razem, { kurs: kwotaTekst(kursMinor, waluta), bump: bumpCena })}</p>}
        {rabat === 10 && (
          <p className="hb-kwota-notka">
            {fill(t.kod.regularna, { cena: kwotaTekst(cfg.baseMinorUnits, waluta) })}{' '}
            {fill(t.kod.omnibus, { cena: kwotaTekst(cfg.baseMinorUnits, waluta) })}
          </p>
        )}

        <div className="hb-oferta-opcje">
          <button aria-controls="hb-panel-kod" aria-expanded={otwarty === 'kod'} className="hb-btn hb-maly-btn hb-btn-szklane hb-opcja" onClick={() => przelacz('kod')} type="button">
            <i aria-hidden="true" className="hb-kropka" />{t.kod.pytanie}<i aria-hidden="true" className="hb-szewron" />
          </button>
          <button aria-controls="hb-panel-waluta" aria-expanded={otwarty === 'waluta'} className="hb-btn hb-maly-btn hb-btn-szklane hb-opcja" onClick={() => przelacz('waluta')} type="button">
            <i aria-hidden="true" className="hb-kropka" />{t.waluta.pytanie}<i aria-hidden="true" className="hb-szewron" />
          </button>
        </div>

        {otwarty === 'kod' && (
          <div className="hb-oferta-panel" id="hb-panel-kod">
            <div className="hb-kod-wiersz">
              <label className="hb-sr" htmlFor="hb-kod">{t.kod.pytanie}</label>
              <input
                autoComplete="off"
                id="hb-kod"
                onChange={(e) => setKod(e.target.value.toUpperCase())}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); zastosuj(); } }}
                placeholder={t.kod.placeholder}
                type="text"
                value={kod}
              />
              <button className="hb-btn hb-btn-noc" onClick={zastosuj} type="button">{t.kod.zastosuj}</button>
            </div>
            {aktywny && <p className="hb-komunikat hb-ok" role="status">{fill(rabat === 100 ? t.kod.okZero : t.kod.ok, { kod: aktywny })}</p>}
            {oczekujacy && !kodBlad && <p className="hb-komunikat hb-info" role="status">{fill(t.kod.sprawdzimy, { kod: oczekujacy })}</p>}
            {kodBlad && <p className="hb-komunikat hb-blad" role="alert">{kodBlad}</p>}
            {kod.trim() && <button className="hb-link hb-usun-kod" onClick={usunKod} type="button">{t.kod.usun}</button>}
          </div>
        )}

        {otwarty === 'waluta' && (
          <div className="hb-oferta-panel" id="hb-panel-waluta">
            <p className="hb-panel-tyt">{t.waluta.tyt}</p>
            <div className="hb-wybor" role="group" aria-label={t.waluta.tyt}>
              {WALUTY.map((w) => (
                <button aria-pressed={waluta === w} className="hb-szklo" key={w} onClick={() => setWaluta(w)} type="button">{w.toUpperCase()}</button>
              ))}
            </div>
          </div>
        )}

        {/* NIEZBĘDNIK (order bump, domyślnie odznaczony) w wyróżnionej karcie */}
        <div className="hb-bump-karta">
          <div className="hb-bump-gora">
            <span className="hb-bump-dodatek">{fill(t.bump.dodatek, { cena: bumpCena })}</span>
            <button aria-controls="hb-panel-pakiet" aria-expanded={otwarty === 'pakiet'} className="hb-link hb-bump-zagranica" onClick={() => przelacz('pakiet')} type="button">
              {t.bump.zagranica}<i aria-hidden="true" className="hb-szewron" />
            </button>
          </div>
          {otwarty === 'pakiet' && (
            <div className="hb-oferta-panel" id="hb-panel-pakiet">
              <p className="hb-panel-tyt">{t.zagranica.pakiet}</p>
              <div className="hb-wybor" role="group" aria-label={t.zagranica.pakiet}>
                {EDYCJE.map((e) => (
                  <button aria-pressed={smart.editionKey === e.key} className="hb-szklo" key={e.key} onClick={() => wybierzEdycje(e.key)} type="button">{e[lang] || e.pl}</button>
                ))}
              </div>
            </div>
          )}
          <label className="hb-bump">
            <input checked={bump} onChange={(e) => setBump(e.target.checked)} type="checkbox" />
            <span className="hb-bump-tresc">
              <span className="hb-bump-nazwa"><b>{t.bump.nazwa}</b> <span>{fill(t.bump.dodaj, { cena: bumpCena })}</span></span>
              <span className="hb-bump-opis">
                {zagraniczna ? fill(t.bump.wersja, { rynek: nazwaRynku(smart.editionKey), tytul: smart.checkoutTitlePl }) : t.bump.opis}
              </span>
            </span>
          </label>
          {zagraniczna && otwarty !== 'pakiet' && (
            <p className="hb-panel-notka">{fill(t.zagranica.dopasowano, { rynek: nazwaRynku(smart.editionKey) })}</p>
          )}
        </div>

        {/* dwie wymagane zgody; treść identyczna z zapisem w Stripe, gwiazdka tylko wizualnie
            i zawsze przy ostatnim słowie (twarda spacja) */}
        <p className="hb-zgody-tyt hb-akcent">{t.zgodyTyt}</p>
        <div className="hb-oferta-zgody">
          <label className="hb-zgoda hb-zgoda-glowna">
            <input
              aria-invalid={brakZgod && !zgodaReg ? true : undefined}
              aria-required="true"
              checked={zgodaReg}
              id="hb-zgoda-reg"
              onChange={(e) => { setZgodaReg(e.target.checked); if (e.target.checked && zgodaArt38) { setBrakZgod(false); setBlad(null); } }}
              type="checkbox"
            />
            <span>
              {przed}
              <Link href="/regulamin" rel="noopener" target="_blank">{regulamin}</Link>
              {srodek}
              <Link href="/polityka-prywatnosci" rel="noopener" target="_blank">{polityka}</Link>
              {po}
              <span aria-hidden="true" className="hb-gwiazdka">{'\u00A0*'}</span>
              <span className="hb-sr"> ({t.wymagane})</span>
            </span>
          </label>
          <label className="hb-zgoda">
            <input
              aria-invalid={brakZgod && !zgodaArt38 ? true : undefined}
              aria-required="true"
              checked={zgodaArt38}
              id="hb-zgoda-art38"
              onChange={(e) => { setZgodaArt38(e.target.checked); if (e.target.checked && zgodaReg) { setBrakZgod(false); setBlad(null); } }}
              type="checkbox"
            />
            <span>
              {bezLamania(t.zgodaArt38)}
              <span aria-hidden="true" className="hb-gwiazdka">{'\u00A0*'}</span>
              <span className="hb-sr"> ({t.wymagane})</span>
            </span>
          </label>
        </div>

        <div className="hb-zakup-cel" id="kup">
          <button className="hb-btn hb-btn-zakup" disabled={ladowanie} onClick={kup} type="button">
            {ladowanie || rabat === 100 ? (
              <span>{ladowanie ? t.ladowanie : t.kupZero}</span>
            ) : (
              <span className="hb-kup-napis">
                <span>{t.kup}</span>
                <span aria-hidden="true" className="hb-kup-kropka"> · </span>
                <span className="hb-kup-kwota">{kwotaPelna(razemMinor, waluta)}</span>
              </span>
            )}
            {!ladowanie && <span aria-hidden="true" className="hb-btn-ikona"><IconUsmiech className="hb-usmiech" /></span>}
          </button>
        </div>
        {blad && <p className="hb-komunikat hb-blad" role="alert">{blad}</p>}
        <p className="hb-platnosc"><i aria-hidden="true" className="hb-kropka" />{waluta === 'pln' ? t.platnosc : t.platnoscZagranica}</p>
        <p className="hb-sprzedawca">{t.sprzedawca}</p>
      </div>
    </div>
  );
}
