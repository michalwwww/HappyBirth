'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pl' | 'en' | 'ru';

export interface Translations {
  [key: string]: {
    pl: string;
    en: string;
    ru: string;
  };
}

export const translations: Translations = {
  // Nawigacja górna & Paski
  brandTitle: {
    pl: 'Strefa Kursantki HappyBirth',
    en: 'HappyBirth Student Zone',
    ru: 'Зона Курсантки HappyBirth',
  },
  ribbonSubtitle: {
    pl: '52 lekcje wideo w jakości Full HD · Dostęp aktywny: 12 msc od terminu porodu dla dwojga',
    en: '52 Full HD video lessons · Active access: 12 months from due date for two',
    ru: '52 видеоурока Full HD · Доступ: 12 месяцев с даты родов для двоих',
  },
  viewMode: {
    pl: 'Tryb widoku:',
    en: 'View mode:',
    ru: 'Режим:',
  },
  roleStudent: {
    pl: 'Kursantka',
    en: 'Student',
    ru: 'Курсантка',
  },
  rolePartner: {
    pl: 'Dla Taty',
    en: 'For Dad',
    ru: 'Для Папы',
  },
  roleGuest: {
    pl: 'Gość',
    en: 'Guest',
    ru: 'Гость',
  },
  navDashboard: {
    pl: 'Kokpit',
    en: 'Dashboard',
    ru: 'Главная',
  },
  navLessons: {
    pl: 'Lekcje (52)',
    en: 'Lessons (52)',
    ru: 'Уроки (52)',
  },
  navCabinet: {
    pl: 'Apteczka',
    en: 'Medicine Box',
    ru: 'Аптечка',
  },
  navCounter: {
    pl: 'Licznik 5-1-1',
    en: '5-1-1 Counter',
    ru: 'Счётчик 5-1-1',
  },
  navPartner: {
    pl: 'Strefa dla Taty',
    en: 'Dad Zone',
    ru: 'Для Папы',
  },
  navStandard: {
    pl: 'Standard Medyczny',
    en: 'Medical Standard',
    ru: 'Мед. стандарт',
  },
  btnBuy: {
    pl: 'Kup dostęp · 349 zł',
    en: 'Get Access · 349 PLN',
    ru: 'Купить доступ · 349 zł',
  },
  btnLogin: {
    pl: 'Zaloguj się',
    en: 'Sign in',
    ru: 'Войти',
  },
  btnLogout: {
    pl: 'Wyloguj',
    en: 'Log out',
    ru: 'Выйти',
  },
  schoolTitle: {
    pl: 'Szkoła Rodzenia',
    en: 'Birthing School',
    ru: 'Школа родов',
  },
  vodZone: {
    pl: 'Strefa',
    en: 'Zone',
    ru: 'Зона',
  },
  vodSubtitle: {
    pl: 'panel edukacyjny vod',
    en: 'VOD educational portal',
    ru: 'образовательный VOD-портал',
  },
  completedOf: {
    pl: 'ukończonych',
    en: 'completed',
    ru: 'завершено',
  },
  nextLesson: {
    pl: 'Następna lekcja',
    en: 'Next lesson',
    ru: 'Следующий урок',
  },
  courseProgress: {
    pl: 'Twój postęp w kursie:',
    en: 'Your course progress:',
    ru: 'Ваш прогресс в курсе:',
  },
  goToLesson: {
    pl: 'Przejdź do: Lekcja',
    en: 'Go to: Lesson',
    ru: 'Перейти: Урок',
  },
  // Dostępność
  a11yTitle: {
    pl: 'Ułatwienia dostępu (WCAG 2.1 / UE)',
    en: 'Accessibility Settings (WCAG 2.1 / EU)',
    ru: 'Специальные возможности (WCAG 2.1 / ЕС)',
  },
  a11yFontSize: {
    pl: 'Rozmiar tekstu',
    en: 'Text Size',
    ru: 'Размер текста',
  },
  a11yNormal: {
    pl: 'Normalny',
    en: 'Normal',
    ru: 'Обычный',
  },
  a11yMedium: {
    pl: 'Średni (+15%)',
    en: 'Medium (+15%)',
    ru: 'Средний (+15%)',
  },
  a11yLarge: {
    pl: 'Duży (+30%)',
    en: 'Large (+30%)',
    ru: 'Крупный (+30%)',
  },
  a11yContrast: {
    pl: 'Wysoki kontrast',
    en: 'High Contrast',
    ru: 'Высокая контрастность',
  },
  a11yUnderline: {
    pl: 'Podkreślenie linków',
    en: 'Underline Links',
    ru: 'Подчёркивать ссылки',
  },
  a11yDyslexic: {
    pl: 'Czcionka czytelna (dysleksja)',
    en: 'Readable font (dyslexia)',
    ru: 'Шрифт для дислексии',
  },
  a11yReduceMotion: {
    pl: 'Zatrzymaj animacje',
    en: 'Reduce motion',
    ru: 'Остановить анимации',
  },
  a11yReset: {
    pl: 'Przywróć domyślne',
    en: 'Reset to default',
    ru: 'Сбросить настройки',
  },
  a11yDeclaration: {
    pl: 'Deklaracja dostępności UE',
    en: 'EU Accessibility Declaration',
    ru: 'Декларация доступности ЕС',
  },
  // Tryby
  themeLight: {
    pl: 'Jasny motyw',
    en: 'Light Mode',
    ru: 'Светлая тема',
  },
  themeDark: {
    pl: 'Ciemny motyw',
    en: 'Dark Mode',
    ru: 'Тёмная тема',
  },
};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'pl',
  setLang: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('pl');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hb_lang') as Language;
      if (saved && (saved === 'pl' || saved === 'en' || saved === 'ru')) {
        setLangState(saved);
      }
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hb_lang', newLang);
      document.documentElement.lang = newLang;
      window.dispatchEvent(new Event('hb_lang_updated'));
    }
  };

  const t = (key: string): string => {
    if (translations[key] && translations[key][lang]) {
      return translations[key][lang];
    }
    if (translations[key] && translations[key]['pl']) {
      return translations[key]['pl'];
    }
    return key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
