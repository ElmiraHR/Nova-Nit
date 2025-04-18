import s from './VolunteerSection2.module.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { API_URL } from '../../services/pageService';
import { renderHtmlText } from "../../services/renderHtmlText"

interface VolunteerPageSection {
  title_en: string;
  title_me: string;
  text_en: string;
  text_me: string;
  image_url: string;
  file?: File | null;
}

const VolunteerSection2: React.FC = () => {
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
        title_en: data?.section2_title_en || '',
        title_me: data?.section2_title_me || '',
        text_en: data?.section2_text_en || '',
        text_me: data?.section2_text_me || '',
        image_url: data?.section2_image ? `${API_URL}/images/${data.section2_image}` : '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!section) return null;

  const title = language === 'EN' ? section.title_en : section.title_me;
  const text = language === 'EN' ? section.text_en : section.text_me;

  return (
    <section className={s.volunteerSection2}>
      <div className={s.volunteerSection2Box}>
        <div className={s.volunteerSection2ContentBox}>
          <h3 className={s.volunteerSection2Title}>{renderHtmlText(title)}</h3>
          <p className={s.volunteerSection2Content}>{renderHtmlText(text)}</p>
        </div>
        <div className={s.volunteerSection2ImgBox}>
          {section.image_url && <img src={section.image_url} alt="section 1" />}
        </div>
      </div>
    </section>
  );
};

export default VolunteerSection2;