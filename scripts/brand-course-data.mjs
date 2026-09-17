// Jednorazowa migracja lib/course-data.ts do systemu kolor/etap HAPPYBIRTH.
// 1. Kolory etapów i lekcji na tokeny marki (c / tint2).
// 2. Zasada copy: zero myślników, dywizów i pauz w widocznym tekście.
//    Zakres liczbowy zapisujemy słowem ("tydzień 1 do 14"), a myślnik w zdaniu
//    zamieniamy na kropkę i nowe zdanie.
// Uruchomienie: node scripts/brand-course-data.mjs

import fs from 'node:fs';

const file = new URL('../lib/course-data.ts', import.meta.url);
let src = fs.readFileSync(file, 'utf8');

const tokens = {
  'stage-01': { c: '#8F8D8D', tint: '#F2EFEB', tint2: '#E9E6E2', deep: '#6B6969' },
  'stage-02': { c: '#54BF39', tint: '#EDF3E4', tint2: '#DFEED4', deep: '#347A22' },
  'stage-03': { c: '#FCD705', tint: '#FBF5E0', tint2: '#FBF2CB', deep: '#816E00' },
  'stage-04': { c: '#F57B14', tint: '#FAEDE1', tint2: '#FAE3CE', deep: '#AA5003' },
  'stage-05': { c: '#ED1C24', tint: '#FAE5E2', tint2: '#F9D3D1', deep: '#D00B13' },
  'stage-06': { c: '#952999', tint: '#F2E6EC', tint2: '#EAD5E5', deep: '#98269C' },
  'stage-07': { c: '#EC008C', tint: '#FAE3EB', tint2: '#F8CEE2', deep: '#C80077' },
  'stage-08': { c: '#00ADEF', tint: '#E6F2F4', tint2: '#D0EBF3', deep: '#00729D' },
  'stage-09': { c: '#3B46A4', tint: '#EBE9ED', tint2: '#DADAE6', deep: '#3844A7' },
};

// --- 1. Kolory etapów (blok stages) ---
for (const [id, t] of Object.entries(tokens)) {
  const re = new RegExp(`("id": "${id}",[\\s\\S]*?"color": ")#[0-9A-Fa-f]{6}(",\\s*"accentBg": ")#[0-9A-Fa-f]{6}(")`);
  src = src.replace(re, `$1${t.c}$2${t.tint2}$3`);
  // dopisz tint i deep po accentBg, jeśli jeszcze ich nie ma
  const re2 = new RegExp(`("id": "${id}",[\\s\\S]*?"accentBg": "#[0-9A-Fa-f]{6}",)(\\s*)("description")`);
  if (!new RegExp(`"id": "${id}",[\\s\\S]*?"tint":`).test(src.slice(0, src.indexOf('export const lessons')))) {
    src = src.replace(re2, `$1$2"tint": "${t.tint}",$2"deep": "${t.deep}",$2$3`);
  }
}

// --- 2. Kolory lekcji (stageColor per stageId) ---
src = src.replace(/"stageId": "(stage-0\d)",\s*"stageTitle": "([^"]*)",\s*"stageColor": "#[0-9A-Fa-f]{6}"/g, (m, id, title) => {
  return `"stageId": "${id}",\n    "stageTitle": "${title}",\n    "stageColor": "${tokens[id].c}"`;
});

// --- 3. Copy bez myślników ---
const upper = (s) => s.charAt(0).toUpperCase() + s.slice(1);
src = src.replace(/"((?:title|description|subtitle|weeks|previewText|name)": ")([^"]*)"/g, (m, key, val) => {
  let v = val;
  // zakresy liczbowe: 1 – 14, 31–40, 15 – 32
  v = v.replace(/(\d)\s*[–—-]\s*(\d)/g, '$1 do $2');
  // "Tydzień 1 do 14" w polu weeks piszemy małą literą, jak zakres, nie tytuł
  if (key.startsWith('weeks')) v = v.replace(/^Tydzień/, 'tydzień');
  // myślnik w zdaniu: kropka i nowe zdanie
  v = v.replace(/\s+[–—]\s+(\S)/g, (mm, ch) => `. ${upper(ch)}`);
  // pozostałe pauzy bez spacji (rzadkie)
  v = v.replace(/[–—]/g, ',');
  return `"${key}${v}"`;
});

fs.writeFileSync(file, src);
const left = (src.match(/[–—]/g) || []).length;
console.log(`course-data.ts zapisany. Pozostałe pauzy: ${left}`);
