import s from './FAQ.module.css';
import Accordion from '../../components/accordion/Accordion';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../services/pageService';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';



const FAQButton = styled.button`
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

const FAQ: React.FC = () => {
  const { language } = useLanguage();
  const [image, setImage] = useState<File | null>(null);
  const [storedImage, setStoredImage] = useState('');

  useEffect(() => {
    fetchImage();
  }, []);

  interface FaqImageResponse {
    image_url: string;
  }

  const fetchImage = async () => {
    try {
      const res = await axios.get<FaqImageResponse>(`${API_URL}/api/faq-image`);
      if (res.data?.image_url) {
        setStoredImage(`${API_URL}/${res.data.image_url}`);
      }
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  return (
    <div className={s.faq}>
      <h2>FAQ</h2>
      <div className={s.faqBox}>
        <div className={s.faqBox_acc}>
          <Accordion />
        </div>

        {storedImage && (
          <div className={s.previewWrapper}>
            <img
              src={storedImage}
              alt="FAQ"
              className={`${s.image} ${image ? s.dimmed : ''}`}
            />
          </div>
        )}
      </div>
      <div className={s.faq_buttonBox}>
        <h3>{language === 'EN' ? 'Want to learn more about Nova Nit or get answers to your questions? ' : 'Želite da saznate više o Nova Nit ili da dobijete odgovore na svoja pitanja?'}</h3>
        <FAQButton>Get in touch here</FAQButton>
      </div>
    </div>
  );
};

export default FAQ;