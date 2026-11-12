'use client';

// Wspólny nagłówek stron publicznych (runda X1, 05.11.2026). Jaśniejszy, półprzezroczysty pas menu,
// logo w kolorach palety, pięć szklanych pigułek (O nas, Program, Dla Ciebie, Pytania i Strefa mamy
// w innym kolorze), małe flagi języków i znaki trzech serwisów, przycisk DOŁĄCZ TERAZ w kolorze
// wyróżnienia palety i na końcu koło zębate Ustawień. Panel Ustawień: tryb dzień albo noc, paleta
// (cztery wersje z logo i próbką barw) i ułatwienia dostępu. Na telefonie to samo w menu.
// Strony poza główną mówią po polsku: flaga innego języka przenosi na stronę główną w tym języku.
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useI18n, type Language } from '@/lib/i18n';
import { SHELL, type ShellCopy } from '@/lib/site-copy';
import { PALETY, useWyglad } from '@/lib/wyglad';
import { Flaga, IconDostep, IconKolo, IconKsiezyc, IconMenu, IconSlonce, IconZamknij } from './icons';
import { Logo } from './logo';
import { SocialMini } from './social';
import { useSierotki } from './sierotki';

export type SiteSection = 'o-nas' | 'program' | 'dla-ciebie' | 'pytania' | null;

type Odnosnik = { id: Exclude<SiteSection, null> | 'strefa'; href: string; label: string; zwykly?: boolean };

const JEZYKI: { id: Language; nazwa: string }[] = [
  { id: 'pl', nazwa: 'Polski' },
  { id: 'en', nazwa: 'English' },
  { id: 'ru', nazwa: 'Русский' },
];

// Język (runda X3): widać jedną flagę, bieżącego języka (na podstronach zawsze polską), a pozostałe
// języki pokazują się dopiero po jej rozwinięciu. Escape, kliknięcie obok i wyjście Tabem zamykają listę.
function Flagi({ multilingual }: { multilingual: boolean }) {
  const { lang, setLang } = useI18n();
  const biezacy: Language = multilingual ? lang : 'pl';
  const [otwarte, setOtwarte] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const przycisk = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!otwarte) return;
    const obok = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) setOtwarte(false); };
    const klawisz = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOtwarte(false); przycisk.current?.focus(); } };
    document.addEventListener('pointerdown', obok);
    document.addEventListener('keydown', klawisz);
    return () => { document.removeEventListener('pointerdown', obok); document.removeEventListener('keydown', klawisz); };
  }, [otwarte]);
  const wybierz = (id: Language) => {
    setOtwarte(false);
    setLang(id);
    // podstrony są po polsku: inny język otwiera stronę główną, która ma tłumaczenia
    if (!multilingual && id !== 'pl') window.location.href = '/';
  };
  const nazwa = JEZYKI.find((j) => j.id === biezacy)?.nazwa || 'Polski';
  return (
    <div
      className="hb-jezyk"
      onBlur={(e) => { if (otwarte && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) setOtwarte(false); }}
      ref={ref}
    >
      <button
        aria-expanded={otwarte}
        aria-label={`Język / Language / Язык: ${nazwa}`}
        className="hb-flaga hb-flaga-biezaca"
        onClick={() => setOtwarte((o) => !o)}
        ref={przycisk}
        title={nazwa}
        type="button"
      >
        <Flaga kod={biezacy} />
        <i aria-hidden="true" className="hb-jezyk-strzalka" />
      </button>
      {otwarte && (
        <div aria-label="Język / Language / Язык" className="hb-jezyk-lista" role="group">
          {JEZYKI.filter((j) => j.id !== biezacy).map((j) => (
            <button className="hb-jezyk-opcja" key={j.id} lang={j.id} onClick={() => wybierz(j.id)} type="button">
              <Flaga kod={j.id} />
              <span>{j.nazwa}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Zawartość Ustawień: w panelu pod kołem zębatym i w menu na telefonie
function Ustawienia({ t, onA11y }: { t: ShellCopy; onA11y: () => void }) {
  const { paleta, ciemny, setPaleta, setCiemny } = useWyglad();
  return (
    <>
      <div className="hb-ustaw-sekcja">
        <p className="hb-ustaw-tyt">{t.ustawienia.tryb}</p>
        <div aria-label={t.ustawienia.tryb} className="hb-tryb" role="group">
          <button aria-pressed={!ciemny} className="hb-szklo" onClick={() => setCiemny(false)} type="button">
            <IconSlonce /><span>{t.ustawienia.dzien}</span>
          </button>
          <button aria-pressed={ciemny} className="hb-szklo" onClick={() => setCiemny(true)} type="button">
            <IconKsiezyc /><span>{t.ustawienia.noc}</span>
          </button>
        </div>
      </div>
      <div className="hb-ustaw-sekcja">
        <p className="hb-ustaw-tyt">{t.ustawienia.paleta}</p>
        <div aria-label={t.ustawienia.paleta} className="hb-palety" role="group">
          {PALETY.map((p) => (
            <button
              aria-pressed={paleta === p.id}
              className="hb-paleta"
              key={p.id}
              onClick={() => setPaleta(p.id)}
              style={{ ['--tlo' as string]: ciemny ? p.tlo.noc : p.tlo.jasny } as React.CSSProperties}
              type="button"
            >
              <Logo className="hb-paleta-logo" kolory={ciemny ? p.logo.noc : p.logo.jasny} />
              <span className="hb-paleta-opis">
                <b>{p.nazwa}</b>
                <span aria-hidden="true" className="hb-probki">
                  {p.probki.map((k) => <i key={k} style={{ background: k }} />)}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <button className="hb-ustaw-wiersz" onClick={onA11y} type="button">
        <IconDostep />
        <span>{t.ustawienia.a11y}</span>
      </button>
    </>
  );
}

export function SiteHeader({ active = null, multilingual = false }: { active?: SiteSection; multilingual?: boolean }) {
  const { lang } = useI18n();
  const t = SHELL[multilingual ? lang : 'pl'] || SHELL.pl;
  const [open, setOpen] = useState(false);
  const [ustaw, setUstaw] = useState(false);
  useSierotki(multilingual ? lang : 'pl');
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const kartaRef = useRef<HTMLDivElement>(null);
  const ustawRef = useRef<HTMLDivElement>(null);
  const ustawBtnRef = useRef<HTMLButtonElement>(null);

  // menu na telefonie: Escape zamyka, Tab krąży wewnątrz menu, strona pod spodem się nie przewija,
  // po zamknięciu fokus wraca na przycisk menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key !== 'Tab' || !kartaRef.current) return;
      const el = Array.from(kartaRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      if (!el.length) return;
      const pierwszy = el[0];
      const ostatni = el[el.length - 1];
      if (e.shiftKey && document.activeElement === pierwszy) { e.preventDefault(); ostatni.focus(); }
      else if (!e.shiftKey && document.activeElement === ostatni) { e.preventDefault(); pierwszy.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const przycisk = menuBtnRef.current;
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      if (przycisk && przycisk.offsetParent !== null) przycisk.focus();
    };
  }, [open]);

  // panel Ustawień: zamyka się dotknięciem albo kliknięciem obok, wyjściem fokusu poza panel
  // i klawiszem Escape (wtedy fokus wraca na koło zębate)
  useEffect(() => {
    if (!ustaw) return;
    const onDoc = (e: PointerEvent) => { if (!ustawRef.current?.contains(e.target as Node)) setUstaw(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setUstaw(false); ustawBtnRef.current?.focus(); } };
    document.addEventListener('pointerdown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [ustaw]);

  const openA11y = () => {
    setOpen(false);
    setUstaw(false);
    window.dispatchEvent(new CustomEvent('hb_open_a11y'));
  };

  // Pytania i Strefa mamy jako zwykłe odnośniki: strefa w produkcji przekierowuje na własną subdomenę
  const links: Odnosnik[] = [
    { id: 'o-nas', href: '/o-nas', label: t.nav.oNas },
    { id: 'program', href: '/program', label: t.nav.program },
    { id: 'dla-ciebie', href: '/dla-ciebie', label: t.nav.wiedza },
    { id: 'pytania', href: '/#pytania', label: t.nav.pytania, zwykly: true },
    { id: 'strefa', href: '/strefa', label: t.nav.strefa, zwykly: true },
  ];

  const odnosnik = (l: Odnosnik, klasa: string, onClick?: () => void) => {
    const akt = active === l.id ? 'page' : undefined;
    const k = `${klasa}${l.id === 'strefa' ? ' hb-pig-strefa' : ''}`;
    return l.zwykly
      ? <a aria-current={akt} className={k} href={l.href} key={l.id} onClick={onClick}>{l.label}</a>
      : <Link aria-current={akt} className={k} href={l.href} key={l.id} onClick={onClick}>{l.label}</Link>;
  };

  return (
    <>
      <a className="hb-skok" href="#tresc">{t.skip}</a>

      <header className="hb-nav">
        <div className="hb-nav-in">
          <Link aria-label={t.homeLabel} className="hb-znak" href="/">
            <Logo />
          </Link>

          <nav aria-label={t.navLabel} className="hb-linki">
            {links.map((l) => odnosnik(l, 'hb-szklo hb-pig'))}
          </nav>

          <div className="hb-nav-narzedzia">
            <div className="hb-nav-male">
              <SocialMini label={t.footer.social} />
            </div>
            <a className="hb-btn hb-btn-kup hb-btn-nav" href="/#kup">{t.nav.dolacz}</a>
            {/* flaga języka za DOŁĄCZ, przed kołem zębatym (runda X4) */}
            <div className="hb-nav-jezyk">
              <Flagi multilingual={multilingual} />
            </div>
            <div
              className="hb-ustaw"
              // Tab poza panel zamyka go; kliknięcia obsługuje pointerdown wyżej (Safari nie daje fokusu przyciskom)
              onBlur={(e) => { if (ustaw && e.relatedTarget && !e.currentTarget.contains(e.relatedTarget as Node)) setUstaw(false); }}
              ref={ustawRef}
            >
              <button
                aria-controls="hb-ustaw-panel"
                aria-expanded={ustaw}
                aria-label={t.ustawienia.label}
                className="hb-szklo hb-kolo"
                onClick={() => setUstaw((v) => !v)}
                ref={ustawBtnRef}
                title={t.ustawienia.label}
                type="button"
              >
                <IconKolo />
              </button>
              {ustaw && (
                <div aria-label={t.ustawienia.label} className="hb-ustaw-panel" id="hb-ustaw-panel" role="group">
                  <Ustawienia onA11y={openA11y} t={t} />
                </div>
              )}
            </div>
            <div className="hb-menu">
              <button aria-expanded={open} aria-label={t.menuOpen} className="hb-szklo hb-menu-btn" onClick={() => setOpen(true)} ref={menuBtnRef} type="button">
                <IconMenu />
              </button>
            </div>
          </div>
        </div>
      </header>

      {open && (
        <div aria-label={t.navLabel} aria-modal="true" className="hb-menu-panel" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }} role="dialog">
          <div className="hb-menu-karta" ref={kartaRef}>
            <div className="hb-menu-gora">
              <Link aria-label={t.homeLabel} className="hb-znak" href="/" onClick={() => setOpen(false)}>
                <Logo />
              </Link>
              <button aria-label={t.menuClose} className="hb-szklo hb-menu-btn" onClick={() => setOpen(false)} ref={closeRef} type="button">
                <IconZamknij />
              </button>
            </div>
            <nav aria-label={t.navLabel} className="hb-menu-linki">
              {links.map((l) => odnosnik(l, '', () => setOpen(false)))}
            </nav>
            <div className="hb-menu-dol">
              <a className="hb-btn hb-btn-kup hb-duzy" href="/#kup" onClick={() => setOpen(false)}>{t.nav.dolacz}</a>
              <div className="hb-menu-male">
                <Flagi multilingual={multilingual} />
                <SocialMini label={t.footer.social} />
              </div>
              <div aria-label={t.ustawienia.label} className="hb-menu-ustaw" role="group">
                <p className="hb-ustaw-naglowek"><IconKolo />{t.ustawienia.label}</p>
                <Ustawienia onA11y={openA11y} t={t} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
