'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Check, 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  Baby, 
  User, 
  RotateCcw,
  Download,
  Info
} from 'lucide-react';

interface PlanSection {
  id: string;
  title: string;
  category: string;
  options: { id: string; label: string; recommended?: boolean }[];
}

const SECTIONS: PlanSection[] = [
  {
    id: 'atmosfera',
    title: '1. Warunki i atmosfera na sali porodowej',
    category: 'Otoczenie',
    options: [
      { id: 'opt_partner', label: 'Obecność partnera / osoby towarzyszącej przez cały czas trwania porodu', recommended: true },
      { id: 'opt_swiatlo', label: 'Przygaszone, intymne oświetlenie na sali porodowej', recommended: true },
      { id: 'opt_wlasne_ubranie', label: 'Możliwość rodzenia we własnej koszuli porodowej', recommended: true },
      { id: 'opt_plyny', label: 'Swobodne picie niegazowanej wody i napojów izotonicznych', recommended: true },
      { id: 'opt_muzyka', label: 'Możliwość odtwarzania własnej relaksacyjnej muzyki z telefonu' },
    ],
  },
  {
    id: 'faza1',
    title: '2. I Okres Porodu (Skurcze i rozwieranie)',
    category: 'Ruch i Łagodzenie Bólu',
    options: [
      { id: 'opt_ruch', label: 'Swoboda poruszania się, spacerowania i zmian pozycji (piłka, worek sako)', recommended: true },
      { id: 'opt_woda', label: 'Dostęp do ciepłego prysznica lub wanny (hydroterapia)', recommended: true },
      { id: 'opt_niefarm', label: 'Masaż krzyżowy przez partnera, techniki oddechowe i ciepłe okłady', recommended: true },
      { id: 'opt_pecherz', label: 'Zgoda na przebicie pęcherza płodowego (amniotomię) tylko przy medycznych wskazaniach', recommended: true },
      { id: 'opt_wenflon', label: 'Kaniulacja (wenflon) z zatyczką mandrynową bez stałego podłączenia kroplówki' },
      { id: 'opt_zzo', label: 'Prośba o znieczulenie zewnątrzoponowe (ZZO) w razie silnego bólu' },
    ],
  },
  {
    id: 'faza2',
    title: '3. II Okres Porodu (Parcie i narodziny)',
    category: 'Ochrona Krocza i Pozycje',
    options: [
      { id: 'opt_parcie_spontaniczne', label: 'Parcie spontaniczne, zgodne z naturalnym odruchem mojego ciała (bez odliczania do 10)', recommended: true },
      { id: 'opt_wertykalne', label: 'Wybór pozycji wertykalnej do porodu (kuczna, na czworaka, w klęku, stołek porodowy)', recommended: true },
      { id: 'opt_ochrona_krocza', label: 'Aktywna ochrona krocza przed rutynowym nacięciem (episiotomią) z użyciem ciepłych kompresów', recommended: true },
      { id: 'opt_pepowina_tata', label: 'Przecięcie pępowiny przez tatę / partnera po całkowitym ustaniu tętnienia', recommended: true },
    ],
  },
  {
    id: 'kontakt',
    title: '4. Po Narodzinach (Kontakt skóra do skóry & Noworodek)',
    category: 'Pierwsze Chwile',
    options: [
      { id: 'opt_skora_do_skory', label: 'Nieprzerwany kontakt „skóra do skóry” (kangurowanie) przez minimum 2 godziny po porodzie', recommended: true },
      { id: 'opt_karmienie_1h', label: 'Wsparcie w pierwszym przystawieniu do piersi w trakcie pierwszych 2 godzin', recommended: true },
      { id: 'opt_badania_na_brzuchu', label: 'Wstępna ocena w skali Apgar i pierwsze badanie na brzuchu mamy', recommended: true },
      { id: 'opt_tata_kangurowanie', label: 'Kangurowanie przez tatę w razie konieczności zaopatrzenia mamy (np. po cięciu cesarskim)', recommended: true },
      { id: 'opt_kapiel_odroczona', label: 'Odroczona pierwsza kąpiel (zachowanie ochronnej mazi płodowej przez min. 24h)', recommended: true },
    ],
  },
];

export function BirthPlanGenerator() {
  const [motherName, setMotherName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
  const [customNotes, setCustomNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Inicjalizacja domyślnych rekomendacji
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem('hb_birth_plan_data');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setMotherName(parsed.motherName || '');
          setPartnerName(parsed.partnerName || '');
          setHospitalName(parsed.hospitalName || '');
          setDueDate(parsed.dueDate || '');
          setSelectedOptions(parsed.selectedOptions || {});
          setCustomNotes(parsed.customNotes || '');
          return;
        }
      } catch {}

      // Default recommendations
      const initial: Record<string, boolean> = {};
      SECTIONS.forEach((sec) => {
        sec.options.forEach((opt) => {
          if (opt.recommended) {
            initial[opt.id] = true;
          }
        });
      });
      setSelectedOptions(initial);
    }
  }, []);

  const toggleOption = (id: string) => {
    const updated = { ...selectedOptions, [id]: !selectedOptions[id] };
    setSelectedOptions(updated);
    saveData(updated);
  };

  const saveData = (opts = selectedOptions) => {
    if (typeof window !== 'undefined') {
      const data = {
        motherName,
        partnerName,
        hospitalName,
        dueDate,
        selectedOptions: opts,
        customNotes,
      };
      localStorage.setItem('hb_birth_plan_data', JSON.stringify(data));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const resetToDefault = () => {
    const initial: Record<string, boolean> = {};
    SECTIONS.forEach((sec) => {
      sec.options.forEach((opt) => {
        if (opt.recommended) initial[opt.id] = true;
      });
    });
    setSelectedOptions(initial);
    saveData(initial);
  };

  const handlePrint = () => {
    saveData();
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="bg-white dark:bg-[#1C081A] rounded-2xl border border-[#EAE3DB] dark:border-[#461643] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm print:hidden">
        <div className="flex items-center gap-2 text-xs text-[#544A44] dark:text-[#EAD5E5]/80">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Zgodny ze Standardem Organizacyjnym Opieki Okołoporodowej (Rozp. MZ)</span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={resetToDefault}
            type="button"
            className="px-3 py-2 rounded-xl border border-[#EAE3DB] dark:border-[#461643] text-xs font-semibold text-[#867A72] hover:text-[#1A1512] dark:hover:text-white transition-colors flex items-center gap-1.5"
            title="Przywróć rekomendowane opcje położnicze"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Domyślne</span>
          </button>

          <button
            onClick={handlePrint}
            type="button"
            className="px-4 py-2 rounded-xl bg-[#EC008C] hover:bg-[#D0007A] text-white text-xs font-semibold shadow-md shadow-[#EC008C]/25 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Drukuj / Pobierz PDF</span>
          </button>
        </div>
      </div>

      {/* Main Printable Document Card */}
      <div className="bg-white dark:bg-[#1C081A] rounded-3xl border border-[#EAE3DB] dark:border-[#461643] p-6 sm:p-10 shadow-lg print:shadow-none print:border-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-[#EAE3DB] dark:border-[#461643] pb-6 mb-8 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAE3EB] dark:bg-[#370E35] text-[#EC008C] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dokument do karty ciąży</span>
          </div>
          <h2 className="font-brand-display font-bold text-2xl sm:text-4xl text-[#1A1512] dark:text-[#FBF8F4]">
            Mój Plan Porodu
          </h2>
          <p className="text-xs sm:text-sm text-[#867A72] dark:text-[#EAD5E5]/70 max-w-2xl mx-auto">
            Niniejszy dokument przedstawia moje świadome preferencje dotyczące przebiegu porodu i opieki nad noworodkiem, sporządzone w porozumieniu z osobą towarzyszącą zgodnie z prawami pacjenta.
          </p>
        </div>

        {/* Input Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#FBF8F4] dark:bg-[#250A24] border border-[#EAE3DB] dark:border-[#461643] mb-8">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#867A72] dark:text-[#EAD5E5]/70 mb-1">
              Imię i Nazwisko Mamy:
            </label>
            <input
              type="text"
              value={motherName}
              onChange={(e) => { setMotherName(e.target.value); saveData(); }}
              placeholder="np. Anna Kowalska"
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-[#EAE3DB] dark:border-[#461643] bg-white dark:bg-[#140513] text-[#1A1512] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#867A72] dark:text-[#EAD5E5]/70 mb-1">
              Osoba Towarzysząca (Tata):
            </label>
            <input
              type="text"
              value={partnerName}
              onChange={(e) => { setPartnerName(e.target.value); saveData(); }}
              placeholder="np. Piotr Kowalski (mąż)"
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-[#EAE3DB] dark:border-[#461643] bg-white dark:bg-[#140513] text-[#1A1512] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#867A72] dark:text-[#EAD5E5]/70 mb-1">
              Planowany Szpital:
            </label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => { setHospitalName(e.target.value); saveData(); }}
              placeholder="np. Szpital im. Raszei"
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-[#EAE3DB] dark:border-[#461643] bg-white dark:bg-[#140513] text-[#1A1512] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#867A72] dark:text-[#EAD5E5]/70 mb-1">
              Przewidywany Termin Porodu:
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => { setDueDate(e.target.value); saveData(); }}
              className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-[#EAE3DB] dark:border-[#461643] bg-white dark:bg-[#140513] text-[#1A1512] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
            />
          </div>
        </div>

        {/* Plan Sections */}
        <div className="space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.id} className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#EAE3DB] dark:border-[#461643] pb-2">
                <h3 className="font-brand-display font-bold text-base sm:text-lg text-[#1A1512] dark:text-[#FBF8F4]">
                  {section.title}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#EC008C] bg-[#FAE3EB] dark:bg-[#370E35] px-2.5 py-0.5 rounded-full">
                  {section.category}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {section.options.map((option) => {
                  const isChecked = !!selectedOptions[option.id];
                  return (
                    <div
                      key={option.id}
                      onClick={() => toggleOption(option.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-[#FAE3EB]/40 dark:bg-[#EC008C]/10 border-[#EC008C] text-[#1A1512] dark:text-white font-medium'
                          : 'bg-white dark:bg-[#1C081A] border-[#EAE3DB] dark:border-[#461643] text-[#544A44] dark:text-[#EAD5E5]/70 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-colors ${
                          isChecked ? 'bg-[#EC008C] text-white' : 'border border-stone-300 dark:border-stone-600'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className="text-xs leading-relaxed">{option.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Indywidualne Uwagi Rodziców */}
          <div className="space-y-2 pt-2">
            <h3 className="font-brand-display font-bold text-base text-[#1A1512] dark:text-[#FBF8F4]">
              5. Indywidualne uwagi i ważne informacje medyczne:
            </h3>
            <textarea
              value={customNotes}
              onChange={(e) => { setCustomNotes(e.target.value); saveData(); }}
              placeholder="np. noszę soczewki kontaktowe; w razie konieczności cięcia proszę o natychmiastowe kangurowanie przez tatę; zależy mi na niefarmakologicznych metodach tak długo, jak to możliwe..."
              rows={3}
              className="w-full text-xs p-3 rounded-xl border border-[#EAE3DB] dark:border-[#461643] bg-white dark:bg-[#140513] text-[#1A1512] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#EC008C]"
            />
          </div>
        </div>

        {/* Footer of the Document */}
        <div className="mt-8 pt-6 border-t border-[#EAE3DB] dark:border-[#461643] flex flex-wrap items-center justify-between gap-4 text-[11px] text-[#867A72] dark:text-[#EAD5E5]/60">
          <div>
            <span>Przygotowano w Strefie Rodziców <strong>HappyBirth.pl</strong></span>
          </div>
          <div className="flex items-center gap-6">
            <span>Podpis Mamy: .......................................</span>
            <span>Podpis Położnej: .......................................</span>
          </div>
        </div>
      </div>
    </div>
  );
}
