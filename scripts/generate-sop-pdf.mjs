import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const mdPath = path.resolve('INSTRUKCJA_STARTU_KAMPANII_SOP.md');
const htmlPath = path.resolve('INSTRUKCJA_STARTU_KAMPANII_SOP.html');
const pdfPath = path.resolve('INSTRUKCJA_STARTU_KAMPANII_SOP.pdf');

if (!fs.existsSync(mdPath)) {
  console.error('Brak pliku:', mdPath);
  process.exit(1);
}

const mdContent = fs.readFileSync(mdPath, 'utf-8');

function renderHtml(content) {
  let body = content
    .replace(/^# (.*$)/gim, '<h1 class="main-title">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="sec-title">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="sub-title">$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4 class="sub-sub-title">$1</h4>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/---/gim, '<hr/>');

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Instrukcja Startu Kampanii HappyBirth</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1A1512; line-height: 1.5; font-size: 10pt; }
    .header-bar { border-bottom: 3px solid #EC008C; padding-bottom: 8px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
    .logo-text { font-size: 18pt; font-weight: 800; color: #250A24; letter-spacing: -0.5px; }
    .logo-badge { background: #EC008C; color: white; padding: 4px 10px; border-radius: 99px; font-size: 8pt; font-weight: bold; text-transform: uppercase; }
    .main-title { font-size: 16pt; color: #250A24; margin-top: 8px; margin-bottom: 4px; font-weight: 800; }
    .sec-title { font-size: 12pt; color: #EC008C; margin-top: 18px; margin-bottom: 6px; border-bottom: 1px solid #EAE3DB; padding-bottom: 3px; font-weight: bold; }
    .sub-title { font-size: 10.5pt; color: #250A24; margin-top: 12px; margin-bottom: 4px; font-weight: bold; }
    p { margin-bottom: 8px; color: #443B35; }
    ul, ol { margin-left: 18px; margin-bottom: 10px; color: #443B35; }
    li { margin-bottom: 3px; }
    code { background: #F3ECE5; padding: 2px 4px; border-radius: 4px; font-family: Consolas, monospace; font-size: 8.5pt; color: #98269C; }
    blockquote { background: #FFF5F9; border-left: 4px solid #EC008C; padding: 8px 14px; margin: 10px 0; font-style: italic; color: #443B35; border-radius: 0 6px 6px 0; }
    hr { border: 0; border-top: 1px solid #EAE3DB; margin: 14px 0; }
    .footer-note { margin-top: 24px; padding-top: 10px; border-top: 1px solid #EAE3DB; font-size: 8pt; color: #867A72; text-align: center; }
  </style>
</head>
<body>
  <div class="header-bar">
    <div class="logo-text">HAPPYBIRTH</div>
    <div class="logo-badge">SOP · Start Kampanii & AdOps</div>
  </div>
  ${body}
  <div class="footer-note">
    Dokument operacyjny wygenerowany przez Google Antigravity AI dla projektu HappyBirth · Poufne
  </div>
</body>
</html>`;
}

fs.writeFileSync(htmlPath, renderHtml(mdContent), 'utf-8');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let browserExe = fs.existsSync(edgePath) ? edgePath : fs.existsSync(chromePath) ? chromePath : null;

if (browserExe) {
  try {
    const cmd = `"${browserExe}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" "${htmlPath}"`;
    execSync(cmd, { stdio: 'inherit' });
    console.log('🎉 Pomyślnie wygenerowano plik PDF:', pdfPath);
  } catch (err) {
    console.error('Błąd generowania PDF:', err);
  }
} else {
  console.log('ℹ️ Pozostawiono plik HTML:', htmlPath);
}
