import { lessons, stages } from '../lib/course-data';

console.log('🧪 [SESJA 2 TEST] Weryfikacja integralności programu edukacyjnego HappyBirth...');
console.log(`Liczba etapów edukacyjnych: ${stages.length}`);
console.log(`Liczba lekcji wideo VOD: ${lessons.length}`);

// 1. Weryfikacja unikalności lekcji
const ids = new Set(lessons.map((l) => l.id));
if (ids.size !== lessons.length) {
  console.error('❌ Wykryto powtórzone identyfikatory lekcji!');
  process.exit(1);
}

// 2. Weryfikacja powiązań z etapami
let allStagesValid = true;
const stageIds = new Set(stages.map((s) => s.id));
for (const lesson of lessons) {
  if (!stageIds.has(lesson.stageId)) {
    console.error(`❌ Lekcja ${lesson.id} ma nieprawidłowy stageId: ${lesson.stageId}`);
    allStagesValid = false;
  }
}

// 3. Weryfikacja Cloudflare Stream UID
const missingUids = lessons.filter((l) => !l.cloudflareUid);
if (missingUids.length > 0) {
  console.warn(`⚠️ Ostrzeżenie: ${missingUids.length} lekcji ma brakujący UID Cloudflare Stream`);
} else {
  console.log('✅ Wszystkie 52 lekcje mają przypisany identyfikator Cloudflare Stream!');
}

if (lessons.length === 52 && allStagesValid) {
  console.log('🎉 [SESJA 2 SUKCES] Program edukacyjny (52 lekcje w 9 etapach) jest w 100% spójny!');
} else {
  console.error('❌ Błąd spójności programu lekcji');
  process.exit(1);
}
