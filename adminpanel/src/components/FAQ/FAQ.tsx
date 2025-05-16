import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../services/pageService';
import styles from './FAQ.module.css';

interface FaqImageResponse {
  image_url: string;
}

interface FaqItem {
  id: number;
  question_en: string;
  question_me: string;
  answer_en: string;
  answer_me: string;
}

const FAQ: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [storedImage, setStoredImage] = useState('');
  const [imageName, setImageName] = useState('No file selected');
  const [notification, setNotification] = useState('');
  const [faqList, setFaqList] = useState<FaqItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showReplaceMessage, setShowReplaceMessage] = useState(false);

  useEffect(() => {
    fetchImage();
    fetchFaqs();
  }, []);

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

  const fetchFaqs = async () => {
    try {
      const res = await axios.get<FaqItem[]>(`${API_URL}/api/faq-page`);
      setFaqList(res.data);
    } catch (error) {
      console.error('Error loading FAQ list:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageName(e.target.files[0].name);
      setShowReplaceMessage(true);
    }
  };

  const handleCancelImage = () => {
    setImage(null);
    setImageName('No file selected');
    setShowReplaceMessage(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!image) return;
    try {
      const formData = new FormData();
      formData.append('image', image);

      const res = await axios.post<FaqImageResponse>(`${API_URL}/api/faq-image/upload`, formData);
      setStoredImage(`${API_URL}/${res.data.image_url}`);

      setImage(null);
      setImageName('No file selected');
      setShowReplaceMessage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';

      setNotification('Image uploaded!');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      setNotification('Upload failed');
    }
  };

  const handleFaqChange = (index: number, field: keyof FaqItem, value: string) => {
    const updatedFaqs = [...faqList];
    updatedFaqs[index] = {
      ...updatedFaqs[index],
      [field]: value,
    };
    
    setFaqList(updatedFaqs);
  };

  const handleSaveFaqs = async () => {
    try {
      await axios.post(`${API_URL}/api/faq-page/update`, { faqs: faqList });
      setNotification('FAQ updated!');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('FAQ update failed:', error);
      setNotification('FAQ update failed');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>FAQ Image </h2>
      {notification && <div className={styles.notification}>{notification}</div>}

      <div className={styles.uploadSection}>
        <button className={styles.uploadButton} onClick={() => fileInputRef.current?.click()}>
          Choose File
        </button>
        <span>{imageName}</span>
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          className={styles.hiddenInput}
        />
        <button className={styles.saveButton} onClick={handleUpload}>Upload</button>
      </div>

      {storedImage && (
        <div className={styles.previewWrapper}>
          <img
            src={storedImage}
            alt="FAQ"
            className={`${styles.image} ${image ? styles.dimmed : ''}`}
          />
        </div>
      )}

      {image && (
        <div className={styles.previewNewWrapper}>
          <img src={URL.createObjectURL(image)} alt="Preview" className={`${styles.image} ${styles.preview}`} />
          <div className={styles.replaceMessage}>
            This image will replace the current one.
            <button className={styles.cancelButton} onClick={handleCancelImage}>Cancel</button>
          </div>
        </div>
      )}

      {/* 🔽 РЕДАКТИРОВАНИЕ ВОПРОСОВ */}
      <h2 className={styles.sectionTitle}>Edit FAQ</h2>
      {faqList.map((faq, index) => (
        <div key={faq.id} className={styles.faqBlock}>
          <div className={styles.inputBlock}>
            <label>Question (EN) {index + 1}</label>
            <input
              type="text"
              value={faq.question_en}
              onChange={(e) => handleFaqChange(index, 'question_en', e.target.value)}
              className={styles.inputField}
            />
          </div>
          <div className={styles.inputBlock}>
            <label>Question (ME)</label>
            <input
              type="text"
              value={faq.question_me}
              onChange={(e) => handleFaqChange(index, 'question_me', e.target.value)}
              className={styles.inputField}
            />
          </div>
          <div className={styles.inputBlock}>
            <label>Answer (EN)</label>
            <textarea
              value={faq.answer_en}
              onChange={(e) => handleFaqChange(index, 'answer_en', e.target.value)}
              className={styles.textareaField}
            />
          </div>
          <div className={styles.inputBlock}>
            <label>Answer (ME)</label>
            <textarea
              value={faq.answer_me}
              onChange={(e) => handleFaqChange(index, 'answer_me', e.target.value)}
              className={styles.textareaField}
            />
          </div>
        </div>
      ))}
      <button className={styles.saveButton} onClick={handleSaveFaqs}>
        Save FAQ
      </button>
    </div>
  );
};

export default FAQ;
