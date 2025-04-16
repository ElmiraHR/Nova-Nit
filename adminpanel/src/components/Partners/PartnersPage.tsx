import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_URL } from '../../services/pageService';
import styles from './PartnerPage.module.css';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor'; // Импортируем RichTextEditor

interface PartnerPageData {
  id: number;
  title_en: string;
  title_me: string;
  text_en: string;
  text_me: string;
  banner_image: string;
}

interface Partner {
  id?: number;
  name_en: string;
  name_me: string;
  text_en: string;
  text_me: string;
  logo: string;
  instagram_link: string;
  facebook_link: string;
  logoFile?: File | null;
}

const PartnersPage: React.FC = () => {
  const [pageData, setPageData] = useState<PartnerPageData | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [notification, setNotification] = useState('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get<{ page: PartnerPageData | null; partners: Partner[] }>(`${API_URL}/api/partners`);
      setPageData(res.data.page);

      const partnersWithPreview = res.data.partners.map((partner) => ({
        ...partner,
        logo: partner.logo ? `${API_URL}/images/${partner.logo}` : '',
        logoFile: null,
      }));

      setPartners(partnersWithPreview);

      if (res.data.page && res.data.page.banner_image) {
        setBannerPreview(`${API_URL}/images/${res.data.page.banner_image}`);
      }
    } catch (err) {
      console.error(err);
      setNotification('Error loading data');
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBannerFile(e.target.files[0]);
      setBannerPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSavePage = async () => {
    if (!pageData) return;
    try {
      const formData = new FormData();
      formData.append('title_en', pageData.title_en);
      formData.append('title_me', pageData.title_me);
      formData.append('text_en', pageData.text_en);
      formData.append('text_me', pageData.text_me);
      if (bannerFile) {
        formData.append('image', bannerFile);
      }
      await axios.post(`${API_URL}/api/partners/page/update/${pageData.id}`, formData);
      setNotification('Page updated');
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      setNotification('Error saving page');
    }
  };

  const handleDeletePartner = async (id: number | undefined) => {
    if (!id) return;
    try {
        await axios.delete(`${API_URL}/api/partners/delete/${id}`);

      setPartners(partners.filter(p => p.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      setNotification('Error deleting partner');
    }
  };

  const updatePartnerField = <K extends keyof Partner>(index: number, field: K, value: Partner[K]) => {
    const updated = [...partners];
    updated[index][field] = value;
    setPartners(updated);
  };

  const handleAddPartner = () => {
    setPartners([...partners, {
      name_en: '',
      name_me: '',
      text_en: '',
      text_me: '',
      logo: '',
      instagram_link: '',
      facebook_link: '',
      logoFile: null,
    }]);
  };

  const handleSavePartners = async () => {
    try {
      const updatedPartners: Partner[] = [];

      for (const partner of partners) {
        const formData = new FormData();
        formData.append('name_en', partner.name_en);
        formData.append('name_me', partner.name_me);
        formData.append('text_en', partner.text_en);
        formData.append('text_me', partner.text_me);
        formData.append('instagram_link', partner.instagram_link);
        formData.append('facebook_link', partner.facebook_link);

        if (partner.logoFile) {
          formData.append('logo', partner.logoFile);
        }

        if (partner.id) {
          await axios.post(`${API_URL}/api/partners/update/${partner.id}`, formData);
          updatedPartners.push(partner);
        } else {
          const response = await axios.post<{ message: string; id: number; logo: string }>(
            `${API_URL}/api/partners/create`, formData
          );
          updatedPartners.push({
            ...partner,
            id: response.data.id,
            logo: `${API_URL}/images/${response.data.logo}`,
            logoFile: null
          });
        }
      }

      setNotification('Partners saved successfully');
      setPartners(updatedPartners);
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      console.error(err);
      setNotification('Error saving partners');
    }
  };

  const renderPartnerFields = (partner: Partner, index: number) => {
    const fileInputId = `fileInput-${index}`;
    return (
      <div key={index} className={styles.partnerItem}>
        <RichTextEditor value={partner.name_en} onChange={(val) => updatePartnerField(index, 'name_en', val)} minHeight={50} />
        <RichTextEditor value={partner.name_me} onChange={(val) => updatePartnerField(index, 'name_me', val)} minHeight={50} />
        <RichTextEditor value={partner.text_en} onChange={(val) => updatePartnerField(index, 'text_en', val)} minHeight={120} />
        <RichTextEditor value={partner.text_me} onChange={(val) => updatePartnerField(index, 'text_me', val)} minHeight={120} />

        <label>Logo:</label>
        <div className={styles.fileInputWrapper}>
          <button className={styles.uploadButton} onClick={(e) => {
            e.preventDefault();
            document.getElementById(fileInputId)?.click();
          }}>Choose Logo</button>
          <span>{partner.logoFile?.name || 'No file selected'}</span>
          <input id={fileInputId} type="file" style={{ display: 'none' }} onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              const updated = [...partners];
              updated[index].logoFile = e.target.files[0];
              setPartners(updated);
            }
          }} />
        </div>

        {(partner.logoFile || partner.logo) && (
          <div className={styles.logoPreviewBlock}>
            <img
              src={partner.logoFile ? URL.createObjectURL(partner.logoFile) : partner.logo}
              alt="Logo"
              className={styles.logoPreview}
            />
            <button className={styles.cancelButton} onClick={() => {
              const updated = [...partners];
              updated[index].logoFile = null;
              updated[index].logo = '';
              setPartners(updated);
            }}>Cancel</button>
          </div>
        )}

        <input className={styles.inputField} placeholder="Instagram Link" value={partner.instagram_link} onChange={(e) => updatePartnerField(index, 'instagram_link', e.target.value)} />
        <input className={styles.inputField} placeholder="Facebook Link" value={partner.facebook_link} onChange={(e) => updatePartnerField(index, 'facebook_link', e.target.value)} />
        <button className={styles.deleteButton} onClick={() => handleDeletePartner(partner.id)}>Delete</button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Partners Page</h2>
      {notification && <div className={styles.notification}>{notification}</div>}

      {pageData && (
        <div className={styles.pageSection}>
          <label>Title (EN):</label>
          <RichTextEditor value={pageData.title_en} onChange={(val) => setPageData({ ...pageData, title_en: val })} minHeight={50} />
          <label>Title (ME):</label>
          <RichTextEditor value={pageData.title_me} onChange={(val) => setPageData({ ...pageData, title_me: val })} minHeight={50} />
          <label>Text (EN):</label>
          <RichTextEditor value={pageData.text_en} onChange={(val) => setPageData({ ...pageData, text_en: val })} minHeight={120} />
          <label>Text (ME):</label>
          <RichTextEditor value={pageData.text_me} onChange={(val) => setPageData({ ...pageData, text_me: val })} minHeight={120} />

          <label>Banner Image:</label>
          <div className={styles.fileInputWrapper}>
            <button className={styles.uploadButton} onClick={() => fileInputRef.current?.click()}>Choose Banner</button>
            <span>{bannerFile?.name || 'No file selected'}</span>
            <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleBannerChange} />
          </div>
          {bannerPreview && <img src={bannerPreview} alt="Preview" className={styles.imagePreview} />}

          <button className={styles.saveButton} onClick={handleSavePage}>Save Page Info</button>
        </div>
      )}

      <h3 className={styles.sectionTitle}>Partners List</h3>
      {partners.map((partner, idx) => renderPartnerFields(partner, idx))}
      <button className={styles.saveButton} onClick={handleSavePartners}>Save Partners</button>
      <button className={styles.addButton} onClick={handleAddPartner}>Add Partner</button>
    </div>
  );
};

export default PartnersPage;
