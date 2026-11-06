'use client';

import React, { useState, useEffect } from 'react';
import { Play, Square, RotateCcw, AlertTriangle, PhoneCall, CheckCircle2, Clock } from 'lucide-react';

interface Contraction {
  id: string;
  startTime: Date;
  durationSeconds: number;
  intervalMinutes?: number;
}

export function SosContractionCounter() {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [activeStartTime, setActiveStartTime] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleStartStop = () => {
    if (!isActive) {
      // Start contraction
      setIsActive(true);
      setSeconds(0);
      setActiveStartTime(new Date());
    } else {
      // Stop contraction
      setIsActive(false);
      const now = new Date();
      const start = activeStartTime || now;
      const duration = seconds;

      // Calculate interval from previous contraction start
      let intervalMin: number | undefined;
      if (contractions.length > 0) {
        const lastStart = contractions[0].startTime;
        const diffMs = start.getTime() - lastStart.getTime();
        intervalMin = Math.round(diffMs / 60000);
      }

      const newEntry: Contraction = {
        id: Date.now().toString(),
        startTime: start,
        durationSeconds: duration,
        intervalMinutes: intervalMin,
      };

      setContractions([newEntry, ...contractions]);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
    setContractions([]);
    setActiveStartTime(null);
  };

  // 5-1-1 Rule Check:
  // Are the last 3 contractions around 5 minutes apart and lasting ~60 seconds?
  const recentContractions = contractions.slice(0, 3);
  const is511Alert =
    recentContractions.length >= 3 &&
    recentContractions.every(
      (c) => c.durationSeconds >= 45 && (c.intervalMinutes === undefined || (c.intervalMinutes >= 3 && c.intervalMinutes <= 6))
    );

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-white dark:bg-[color:var(--hb-karta)] rounded-3xl border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] p-6 sm:p-8 shadow-xl">
      {/* Alert banner when 5-1-1 is met */}
      {is511Alert && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border-2 border-rose-500 text-rose-950 flex items-start space-x-3 animate-bounce">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-base">Zasada 5-1-1 osiągnięta: Czas ruszać do szpitala!</h4>
            <p className="text-xs text-rose-800 mt-1">
              Twoje skurcze występują regularnie co ok. 5 minut i trwają około minuty. Zachowaj spokój, weź torbę i skierujcie się z partnerem na izbę przyjęć.
            </p>
          </div>
        </div>
      )}

      {/* Main Counter Display */}
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <span className="text-xs font-bold tracking-wider uppercase text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)] mb-2">
          {isActive ? 'Skurcz w toku... Oddychaj torem dolnożebrowym' : 'Licznik gotowy'}
        </span>

        <div className="font-mono font-bold text-6xl sm:text-7xl tracking-tight text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] mb-6">
          {formatTime(seconds)}
        </div>

        {/* Start / Stop Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleStartStop}
            className={`px-8 py-4 rounded-full font-bold text-base shadow-lg transition-all transform active:scale-95 flex items-center space-x-2 ${
              isActive
                ? 'bg-rose-600 text-white hover:bg-rose-700 animate-pulse'
                : 'bg-[color:var(--hb-mag)] text-[color:var(--hb-cta-ink)] hover:bg-[color:var(--hb-mag-h)]'
            }`}
          >
            {isActive ? (
              <>
                <Square className="w-5 h-5 fill-current" />
                <span>Koniec skurczu</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Początek skurczu</span>
              </>
            )}
          </button>

          {contractions.length > 0 && !isActive && (
            <button
              onClick={handleReset}
              className="p-4 rounded-full bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-kosc)] text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)] hover:text-[color:var(--hb-ink)] dark:hover:text-[color:var(--hb-ink)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] transition-colors"
              title="Wyczyść historię"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 5-1-1 Explanation Box */}
      <div className="my-6 p-4 rounded-2xl bg-[color:var(--hb-kosc)] dark:bg-[color:var(--hb-kosc)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] text-xs text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)] flex items-center justify-between gap-4">
        <div>
          <span className="font-bold text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">Reguła szpitalna 5-1-1:</span>
          <span className="ml-1 text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">
            Skurcze co <strong>5 minut</strong>, trwające <strong>1 minutę</strong>, przez co najmniej <strong>1 godzinę</strong>.
          </span>
        </div>
        <div className="shrink-0">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[11px]">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Zgodne z wytycznymi PTGiP
          </span>
        </div>
      </div>

      {/* History Table */}
      {contractions.length > 0 && (
        <div className="mt-6 border-t border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] pt-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)] mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Ostatnie skurcze ({contractions.length})
          </h4>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {contractions.map((c, index) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[color:var(--hb-papier)] dark:bg-[color:var(--hb-papier)] border border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)] text-xs"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-[color:var(--hb-ink3)] dark:text-[color:var(--hb-ink3)]">#{contractions.length - index}</span>
                  <span className="text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)] font-medium">
                    {c.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-[color:var(--hb-ink2)] dark:text-[color:var(--hb-ink2)]">
                    Czas trwania: <strong className="text-[color:var(--hb-ink)] dark:text-[color:var(--hb-ink)]">{c.durationSeconds} s</strong>
                  </span>
                  {c.intervalMinutes !== undefined && (
                    <span className="font-semibold text-[color:var(--hb-p4g)] dark:text-[color:var(--hb-p4g)] bg-[color:var(--hb-p4l)] dark:bg-[color:var(--hb-p4l)] px-2 py-0.5 rounded-md">
                      Odstęp: {c.intervalMinutes} min
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency 112 Red Flags */}
      <div className="mt-8 pt-6 border-t border-[color:var(--hb-linia)] dark:border-[color:var(--hb-linia)]">
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="font-bold flex items-center gap-1 text-amber-900 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Czerwone Flagi (Kiedy natychmiast dzwonisz pod 112)
            </span>
            <a
              href="tel:112"
              className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1 rounded-full text-[11px] shadow"
            >
              <PhoneCall className="w-3 h-3" /> Zadzwoń 112
            </a>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-amber-900/90 list-disc list-inside">
            <li>Jasnoczerwone krwawienie z dróg rodnych</li>
            <li>Zielone lub brunatne wody płodowe</li>
            <li>Gwałtowny spadek lub całkowity brak ruchów dziecka</li>
            <li>Silny, nieustępujący ból podbrzusza między skurczami</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
