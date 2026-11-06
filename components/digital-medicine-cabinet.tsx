'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { medicineCabinetItems, getLessonById } from '@/lib/course-data';
import { Search, Sparkles, ArrowRight, Play, Tag } from 'lucide-react';
import { czyTekstPasuje } from '@/lib/search-utils';

export function DigitalMedicineCabinet() {
  const pathname = usePathname();
  const prefix = pathname.startsWith('/strefa') ? '/strefa' : '';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Wszystko');

  const categories = [
    'Wszystko',
    'Ciąża · Objawy',
    'Zdrowie · Profilaktyka',
    'Fizjoterapia',
    'Poród · Niefarmakologiczne',
    'Poród · Medycyna',
    'Połóg · Regeneracja',
    'Laktacja',
    'Noworodek · Dolegliwości',
    'Bezpieczeństwo · SOS',
  ];

  const filteredItems = medicineCabinetItems.filter((item) => {
    const matchesCategory = activeCategory === 'Wszystko' || item.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      czyTekstPasuje(searchQuery, item.title, item.tag, item.previewText, item.category);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Header & Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj dolegliwości, pytania lub hasła (np. zgaga, wody, kolka)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] bg-white dark:bg-[color:var(--hb-karta)] text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--hb-mag)] transition-all shadow-sm placeholder:text-[color:var(--hb-ink3)]"
          />
        </div>

        <span className="text-xs text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)] shrink-0 font-medium">
          Dostępne pigułki wiedzy: <strong>{filteredItems.length}</strong>
        </span>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-[color:var(--hb-mag)] text-[color:var(--hb-cta-ink)] shadow-sm shadow-[color:color-mix(in_srgb,var(--hb-mag)_20%,transparent)]'
                : 'bg-white/80 dark:bg-[color:color-mix(in_srgb,var(--hb-karta)_80%,transparent)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] hover:border-[color:var(--hb-ink3)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const lesson = getLessonById(item.lessonId);
          return (
            <div
              key={item.id}
              className="group bg-white dark:bg-[color:var(--hb-karta)] rounded-2xl p-5 border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] hover:border-[color:var(--hb-mag)] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[color:var(--hb-mag-t)] bg-[color:color-mix(in_srgb,var(--hb-mag)_10%,transparent)] px-2.5 py-0.5 rounded-full">
                    <Tag className="w-3 h-3" />
                    {item.tag}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
                    {item.category.split('·')[0]}
                  </span>
                </div>

                <h4 className="font-brand-display font-bold text-base text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] group-hover:text-[color:var(--hb-mag-t)] transition-colors mb-1.5">
                  {item.title}
                </h4>

                <p className="text-xs text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] leading-relaxed line-clamp-2 mb-4">
                  {item.previewText}
                </p>
              </div>

              <div className="pt-3 border-t border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] flex items-center justify-between text-xs">
                <span className="text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)] font-mono">
                  {lesson ? `Lekcja ${lesson.lessonNumber} · ${lesson.durationFormatted}` : ''}
                </span>

                <Link
                  href={`${prefix}/lekcja/${item.lessonId}`}
                  className="inline-flex items-center space-x-1.5 font-bold text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] group-hover:text-[color:var(--hb-mag-t)] transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Obejrzyj lekcję</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
