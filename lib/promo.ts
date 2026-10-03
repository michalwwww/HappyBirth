export function is100PercentPromo(code?: string | null): boolean {
  if (!code) return false;
  const clean = code.trim().toUpperCase();
  const validExactCodes = [
    'TEST100',
    'HAPPY100',
    'TEST',
    'FREE',
    'FREE100',
    'PROMO',
    'PROMO100',
    'RABAT',
    'RABAT100',
    'DEMO',
    'DEMO100',
    'MICHAL100',
    'START100',
    'KOD100',
    '100',
    '100%',
    'KURS100',
  ];
  if (validExactCodes.includes(clean)) return true;
  if (clean.includes('100') || clean.includes('TEST') || clean.includes('FREE') || clean.includes('DEMO')) return true;
  return false;
}

export function activateStudentAccessLocally(promoCode: string = 'TEST100') {
  if (typeof window === 'undefined') return;
  try {
    const clean = promoCode.trim().toUpperCase() || 'TEST100';
    localStorage.setItem('hb_current_role', 'student');
    localStorage.setItem('hb_unlocked', 'true');
    localStorage.setItem('hb_active_promo', clean);
    localStorage.setItem('hb_payment_status', 'success');
    sessionStorage.setItem('hb_payment', 'success');
    window.dispatchEvent(new Event('hb_role_updated'));
    window.dispatchEvent(new Event('hb_progress_updated'));
  } catch (e) {
    console.error('Error activating student access:', e);
  }
}

export function isCourseUnlockedLocally(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const role = localStorage.getItem('hb_current_role');
    const unlocked = localStorage.getItem('hb_unlocked');
    return role === 'student' || role === 'partner' || unlocked === 'true';
  } catch {
    return false;
  }
}
