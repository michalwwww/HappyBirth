'use client';

import { useState, useEffect } from 'react';
import { UserRole } from './types';

const COMPLETED_LESSONS_KEY = 'hb_completed_lessons';
const CURRENT_ROLE_KEY = 'hb_current_role';
const DUE_DATE_KEY = 'hb_due_date';

export function getStoredCompletedLessons(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(COMPLETED_LESSONS_KEY);
    return data ? JSON.parse(data) : ['lekcja-01']; // default 1st completed for demo
  } catch {
    return ['lekcja-01'];
  }
}

export function saveCompletedLesson(lessonId: string, isCompleted: boolean = true) {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredCompletedLessons();
    const set = new Set(list);
    if (isCompleted) {
      set.add(lessonId);
    } else {
      set.delete(lessonId);
    }
    const updated = Array.from(set);
    localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('hb_progress_updated'));
  } catch (e) {
    console.error('Failed to save progress', e);
  }
}

export function useCourseProgress() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [role, setRole] = useState<UserRole>('student');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCompletedLessons(getStoredCompletedLessons());
    const storedRole = (localStorage.getItem(CURRENT_ROLE_KEY) as UserRole) || 'student';
    setRole(storedRole);
    setIsLoaded(true);

    const handleUpdate = () => {
      setCompletedLessons(getStoredCompletedLessons());
    };

    window.addEventListener('hb_progress_updated', handleUpdate);
    return () => window.removeEventListener('hb_progress_updated', handleUpdate);
  }, []);

  const toggleLessonCompletion = (lessonId: string) => {
    const isCompleted = completedLessons.includes(lessonId);
    saveCompletedLesson(lessonId, !isCompleted);
  };

  const changeRole = (newRole: UserRole) => {
    setRole(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_ROLE_KEY, newRole);
    }
  };

  return {
    completedLessons,
    isLoaded,
    toggleLessonCompletion,
    role,
    changeRole,
    totalLessons: 52,
    percentCompleted: Math.round((completedLessons.length / 52) * 100),
  };
}
