import { Lesson } from './types';

/**
 * Generuje i otwiera w nowej karcie gotową do druku (A4 / Zapisz jako PDF)
 * Kartę Pracy i Podsumowanie dla wybranej lekcji z 52 lekcji HappyBirth.
 * Całkowicie eliminuje jakiekolwiek zaślepki `alert(...)`.
 */
export function openPrintableLessonWorksheet(lesson: Lesson, attachmentName?: string) {
  if (typeof window === 'undefined') return;

  const title = attachmentName || `Karta Pracy · Lekcja ${lesson.lessonNumber}`;
  const html = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <title>${title} — ${lesson.title} · HappyBirth.pl</title>
  <style>
    @page { size: A4; margin: 16mm; }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      color: #1A1512;
      background: #FBF8F4;
      margin: 0;
      padding: 24px;
      line-height: 1.6;
    }
    .sheet {
      max-width: 780px;
      margin: 0 auto;
      background: #FFFFFF;
      border: 1px solid #EAE3DB;
      border-radius: 18px;
      padding: 32px 36px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #DA0271;
      padding-bottom: 14px;
      margin-bottom: 20px;
    }
    .badge {
      display: inline-block;
      background: #FAE3EB;
      color: #DA0271;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 4px 10px;
      border-radius: 999px;
    }
    h1 { font-size: 22px; color: #250A24; margin: 8px 0 4px 0; }
    .meta { font-size: 12px; color: #867A72; }
    .box {
      background: #FDFAF6;
      border: 1px solid #EAE3DB;
      border-radius: 14px;
      padding: 16px 20px;
      margin: 16px 0;
    }
    .box h2 { font-size: 14px; color: #250A24; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.05em; }
    .lines {
      margin-top: 12px;
    }
    .line {
      border-bottom: 1px dashed #D5C8BD;
      height: 28px;
    }
    .print-btn {
      background: #DA0271;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
    }
    .footer {
      margin-top: 28px;
      padding-top: 12px;
      border-top: 1px solid #EAE3DB;
      font-size: 11px;
      color: #867A72;
      text-align: center;
    }
    @media print {
      body { background: #fff; padding: 0; }
      .sheet { border: none; padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="header">
      <div>
        <span class="badge">${title} · Etap: ${lesson.stageTitle}</span>
        <h1>Lekcja ${lesson.lessonNumber}: ${lesson.title}</h1>
        <div class="meta">Czas trwania wideo: ${lesson.durationFormatted} min · Szkoła Rodzenia Online HappyBirth.pl (Mama Gaja)</div>
      </div>
      <button class="print-btn no-print" onclick="window.print()">Drukuj / Zapisz PDF</button>
    </div>

    <div class="box">
      <h2>Esencja merytoryczna lekcji</h2>
      <p style="margin:0;font-size:13.5px;color:#3A322D;">${lesson.description}</p>
    </div>

    <div class="box">
      <h2>Checklista po obejrzeniu lekcji (Dla Mamy i Partnera)</h2>
      <ul style="margin:0;padding-left:18px;font-size:13px;color:#3A322D;">
        <li>☐ Omówiliśmy wspólnie najważniejsze wskazówki z tej lekcji.</li>
        <li>☐ Zapisaliśmy ewentualne pytania do naszej położnej lub lekarza prowadzącego.</li>
        <li>☐ Oznaczyliśmy lekcję nr ${lesson.lessonNumber} jako ukończoną w Strefie Kursantki.</li>
      </ul>
    </div>

    <div class="box">
      <h2>Wasze notatki, pytania na wizytę i ustalenia</h2>
      <div class="lines">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
    </div>

    <div class="footer">
      Notatnik Rodzica HappyBirth.pl · Opracowano z ekspertkami ze szkoły rodzenia Mama Gaja · KLARSOLUTIONS Sp. z o.o. (KRS: 0001268396, NIP: 7812118273).
    </div>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
