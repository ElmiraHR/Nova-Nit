import React, { createContext, useContext, useState } from 'react';

// Определяем тип контекста
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

// Создаем контекст
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Провайдер контекста
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'EN');

  // Функция смены языка
  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang); // Сохраняем язык
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Хук для использования контекста
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
