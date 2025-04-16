import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import styles from './VolunteerPage.module.css';
import { API_URL } from '../../services/pageService';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';

interface VolunteerPageSection {
  title_en: string;
  title_me: string;
  text_en: string;
  text_me: string;
  image_url: string;
  file?: File | null;
}

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

const VolunteerPage: React.FC = () => {
  const [sections, setSections] = useState<VolunteerPageSection[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerCard[]>([]);
  const [notification, setNotification] = useState('');
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const volunteerFileRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/volunteer`);
      const result = res.data as any;
      const data = result.page;

      setSections([
        {
          title_en: data?.section1_title_en || '',
          title_me: data?.section1_title_me || '',
          text_en: data?.section1_text_en || '',
          text_me: data?.section1_text_me || '',
          image_url: data?.section1_image ? `${API_URL}/images/${data.section1_image}` : '',
        },
        {
          title_en: data?.section2_title_en || '',
          title_me: data?.section2_title_me || '',
          text_en: data?.section2_text_en || '',
          text_me: data?.section2_text_me || '',
          image_url: data?.section2_image ? `${API_URL}/images/${data.section2_image}` : '',
        },
        {
          title_en: '',
          title_me: '',
          text_en: '',
          text_me: '',
          image_url: data?.section3_image ? `${API_URL}/images/${data.section3_image}` : '',
        },
      ]);

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

  const handleSectionChange = (index: number, field: string, value: any) => {
    const updated = [...sections];
    if (field === 'file' && value instanceof File) {
      updated[index].file = value;
      updated[index].image_url = URL.createObjectURL(value);
    } else {
      (updated[index] as any)[field] = value;
    }
    setSections(updated);
  };

  const handleVolunteerChange = (index: number, field: string, value: any) => {
    const updated = [...volunteers];
    if (field === 'photoFile' && value instanceof File) {
      updated[index].photoFile = value;
      updated[index].photo = URL.createObjectURL(value);
      updated[index].saved = false;
    } else {
      (updated[index] as any)[field] = value;
      updated[index].saved = false;
    }
    setVolunteers(updated);
  };

  const handleAddVolunteer = () => {
    setVolunteers([...volunteers, {
      name_en: '', name_me: '', text_en: '', text_me: '', photo: '', photoFile: null, saved: false
    }]);
  };

  const handleDeleteVolunteer = async (index: number) => {
    const volunteer = volunteers[index];
    if (volunteer.id) {
      await axios.delete(`${API_URL}/api/volunteer/delete/${volunteer.id}`);
    }
    const updated = [...volunteers];
    updated.splice(index, 1);
    setVolunteers(updated);
  };

  const handleSaveSections = async () => {
    try {
      const formData = new FormData();

      formData.append('section1_title_en', sections[0].title_en);
      formData.append('section1_title_me', sections[0].title_me);
      formData.append('section1_text_en', sections[0].text_en);
      formData.append('section1_text_me', sections[0].text_me);
      if (sections[0].file) {
        formData.append('section1_image', sections[0].file);
      }

      formData.append('section2_title_en', sections[1].title_en);
      formData.append('section2_title_me', sections[1].title_me);
      formData.append('section2_text_en', sections[1].text_en);
      formData.append('section2_text_me', sections[1].text_me);
      if (sections[1].file) {
        formData.append('section2_image', sections[1].file);
      }

      if (sections[2].file) {
        formData.append('section3_image', sections[2].file);
      }

      await axios.post(`${API_URL}/api/volunteer/page/update/1`, formData);
      setNotification('Sections updated');
      fetchData();
    } catch (err) {
      console.error(err);
      setNotification('Error updating sections');
    }
  };

  const handleSaveVolunteer = async (vol: VolunteerCard, index: number) => {
    try {
      const formData = new FormData();
      formData.append('name_en', vol.name_en);
      formData.append('name_me', vol.name_me);
      formData.append('text_en', vol.text_en);
      formData.append('text_me', vol.text_me);
      if (vol.photoFile) {
        formData.append('photo', vol.photoFile);
      }
  
      let response;
      if (vol.id) {
        response = await axios.post(`${API_URL}/api/volunteer/update/${vol.id}`, formData);
      } else {
        response = await axios.post(`${API_URL}/api/volunteer/create`, formData);
      }
  
      setNotification('Volunteer saved');
  
      const responseData = response.data as any;
      const newPhotoFromServer = responseData?.photo;
  
      const updated = [...volunteers];
      updated[index] = {
        ...vol,
        id: vol.id || responseData.id,
        photo: newPhotoFromServer
          ? `${API_URL}/images/${newPhotoFromServer}`
          : vol.photo,
        photoFile: null,
        saved: true,
      };
      setVolunteers(updated);
    } catch (err) {
      console.error(err);
      setNotification('Error saving volunteer');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Volunteer With Us</h2>
      {notification && <div className={styles.notification}>{notification}</div>}

      {sections.map((sec, idx) => (
        <div key={idx} className={styles.sectionBox}>
          <h3 className={styles.subTitle}>Section {idx + 1}</h3>
          {idx < 2 && (
            <>
              <label className={styles.label}>Title EN: </label>
              <RichTextEditor value={sec.title_en} onChange={(val) => handleSectionChange(idx, 'title_en', val)} minHeight={50} />
              <label className={styles.label}>Title ME: </label>
              <RichTextEditor value={sec.title_me} onChange={(val) => handleSectionChange(idx, 'title_me', val)} minHeight={50} />
              <label className={styles.label}>Text EN: </label>
              <RichTextEditor value={sec.text_en} onChange={(val) => handleSectionChange(idx, 'text_en', val)} minHeight={120} />
              <label className={styles.label}>Text ME: </label>
              <RichTextEditor value={sec.text_me} onChange={(val) => handleSectionChange(idx, 'text_me', val)} minHeight={120} />
            </>
          )}
          <button className={styles.uploadButton} onClick={() => fileInputRefs.current[idx]?.click()}>Choose File</button>
          <input type="file" ref={(el) => { fileInputRefs.current[idx] = el; }} onChange={(e) => e.target.files && handleSectionChange(idx, 'file', e.target.files[0])} className={styles.hiddenInput} />
          {sec.image_url && <img src={sec.image_url} className={styles.previewImage} alt="section" />}
        </div>
      ))}

      <button className={styles.saveButton} onClick={handleSaveSections}>Save Sections</button>

      <h3 className={styles.subTitle}>Volunteers</h3>
      {volunteers.map((vol, idx) => (
        <div key={idx} className={styles.volunteerCard}>
          <label className={styles.label}>Name EN: </label>
          <input value={vol.name_en} placeholder="Name EN" className={styles.inputField} onChange={(e) => handleVolunteerChange(idx, 'name_en', e.target.value)} />
          <label className={styles.label}>Name ME: </label>
          <input value={vol.name_me} placeholder="Name ME" className={styles.inputField} onChange={(e) => handleVolunteerChange(idx, 'name_me', e.target.value)} />
          <label className={styles.label}>Text EN: </label>
          <RichTextEditor value={vol.text_en} onChange={(val) => handleVolunteerChange(idx, 'text_en', val)} minHeight={120} />
          <label className={styles.label}>Text ME: </label>
          <RichTextEditor value={vol.text_me} onChange={(val) => handleVolunteerChange(idx, 'text_me', val)} minHeight={120} />
          <button className={styles.uploadButton} onClick={() => volunteerFileRefs.current[idx]?.click()}>Choose File</button>
          <input type="file" ref={(el) => { volunteerFileRefs.current[idx] = el; }} onChange={(e) => e.target.files && handleVolunteerChange(idx, 'photoFile', e.target.files[0])} className={styles.hiddenInput} />
          {vol.photo && (
            <img src={vol.photo} alt="volunteer" className={styles.volunteerImage} style={{ opacity: vol.saved === false ? 0.5 : 1 }} />
          )}
          <button
            className={`${styles.saveButton} ${vol.saved ? styles.disabledButton : ''}`}
            disabled={vol.saved}
            onClick={() => handleSaveVolunteer(vol, idx)}
          >
            Save
          </button>
          <button className={styles.deleteButton} onClick={() => handleDeleteVolunteer(idx)}>Delete</button>
        </div>
      ))}

      <button className={styles.addButton} onClick={handleAddVolunteer}>Add Volunteer</button>
    </div>
  );
};

export default VolunteerPage;
