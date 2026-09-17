# HAPPYBIRTH · design system v2 (strona marketingowa)

Stan: 17 września 2026. Fundament wizualny strony głównej na bazie paczki marki
(system kolor/etap, dwa rejestry, typografia, ruch). Strefa kursantki korzysta
z tych samych tokenów, ale jej układ czeka na następną fazę.

## Zasady, których pilnujemy w kodzie

1. **Kolor jest nawigacją, nie dekoracją.** Dziewięć etapów, dziewięć kolorów.
   Tokeny w `lib/brand.ts` i klasach `.e-*` w `app/globals.css`. Nie poprawiamy hexów ręcznie.
2. **Czysty kolor etapu (`--c`) to wyłącznie plama i symbol. Nigdy tekst.**
   Na tincie sekcji (`--tint`) wolno pisać kolorem `--deep` (min 4,6 do 1).
   Na tincie kafla (`--tint2`) `--deep` daje 4,0 do 4,5, więc drobny tekst na kaflach idzie w atramencie.
   Na czystym kolorze tekst ma kolor `--on-c` (atrament na jasnych, biel na ciemnych).
3. **Dwa rejestry.** Hero i akcenty radości: pełna paleta, symbole. Reszta strony (etapy, narzędzia,
   cennik, FAQ, stopka): papier, atrament, jeden akcent żółty (`--accent`) na CTA i cenniku.
4. **Logotyp:** kolorowy tylko w nawigacji, mono tylko w stopce. Minimum 120 px szerokości,
   poniżej sygnet (belka po przewinięciu). Pełny znak nigdy na własnych kolorach.
5. **Typografia:** Bricolage Grotesque 500 (nagłówki, ostatnie słowo w Instrument Serif italic),
   Inter 18 px / 1,62 (tekst). Fonty hostowane lokalnie (`@fontsource`), bez zapytań do Google.
6. **Copy:** druga osoba, zdania krótkie, zero myślników i pauz w widocznym tekście,
   zero zdrobnień w treści merytorycznej, nigdy obietnica przebiegu porodu.
   Teksty strony w jednym pliku: `components/landing/content.ts`.
7. **Ruch pracuje, nie popisuje się.** Odsłanianie przy scrollu (`.r` + `RevealObserver`),
   kafel wypełnia się kolorem na hover, kropka w nawigacji przejmuje kolor etapu,
   symbole tła unoszą się w hero. `prefers-reduced-motion` wyłącza wszystko.
8. **Dostępność:** wszystkie pary tekst/tło na stronie głównej przechodzą WCAG AA
   (`--ink3` pociemniony względem paczki do `#766A62`, żeby tekst 13 do 16 px przechodził na papierze).
   Zero przewijania poziomego na 390 px.

## Pliki

| Co | Gdzie |
|---|---|
| Tokeny, komponenty CSS, ruch | `app/globals.css`, `tailwind.config.js` |
| Tokeny etapów w TS, zdarzenie `hb:stage` | `lib/brand.ts` |
| Logotyp (kolor, mono, sygnet) jako inline SVG | `components/logo.tsx`, `components/brand/logo-paths.ts`, `public/logo/*.svg` |
| Dziewięć symboli etapów (sprite + `<use>`) | `components/stage-icons.tsx` |
| Sekcje strony głównej | `components/landing/*` |
| Moduł red flag (stała forma) | `components/red-flag.tsx` |
| Nawigacja, stopka, cookies | `components/marketing-navbar.tsx`, `components/footer.tsx`, `components/cookie-banner.tsx` |

## Kontrola przed publikacją

```bash
npm run build
node scripts/check-dashes.mjs            # zero myślników w widocznym tekście strony głównej
node scripts/check-dashes.mjs components/landing/content.ts lib/course-data.ts lib/daily-tips.ts
```

## Otwarte na następną fazę

- Strefa kursantki na tokenach v2 (kokpit, lista lekcji, odtwarzacz, logowanie): paleta śliwkowa do wygaszenia.
- Sygnatura położnej przy materiałach (imię, nazwisko, certyfikat) jako powtarzalny komponent.
- Fotografia dokumentalna albo ilustracja: decyzja właściciela.
- Wariant znaku o uproszczonych nakładkach na zakres 32 do 120 px (dziś zakrywa to sygnet).
