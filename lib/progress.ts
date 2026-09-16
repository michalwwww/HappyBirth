'use client';

import { useState, useEffect } from 'react';
import { UserRole } from './types';

const COMPLETED_LESSONS_KEY = 'hb_completed_lessons';
const CURRENT_ROLE_KEY = 'hb_current_role';

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

    // Synchronizacja w tle z Cloudflare D1
    fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonId, completed: isCompleted }),
    }).catch(() => {
      // Offline lub niezalogowany - zachowaj w localStorage
    });
  } catch (e) {
    console.error('Failed to save progress', e);
  }
}

export function useCourseProgress() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [role, setRole] = useState<UserRole>('guest');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Natychmiast załaduj z localStorage (domyślnie 'guest')
    const localLessons = getStoredCompletedLessons();
    setCompletedLessons(localLessons);
    const storedRole = (localStorage.getItem(CURRENT_ROLE_KEY) as UserRole) || 'guest';
    setRole(storedRole);
    setIsLoaded(true);

    // Weryfikacja ze stanem serwera
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && (data.user?.hasActiveCourse || data.user?.role === 'student' || data.user?.role === 'partner')) {
          const validRole = (data.user.role as UserRole) || 'student';
          setRole(validRole);
          localStorage.setItem(CURRENT_ROLE_KEY, validRole);
        } else if (!data.authenticated && !localStorage.getItem(CURRENT_ROLE_KEY)) {
          setRole('guest');
        }
      })
      .catch(() => {});

    // 2. Pobierz postępy z Cloudflare D1 i połącz
    fetch('/api/progress')
      .then((res) => res.json())
      .then((data) => {
        if (data.completedLessons && Array.isArray(data.completedLessons) && data.completedLessons.length > 0) {
          const merged = Array.from(new Set([...localLessons, ...data.completedLessons]));
          setCompletedLessons(merged);
          localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(merged));
        }
      })
      .catch(() => {});

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
