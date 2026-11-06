'use client';

// Program kursu v3: spis 52 lekcji ułożony jak dobry sylabus.
// Wyszukiwarka bez polskich znaków (kapiel znajdzie kąpiel), filtr czterech pasm, moduły jako
// rozwijane karty z liczbą lekcji i czasem, linki głębokie #modul-N i #lekcja-N.
// Poprawki z 13.10.2026:
// 1. Szukanie i filtry w jednej linii, jako jeden moduł. Pod nim, po prawej, sam przycisk „Rozwiń wszystko”;
//    po rozwinięciu w tym samym miejscu stoi mały napis „Zwiń wszystko”.
// 2. Bez stałej linii z podsumowaniem pod filtrami (liczba trafień pokazuje się tylko przy szukaniu, po lewej).
// 3. Przy każdym module i każdej lekcji przycisk Odtwórz przed czasem trwania. Prowadzi do filmu
//    w strefie kursu (/strefa/lekcja/lekcja-NN, numeracja 1:1 z lib/course-data.ts). Bez dostępu
//    na tym urządzeniu pokazuje okienko z zakupem i zapamiętuje lekcję w sessionStorage
//    (hb_lekcja_po_zakupie), a strefa po płatności otwiera właśnie ją.
// Poprawki z 04.11.2026: grupy nazwane jak pięć obszarów osi czasu na stronie głównej (Dwie kreski,
// Złoty trymestr, Czas przygotowań, Dzień narodzin, Pierwszy rok), bez zakresów tygodni w tytułach,
// bez etykiet „Moduł N” i numerów modułów, przyciski odtwarzania jako sam znak play, mocniejsza
// hierarchia: grupa, moduł (tytuł, opis, liczba lekcji i czas), lekcje.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LEKCJE, MODULY } from '@/lib/program-data';
import { HOME, type StageId } from '@/lib/site-copy';
import { IconLupa, IconZamknij } from './icons';

// Moduły w pięciu obszarach osi czasu; nazwy obszarów bierzemy z osi na stronie głównej.
const MODULY_W_OBSZARACH: Record<StageId, number[]> = { p1: [1, 2], p2: [3], p3: [4], pn: [5], p4: [6, 7, 8] };
type Grupa = { id: StageId; nazwa: string; moduly: number[] };
const GRUPY: Grupa[] = HOME.pl.mapa.etapy.map((e) => ({ id: e.id, nazwa: e.tytul, moduly: MODULY_W_OBSZARACH[e.id] }));
const modulySlowo = (n: number) => (n === 1 ? 'moduł' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'moduły' : 'modułów');

const PL: Record<string, string> = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' };
const norm = (s: string) => s.toLowerCase().replace(/[ąćęłńóśźż]/g, (c) => PL[c] || c);
const czas = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
const minuty = (s: number) => `${Math.round(s / 60)} min`;
const paucal = (n: number) => n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20);
const lekcjiSlowo = (n: number) => (n === 1 ? 'lekcja' : paucal(n) ? 'lekcje' : 'lekcji');
const idLekcji = (nr: number) => `lekcja-${String(nr).padStart(2, '0')}`;
const adresLekcji = (nr: number) => `/strefa/lekcja/${idLekcji(nr)}`;

export const KLUCZ_LEKCJI_PO_ZAKUPIE = 'hb_lekcja_po_zakupie';

// Dostęp na tym urządzeniu: te same znaczniki, które zapisują zakup i kod (lib/promo.ts) oraz logowanie.
function maDostep(): boolean {
  try {
    const rola = localStorage.getItem('hb_current_role');
    return localStorage.getItem('hb_unlocked') === 'true' || rola === 'student' || rola === 'partner';
  } catch {
    return false;
  }
}

type Wybor = { nr: number; tytul: string } | null;

function Podswietl({ tekst, q }: { tekst: string; q: string }) {
  if (!q) return <>{tekst}</>;
  const n = norm(tekst);
  const czesci: React.ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (q && (k = n.indexOf(q, i)) !== -1) {
    if (k > i) czesci.push(tekst.slice(i, k));
    czesci.push(<mark key={k}>{tekst.slice(k, k + q.length)}</mark>);
    i = k + q.length;
  }
  czesci.push(tekst.slice(i));
  return <>{czesci}</>;
}

function Odtworz({ nr, tytul, opis, onWybierz }: { nr: number; tytul: string; opis: string; onWybierz: (w: Wybor) => void }) {
  return (
    <a
      className="hb-szklo hb-play hb-graj"
      href={adresLekcji(nr)}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (maDostep()) return;
        e.preventDefault();
        onWybierz({ nr, tytul });
      }}
    >
      <i aria-hidden="true" />
      <span className="hb-sr">Odtwórz {opis}</span>
    </a>
  );
}

function OknoZakupu({ wybor, onZamknij }: { wybor: Wybor; onZamknij: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (wybor && !d.open) d.showModal();
    if (!wybor && d.open) d.close();
  }, [wybor]);

  return (
    <dialog
      aria-labelledby="okno-lekcja-tyt"
      className="hb-okno"
      onClick={(e) => { if (e.target === e.currentTarget) onZamknij(); }}
      onClose={onZamknij}
      ref={ref}
    >
      {wybor && (
        <div className="hb-okno-in">
          <button aria-label="Zamknij" className="hb-okno-x" onClick={onZamknij} type="button"><IconZamknij /></button>
          <p className="hb-okno-nr">Lekcja {wybor.nr}</p>
          <h2 id="okno-lekcja-tyt">{wybor.tytul}</h2>
          <p>Ta lekcja jest częścią kursu. Po zakupie przejdziesz prosto do niej.</p>
          <p className="hb-maly">52 lekcje, 489 zł jednorazowo, dostęp dla dwojga na 18 miesięcy od zakupu.</p>
          <div className="hb-okno-akcje">
            <a
              className="hb-btn hb-btn-kup"
              href="/#kup"
              onClick={() => { try { sessionStorage.setItem(KLUCZ_LEKCJI_PO_ZAKUPIE, idLekcji(wybor.nr)); } catch { /* prywatne okno */ } }}
            >
              Dołącz teraz · 489 zł
            </a>
            <a className="hb-okno-link" href={adresLekcji(wybor.nr)}>Mam już dostęp, przejdź do lekcji</a>
          </div>
        </div>
      )}
    </dialog>
  );
}

export function ProgramExplorer() {
  const [q, setQ] = useState('');
  const [pasmo, setPasmo] = useState<StageId | 'all'>('all');
  const [otwarte, setOtwarte] = useState<Set<number>>(new Set([1]));
  const [wybor, setWybor] = useState<Wybor>(null);

  const fraza = norm(q.trim());

  useEffect(() => {
    const otworzZHash = () => {
      const h = window.location.hash;
      const m = h.match(/^#(modul|lekcja)-(\d+)$/);
      if (!m) return;
      const nr = Number(m[2]);
      const modul = m[1] === 'modul' ? nr : LEKCJE.find((l) => l.nr === nr)?.modul;
      if (!modul) return;
      setPasmo('all');
      setOtwarte((o) => new Set([...o, modul]));
      window.setTimeout(() => document.getElementById(h.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
    };
    otworzZHash();
    window.addEventListener('hashchange', otworzZHash);
    return () => window.removeEventListener('hashchange', otworzZHash);
  }, []);

  const widok = useMemo(() => {
    return GRUPY.filter((g) => pasmo === 'all' || g.id === pasmo).map((g) => ({
      pasmo: g,
      moduly: MODULY.filter((m) => g.moduly.includes(m.nr)).map((m) => {
        const lekcje = LEKCJE.filter((l) => l.modul === m.nr);
        const trafModul = !!fraza && (norm(m.nazwa).includes(fraza) || norm(m.opis).includes(fraza));
        const traf = fraza ? lekcje.filter((l) => norm(l.tytul).includes(fraza)) : lekcje;
        return { modul: m, lekcje: fraza && !trafModul ? traf : lekcje, widoczny: !fraza || trafModul || traf.length > 0 };
      }).filter((x) => x.widoczny),
    })).filter((g) => g.moduly.length > 0);
  }, [pasmo, fraza]);

  const znalezione = widok.reduce((a, g) => a + g.moduly.reduce((b, m) => b + m.lekcje.length, 0), 0);
  const wszystkieOtwarte = MODULY.every((m) => otwarte.has(m.nr));

  const przelacz = (nr: number) => setOtwarte((o) => { const n = new Set(o); if (n.has(nr)) n.delete(nr); else n.add(nr); return n; });

  return (
    <div>
      <div className="hb-pasek-narz hb-pasek-program" role="search">
        <div className="hb-szukaj">
          <IconLupa />
          <label className="hb-sr" htmlFor="szukaj-lekcji">Szukaj tematu lekcji</label>
          <input id="szukaj-lekcji" onChange={(e) => setQ(e.target.value)} placeholder="Szukaj tematu" type="search" value={q} />
        </div>
        <div aria-label="Etap" className="hb-chipy" role="group">
          <button aria-pressed={pasmo === 'all'} className="hb-szklo hb-chip" onClick={() => setPasmo('all')} type="button">Wszystkie</button>
          {GRUPY.map((g) => (
            <button aria-pressed={pasmo === g.id} className={`hb-szklo hb-chip ${g.id}`} key={g.id} onClick={() => setPasmo(g.id)} type="button">
              <i aria-hidden="true" />{g.nazwa}
            </button>
          ))}
        </div>
      </div>

      <div className="hb-narz-dol">
        <p aria-live="polite" className="hb-podsum">
          {fraza ? <span><b>{znalezione}</b> {lekcjiSlowo(znalezione)} {paucal(znalezione) ? 'pasują' : 'pasuje'} do „{q.trim()}”</span> : null}
        </p>
        <div className="hb-rozwin">
          {wszystkieOtwarte
            ? <button className="hb-zwin" onClick={() => setOtwarte(new Set())} type="button">Zwiń wszystko</button>
            : <button className="hb-szklo hb-chip" onClick={() => setOtwarte(new Set(MODULY.map((m) => m.nr)))} type="button">Rozwiń wszystko</button>}
        </div>
      </div>

      {widok.length === 0 && <p className="hb-brak">Nie ma lekcji o tym temacie. Spróbujcie innego słowa albo wyczyśćcie wyszukiwanie.</p>}

      {widok.map(({ pasmo: p, moduly }) => {
        const wszystkie = MODULY.filter((m) => p.moduly.includes(m.nr));
        const ileLekcji = wszystkie.reduce((a, m) => a + m.lekcje.length, 0);
        const sekundy = wszystkie.reduce((a, m) => a + m.sekundy, 0);
        return (
        <section aria-labelledby={`pasmo-${p.id}`} className={`hb-etap-grupa ${p.id}`} key={p.id}>
          <div className="hb-etap-grupa-glowa">
            <h2 id={`pasmo-${p.id}`}><i aria-hidden="true" />{p.nazwa}</h2>
            <span>{wszystkie.length} {modulySlowo(wszystkie.length)} · {ileLekcji} {lekcjiSlowo(ileLekcji)} · {minuty(sekundy)}</span>
          </div>
          <div className="hb-moduly">
            {moduly.map(({ modul: m, lekcje }) => {
              const otw = otwarte.has(m.nr) || !!fraza;
              const pierwsza = LEKCJE.filter((l) => l.modul === m.nr).sort((a, b) => a.nr - b.nr)[0];
              return (
                <article className={`hb-modul ${p.id}`} data-open={otw} id={`modul-${m.nr}`} key={m.nr}>
                  <div className="hb-modul-glowa">
                    <div className="hb-modul-tekst">
                      <h3 className="hb-modul-h">
                        <button aria-controls={`modul-${m.nr}-lekcje`} aria-expanded={otw} className="hb-modul-przel" onClick={() => przelacz(m.nr)} type="button">
                          <span className="hb-modul-tyt"><Podswietl q={fraza} tekst={m.nazwa} /></span>
                        </button>
                      </h3>
                      <span className="hb-modul-opis">{m.opis}</span>
                      <span className="hb-modul-meta">
                        {pierwsza && (
                          <Odtworz
                            nr={pierwsza.nr}
                            onWybierz={setWybor}
                            opis={`moduł „${m.nazwa}” od lekcji ${pierwsza.nr}`}
                            tytul={pierwsza.tytul}
                          />
                        )}
                        <span>{m.lekcje.length} {lekcjiSlowo(m.lekcje.length)}</span>
                        <span aria-hidden="true">·</span>
                        <span><span className="hb-sr">czas trwania </span>{minuty(m.sekundy)}</span>
                      </span>
                    </div>
                    <span aria-hidden="true" className="hb-strzalka" />
                  </div>
                  <ol className="hb-lekcje" hidden={!otw} id={`modul-${m.nr}-lekcje`}>
                    {lekcje.map((l) => (
                      <li className="hb-lekcja" id={`lekcja-${l.nr}`} key={l.nr}>
                        <span className="hb-lekcja-nr">{l.nr}</span>
                        <span className="hb-lekcja-t"><Podswietl q={fraza} tekst={l.tytul} /></span>
                        <span className="hb-lekcja-akcje">
                          <Odtworz nr={l.nr} onWybierz={setWybor} opis={`lekcję ${l.nr}: ${l.tytul}`} tytul={l.tytul} />
                          <span className="hb-lekcja-czas"><span className="hb-sr">czas trwania </span>{czas(l.sekundy)}</span>
                        </span>
                      </li>
                    ))}
                  </ol>
                </article>
              );
            })}
          </div>
        </section>
        );
      })}

      <OknoZakupu onZamknij={() => setWybor(null)} wybor={wybor} />
    </div>
  );
}
