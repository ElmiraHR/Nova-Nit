import axios from 'axios';

// ✅ Используем переменную API_URL из .env или локальный сервер по умолчанию
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export interface PageData {
  title_en?: string;
  title_me?: string;
  text_en?: string;
  text_me?: string;
  image_path?: string;
  mission_image_path?: string;
  how_work_image_path?: string;

  // ✅ Hero Banner
  hero_title_en?: string;
  hero_title_me?: string;
  hero_text_en?: string;
  hero_text_me?: string;
  hero_image_path?: string;

  // ✅ Body Info
  body_title_en?: string;
  body_title_me?: string;
  body_title_link?: string;

  body_info_en?: string;
  body_info_me?: string;
  section1_en?: string;
  section1_me?: string;
  section2_en?: string;
  section2_me?: string;
  section3_en?: string;
  section3_me?: string;

  // ✅ Partners
  partners_title_en?: string;
  partners_title_me?: string;
  partners_info_en?: string;
  partners_info_me?: string;
  partners_image_path?: string;
  partners_logos?: string[]; // ✅ добавляем массив логотипов
}

// ✅ Получение страницы по slug
export const fetchPage = async (slug: string): Promise<PageData> => {
  const response = await axios.get<PageData>(`${API_URL}/api/pages/${slug}`);
  const data = response.data;

  // ✅ Добавляем базовый URL для изображений, если нужно
  if (data.hero_image_path && !/^https?:\/\//.test(data.hero_image_path)) {
    data.hero_image_path = `${API_URL}${data.hero_image_path}`;
  }
  if (data.how_work_image_path && !/^https?:\/\//.test(data.how_work_image_path)) {
    data.how_work_image_path = `${API_URL}${data.how_work_image_path}`;
  }

  return data;
};

// ✅ Обновление страницы
export const updatePage = async (slug: string, data: PageData, imageFile?: File): Promise<PageData> => {
  const formData = new FormData();

  // ✅ Hero Banner
  formData.append('hero_title_en', data.hero_title_en || '');
  formData.append('hero_title_me', data.hero_title_me || '');
  formData.append('hero_text_en', data.hero_text_en || '');
  formData.append('hero_text_me', data.hero_text_me || '');

  // ✅ Body Info
  formData.append('body_title_en', data.body_title_en || '');
  formData.append('body_title_me', data.body_title_me || '');

  formData.append('body_title_link', data.body_title_link || '');

  
  formData.append('body_info_en', data.body_info_en || '');
  formData.append('body_info_me', data.body_info_me || '');
  formData.append('section1_en', data.section1_en || '');
  formData.append('section1_me', data.section1_me || '');
  formData.append('section2_en', data.section2_en || '');
  formData.append('section2_me', data.section2_me || '');
  formData.append('section3_en', data.section3_en || '');
  formData.append('section3_me', data.section3_me || '');

  // ✅ Partners
  formData.append('partners_title_en', data.partners_title_en || '');
  formData.append('partners_title_me', data.partners_title_me || '');
  formData.append('partners_info_en', data.partners_info_en || '');
  formData.append('partners_info_me', data.partners_info_me || '');

  // ✅ Загружаем файл, если он есть
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

// ✅ Обновление Mission
export const updateMission = async (slug: string, formData: FormData): Promise<PageData> => {
  try {
    console.log("Отправляем formData:", formData);
    const response = await axios.post<PageData>(`${API_URL}/api/mission/${slug}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("Ответ сервера:", response.data);
    return response.data;
  } catch (error) {
    console.error('Ошибка при обновлении миссии:', error);
    throw error;
  }
};

// ✅ Обновление How Does Work (фикс пути)
export const updateHowDoesWork = async (formData: FormData): Promise<PageData> => {
  try {
    console.log("✅ Отправляем formData:", formData);

    // 🛠️ Убедись, что путь API соответствует реальному маршруту на сервере
    const response = await axios.post<PageData>(`${API_URL}/api/howdoeswork`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("✅ Ответ сервера:", response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Ошибка при обновлении How Does Work:', error);
    throw error;
  }
};

// ✅ Обновление Partners
export const updatePartners = async (
  slug: string,
  data: PageData,
  imageFile?: File,
  logoFiles?: File[]
): Promise<PageData> => {
  const formData = new FormData();

  // ✅ Основные текстовые поля
  formData.append('partners_title_en', data.partners_title_en || '');
  formData.append('partners_title_me', data.partners_title_me || '');
  formData.append('partners_info_en', data.partners_info_en || '');
  formData.append('partners_info_me', data.partners_info_me || '');

  // ✅ Сохраняем уже существующие лого, оставшиеся после удаления
  if (data.partners_logos) {
    formData.append('partners_logos', JSON.stringify(data.partners_logos));
  }

  // ✅ Главная картинка
  if (imageFile) {
    formData.append('image', imageFile);
  }

  // ✅ Новые логотипы (если есть)
  if (logoFiles) {
    logoFiles.forEach((file) => {
      formData.append('logos[]', file);
    });
  }

  try {
    const response = await axios.post<PageData>(`${API_URL}/api/pages/partners/${slug}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating partners data', error);
    throw error;
  }
};
