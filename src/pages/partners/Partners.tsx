// src/pages/Partners/Partners.tsx
import React from 'react';
import styles from './Partners.module.css';

const Partners: React.FC = () => {
  return (
    <section className={styles.partners}>
      <h1 className={styles.title}>Our Partners</h1>
      <div className={styles.partnerList}>
        <div className={styles.partner}>
          <img src="/images/partner1.jpg" alt="Partner 1" className={styles.partnerLogo} />
          <p>Partner Organization 1</p>
        </div>
        <div className={styles.partner}>
          <img src="/images/partner2.jpg" alt="Partner 2" className={styles.partnerLogo} />
          <p>Partner Organization 2</p>
        </div>
      </div>
    </section>
  );
};

export default Partners;