/**
 * [TECH-03 Pilot] Generator Manifestu Lokalizacji 52 Lekcji 4K (Multi-Audio HLS & WebVTT Subtitles)
 * Uruchomienie: npx tsx scripts/prepare-localization-pilot.ts
 */

import { lessons, stages } from '../lib/course-data';

export interface ObstetricalGlossaryEntry {
  pl: string;
  enUk: string;
  enUs: string;
  de: string;
  es: string;
  ptBr: string;
  clinicalNote: string;
}

export const OBSTETRICAL_GLOSSARY_2026: ObstetricalGlossaryEntry[] = [
  {
    pl: 'Położna',
    enUk: 'Midwife (NHS / HSE)',
    enUs: 'Certified Nurse-Midwife (CNM) / L&D Nurse',
    de: 'Hebamme (Kreißsaal / Nachsorgehebamme)',
    es: 'Matrona / Comadrona',
    ptBr: 'Enfermeira Obstetra / Obstetriz',
    clinicalNote: 'W USA większość porodów szpitalnych prowadzi L&D Nurse + OB-GYN; w UK/DE/NL pierwszoplanową rolę pełni Midwife/Hebamme.',
  },
  {
    pl: 'Znieczulenie zewnątrzoponowe (ZZO)',
    enUk: 'Epidural analgesia',
    enUs: 'Epidural anesthesia',
    de: 'Periduralanästhesie (PDA / Walking-PDA)',
    es: 'Analgesia epidural',
    ptBr: 'Analgesia peridural / raquiperidural',
    clinicalNote: 'W Niemczech zawsze używać skrótu PDA; w Holandii potocznie „Ruggenprik”.',
  },
  {
    pl: 'Gaz rozweselający (podtlenek azotu)',
    enUk: 'Entonox (Gas and Air)',
    enUs: 'Nitrous Oxide',
    de: 'Lachgas (Entonox)',
    es: 'Óxido nitroso (Entonox)',
    ptBr: 'Óxido nitroso',
    clinicalNote: 'W UK standard nr 1 na każdym oddziale („Gas and Air”).',
  },
  {
    pl: 'Nacięcie krocza (episiotomia)',
    enUk: 'Episiotomy',
    enUs: 'Episiotomy',
    de: 'Dammschnitt (Episiotomie)',
    es: 'Episiotomía',
    ptBr: 'Episiotomia',
    clinicalNote: 'We wszystkich rynkach podkreślać ochronę krocza ciepłymi kompresami („Active perineal protection / Dammschutz”).',
  },
  {
    pl: 'Kontakt skóra do skóry (Kangurowanie)',
    enUk: 'Skin-to-skin contact (Golden Hour)',
    enUs: 'Uninterrupted skin-to-skin (Golden Hour)',
    de: 'Haut-zu-Haut-Kontakt (Bonding / Känguruhen)',
    es: 'Contacto piel con piel (Hora Sagrada)',
    ptBr: 'Contato pele a pele (Hora Dourada)',
    clinicalNote: 'Po cesarce używać terminu „Gentle Cesarean / Kaisergeburt / Cesárea Humanizada”.',
  },
  {
    pl: 'Przedporodowe odciąganie siary (od 36/37 tyg.)',
    enUk: 'Antenatal colostrum harvesting (1 ml syringes)',
    enUs: 'Antenatal colostrum expression',
    de: 'Präpartale Kolostrum-Gewinnung (ab 37+0 SSW)',
    es: 'Extracción prenatal de calostro',
    ptBr: 'Ordenha pré-natal de colostro',
    clinicalNote: 'Kluczowy trend kliniczny 2025/2026 w UK, Australii i DACH.',
  },
];

const PILOT_LESSON_IDS = ['lekcja-01', 'lekcja-09', 'lekcja-18'];

export function buildLocalizationPilotManifest() {
  const totalDurationSeconds = lessons.reduce((acc, l) => acc + l.durationSeconds, 0);
  const totalMinutes = Math.round(totalDurationSeconds / 60);

  const pilotLessons = lessons
    .filter((l) => PILOT_LESSON_IDS.includes(l.id))
    .map((l) => ({
      id: l.id,
      stageId: l.stageId,
      titlePl: l.title,
      durationSeconds: l.durationSeconds,
      cloudflareVideoUid: l.cloudflareUid,
      localizationStrategy: 'Voice Cloning Multi-Audio HLS (Zero AI Face Swap) + Lower-Thirds Graphic Overlay Replacement',
      targetAudioTracks: [
        { lang: 'pl', label: 'Polski (Oryginał)', default: true },
        { lang: 'en-GB', label: 'English (UK — NHS Terminology)' },
        { lang: 'en-US', label: 'English (US — ACOG L&D Terminology)' },
        { lang: 'de', label: 'Deutsch (DACH — S3-Leitlinie)' },
        { lang: 'es', label: 'Español (España & LatAm)' },
        { lang: 'pt-BR', label: 'Português (Brasil — Parto Humanizado)' },
      ],
      subtitlePaths: [
        `/subtitles/${l.id}.pl.vtt`,
        `/subtitles/${l.id}.en-gb.vtt`,
        `/subtitles/${l.id}.en-us.vtt`,
        `/subtitles/${l.id}.de.vtt`,
        `/subtitles/${l.id}.es.vtt`,
        `/subtitles/${l.id}.pt-br.vtt`,
      ],
    }));

  return {
    generatedAt: new Date().toISOString(),
    totalStages: stages.length,
    totalLessons: lessons.length,
    totalDurationMinutes: totalMinutes,
    recommendedArchitecture: {
      visuals: 'Keep original 4K Polish midwifery recordings (authentic facial micro-expressions, zero uncanny valley)',
      audio: 'ElevenLabs Dubbing Studio / HeyGen Voice Cloning uploaded as secondary HLS audio tracks to Cloudflare Stream',
      overlays: 'Replace Polish hospital/legal lower-thirds with localized NICE CG190 (UK), ACOG (US), S3-Leitlinie (DE), and Lei 11.108 (BR) cards',
    },
    pilotLessons,
    glossaryCount: OBSTETRICAL_GLOSSARY_2026.length,
  };
}

if (require.main === module) {
  const manifest = buildLocalizationPilotManifest();
  console.log('=== HAPPYBIRTH 4K VIDEO LOCALIZATION PILOT MANIFEST (TECH-03) ===');
  console.log(`Total Lessons: ${manifest.totalLessons} (${manifest.totalDurationMinutes} min across ${manifest.totalStages} modules)`);
  console.log(`Pilot Lessons Selected (${manifest.pilotLessons.length}):`);
  manifest.pilotLessons.forEach((p) => {
    console.log(`  - [${p.id}] ${p.titlePl} (${p.durationSeconds}s) -> 6 HLS Audio Tracks + 6 WebVTT Subtitles`);
  });
  console.log(`Obstetrical Glossary Entries Ready: ${manifest.glossaryCount}`);
}
