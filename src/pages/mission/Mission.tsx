// src/pages/Mission/Mission.tsx
import s from './Mission.module.css';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { fetchPage } from '../../services/pageService';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { renderHtmlText } from '../../services/renderHtmlText'; 

const MissionButton = styled.button`
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

const Mission: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const pageData = await fetchPage('mission');

        setTitle(language === 'EN' ? pageData.title_en || '' : pageData.title_me || '');
        setText(language === 'EN' ? pageData.text_en || '' : pageData.text_me || '');
        setImageUrl(pageData.mission_image_path || null);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    loadPageData();
  }, [language]);

  const baseURL = 'http://localhost:8080'; // Лучше вынести в env/config

  return (
    <section className={s.mission}>
      <h2 className={s.missionTitle}>{renderHtmlText(title)}</h2>

      <div className={s.missionBox}>
        <div className={s.missionImgBox}>
          {imageUrl && <img src={`${baseURL}${imageUrl}`} alt={title} />}
        </div>

        <div className={s.missionContentBox}>
          <p className={s.missionContent}>
            {renderHtmlText(text)}
          </p>

          <MissionButton onClick={() => navigate("/get-involved")}>
            {language === "ME" ? 'Uključi se' : 'Get Involved'}
          </MissionButton>
        </div>
      </div>
    </section>
  );
};

export default Mission;
