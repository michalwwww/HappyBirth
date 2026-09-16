'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, RefreshCw, Play, ArrowRight, Lightbulb, BookmarkCheck, Heart } from 'lucide-react';
import { DailyTip, getTodayTip, getRandomTip } from '@/lib/daily-tips';

interface DailyTipCardProps {
  className?: string;
  variant?: 'banner' | 'card' | 'teaser';
}

export function DailyTipCard({ className = '', variant = 'card' }: DailyTipCardProps) {
  const isDev = typeof window !== 'undefined' && window.location.hostname.includes('localhost');
  const strefaUrl = isDev ? '/strefa' : 'https://strefa.happybirth.pl';
  const [tip, setTip] = useState<DailyTip>(getTodayTip());
  const [saved, setSaved] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setTip(getTodayTip());
  }, []);

  const handleNextTip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setTip((prev) => getRandomTip(prev.id));
      setIsAnimating(false);
      setSaved(false);
    }, 200);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  if (variant === 'teaser') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#250A24] to-[#140513] text-white p-5 border border-[#461643] shadow-lg ${className}`}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EC008C]/20 border border-[#EC008C]/40 text-[#EC008C] text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Patent HappyBirth</span>
          </div>
          <span className="text-[11px] text-[#EAD5E5]/60 font-medium">Zmieniany co 24h</span>
        </div>

        <h4 className="font-brand-display font-bold text-base text-white mb-1.5 leading-snug">
          {tip.title}
        </h4>
        <p className="text-xs text-[#EAD5E5]/80 leading-relaxed line-clamp-2 mb-3">
          {tip.shortDesc}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-[#461643]/70">
          <button
            onClick={handleNextTip}
            className="text-[11px] text-[#EAD5E5]/70 hover:text-white flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Kolejny patent</span>
          </button>

          {tip.lessonId ? (
            <a
              href={`${strefaUrl}/lekcja/${tip.lessonId}`}
              className="text-[11px] font-semibold text-[#EC008C] hover:text-pink-300 flex items-center gap-1 transition-colors"
            >
              <span>Zobacz wideo</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-white dark:bg-[#1C081A] border border-[#EAE3DB] dark:border-[#461643] p-5 sm:p-6 shadow-md hover:shadow-lg transition-all ${className}`}
    >
      {/* Decorative top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ backgroundColor: tip.categoryColor }}
      />

      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pt-1">
        <div className="flex items-center gap-2">
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm"
            style={{ backgroundColor: tip.categoryColor }}
          >
            {tip.categoryLabel}
          </span>
          <span className="text-[11px] text-[#867A72] dark:text-[#EAD5E5]/60 font-medium flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-[#FCD705]" />
            {tip.authorNote || 'Patent z bazy HappyBirth'}
          </span>
        </div>

        <button
          onClick={handleNextTip}
          className="text-xs text-[#867A72] dark:text-[#EAD5E5]/70 hover:text-[#EC008C] dark:hover:text-white transition-colors flex items-center gap-1 font-medium"
          title="Pokaż inny patent z bazy wiedzy"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Wylosuj inny patent</span>
        </button>
      </div>

      <div className={`transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <h3 className="font-brand-display font-semibold text-lg sm:text-xl text-[#1A1512] dark:text-[#FBF8F4] mb-2 leading-snug">
          {tip.title}
        </h3>
        <p className="text-sm text-[#544A44] dark:text-[#EAD5E5]/80 leading-relaxed mb-4">
          {tip.shortDesc}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#EAE3DB] dark:border-[#461643]">
          {tip.lessonId ? (
            <a
              href={`${strefaUrl}/lekcja/${tip.lessonId}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EC008C] hover:text-[#C80077] dark:hover:text-pink-300 transition-colors group"
            >
              <div className="w-6 h-6 rounded-full bg-[#EC008C]/10 text-[#EC008C] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-3 h-3 fill-current" />
              </div>
              <span>{tip.lessonTitle || 'Przejdź do powiązanej lekcji wideo'}</span>
            </a>
          ) : (
            <div />
          )}

          <button
            onClick={handleSave}
            className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
              saved
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                : 'text-[#867A72] dark:text-[#EAD5E5]/60 hover:text-[#1A1512] dark:hover:text-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current text-rose-500' : ''}`} />
            <span>{saved ? 'Zapisano w ulubionych' : 'Zapisz patent'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
