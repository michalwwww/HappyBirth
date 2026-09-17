'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Play, ArrowRight, Heart } from 'lucide-react';
import { DailyTip, HAPPYBIRTH_DAILY_TIPS, getTodayTip, getRandomTip } from '@/lib/daily-tips';
import { useSiteUrls } from '@/lib/site-urls';

interface DailyTipCardProps {
  className?: string;
  variant?: 'banner' | 'card' | 'teaser';
}

/**
 * Patent dnia: jeden konkret z 52 lekcji. Wariant „card” na stronie głównej
 * (papier i atrament), wariant „teaser” w Strefie (paleta śliwkowa panelu).
 */
export function DailyTipCard({ className = '', variant = 'card' }: DailyTipCardProps) {
  const urls = useSiteUrls();
  // Deterministyczny start (ten sam tip na serwerze i kliencie), patent dnia po zamontowaniu
  const [tip, setTip] = useState<DailyTip>(HAPPYBIRTH_DAILY_TIPS[0]);
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

  const handleSave = () => setSaved(!saved);

  if (variant === 'teaser') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#250A24] to-[#140513] text-white p-5 border border-[#461643] shadow-lg ${className}`}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EC008C]/20 border border-[#EC008C]/40 text-[#EC008C] text-[11px] font-bold uppercase tracking-wider">
            <span>Patent HappyBirth</span>
          </div>
          <span className="text-[11px] text-[#EAD5E5]/60 font-medium">Zmieniany co 24h</span>
        </div>

        <h4 className="font-brand-display font-medium text-base text-white mb-1.5 leading-snug">{tip.title}</h4>
        <p className="text-xs text-[#EAD5E5]/80 leading-relaxed line-clamp-2 mb-3">{tip.shortDesc}</p>

        <div className="flex items-center justify-between pt-2 border-t border-[#461643]/70">
          <button onClick={handleNextTip} className="text-[11px] text-[#EAD5E5]/70 hover:text-white flex items-center gap-1 transition-colors">
            <RefreshCw className="w-3 h-3" />
            <span>Kolejny patent</span>
          </button>
          {tip.lessonId ? (
            <a href={urls.strefaPath(`/lekcja/${tip.lessonId}`)} className="text-[11px] font-semibold text-[#EC008C] hover:text-pink-300 flex items-center gap-1 transition-colors">
              <span>Zobacz wideo</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={`card relative overflow-hidden p-6 sm:p-7 flex flex-col ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-ink-2">
          <span className="w-2 h-2 rounded-full" style={{ background: tip.categoryColor }} aria-hidden="true" />
          {tip.categoryLabel}
        </span>
        <button
          type="button"
          onClick={handleNextTip}
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-ink-3 hover:text-ink transition-colors"
          title="Pokaż inny patent"
        >
          <RefreshCw className={`w-4 h-4 ${isAnimating ? 'animate-spin' : ''}`} aria-hidden="true" />
          <span>Wylosuj inny</span>
        </button>
      </div>

      <div className={`mt-5 flex-1 transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <h3 className="text-[24px] sm:text-[28px] leading-tight text-ink">{tip.title}</h3>
        <p className="mt-3 text-[17px] leading-relaxed text-ink-2 max-w-[60ch]">{tip.shortDesc}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
        {tip.lessonId ? (
          <a
            href={urls.strefaPath(`/lekcja/${tip.lessonId}`)}
            className="inline-flex items-center gap-2.5 text-[15px] font-semibold text-ink group"
          >
            <span className="inline-flex w-7 h-7 rounded-full bg-ink text-paper items-center justify-center group-hover:scale-105 transition-transform">
              <Play className="w-3 h-3 fill-current" aria-hidden="true" />
            </span>
            <span>{tip.lessonTitle || 'Przejdź do lekcji'}</span>
          </a>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={handleSave}
          className={`inline-flex items-center gap-1.5 text-[14px] font-medium px-3 py-1.5 rounded-full transition-colors ${
            saved ? 'bg-paper-2 text-ink' : 'text-ink-3 hover:text-ink'
          }`}
          aria-pressed={saved}
        >
          <Heart className={`w-4 h-4 ${saved ? 'fill-current text-stage-pierwszanoc' : ''}`} aria-hidden="true" />
          <span>{saved ? 'Zapisane' : 'Zapisz'}</span>
        </button>
      </div>
    </div>
  );
}
