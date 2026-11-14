'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { CLOUDFLARE_CUSTOMER_DOMAIN } from '@/lib/course-data';

interface PreviewLessonItem {
  id: string;
  number: number;
  moduleLabel: string;
  title: string;
  duration: string;
  uid: string;
  summary: string;
}

const PREVIEW_LESSONS: PreviewLessonItem[] = [
  {
    id: 'preview-lekcja-1',
    number: 1,
    moduleLabel: 'Moduł 1 · Początek ciąży',
    title: 'I trymestr: początek nowego życia i pierwsze tygodnie',
    duration: '5:33 min',
    uid: 'f8d8d8f24b917a32961efea785c9324b',
    summary:
      'Spokojne wprowadzenie do pierwszych tygodni ciąży — bez straszenia i chaosu z internetu.',
  },
  {
    id: 'preview-lekcja-6',
    number: 6,
    moduleLabel: 'Moduł 2 · Wreszcie lepiej',
    title: 'Szkoła rodzenia online – Twój bezpieczny i wygodny start',
    duration: '4:19 min',
    uid: 'ab0d90bf8a42fcf4d7e4debf10509f73',
    summary:
      'Jak mądrze korzystać z lekcji we dwoje we własnym tempie — z kanapy w salonie i przez cały pierwszy rok z maluszkiem.',
  },
  {
    id: 'preview-lekcja-26',
    number: 26,
    moduleLabel: 'Moduł 5 · Świadomy poród',
    title: 'Twój Plan Porodu – jak stworzyć dokument wspierający Twoje wybory',
    duration: '10:39 min',
    uid: 'ea898b3a4f5e4b7e23d212d595b13f47',
    summary:
      'Praktyczny przewodnik po preferencjach porodowych zgodnych ze standardem organizacyjnym (Dz.U. 2025 poz. 1525) i spokojnej rozmowie z położną.',
  },
  {
    id: 'preview-lekcja-40',
    number: 40,
    moduleLabel: 'Moduł 7 · Opieka nad noworodkiem',
    title: 'Pierwsze chwile maluszka – wygląd noworodka i dotyk',
    duration: '2:28 min',
    uid: '21baa2cafef2f7731b4a36c6464ee6e8',
    summary:
      'Pierwsze godziny po narodzinach oczami położnej — spokojne oswajanie dotyku, bliskości i wyglądu maluszka.',
  },
];

export function FreeLessonPreview() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [signedTokens, setSignedTokens] = useState<Record<string, string>>({});

  useEffect(() => {
    const syncLessonFromUrl = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const rawLesson = params.get('lekcja') ?? params.get('preview');
      if (!rawLesson) return;
      const parsedNumber = Number.parseInt(rawLesson, 10);
      if (!Number.isFinite(parsedNumber)) return;
      const foundIdx = PREVIEW_LESSONS.findIndex((item) => item.number === parsedNumber);
      if (foundIdx !== -1) {
        setSelectedIdx(foundIdx);
      }
    };

    syncLessonFromUrl();
    window.addEventListener('popstate', syncLessonFromUrl);
    window.addEventListener('hashchange', syncLessonFromUrl);
    return () => {
      window.removeEventListener('popstate', syncLessonFromUrl);
      window.removeEventListener('hashchange', syncLessonFromUrl);
    };
  }, []);

  const active = PREVIEW_LESSONS[selectedIdx] || PREVIEW_LESSONS[0];

  useEffect(() => {
    const uid = active.uid;
    if (signedTokens[uid]) return;

    const controller = new AbortController();
    fetch(`/api/stream/token?uid=${encodeURIComponent(uid)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) return null;
        return res.json().catch(() => null);
      })
      .then((data) => {
        if (data?.signed === true && typeof data?.token === 'string' && data.token.length > 0) {
          setSignedTokens((prev) =>
            prev[uid] === data.token ? prev : { ...prev, [uid]: data.token }
          );
        }
      })
      .catch(() => {
        // Bezplatne lekcje maja publiczny dostep bez podpisanego tokenu; blad sieci nie blokuje odtwarzacza.
      });

    return () => {
      controller.abort();
    };
  }, [active.uid, signedTokens]);

  const streamId = signedTokens[active.uid] || active.uid;
  const posterUrl = `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${active.uid}/thumbnails/thumbnail.jpg?time=4s&height=720`;
  const iframeSrc = `https://${CLOUDFLARE_CUSTOMER_DOMAIN}/${streamId}/iframe?poster=${encodeURIComponent(posterUrl)}&preload=metadata&controls=true&primaryColor=%23DA0271`;

  return (
    <section aria-labelledby="zwiastun-tyt" className="sek" id="zwiastun">
      <div className="wrap" id="bezplatna-lekcja">
        <div className="rounded-3xl border border-[#EAE3DB] dark:border-[#3D0E39] bg-white dark:bg-[#1C081A] p-5 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE3DB] dark:border-[#3D0E39] pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DA0271] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Bezpłatna lekcja bez logowania
              </span>
              <h2
                id="zwiastun-tyt"
                className="font-brand-display text-xl sm:text-2xl font-bold text-[#1A1512] dark:text-[#FBF8F4] mt-0.5"
              >
                Zobacz, jak wyglądają nasze lekcje
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {PREVIEW_LESSONS.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    selectedIdx === idx
                      ? 'bg-[#DA0271] text-white border-[#DA0271]'
                      : 'bg-[#FBF8F4] dark:bg-[#250A24] text-[#544A44] dark:text-[#D7CCC3] border-[#EAE3DB] dark:border-[#461643]'
                  }`}
                >
                  Lekcja #{item.number} ({item.duration})
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7">
              <div
                className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#1A0619] border border-[#461643]"
                style={{ aspectRatio: '16 / 9' }}
              >
                <iframe
                  key={streamId}
                  src={iframeSrc}
                  title={active.title}
                  className="w-full h-full border-0 absolute inset-0"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[#DA0271]">
                {active.moduleLabel}
              </div>
              <h3 className="font-brand-display text-lg sm:text-xl font-bold text-[#1A1512] dark:text-[#FBF8F4]">
                {active.title}
              </h3>
              <p className="text-sm text-[#544A44] dark:text-[#D7CCC3] leading-relaxed">
                {active.summary}
              </p>

              <ul className="space-y-2 text-xs text-[#544A44] dark:text-[#D7CCC3] pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Oglądasz od razu — bez konta i bez podawania e-maila</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Krótkie odcinki w jakości 4K — w swoim tempie</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Położne i ekspertki ze szkoły rodzenia Mama Gaja</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
