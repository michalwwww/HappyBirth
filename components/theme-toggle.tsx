'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('hb_theme');
      // Domyślnie ZAWSZE tryb jasny (charakterystyczny dla identyfikacji HappyBirth), chyba że użytkownik celowo wybrał 'dark'
      const shouldBeDark = savedTheme === 'dark';
      
      setIsDark(shouldBeDark);
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (typeof window !== 'undefined') {
      if (nextDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('hb_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('hb_theme', 'light');
      }
      window.dispatchEvent(new Event('hb_theme_updated'));
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-1.5 rounded-full border border-[#461643] bg-[#180517]/90 text-[#EAD5E5] hover:text-white hover:bg-white/10 transition-all ${className}`}
      title={isDark ? 'Włącz tryb jasny' : 'Włącz tryb ciemny'}
      aria-label={isDark ? 'Włącz tryb jasny' : 'Włącz tryb ciemny'}
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-amber-300 transition-transform rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-[#EAD5E5] transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
