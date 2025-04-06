import s from './VolunteerSection4.module.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { API_URL } from '../../services/pageService';

interface VolunteerCard {
  id?: number;
  name_en: string;
  name_me: string;
  text_en: string;
  text_me: string;
  photo: string;
  photoFile?: File | null;
  saved?: boolean;
}

const VolunteerSection4: React.FC = () => {
  const { language } = useLanguage();
  const [volunteers, setVolunteers] = useState<VolunteerCard[]>([]);

  useEffect(() => {
    fetchData();
  }, [language]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/volunteer`);
      const result = res.data as any;

      const vols = (result.volunteers || []).map((v: any) => ({
        id: v.id,
        name_en: v.name_en,
        name_me: v.name_me,
        text_en: v.text_en,
        text_me: v.text_me,
        photo: v.photo ? `${API_URL}/images/${v.photo}` : '',
        saved: true,
      }));
      setVolunteers(vols);
    } catch (err) {
      console.error('Error loading data', err);
    }
  };

  return (
    <div className={s.volunteerSection4}>
      <h2 className={s.sectionTitle}>
        {language === 'EN' ? 'Hear from our volunteers' : 'Čujte od naših volontera'}
      </h2>

      <div className={s.cardsContainer}>
        {volunteers.map((volunteer) => (
          <div key={volunteer.id} className={s.card}>
            <div className={s.photoBox}>
              {volunteer.photo && <img src={volunteer.photo} alt={volunteer.name_en} className={s.photo} />}
            </div>
            <div className={s.cardContent}>
              <h3 className={s.cardName}>
                {language === 'EN' ? volunteer.name_en : volunteer.name_me}
              </h3>
              <p className={s.cardText}>
                {language === 'EN' ? volunteer.text_en : volunteer.text_me}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerSection4;
