"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios'; // 🔥 Добавлен импорт axios
import s from './Contact.module.css';
import ContactForm from '../../components/contactForm/ContactForm';
import { useLanguage } from '../../context/LanguageContext';
import { API_URL } from '../../services/pageService';

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const [storedImage, setStoredImage] = useState<string | null>(null);

  useEffect(() => {
    fetchImage();
  }, []);

  const fetchImage = async () => {
    try {
      const res = await axios.get<{ image_url: string }>(`${API_URL}/api/contact-image`);
      if (res.data?.image_url) {
        setStoredImage(`${API_URL}/${res.data.image_url}`);
      }
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  return (
    <div className={s.contactContainer}>
      <h2>{language === 'ME' ? 'Kontaktirajte nas' : 'Contact Us'}</h2>
      <div className={s.contact}>
        <span>
        <ContactForm />
        </span>
        <div className={s.contact_imgBox}>
          {storedImage ? ( // 🔥 Не рендерим `img`, если `storedImage === null`
            <img src={storedImage} alt="Contact Image" />
          ) : (
            <p>Loading image...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
