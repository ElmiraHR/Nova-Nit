import React from 'react';
import s from './Volunteer.module.css';
import VolunteerSection1 from '../../components/volunteerSection1/VolunteerSection1';
import VolunteerSection2 from '../../components/volunteerSection2/VolunteerSection2';
import VolunteerSection3 from '../../components/volunteerSection3/VolunteerSection3';
import VolunteerSection4 from '../../components/volunteerSection4/VolunteerSection4';
import { useLanguage } from '../../context/LanguageContext';

const Volunteer: React.FC = () => {
    const { language } = useLanguage();
  return (
    <div className={s.volunteer}>
      <h2>{language === 'EN' ? 'Volunteer With Us' : 'Volontirajte s Nama'}</h2>
      <VolunteerSection1 />
      <VolunteerSection2 />
      <VolunteerSection3 />
      <VolunteerSection4 />
    </div>
  );
};

export default Volunteer;