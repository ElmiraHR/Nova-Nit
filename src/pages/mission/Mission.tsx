// src/pages/Mission/Mission.tsx
import React from 'react';
import styles from './Mission.module.css';

const Mission: React.FC = () => {
  return (
    <section className={styles.mission}>
      <h1 className={styles.title}>Our Mission</h1>
      <p className={styles.content}>
        Nourish Kit is dedicated to providing food and support to communities in need, fostering sustainability and empowerment.
      </p>
      <img src="/images/mission-image.jpg" alt="Mission" className={styles.image} />
    </section>
  );
};

export default Mission;