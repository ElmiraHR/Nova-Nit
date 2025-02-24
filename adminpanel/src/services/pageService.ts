import axios from 'axios';

// ✅ Используем переменную API_URL из .env
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export interface PageData {
  title_en?: string;
  title_me?: string;
  text_en?: string;
  text_me?: string;
  image_path?: string;

  // ✅ Hero Banner
  hero_title_en?: string;
  hero_title_me?: string;
  hero_text_en?: string;
  hero_text_me?: string;
  hero_image_path?: string;

  // ✅ Body Info
  body_info_en?: string;
  body_info_me?: string;

  // ✅ Partners
  partners_title_en?: string;
  partners_title_me?: string;
  partners_info_en?: string;
  partners_info_me?: string;
  partners_image_path?: string;
}

export const fetchPage = async (slug: string): Promise<PageData> => {
  const response = await axios.get<PageData>(`${API_URL}/api/pages/${slug}`);
  const data = response.data;

  // Добавляем базовый URL, если его нет
  if (data.hero_image_path && !/^https?:\/\//.test(data.hero_image_path)) {
    data.hero_image_path = `${API_URL}${data.hero_image_path}`;
  }

  return data;
};

export const updatePage = async (slug: string, data: PageData, imageFile?: File): Promise<PageData> => {
  const formData = new FormData();

  formData.append('hero_title_en', data.hero_title_en || '');
  formData.append('hero_title_me', data.hero_title_me || '');
  formData.append('hero_text_en', data.hero_text_en || '');
  formData.append('hero_text_me', data.hero_text_me || '');

  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const response = await axios.post<PageData>(`${API_URL}/api/pages/${slug}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating page data', error);
    throw error;
  }
};
