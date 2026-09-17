/**
 * HAPPYBIRTH · tokeny systemu kolor/etap
 *
 * Dziewięć etapów drogi, dziewięć kolorów. Wartości wyliczone algorytmicznie
 * z koloru bazowego (paczka marki, assets/stages.json). Każda para deep/tint
 * przechodzi WCAG AA. Nie poprawiać hexów ręcznie.
 *
 *  c     czysty kolor etapu. Wyłącznie plama i symbol. Nigdy tekst
 *  tint  tło całej sekcji (8,5 procent koloru w papierze)
 *  tint2 tło kafla (17 procent)
 *  deep  jedyny dopuszczalny kolorowy tekst na tincie
 *  nav   wariant do drobnych elementów na papierze (kropka nawigacji)
 */

export type StageKey =
  | 'zanim'
  | 'dwiekreski'
  | 'lepiej'
  | 'torba'
  | 'boli'
  | 'planb'
  | 'pierwszanoc'
  | 'karmienie'
  | 'niespi';

export interface StageToken {
  nr: number;
  key: StageKey;
  /** id etapu w lib/course-data.ts */
  stageId: string;
  c: string;
  tint: string;
  tint2: string;
  deep: string;
  nav: string;
}

export const PAPER = '#FBF8F4';
export const INK = '#1A1512';
export const ACCENT = '#FCD705';

export const STAGE_TOKENS: StageToken[] = [
  { nr: 1, key: 'zanim',       stageId: 'stage-01', c: '#8F8D8D', tint: '#F2EFEB', tint2: '#E9E6E2', deep: '#6B6969', nav: '#828080' },
  { nr: 2, key: 'dwiekreski',  stageId: 'stage-02', c: '#54BF39', tint: '#EDF3E4', tint2: '#DFEED4', deep: '#347A22', nav: '#3E9228' },
  { nr: 3, key: 'lepiej',      stageId: 'stage-03', c: '#FCD705', tint: '#FBF5E0', tint2: '#FBF2CB', deep: '#816E00', nav: '#967F00' },
  { nr: 4, key: 'torba',       stageId: 'stage-04', c: '#F57B14', tint: '#FAEDE1', tint2: '#FAE3CE', deep: '#AA5003', nav: '#D26204' },
  { nr: 5, key: 'boli',        stageId: 'stage-05', c: '#ED1C24', tint: '#FAE5E2', tint2: '#F9D3D1', deep: '#D00B13', nav: '#F2171F' },
  { nr: 6, key: 'planb',       stageId: 'stage-06', c: '#952999', tint: '#F2E6EC', tint2: '#EAD5E5', deep: '#98269C', nav: '#98269C' },
  { nr: 7, key: 'pierwszanoc', stageId: 'stage-07', c: '#EC008C', tint: '#FAE3EB', tint2: '#F8CEE2', deep: '#C80077', nav: '#EC008C' },
  { nr: 8, key: 'karmienie',   stageId: 'stage-08', c: '#00ADEF', tint: '#E6F2F4', tint2: '#D0EBF3', deep: '#00729D', nav: '#0088BC' },
  { nr: 9, key: 'niespi',      stageId: 'stage-09', c: '#3B46A4', tint: '#EBE9ED', tint2: '#DADAE6', deep: '#3844A7', nav: '#3844A7' },
];

const byStageId = new Map(STAGE_TOKENS.map((t) => [t.stageId, t]));
const byKey = new Map(STAGE_TOKENS.map((t) => [t.key, t]));

export function stageToken(stageIdOrKey: string): StageToken {
  return byStageId.get(stageIdOrKey) || byKey.get(stageIdOrKey as StageKey) || STAGE_TOKENS[0];
}

/** Klasa CSS ustawiająca zmienne --c, --tint, --tint2, --deep, --nav dla etapu */
export function stageClass(stageIdOrKey: string): string {
  return `e-${stageToken(stageIdOrKey).key}`;
}

/** Zmienne etapu jako inline style (gdy klasa nie wystarcza, np. w portalu) */
export function stageVars(stageIdOrKey: string): React.CSSProperties {
  const t = stageToken(stageIdOrKey);
  return {
    ['--c' as string]: t.c,
    ['--tint' as string]: t.tint,
    ['--tint2' as string]: t.tint2,
    ['--deep' as string]: t.deep,
    ['--nav' as string]: t.nav,
  } as React.CSSProperties;
}

/** Nazwa zdarzenia, którym sekcje informują nawigację o aktywnym etapie */
export const STAGE_EVENT = 'hb:stage';

export function emitStage(stageIdOrKey: string | null) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(STAGE_EVENT, { detail: stageIdOrKey }));
}
