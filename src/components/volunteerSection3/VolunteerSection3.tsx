import s from './VolunteerSection3.module.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { API_URL } from '../../services/pageService';
import ContactForm from '../../components/contactForm/ContactForm';

interface VolunteerPageSection {
  title_en: string;
  title_me: string;
  text_en: string;
  text_me: string;
  image_url: string;
  file?: File | null;
}

const VolunteerSection3: React.FC = () => {
  const { language } = useLanguage();
  const [section, setSection] = useState<VolunteerPageSection | null>(null);

  useEffect(() => {
    fetchData();
  }, [language]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/volunteer`);
      const result = res.data as any;
      const data = result.page;

      setSection({
        title_en: data?.section3_title_en || '',
        title_me: data?.section3_title_me || '',
        text_en: data?.section3_text_en || '',
        text_me: data?.section3_text_me || '',
        image_url: data?.section3_image ? `${API_URL}/images/${data.section3_image}` : '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!section) return null;

  return (
    <section className={s.volunteerSection3}>
      <div className={s.volunteerSection3Box}>
        <div className={s.volunteerSection3ImgBox}>
          {section.image_url && <img src={section.image_url} alt="section 3" />}
        </div>
        <span>
          <ContactForm />
        </span>
      </div>
    </section>
  );
};

export default VolunteerSection3;