import React from 'react';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';

const SwitcherWrapper = styled.div`
  display: flex;
  justify-content: center; /* Центрируем кнопки по горизонтали */
  align-items: center; /* Выравниваем по вертикали */
  gap: 10px; /* Отступы между кнопками */
  margin: 1rem 0;
  width: fit-content;
`;

const LanguageButton = styled.button<{ $active?: boolean }>`
  background: ${({ $active }) => ($active ? '#3F4D61' : '#ccc')};
  color: white;
  padding: 0.2rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  width: fit-content;
  text-align: center; /* Центрируем текст на кнопке */
`;

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <SwitcherWrapper>
      <LanguageButton $active={language === 'EN'} onClick={() => setLanguage('EN')}>
        EN
      </LanguageButton>
      <LanguageButton $active={language === 'ME'} onClick={() => setLanguage('ME')}>
        ME
      </LanguageButton>
    </SwitcherWrapper>
  );
};

export default LanguageSwitcher;
