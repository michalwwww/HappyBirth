'use client';

// Hasła bazy wiedzy „Dla Ciebie”: wyszukiwarka, filtr tematów, karty z prostym wyjaśnieniem,
// dosłownym cytatem z przepisu, wskazaniem miejsca w akcie i odnośnikiem do lekcji kursu.
// Od 04.11.2026 ten sam komponent działa w dwóch miejscach: na stronie publicznej z wybranymi
// hasłami (`ids`) i w strefie kursantki z pełną bazą, gdzie lekcje otwierają się w odtwarzaczu (`wStrefie`).
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { KARTY, TEMATY, ZRODLA } from '@/lib/dla-ciebie-data';
import { LEKCJE } from '@/lib/program-data';
import { czyTekstPasuje, normSearch, podswietlTekst } from '@/lib/search-utils';
import { IconLupa } from './icons';

const ZR = Object.fromEntries(ZRODLA.map((z) => [z.id, z]));
const NAZWA_ZR: Record<string, string> = { 'std-2026': 'Standard opieki okołoporodowej', upp: 'Ustawa o prawach pacjenta' };
const nazwaZrodla = (id: string) => NAZWA_ZR[id] || ZR[id]?.skrot || id;
const hasla = (n: number) => (n === 1 ? 'hasło' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'hasła' : 'haseł');

function Podswietl({ tekst, q }: { tekst: string; q: string }) {
  if (!q) return <>{tekst}</>;
  return <span data-podswietl="">{podswietlTekst(tekst, q)}</span>;
}

export function KnowledgeExplorer({ ids, wStrefie = false }: { ids?: string[]; wStrefie?: boolean }) {
  const karty = useMemo(() => (ids ? KARTY.filter((k) => ids.includes(k.id)) : KARTY), [ids]);
  const lekcjaHref = (nr: number) => (wStrefie ? `/strefa/lekcja/lekcja-${String(nr).padStart(2, '0')}` : `/program#lekcja-${nr}`);
  const [q, setQ] = useState('');
  const [temat, setTemat] = useState<string>('all');
  const [ile, setIle] = useState(12);
  const fraza = normSearch(q);

  // odnośniki #haslo-… (np. z listy najważniejszych zmian) muszą trafić w kartę także przy stronicowaniu
  useEffect(() => {
    const doHasla = () => {
      const m = window.location.hash.match(/^#haslo-(.+)$/);
      if (!m) return;
      const i = karty.findIndex((k) => k.id === decodeURIComponent(m[1]));
      if (i < 0) return;
      setQ(''); setTemat('all'); setIle((n) => Math.max(n, i + 1));
      window.setTimeout(() => document.getElementById(`haslo-${karty[i].id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    };
    doHasla();
    window.addEventListener('hashchange', doHasla);
    return () => window.removeEventListener('hashchange', doHasla);
  }, [karty]);

  const listaWszystkie = useMemo(
    () =>
      karty.filter(
        (k) =>
          !fraza ||
          czyTekstPasuje(
            q,
            k.tytul,
            k.tekst,
            k.cytaty.map((c) => c.tekst).join(' ')
          )
      ),
    [karty, q, fraza]
  );

  const lista = useMemo(
    () => (temat === 'all' ? listaWszystkie : listaWszystkie.filter((k) => k.temat === temat)),
    [listaWszystkie, temat]
  );

  const liczby = useMemo(() => {
    const m: Record<string, number> = {};
    karty.forEach((k) => { m[k.temat] = (m[k.temat] || 0) + 1; });
    return m;
  }, [karty]);

  return (
    <div>
      <div className="hb-pasek-narz" role="search">
        <div className="hb-szukaj">
          <IconLupa />
          <label className="hb-sr" htmlFor="szukaj-hasla">Szukajcie hasła</label>
          <input
            id="szukaj-hasla"
            onChange={(e) => { setQ(e.target.value); setIle(12); }}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && q) {
                e.preventDefault();
                setQ('');
                setIle(12);
              }
            }}
            placeholder="Szukajcie, np. plan porodu, osoba bliska, karmienie"
            type="search"
            value={q}
          />
        </div>
        <div aria-label="Temat" className="hb-chipy" role="group">
          <button aria-pressed={temat === 'all'} className="hb-chip" onClick={() => { setTemat('all'); setIle(12); }} type="button">Wszystkie</button>
          {Object.entries(TEMATY).filter(([id]) => liczby[id]).map(([id, nazwa]) => (
            <button aria-pressed={temat === id} className="hb-chip" key={id} onClick={() => { setTemat(id); setIle(12); }} type="button">{nazwa}</button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="hb-podsum">
        <span>
          <b>{lista.length}</b> {hasla(lista.length)}
          {fraza && lista.length === 0 && listaWszystkie.length > 0 && temat !== 'all' && (
            <>
              {' '}
              —{' '}
              <button className="hb-zwin" onClick={() => setTemat('all')} type="button">
                pokaż ze wszystkich tematów ({listaWszystkie.length})
              </button>
            </>
          )}
        </span>
      </p>

      {lista.length === 0 && (
        <div className="hb-brak">
          {listaWszystkie.length > 0 && temat !== 'all' ? (
            <p>
              W wybranym temacie nie ma pasującego hasła, ale znaleźliśmy{' '}
              <b>{listaWszystkie.length}</b> {hasla(listaWszystkie.length)} w pozostałych tematach.{' '}
              <button className="hb-zwin" onClick={() => setTemat('all')} type="button">
                Pokaż wszystkie tematy
              </button>
            </p>
          ) : (
            <p>Nie ma hasła o tym temacie. Spróbujcie innego słowa albo wybierzcie inny temat.</p>
          )}
        </div>
      )}

      <div className="hb-hasla-l">
        {lista.slice(0, ile).map((k) => (
          <article className="hb-haslo" id={`haslo-${k.id}`} key={k.id}>
            {k.zmiana && (
              <span className={`hb-znacznik${k.zmiana === 'zmienione' ? ' hb-z2' : ''}`}>
                {k.zmiana === 'nowe' ? 'Nowe od 7 maja 2026' : 'Zmienione w 2026'}
              </span>
            )}
            <h3><Podswietl q={q} tekst={k.tytul} /></h3>
            <p><Podswietl q={q} tekst={k.tekst} /></p>
            {k.cytaty.length > 0 ? (
              <details className="hb-przepis">
                <summary>Zobaczcie przepis</summary>
                {k.cytaty.map((c, i) => (
                  <blockquote className="hb-cytat" key={i}>
                    „<Podswietl q={q} tekst={c.tekst} />”
                    <cite>{nazwaZrodla(c.zrodlo)}{c.lok ? `, ${c.lok}` : ''}</cite>
                  </blockquote>
                ))}
              </details>
            ) : k.lokalizatory.length > 0 && (
              <p className="hb-maly">Podstawa: {k.lokalizatory.map((l) => `${nazwaZrodla(l.zrodlo)}${l.lok ? `, ${l.lok}` : ''}`).join('; ')}.</p>
            )}
            {k.lekcje.length > 0 && (
              <div className="hb-haslo-dol">
                {k.lekcje.slice(0, 2).map((nr) => {
                  const l = LEKCJE.find((x) => x.nr === nr);
                  return l ? <Link href={lekcjaHref(nr)} key={nr}>W kursie: lekcja {nr}. {l.tytul}</Link> : null;
                })}
              </div>
            )}
          </article>
        ))}
      </div>
      {lista.length > ile && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 22 }}>
          <button className="hb-btn hb-btn-jasny" onClick={() => setIle((n) => n + 24)} type="button">
            Pokażcie kolejne hasła ({lista.length - ile})
          </button>
        </div>
      )}
    </div>
  );
}
