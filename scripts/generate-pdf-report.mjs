import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const mdPath = path.resolve('AUDIT_REPORT_NOCNY.md');
const htmlPath = path.resolve('AUDIT_REPORT_NOCNY.html');
const pdfPath = path.resolve('AUDIT_REPORT_NOCNY.pdf');

const mdContent = fs.readFileSync(mdPath, 'utf-8');

// Prosty, elegancki konwerter do stylizowanego HTML
function renderHtml(content) {
  let body = content
    .replace(/^# (.*$)/gim, '<h1 class="main-title">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="sec-title">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="sub-title">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/`([^`]+)`/gim, '<code>$1</code>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/---/gim, '<hr/>');

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>Raport z Audytu HappyBirth</title>
  <style>
    @page { size: A4; margin: 20mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1A1512; line-height: 1.5; font-size: 11pt; }
    .header-bar { border-bottom: 3px solid #EC008C; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
    .logo-text { font-size: 20pt; font-weight: 800; color: #250A24; letter-spacing: -0.5px; }
    .logo-badge { background: #EC008C; color: white; padding: 4px 10px; border-radius: 99px; font-size: 8pt; font-weight: bold; text-transform: uppercase; }
    .main-title { font-size: 18pt; color: #250A24; margin-top: 10px; margin-bottom: 4px; font-weight: 800; }
    .sec-title { font-size: 13pt; color: #EC008C; margin-top: 22px; margin-bottom: 8px; border-bottom: 1px solid #EAE3DB; padding-bottom: 4px; font-weight: bold; }
    .sub-title { font-size: 11pt; color: #250A24; margin-top: 14px; margin-bottom: 4px; font-weight: bold; }
    p { margin-bottom: 10px; color: #443B35; }
    ul { margin-left: 20px; margin-bottom: 12px; color: #443B35; }
    li { margin-bottom: 4px; }
    code { background: #F3ECE5; padding: 2px 5px; border-radius: 4px; font-family: Consolas, monospace; font-size: 9pt; color: #98269C; }
    hr { border: 0; border-top: 1px solid #EAE3DB; margin: 16px 0; }
    .footer-note { margin-top: 30px; padding-top: 12px; border-top: 1px solid #EAE3DB; font-size: 8pt; color: #867A72; text-align: center; }
  </style>
</head>
<body>
  <div class="header-bar">
    <div class="logo-text">HAPPYBIRTH</div>
    <div class="logo-badge">Raport Weryfikacji & AdOps</div>
  </div>
  ${body}
  <div class="footer-note">
    Dokument wygenerowany autonomicznie przez Google Antigravity AI dla projektu HappyBirth · Poufne
  </div>
</body>
</html>`;
}

const html = renderHtml(mdContent);
fs.writeFileSync(htmlPath, html, 'utf-8');
console.log('📄 Zapisano pośredni plik HTML:', htmlPath);

// Wywołaj headless Chromium (Edge lub Chrome) do renderowania PDF
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

let browserExe = fs.existsSync(edgePath) ? edgePath : fs.existsSync(chromePath) ? chromePath : null;

if (browserExe) {
  try {
    const cmd = `"${browserExe}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" "${htmlPath}"`;
    execSync(cmd, { stdio: 'inherit' });
    console.log('🎉 Pomyślnie wygenerowano plik PDF:', pdfPath);
  } catch (err) {
    console.error('Błąd generowania PDF przez browser:', err);
  }
} else {
  console.log('ℹ️ Brak znalezionej przeglądarki Chromium w standardowych ścieżkach, pozostawiono HTML.');
}
