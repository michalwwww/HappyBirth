'use client';

import React, { useState } from 'react';
import { 
  PregnancyProfile, 
  calculateDueDateFromLMP, 
  calculateDueDateFromWeek, 
  savePregnancyProfile 
} from '@/lib/pregnancy';
import { 
  Calendar, 
  Heart, 
  Sparkles, 
  Baby, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Shield, 
  X,
  Users
} from 'lucide-react';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: PregnancyProfile) => void;
  initialProfile?: PregnancyProfile | null;
}

export function OnboardingWizard({ 
  isOpen, 
  onClose, 
  onComplete,
  initialProfile 
}: OnboardingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Krok 1 - Data porodu
  const [dateMethod, setDateMethod] = useState<'usg' | 'om' | 'gestational_week'>(
    initialProfile?.dueDateSource || 'usg'
  );
  const [dueDate, setDueDate] = useState(initialProfile?.dueDate || '');
  const [lmpDate, setLmpDate] = useState(initialProfile?.lmpDate || '');
  const [currentWeekChoice, setCurrentWeekChoice] = useState(24);

  // Krok 2 - Dziecko i Partner
  const [babyName, setBabyName] = useState(initialProfile?.babyName || '');
  const [babyGender, setBabyGender] = useState<'girl' | 'boy' | 'surprise' | 'twins'>(
    initialProfile?.babyGender || 'surprise'
  );
  const [partnerName, setPartnerName] = useState(initialProfile?.partnerName || '');

  // Krok 3 - Preferencje i RODO
  const [parity, setParity] = useState<'first_baby' | 'subsequent_baby'>(
    initialProfile?.parity || 'first_baby'
  );
  const [plannedBirthType, setPlannedBirthType] = useState<'natural' | 'cesarean' | 'vbac' | 'undecided'>(
    initialProfile?.plannedBirthType || 'natural'
  );
  const [city, setCity] = useState(initialProfile?.city || '');
  const [rodoConsent, setRodoConsent] = useState(initialProfile ? initialProfile.rodoConsent : true);

  if (!isOpen) return null;

  // Obsługa wyliczenia daty
  const handleLmpChange = (val: string) => {
    setLmpDate(val);
    const calculatedDue = calculateDueDateFromLMP(val);
    if (calculatedDue) {
      setDueDate(calculatedDue);
    }
  };

  const handleWeekSliderChange = (week: number) => {
    setCurrentWeekChoice(week);
    const calculatedDue = calculateDueDateFromWeek(week);
    if (calculatedDue) {
      setDueDate(calculatedDue);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (dateMethod === 'gestational_week' && !dueDate) {
        setDueDate(calculateDueDateFromWeek(currentWeekChoice));
      }
      if (!dueDate) {
        alert('Prosimy o podanie daty porodu lub miesiączki, abyśmy mogli spersonalizować materiały.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleSave = () => {
    if (!dueDate) {
      alert('Termin porodu jest wymagany.');
      setStep(1);
      return;
    }

    const finalProfile: PregnancyProfile = {
      dueDate,
      dueDateSource: dateMethod,
      lmpDate: dateMethod === 'om' ? lmpDate : undefined,
      babyName: babyName.trim() || undefined,
      babyGender,
      partnerName: partnerName.trim() || undefined,
      parity,
      plannedBirthType,
      city: city.trim() || undefined,
      rodoConsent
    };

    savePregnancyProfile(finalProfile);
    onComplete(finalProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#FBF8F4] border border-[#EAE3DB] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header modalny */}
        <div className="p-6 pb-4 border-b border-[#EAE3DB] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#FAE3EB] text-[#EC008C] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-brand-display font-bold text-lg text-[#1A1512]">
                Personalizacja Twojej Strefy
              </h2>
              <p className="text-xs text-[#544A44]">
                Krok {step} z 3 · Dopasowujemy 52 lekcje do Twojego etapu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#867A72] hover:text-[#1A1512] rounded-full hover:bg-[#F6F2EC] transition-colors"
            title="Zamknij"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pasek postępu */}
        <div className="w-full bg-[#EAE3DB] h-1.5">
          <div 
            className="bg-[#EC008C] h-1.5 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Zawartość kroków */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* KROK 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#1A1512] mb-1">
                  Kiedy powitacie Wasze maleństwo?
                </h3>
                <p className="text-xs text-[#544A44]">
                  Wybierz najwygodniejszy sposób określenia etapu ciąży. W dowolnej chwili możesz go zmienić w profilu.
                </p>
              </div>

              {/* Wybór metody */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDateMethod('usg')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    dateMethod === 'usg'
                      ? 'border-[#EC008C] bg-[#FAE3EB] text-[#EC008C] font-bold shadow-sm'
                      : 'border-[#EAE3DB] bg-white text-[#544A44] hover:border-[#867A72]'
                  }`}
                >
                  <Calendar className="w-4 h-4 mx-auto mb-1" />
                  <span>Znam termin z USG / karty</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDateMethod('om')}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    dateMethod === 'om'
                      ? 'border-[#EC008C] bg-[#FAE3EB] text-[#EC008C] font-bold shadow-sm'
                      : 'border-[#EAE3DB] bg-white text-[#544A44] hover:border-[#867A72]'
                  }`}
                >
                  <Heart className="w-4 h-4 mx-auto mb-1" />
                  <span>Znam datę miesiączki (OM)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDateMethod('gestational_week');
                    handleWeekSliderChange(currentWeekChoice);
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    dateMethod === 'gestational_week'
                      ? 'border-[#EC008C] bg-[#FAE3EB] text-[#EC008C] font-bold shadow-sm'
                      : 'border-[#EAE3DB] bg-white text-[#544A44] hover:border-[#867A72]'
                  }`}
                >
                  <Sparkles className="w-4 h-4 mx-auto mb-1" />
                  <span>Wiem, który to tydzień</span>
                </button>
              </div>

              {/* Formularz dla metody USG */}
              {dateMethod === 'usg' && (
                <div className="bg-white p-4 rounded-2xl border border-[#EAE3DB] space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44]">
                    Przewidywany termin porodu (z karty ciąży):
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
                  />
                  <p className="text-[11px] text-[#867A72]">
                    Data wyznaczona przez lekarza na podstawie USG genetycznego CRL lub karty ciąży.
                  </p>
                </div>
              )}

              {/* Formularz dla metody OM */}
              {dateMethod === 'om' && (
                <div className="bg-white p-4 rounded-2xl border border-[#EAE3DB] space-y-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] mb-1">
                      Pierwszy dzień ostatniej miesiączki:
                    </label>
                    <input
                      type="date"
                      value={lmpDate}
                      onChange={(e) => handleLmpChange(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
                    />
                  </div>
                  {dueDate && (
                    <div className="p-3 bg-[#FAE3EB] rounded-xl border border-[#F3CAD9] text-xs text-[#EC008C] flex items-center justify-between">
                      <span>Wyliczony termin (Reguła Naegelego):</span>
                      <strong className="text-sm">{dueDate}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* Formularz dla metody suwaka tygodnia */}
              {dateMethod === 'gestational_week' && (
                <div className="bg-white p-4 rounded-2xl border border-[#EAE3DB] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#544A44]">
                      Obecny tydzień ciąży:
                    </label>
                    <span className="text-sm font-bold text-[#EC008C] bg-[#FAE3EB] px-2.5 py-0.5 rounded-full">
                      {currentWeekChoice}. tydzień
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="41"
                    value={currentWeekChoice}
                    onChange={(e) => handleWeekSliderChange(Number(e.target.value))}
                    className="w-full accent-[#EC008C] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#867A72]">
                    <span>4 tc (Początek)</span>
                    <span>20 tc (Półmetek)</span>
                    <span>40 tc (Termin)</span>
                  </div>
                  {dueDate && (
                    <p className="text-[11px] text-[#867A72] text-center pt-1">
                      Szacowany termin porodu: <strong>{dueDate}</strong>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* KROK 2 */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#1A1512] mb-1">
                  Poznajmy Was bliżej!
                </h3>
                <p className="text-xs text-[#544A44]">
                  Dzięki temu treści będą zwracać się bezpośrednio do Was i Waszego maleństwa.
                </p>
              </div>

              {/* Imię dziecka */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44]">
                  Imię dziecka (lub jak je czule nazywacie):
                </label>
                <div className="relative">
                  <Baby className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#867A72]" />
                  <input
                    type="text"
                    value={babyName}
                    onChange={(e) => setBabyName(e.target.value)}
                    placeholder="np. Zosia, Janek, nasz Skarb..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
                  />
                </div>
                <p className="text-[11px] text-[#867A72]">
                  Możesz zostawić puste, jeśli jeszcze wybieracie imię.
                </p>
              </div>

              {/* Płeć dziecka */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44]">
                  Płeć maluszka:
                </label>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'girl', label: 'Córeczka', icon: '👧' },
                    { id: 'boy', label: 'Synek', icon: '👦' },
                    { id: 'surprise', label: 'Niespodzianka', icon: '🎁' },
                    { id: 'twins', label: 'Bliźniaki', icon: '👶👶' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBabyGender(item.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        babyGender === item.id
                          ? 'border-[#EC008C] bg-[#FAE3EB] text-[#EC008C] font-bold shadow-sm'
                          : 'border-[#EAE3DB] bg-white text-[#544A44] hover:border-[#867A72]'
                      }`}
                    >
                      <div className="text-base mb-0.5">{item.icon}</div>
                      <span className="text-[11px]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Imię Partnera */}
              <div className="space-y-1.5 pt-2 border-t border-[#EAE3DB]">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44]">
                  Imię Partnera / Taty:
                </label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#867A72]" />
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="np. Michał, Tomek..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:ring-2 focus:ring-[#98269C]"
                  />
                </div>
                <p className="text-[11px] text-[#867A72]">
                  W module <strong>Strefa Partnera</strong> przygotujemy dla Niego imienną ściągę na salę porodową!
                </p>
              </div>
            </div>
          )}

          {/* KROK 3 */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#1A1512] mb-1">
                  Plan porodu i preferencje
                </h3>
                <p className="text-xs text-[#544A44]">
                  Dostosujemy rekomendacje technik oddechowych i znieczulenia do Twojej drogi.
                </p>
              </div>

              {/* Kolejność porodu */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44]">
                  Czy to Twój pierwszy poród?
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setParity('first_baby')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      parity === 'first_baby'
                        ? 'border-[#EC008C] bg-[#FAE3EB] text-[#EC008C] font-bold'
                        : 'border-[#EAE3DB] bg-white text-[#544A44]'
                    }`}
                  >
                    Tak, pierwsze dziecko
                  </button>
                  <button
                    type="button"
                    onClick={() => setParity('subsequent_baby')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      parity === 'subsequent_baby'
                        ? 'border-[#EC008C] bg-[#FAE3EB] text-[#EC008C] font-bold'
                        : 'border-[#EAE3DB] bg-white text-[#544A44]'
                    }`}
                  >
                    Kolejne dziecko (wieloródka)
                  </button>
                </div>
              </div>

              {/* Preferowany rodzaj porodu */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44]">
                  Planowany rodzaj porodu:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'natural', label: 'Poród siłami natury (SN)' },
                    { id: 'cesarean', label: 'Planowane cięcie cesarskie' },
                    { id: 'vbac', label: 'VBAC (naturalny po CC)' },
                    { id: 'undecided', label: 'Jeszcze nie zdecydowałam' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPlannedBirthType(opt.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        plannedBirthType === opt.id
                          ? 'border-[#EC008C] bg-[#FAE3EB] text-[#EC008C] font-semibold'
                          : 'border-[#EAE3DB] bg-white text-[#544A44]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Miasto porodu */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44]">
                  Miasto lub planowany szpital (opcjonalnie):
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="np. Warszawa, Szpital Żelazna / Poznań, Polna..."
                  className="w-full px-4 py-2 rounded-xl border border-[#EAE3DB] text-sm focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
                />
              </div>

              {/* Zgoda RODO - dane medyczne */}
              <div className="p-3.5 bg-white rounded-2xl border border-[#EAE3DB] flex items-start gap-3">
                <input
                  type="checkbox"
                  id="rodo_consent"
                  checked={rodoConsent}
                  onChange={(e) => setRodoConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#EC008C] rounded cursor-pointer"
                />
                <label htmlFor="rodo_consent" className="text-[11px] text-[#544A44] leading-relaxed cursor-pointer">
                  <span className="font-semibold text-[#1A1512]">Zgoda na personalizację (RODO): </span>
                  Wyrażam zgodę na przetwarzanie podanych danych dotyczących przebiegu ciąży w celu personalizacji programu edukacyjnego, rekomendacji lekcji i narzędzi w Strefie HappyBirth. Dane są poufne i chronione.
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Stopka modalna z nawigacją */}
        <div className="p-5 border-t border-[#EAE3DB] bg-white flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((step - 1) as any)}
              className="px-4 py-2.5 rounded-full border border-[#EAE3DB] text-xs font-semibold text-[#544A44] hover:bg-[#F6F2EC] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Wstecz</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-[#867A72] hover:text-[#1A1512] px-2 py-1"
            >
              Uzupełnię później
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-xs font-semibold transition-all shadow-md shadow-[#EC008C]/25 flex items-center gap-1.5"
            >
              <span>Dalej</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-full bg-[#EC008C] hover:bg-[#D0007A] text-white text-xs font-semibold transition-all shadow-md shadow-[#EC008C]/25 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Zapisz i spersonalizuj kurs</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
