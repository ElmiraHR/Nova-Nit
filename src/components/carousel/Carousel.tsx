"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import axios from "axios";
import { API_URL } from "../../services/pageService";
import styles from "./Carousel.module.css";

interface ImageData {
  id: number;
  image_url: string;
}

const Carousel: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get<ImageData[]>(`${API_URL}/api/getinvolved`);
      setImages(res.data);
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  return (
    <div className={styles.carouselContainer}>
      {images.length > 0 ? (
        <Swiper
          modules={[Autoplay]}
          spaceBetween={40}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={images.length > 4} // Включаем loop, если достаточно изображений
          breakpoints={{
            320: { slidesPerView: 1 }, // Мобильные устройства
            505: { slidesPerView: 2 }, // Небольшие экраны
            1348: { slidesPerView: 3 }, // Планшеты
          }}
        >
          {images.map((img) => (
            <SwiperSlide key={img.id} className={styles.slide}>
              <img
                src={`${API_URL}/${img.image_url}`}
                alt={`Image ${img.id}`}
                className={styles.image}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>Loading images...</p>
      )}
    </div>
  );
};

export default Carousel;
