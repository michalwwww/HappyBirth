'use client';

import React, { useState } from 'react';
import { Award, CheckCircle2, FileText, Printer, Sparkles, RefreshCw } from 'lucide-react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
}

const FINAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Co w praktyce oznacza reguła obserwacji skurczów 5-1-1 przed wyjazdem do szpitala?',
    options: [
      'Skurcze pojawiają się regularnie co ok. 5 minut, trwają ok. 1 minutę i utrzymują się od co najmniej 1 godziny',
      'Skurcze trwają 5 minut z przerwą 1 minuty przez 1 dzień',
      'Należy jechać do szpitala po 5 pojedynczych skurczach przepowiadających',
    ],
    correctIndex: 0,
  },
  {
    id: 2,
    question: 'Jaka pozycja snu niemowlęcia jest rekomendowana jako najbezpieczniejsza w profilaktyce SIDS?',
    options: [
      'Na brzuszku z miękką poduszką',
      'Na plecach, na odpowiednio twardym, płaskim materacu bez luźnych poduszek i ochraniaczy',
      'Wyłącznie na boku z wałeczkiem z koca',
    ],
    correctIndex: 1,
  },
  {
    id: 3,
    question: 'Jakie znaczenie mają pozycje wertykalne w pierwszym okresie porodu?',
    options: [
      'Są zabronione przez Standard Opieki Okołoporodowej',
      'Wykorzystują siłę grawitacji, wspierają dotlenienie dziecka i ułatwiają wstawianie się główki w kanał rodny',
      'Służą wyłącznie do wykonywania badań KTG na leżąco',
    ],
    correctIndex: 1,
  },
  {
    id: 4,
    question: 'Jak prawidłowo pielęgnować kikut pępowinowy u noworodka zgodnie z aktualnymi zaleceniami?',
    options: [
      'Utrzymywać w czystości i suchości (tzw. sucha pielęgnacja), zapewniając dostęp powietrza i odwijając brzeg pieluszki',
      'Smarować obficie fioletem gencjanowym 5 razy dziennie',
      'Zaklejać szczelnie plastrem wodoodpornym przez 2 tygodnie',
    ],
    correctIndex: 0,
  },
  {
    id: 5,
    question: 'Co świadczy o prawidłowym, głębokim przystawieniu noworodka do piersi?',
    options: [
      'Dziecko chwyta wyłącznie samą końcówkę brodawki, a policzki zapadają się przy ssaniu',
      'Szeroko otwarte usta, wywinięte wargi, broda dotykająca piersi i duża część otoczki w buzi dziecka (brak bólu i cmokania)',
      'Karmienie trwa dokładnie 3 minuty z zegarkiem w ręku',
    ],
    correctIndex: 1,
  },
  {
    id: 6,
    question: 'Czym jest kontakt „skóra do skóry” (kangurowanie) bezpośrednio po narodzinach?',
    options: [
      'Położeniem nagiego noworodka na nagiej klatce piersiowej mamy (lub taty), co wspiera termoregulację, kolonizację florą bakteryjną i pierwszą laktację',
      'Zawinięciem dziecka w dwa koce i odłożeniem do łóżeczka na 12 godzin',
      'Kąpielą noworodka w pierwszej minucie życia',
    ],
    correctIndex: 0,
  },
  {
    id: 7,
    question: 'Jak osoba towarzysząca (partner) może realnie przynieść ulgę rodzącej podczas skurczów krzyżowych?',
    options: [
      'Stosując głęboki oddech wspólnie z mamą oraz ucisk/masaż okolicy kości krzyżowej i przypominając o rozluźnieniu szczęki i barków',
      'Prosząc rodzącą o wstrzymywanie oddechu na 30 sekund',
      'Zabraniając zmiany pozycji na sali porodowej',
    ],
    correctIndex: 0,
  },
  {
    id: 8,
    question: 'Kiedy warto skonsultować się z fizjoterapeutką uroginekologiczną?',
    options: [
      'Wyłącznie 5 lat po porodzie',
      'Zarówno w ciąży (przygotowanie dna miednicy i odciążenie kręgosłupa), jak i po połogu (kontrola rozejścia mięśnia prostego brzucha i blizny)',
      'Nigdy, jeśli poród odbył się drogami natury',
    ],
    correctIndex: 1,
  },
  {
    id: 9,
    question: 'Czym różni się fizjologiczny „Baby Blues” od depresji poporodowej?',
    options: [
      'Baby Blues to przejściowe obniżenie nastroju i płaczliwość w pierwszych dniach po porodzie (związane ze spadkiem hormonów), które zwykle mija samoistnie w ciągu 10–14 dni',
      'Baby Blues pojawia się dopiero po pierwszych urodzinach dziecka',
      'To dokładnie to samo zjawisko niewymagające żadnej obserwacji',
    ],
    correctIndex: 0,
  },
  {
    id: 10,
    question: 'Jak przewozić noworodka w foteliku samochodowym (tzw. łupinie 0–13 kg)?',
    options: [
      'W grubej puchowej kurtce zimowej pod luźnymi pasami',
      'Tyłem do kierunku jazdy (RWF), z wyłączoną poduszką powietrzną na przednim fotelu i pasami dociągniętymi bezpośrednio do ciała dziecka (bez grubej kurtki pod pasami)',
      'Przodem do kierunku jazdy na tylnej kanapie',
    ],
    correctIndex: 1,
  },
];

/**
 * [C3] Test Końcowy (10 pytań, próg 80%) i Generator Imiennych Certyfikatów PDF (/api/certificate)
 */
export function FinalQuizAndCertificate() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<any | null>(null);

  const answeredCount = Object.keys(answers).length;
  const correctCount = FINAL_QUIZ_QUESTIONS.reduce(
    (acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0),
    0
  );

  const handleSubmitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (answeredCount < FINAL_QUIZ_QUESTIONS.length) {
      setErrorMsg('Odpowiedz na wszystkie 10 pytań przed wygenerowaniem certyfikatu.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMsg('Wpisz imię i nazwisko, które ma widnieć na certyfikacie.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          correctAnswers: correctCount,
          totalQuestions: FINAL_QUIZ_QUESTIONS.length,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.passed) {
        setErrorMsg(
          data.error ||
            `Wymagane jest minimum 80% (8/10 poprawnych odpowiedzi). Twój wynik: ${correctCount}/10. Sprawdź odpowiedzi i spróbuj ponownie.`
        );
      } else {
        setCertificate(data.certificate);
      }
    } catch {
      // Fallback lokalny (np. w trybie statycznym bez backendu Node)
      if (correctCount >= 8) {
        const scorePercent = Math.round((correctCount / FINAL_QUIZ_QUESTIONS.length) * 100);
        setCertificate({
          certificateNumber: `HB-CERT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-PL`,
          fullName: fullName.trim(),
          scorePercent,
          correctAnswers: correctCount,
          totalQuestions: 10,
          issuedDateFormatted: new Date().toLocaleDateString('pl-PL'),
          courseTitle: 'Szkoła Rodzenia Online HappyBirth.pl (52 lekcje 4K w 8 modułach · 288 min)',
          academicPartner: 'Szkoła Rodzenia Mama Gaja w Poznaniu (od 2012 r.)',
        });
      } else {
        setErrorMsg(
          `Aby otrzymać certyfikat, wymagany jest wynik minimum 80% (8/10). Twój obecny wynik to ${correctCount}/10.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="certyfikat"
      className="rounded-3xl border border-[#EAE3DB] dark:border-[#3D0E39] bg-white dark:bg-[#1C081A] p-6 sm:p-8 shadow-sm space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3DB] dark:border-[#3D0E39] pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAE3EB] dark:bg-[#3B0D36] text-[#DA0271] dark:text-[#FF4BA8] text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Test Końcowy i Imienny Certyfikat PDF</span>
          </div>
          <h3 className="font-brand-display text-xl sm:text-2xl font-bold text-[#1A1512] dark:text-[#FBF8F4]">
            Certyfikat Ukończenia Szkoły Rodzenia Online HappyBirth.pl
          </h3>
          <p className="text-xs sm:text-sm text-[#544A44] dark:text-[#D7CCC3]">
            Rozwiąż krótki test podsumowujący (10 pytań z porodu, laktacji i opieki nad noworodkiem, próg zaliczenia 80%) i pobierz imienny certyfikat PDF do karty ciąży.
          </p>
        </div>

        {!quizStarted && !certificate && (
          <button
            type="button"
            onClick={() => setQuizStarted(true)}
            className="px-6 py-3 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 shadow-md"
          >
            Rozpocznij test końcowy (10 pytań) →
          </button>
        )}
      </div>

      {certificate ? (
        <div className="space-y-6">
          {/* Wygenerowany Certyfikat gotowy do wydruku / zapisu PDF */}
          <div className="rounded-3xl border-2 border-[#DA0271] bg-[#FFFDFA] text-[#1A1512] p-6 sm:p-10 shadow-xl space-y-6 text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FAE3EB] text-[#DA0271] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certyfikat Ukończenia Kursu · Wynik: {certificate.scorePercent}%</span>
            </div>

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest text-[#867A72] font-semibold">
                Niniejszym zaświadcza się, że
              </p>
              <h4 className="font-brand-display text-2xl sm:text-4xl font-bold text-[#20071E]">
                {certificate.fullName}
              </h4>
              <p className="text-xs sm:text-sm text-[#544A44] max-w-xl mx-auto leading-relaxed pt-1">
                ukończyła/ukończył program edukacyjny <strong>{certificate.courseTitle}</strong> przygotowany z dyplomowanymi położnymi, doradczyniami laktacyjnymi i fizjoterapeutkami ze szkoły rodzenia <strong>Mama Gaja w Poznaniu (działającej od 2012 r.)</strong> zgodnie ze Standardem Organizacyjnym Opieki Okołoporodowej.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#EAE3DB] text-xs text-[#544A44]">
              <div>
                <span className="block text-[10px] uppercase text-[#867A72] font-bold">Numer certyfikatu</span>
                <strong className="font-mono">{certificate.certificateNumber}</strong>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-[#867A72] font-bold">Data wystawienia</span>
                <strong>{certificate.issuedDateFormatted}</strong>
              </div>
              <div>
                <span className="block text-[10px] uppercase text-[#867A72] font-bold">Organizator prawny</span>
                <strong>KLARSOLUTIONS Sp. z o.o. (KRS 0001268396)</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Pobierz / Zapisz Certyfikat jako PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setCertificate(null)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#EAE3DB] dark:border-[#461643] text-xs font-semibold text-[#544A44] dark:text-[#D7CCC3] hover:border-[#DA0271] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Wróć do pytań testowych</span>
            </button>
          </div>
        </div>
      ) : quizStarted ? (
        <form onSubmit={handleSubmitQuiz} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {FINAL_QUIZ_QUESTIONS.map((q) => (
              <div
                key={q.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#FBF8F4] dark:bg-[#250A24] border border-[#EAE3DB] dark:border-[#3D0E39] space-y-3"
              >
                <div className="font-bold text-xs sm:text-sm text-[#1A1512] dark:text-[#FBF8F4]">
                  {q.id}. {q.question}
                </div>
                <div className="space-y-2">
                  {q.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        answers[q.id] === idx
                          ? 'border-[#DA0271] bg-[#FAE3EB]/50 dark:bg-[#3B0D36] text-[#1A1512] dark:text-white font-semibold'
                          : 'border-[#EAE3DB] dark:border-[#461643] bg-white dark:bg-[#1A0619] text-[#544A44] dark:text-[#D7CCC3]'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`quiz-q-${q.id}`}
                        checked={answers[q.id] === idx}
                        onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: idx }))}
                        className="mt-0.5 text-[#DA0271] focus:ring-[#DA0271]"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-[#FBF8F4] dark:bg-[#250A24] border border-[#EAE3DB] dark:border-[#3D0E39] space-y-4">
            <div className="max-w-md space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#544A44] dark:text-[#D7CCC3]">
                Imię i nazwisko na certyfikacie (lub imiona obojga rodziców)
              </label>
              <input
                type="text"
                required
                placeholder="np. Anna Kowalska / Anna i Piotr Kowalscy"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#EAE3DB] dark:border-[#461643] bg-white dark:bg-[#1A0619] text-sm text-[#1A1512] dark:text-white focus:outline-none focus:border-[#DA0271]"
              />
            </div>

            {errorMsg && (
              <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{errorMsg}</p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#867A72] dark:text-[#A2958C]">
                Udzielono odpowiedzi: <strong>{answeredCount} z 10</strong> (wymagany próg zaliczenia: 80%)
              </span>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#DA0271] hover:bg-[#B8005F] text-white text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-md disabled:opacity-60"
              >
                <FileText className="w-4 h-4" />
                <span>{loading ? 'Generowanie certyfikatu...' : 'Sprawdź wynik i wygeneruj Certyfikat PDF'}</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#544A44] dark:text-[#D7CCC3]">
          <div className="p-4 rounded-2xl bg-[#FBF8F4] dark:bg-[#250A24] border border-[#EAE3DB] dark:border-[#3D0E39] flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>10 pytań praktycznych z 8 modułów kursu</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#FBF8F4] dark:bg-[#250A24] border border-[#EAE3DB] dark:border-[#3D0E39] flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Unikalny numer certyfikatu i dane KLARSOLUTIONS Sp. z o.o.</span>
          </div>
          <div className="p-4 rounded-2xl bg-[#FBF8F4] dark:bg-[#250A24] border border-[#EAE3DB] dark:border-[#3D0E39] flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Gotowy do wydruku PDF i dołączenia do dokumentacji ciąży</span>
          </div>
        </div>
      )}
    </section>
  );
}
