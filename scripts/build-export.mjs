import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const apiPath = path.join(projectRoot, 'app', 'api');
const tempApiPath = path.join(projectRoot, 'temp_api_export');

console.log('🚀 Rozpoczynam bezpieczny eksport statyczny...');

let moved = false;
try {
  if (fs.existsSync(apiPath)) {
    console.log('📦 Zabezpieczam dynamiczne API routes (app/api -> temp_api_export)...');
    fs.renameSync(apiPath, tempApiPath);
    moved = true;
  }

  console.log('⚡ Uruchamiam next build (generowanie out/)...');
  execSync('npx next build', {
    cwd: projectRoot,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production', NEXT_EXPORT: 'true' },
  });

  console.log('✅ Eksport statyczny zakończony sukcesem!');
} catch (error) {
  console.error('❌ Błąd podczas budowania:', error);
  process.exitCode = 1;
} finally {
  if (moved && fs.existsSync(tempApiPath)) {
    console.log('🔄 Przywracam app/api...');
    fs.renameSync(tempApiPath, apiPath);
    console.log('✨ app/api pomyślnie przywrócone.');
  }
}
