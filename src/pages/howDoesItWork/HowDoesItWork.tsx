import s from './HowDoesItWork.module.css';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { fetchPage } from '../../services/pageService';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from "react-router-dom";
import { renderHtmlText } from '../../services/renderHtmlText';

// Кнопка для действия "Get Involved"
const HowDoesItWorkButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  background: var(--button-bg);
  color: var(--button-text);
  width: clamp(181px, 23.5vw, 334px);
  height: clamp(50px, 7vw, 80px);
  padding: 0;
  border: none;
  border-radius: 4px;
  font-size: clamp(18px, 2vw, 24px);
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: var(--text-in-boxes);
  }
`;

const HowDoesItWork: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [storedImagePath, setStoredImagePath] = useState<string | null>(null);

  const baseURL = 'http://localhost:8080'; // Базовый URL для изображений

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const pageData = await fetchPage('howdoeswork');

        setTitle(language === 'EN' ? pageData.title_en || '' : pageData.title_me || '');
        setText(language === 'EN' ? pageData.text_en || '' : pageData.text_me || '');

        // Проверка пути к изображению
        if (pageData.how_work_image_path) {
          let imagePath = pageData.how_work_image_path;

          // Проверяем, начинается ли путь с `/`
          if (!imagePath.startsWith('http') && !imagePath.startsWith('/')) {
            console.warn('⚠️ Неправильный путь:', imagePath);
          }

          // Добавляем baseURL, если путь начинается с `/`
          if (imagePath.startsWith('/')) {
            imagePath = `${baseURL}${imagePath}`;
          }

          setStoredImagePath(imagePath);
        } else {
          console.warn('⚠️ Путь к изображению отсутствует');
          setStoredImagePath(null);
        }
      } catch (error) {
        console.error('❌ Ошибка загрузки данных:', error);
      }
    };

    loadPageData();
  }, [language]);


  return (
    <section className={s.howDoesItWork}>
      <h2 className={s.howDoesItWork_title}>{renderHtmlText(title)}</h2>
      <div className={s.howDoesItWork_Box}>
        <div className={s.howDoesItWork_ContentBox}>
          <p>{renderHtmlText(text)}</p>
          <HowDoesItWorkButton onClick={() => navigate("/get-involved")}>
            {language === "ME" ? 'Uključi se' : 'Get Involved'}
          </HowDoesItWorkButton>
        </div>
        <div className={s.howDoesItWork_ImgBox}>
          {storedImagePath ? (
            <img
              src={storedImagePath}
              alt="How It Works"
              onError={(e) => {
                console.error('❌ Ошибка загрузки изображения:', storedImagePath);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <p>{language === "ME" ? 'Slika nije dostupna' : 'The picture is not available'}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default HowDoesItWork;
