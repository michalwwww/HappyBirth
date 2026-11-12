'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Scale,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Filter,
  HeartHandshake,
} from 'lucide-react';

export interface KnowledgeLessonLink {
  num: number;
  publicTitle: string;
  isFree?: boolean;
}

export interface KnowledgeEntry {
  id: string;
  number: number;
  category: string;
  badge2026?: 'NOWE 2026' | 'ZMIANA 2026';
  title: string;
  summary: string;
  practicalTip: string;
  legalAct: string;
  legalSection: string;
  legalParaphrase: string;
  isapUrl: string;
  lessons: KnowledgeLessonLink[];
}

interface DlaCiebieExplorerProps {
  entries: KnowledgeEntry[];
  categories: string[];
}

const STORAGE_KEY = 'hb_saved_rights_v1';

export function DlaCiebieExplorer({ entries, categories }: DlaCiebieExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Wszystkie');
  const [only2026, setOnly2026] = useState<boolean>(false);
  const [onlySaved, setOnlySaved] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSavedIds(parsed);
        }
      }
    } catch (_) {
      // Ignorujemy błędy dostępu do localStorage (100% prywatności lokalnej)
    }
  }, []);

  const toggleSave = (id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  };

  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      if (selectedCategory !== 'Wszystkie' && item.category !== selectedCategory) {
        return false;
      }
      if (only2026 && !item.badge2026) {
        return false;
      }
      if (onlySaved && !savedIds.includes(item.id)) {
        return false;
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSummary = item.summary.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        const matchTip = item.practicalTip.toLowerCase().includes(q);
        return matchTitle || matchSummary || matchCategory || matchTip;
      }
      return true;
    });
  }, [entries, selectedCategory, only2026, onlySaved, searchQuery, savedIds]);

  return (
    <div className="space-y-8">
      {/* Panel wyszukiwania i filtrów */}
      <div className="bg-white dark:bg-[#1E081D] rounded-3xl p-5 sm:p-7 border border-[#EAE3DB] dark:border-[#3A1038] shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Wyszukiwarka */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#867A72] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj hasła, prawa lub sytuacji (np. osoba bliska, posiłek, kangurowanie, plan porodu)..."
              aria-label="Wyszukaj w bazie wiedzy"
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#FBF8F4] dark:bg-[#140513] border border-[#EAE3DB] dark:border-[#3A1038] text-sm text-[#1A1512] dark:text-[#FBF8F4] placeholder:text-[#867A72] focus:outline-none focus:border-[#DA0271]"
            />
          </div>

          {/* Szybkie przełączniki: Zmiany 2026 + Zapisane na liście */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setOnly2026((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                only2026
                  ? 'bg-[#DA0271] text-white border-[#DA0271]'
                  : 'bg-[#FBF8F4] dark:bg-[#270B25] text-[#250A24] dark:text-[#EAD5E5] border-[#EAE3DB] dark:border-[#3A1038] hover:border-[#DA0271]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tylko zmiany od 7 maja 2026</span>
            </button>

            <button
              type="button"
              onClick={() => setOnlySaved((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                onlySaved
                  ? 'bg-[#250A24] text-[#FECB22] border-[#250A24]'
                  : 'bg-[#FBF8F4] dark:bg-[#270B25] text-[#250A24] dark:text-[#EAD5E5] border-[#EAE3DB] dark:border-[#3A1038] hover:border-[#DA0271]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Moja lista ({savedIds.length})</span>
            </button>
          </div>
        </div>

        {/* Pigułki 9 kategorii */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6E625A] dark:text-[#C5B5C3]">
            <span className="inline-flex items-center gap-1.5 font-semibold">
              <Filter className="w-3.5 h-3.5 text-[#DA0271]" />
              <span>Kategorie tematyczne:</span>
            </span>
            <span className="font-semibold">
              Widoczne hasła: <strong className="text-[#DA0271]">{filteredEntries.length}</strong> z {entries.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Kategorie bazy wiedzy">
            {['Wszystkie', ...categories].map((cat) => {
              const active = selectedCategory === cat;
              const count =
                cat === 'Wszystkie'
                  ? entries.length
                  : entries.filter((e) => e.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-[#250A24] dark:bg-[#FECB22] text-white dark:text-[#1A1512] shadow-sm'
                      : 'bg-[#FBF8F4] dark:bg-[#140513] text-[#544A44] dark:text-[#EAD5E5] border border-[#EAE3DB] dark:border-[#3A1038] hover:border-[#DA0271]'
                  }`}
                >
                  {cat} <span className="opacity-70 ml-0.5">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-[11px] text-[#867A72] dark:text-[#A2958C]">
          Twoje zakładki („Moja lista”) zapisują się wyłącznie w pamięci Twojej przeglądarki. Żadne wybory nie są wysyłane na serwer ani udostępniane podmiotom zewnętrznym.
        </p>
      </div>

      {/* Lista 21 haseł E-E-A-T */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white dark:bg-[#1E081D] rounded-3xl p-10 text-center border border-[#EAE3DB] dark:border-[#3A1038] space-y-3">
          <p className="font-brand-display font-bold text-lg text-[#250A24] dark:text-white">
            Brak haseł spełniających wybrane kryteria
          </p>
          <p className="text-sm text-[#6E625A] dark:text-[#C5B5C3]">
            Spróbuj wyczyścić pole wyszukiwania lub przełączyć kategorię na „Wszystkie”.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('Wszystkie');
              setOnly2026(false);
              setOnlySaved(false);
              setSearchQuery('');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#DA0271] text-white text-xs font-bold"
          >
            Pokaż wszystkie {entries.length} haseł
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {filteredEntries.map((entry) => {
            const isSaved = savedIds.includes(entry.id);
            return (
              <article
                key={entry.id}
                id={entry.id}
                className="bg-white dark:bg-[#1E081D] rounded-3xl p-6 sm:p-8 border border-[#EAE3DB] dark:border-[#3A1038] shadow-sm hover:border-[#DA0271]/50 transition-all space-y-5 scroll-mt-24"
              >
                {/* Górna belka karty: numer, kategoria, odznaka 2026, przycisk zakładki */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2ECE4] dark:border-[#2E0C2C] pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#250A24] text-[#FECB22] text-xs font-bold">
                      {String(entry.number).padStart(2, '0')}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#FBF8F4] dark:bg-[#270B25] border border-[#EAE3DB] dark:border-[#3A1038] text-xs font-semibold text-[#544A44] dark:text-[#EAD5E5]">
                      {entry.category}
                    </span>
                    {entry.badge2026 && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAE3EB] dark:bg-[#4A0E35] text-[#DA0271] dark:text-[#FF85C0] text-xs font-bold">
                        <Sparkles className="w-3 h-3" />
                        <span>{entry.badge2026} · od 7 maja 2026 r.</span>
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSave(entry.id)}
                    aria-label={isSaved ? 'Usuń z mojej listy' : 'Zapisz na mojej liście'}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-[#FECB22] text-[#1A1512]'
                        : 'bg-[#FBF8F4] dark:bg-[#270B25] text-[#544A44] dark:text-[#EAD5E5] hover:text-[#DA0271]'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="w-3.5 h-3.5" />
                        <span>Zapisane na liście</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Zapisz dla nas</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Tytuł hasła (H3) i objaśnienie Answer-First */}
                <div className="space-y-3">
                  <h3 className="font-brand-display font-bold text-xl sm:text-2xl text-[#250A24] dark:text-white leading-snug">
                    {entry.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#4A403A] dark:text-[#EAD5E5] leading-relaxed">
                    {entry.summary}
                  </p>
                </div>

                {/* Praktyczna wskazówka dla mamy i osoby towarzyszącej */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FBF8F4] dark:bg-[#140513] border border-[#EAE3DB] dark:border-[#3A1038] flex items-start gap-3">
                  <HeartHandshake className="w-5 h-5 text-[#DA0271] shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs sm:text-sm">
                    <span className="font-bold text-[#250A24] dark:text-[#FECB22] block">
                      Wskazówka praktyczna dla Was (jak zastosować w praktyce):
                    </span>
                    <p className="text-[#544A44] dark:text-[#C5B5C3] leading-relaxed">
                      {entry.practicalTip}
                    </p>
                  </div>
                </div>

                {/* Rozwijana podstawa prawna (Sterylna parafraza + link do ISAP) */}
                <details className="group rounded-2xl border border-[#EAE3DB] dark:border-[#3A1038] bg-[#FDFCFB] dark:bg-[#180617] overflow-hidden">
                  <summary className="px-4 py-3 text-xs sm:text-sm font-bold text-[#250A24] dark:text-[#EAD5E5] flex items-center justify-between cursor-pointer select-none hover:bg-[#F5EFE8] dark:hover:bg-[#240922] transition-colors">
                    <span className="inline-flex items-center gap-2">
                      <Scale className="w-4 h-4 text-[#0097DB] shrink-0" />
                      <span>
                        Zobacz podstawę prawną: {entry.legalAct} ({entry.legalSection})
                      </span>
                    </span>
                    <ChevronDown className="w-4 h-4 text-[#867A72] transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-4 pb-4 pt-2 text-xs sm:text-sm text-[#544A44] dark:text-[#C5B5C3] border-t border-[#EAE3DB] dark:border-[#3A1038] space-y-2.5">
                    <p className="leading-relaxed">{entry.legalParaphrase}</p>
                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
                      <a
                        href={entry.isapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-[#0078AD] dark:text-[#58C4F6] hover:underline"
                      >
                        <span>Tekst urzędowy w ISAP Sejm RP</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </details>

                {/* Powiązane lekcje w kursie HappyBirth */}
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6E625A] dark:text-[#C5B5C3] mr-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#DA0271]" />
                    <span>Omówienie w kursie wideo:</span>
                  </span>
                  {entry.lessons.map((les) => (
                    <Link
                      key={les.num}
                      href={les.isFree ? '/#bezplatna-lekcja' : `/program#lekcja-${les.num}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FBF8F4] dark:bg-[#270B25] hover:bg-[#FAE3EB] dark:hover:bg-[#3A1038] border border-[#EAE3DB] dark:border-[#3A1038] text-xs font-semibold text-[#250A24] dark:text-[#EAD5E5] transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[#DA0271]" />
                      <span>
                        Lekcja {les.num}: {les.publicTitle}
                      </span>
                      {les.isFree && (
                        <span className="ml-1 px-1.5 py-0.5 rounded bg-[#FECB22] text-[#1A1512] text-[10px] font-bold">
                          BEZPŁATNA
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
