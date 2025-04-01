import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './AllImages.module.css';
import { API_URL } from '../../services/pageService';

interface ImageItem {
  name: string;
  url: string;
  created_at: string;
}

const AllImages: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);
  const [notification, setNotification] = useState('');

  const fetchImages = async () => {
    try {
      const res = await axios.get<ImageItem[]>(`${API_URL}/api/all-images`);
      setImages(res.data);
    } catch (error) {
      console.error('Ошибка загрузки изображений:', error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDelete = async (fileName: string) => {
    setDeletingImage(fileName);
  };

  const confirmDelete = async (fileName: string) => {
    try {
      await axios.delete(`${API_URL}/api/all-images/${fileName}`);
      setNotification('Image deleted');
      setDeletingImage(null);
      fetchImages();
      setTimeout(() => setNotification(''), 2000);
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      setNotification('Failed to delete image');
    }
  };

  const cancelDelete = () => {
    setDeletingImage(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>All Uploaded Images</h2>
      {notification && <div className={styles.notification}>{notification}</div>}
      <div className={styles.grid}>
        {images.map((img, index) => (
          <div key={index} className={styles.imageItem}>
            <img src={`${API_URL}/${img.url}`} alt={img.name} />
            <div className={styles.date}>{img.created_at}</div>
            <button
              className={styles.deleteButton}
              onClick={() => handleDelete(img.name)}
              disabled={deletingImage === img.name}
            >
              Delete
            </button>
            {deletingImage === img.name && (
              <div className={styles.inlineConfirm}>
               
                <div className={styles.actions}>
                <span className={styles.warningText}>Are you sure? Image will be permanently deleted.</span>
                  <button className={styles.confirmYes} onClick={() => confirmDelete(img.name)}>Yes</button>
                  <button className={styles.confirmNo} onClick={cancelDelete}>No</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllImages;
