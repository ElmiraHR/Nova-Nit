import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './PageEditor.module.css';

interface PageContent {
  content: string;
  imageUrl?: string;
}

const PageEditor = () => {
  const { page } = useParams<{ page: string }>();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (!page) return;

    axios.get<PageContent>(`/api/getPageContent/${page}`)
      .then((res) => {
        setContent(res.data.content); // ✅ Здесь тип автоматически подтянется
      })
      .catch(err => console.error('Ошибка при загрузке данных:', err));
  }, [page]);

  const handleSave = () => {
    const formData = new FormData();
    formData.append('content', content);
    if (image) formData.append('image', image);

    axios.post(`/api/savePageContent/${page}`, formData)
      .then(() => alert('Changes saved!'))
      .catch(err => console.error('Ошибка при сохранении:', err));
  };

  return (
    <div className={styles.editor}>
      <h2>Editing: {page}</h2>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Edit content here..."
      />

      <input
        type="file"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />

      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};

export default PageEditor;
