import React, { Suspense } from 'react';
import { lessons } from '@/lib/course-data';
import StrefaLessonClient from './lesson-client';

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    id: lesson.id,
  }));
}

export default async function StrefaLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-[#867A72]">
          <div className="w-10 h-10 border-4 border-[#EC008C]/30 border-t-[#EC008C] rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Ładowanie lekcji VOD...</p>
        </div>
      }
    >
      <StrefaLessonClient lessonId={resolvedParams.id} />
    </Suspense>
  );
}
