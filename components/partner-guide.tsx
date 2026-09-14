'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartHandshake, ShieldCheck, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { getLessonById } from '@/lib/course-data';

export function PartnerGuide() {
  const pathname = usePathname();
  const prefix = pathname.startsWith('/strefa') ? '/strefa' : '';
  const partnerLessons = [
    { id: 'lekcja-27', title: 'Torba do szpitala – pakowanie w 3 strefach bez stresu', role: 'Wiesz dokładnie, gdzie leży pomadka, woda i ubranka' },
    { id: 'lekcja-30', title: 'Aktywny poród – ruch, oddech i naturalne łagodzenie skurczów', role: 'Masaż krzyżowy dłońmi i uciskanie kolcami biodrowymi' },
    { id: 'lekcja-31', title: 'Wsparcie partnera na porodówce – pozycje wertykalne i masaż', role: 'Podtrzymywanie w przysiadzie i krążenia miednicą' },
    { id: 'lekcja-32', title: 'Magia chusty Rebozo – techniki odciążania brzucha i pleców', role: 'Odciążanie brzucha mamy chustą w klęku podpartym' },
    { id: 'lekcja-44', title: 'Pierwsza kąpiel krok po kroku – bezpieczny chwyt', role: 'Bezpieczny chwyt i rola taty w wieczornym rytuale' },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Intro Hero Banner */}
      <div className="rounded-3xl bg-indigo-950 text-white p-6 sm:p-8 relative overflow-hidden shadow-xl border border-indigo-900">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3 border border-indigo-500/30">
            <HeartHandshake className="w-3.5 h-3.5" /> Dostęp dla dwojga w cenie
          </span>
          <h2 className="font-brand-display font-bold text-2xl sm:text-3xl tracking-tight mb-2">
            Strefa dla Taty i Partnera: Twoja rola na porodówce i w domu
          </h2>
          <p className="text-sm text-indigo-200 leading-relaxed">
            Nie jesteś tylko obserwatorem. Jesteś tarczą ochronną rodzącej, jej rzecznikiem praw na izbie przyjęć i najważniejszym źródłem poczucia bezpieczeństwa.
          </p>
        </div>
      </div>

      {/* 3 Golden Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-[#EAE3DB] shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold font-mono mb-4 text-sm">
            01
          </div>
          <h4 className="font-brand-display font-bold text-lg text-[#1A1512] mb-2">
            Bądź jej rzecznikiem
          </h4>
          <p className="text-xs text-[#544A44] leading-relaxed">
            Na izbie przyjęć rodząca skupia się na oddechu i skurczach. To Ty podajesz dowód, kartę ciąży, wyniki GBS i pilnujesz założeń Planu Porodu.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#EAE3DB] shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold font-mono mb-4 text-sm">
            02
          </div>
          <h4 className="font-brand-display font-bold text-lg text-[#1A1512] mb-2">
            Fizyczna ulga w bólu
          </h4>
          <p className="text-xs text-[#544A44] leading-relaxed">
            Naucz się techniki ciągłego ucisku na kość krzyżową w trakcie skurczu oraz obsługi chusty Rebozo. Te dwa gesty redukują odczuwanie bólu nawet o 40%.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#EAE3DB] shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold font-mono mb-4 text-sm">
            03
          </div>
          <h4 className="font-brand-display font-bold text-lg text-[#1A1512] mb-2">
            Strażnik spokoju i intymności
          </h4>
          <p className="text-xs text-[#544A44] leading-relaxed">
            Wycisz telefon, przyciemnij światło na sali porodowej, podawaj wodę przez słomkę i dbaj o ciepłe skarpety dla mamy. Oksytocyna lubi półmrok i ciszę.
          </p>
        </div>
      </div>

      {/* Recommended Lessons for Partner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3DB] shadow-sm">
        <h3 className="font-brand-display font-bold text-xl text-[#1A1512] mb-4 flex items-center gap-2">
          <span>Lekcje instruktażowe z konkretną rolą partnera</span>
        </h3>

        <div className="divide-y divide-[#EAE3DB]">
          {partnerLessons.map((item) => {
            const lesson = getLessonById(item.id);
            return (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      Lekcja {lesson?.lessonNumber}
                    </span>
                    <h4 className="text-sm font-bold text-[#1A1512]">{item.title}</h4>
                  </div>
                  <p className="text-xs text-[#544A44]">
                    <strong>Twoja rola:</strong> {item.role}
                  </p>
                </div>

                <Link
                  href={`${prefix}/lekcja/${item.id}`}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-semibold shrink-0 transition-colors shadow-sm"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Włącz lekcję ({lesson?.durationFormatted})</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
