import React from 'react';
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
  return <StrefaLessonClient lessonId={resolvedParams.id} />;
}
