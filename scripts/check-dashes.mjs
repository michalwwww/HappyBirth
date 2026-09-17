// HAPPYBIRTH · kontrola zasady „zero myślników, dywizów i pauz w widocznym tekście”.
// Port skryptu referencja/kontrola-myslnikow.py z paczki marki.
//
// Użycie po `npm run build`:
//   node scripts/check-dashes.mjs                       (domyślnie: .next/server/app/marketing.html)
//   node scripts/check-dashes.mjs .next/server/app/regulamin.html components/landing/content.ts
//
// Wynik 0 = czysto. Wynik 1 = są znalezienia, wypisane z kontekstem.
// Wyklucza komentarze HTML, <script>, <style>, <svg> (dane ścieżek) i atrybuty.
// Zwykły dywiz „-” dopuszczamy wyłącznie wewnątrz kodu i adresów (np. e-mail), stąd
// kontrola dywizu obejmuje tylko sekwencje między literami/spacjami w tekście.

import fs from 'node:fs';

const files = process.argv.slice(2).length ? process.argv.slice(2) : ['.next/server/app/marketing.html'];
const BAD = /[‐‑‒–—―−]|(?<=\s)-(?=\s)|(?<=[A-Za-zÀ-ž])-(?=[A-Za-zÀ-ž])/gu;
// Wyjątki: nazwy własne i identyfikatory techniczne, których nie tłumaczymy
const ALLOW = ['e-mail', 'E-mail', 'e-learning', 'E-learning', 'e-learningu', 'HappyBirth-', 'Sign-in', 'Apple-'];

function visible(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|svg|noscript)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ');
}

let status = 0;
for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`POMINIĘTO  ${file} (brak pliku)`);
    continue;
  }
  const raw = fs.readFileSync(file, 'utf8');
  // Pliki źródłowe: sprawdzamy tylko literały tekstowe, z pominięciem slugów, ścieżek i identyfikatorów
  const text = file.endsWith('.html')
    ? visible(raw)
    : Array.from(raw.matchAll(/(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g), (m) => m[2])
        .filter((lit) => /\s/.test(lit) && !/^[\/#]/.test(lit) && !/^[a-z0-9-]+$/.test(lit))
        .join('\n');
  const hits = [];
  for (const m of text.matchAll(BAD)) {
    const start = Math.max(0, m.index - 40);
    const ctx = text.slice(start, m.index + 41).replace(/\s+/g, ' ');
    if (ALLOW.some((a) => ctx.includes(a) && m[0] === '-')) continue;
    hits.push(ctx);
  }
  if (!hits.length) {
    console.log(`OK      ${file}`);
    continue;
  }
  status = 1;
  console.log(`UWAGA   ${file}  znalezień: ${hits.length}`);
  for (const h of hits.slice(0, 40)) console.log(`        …${h}…`);
}
process.exit(status);
