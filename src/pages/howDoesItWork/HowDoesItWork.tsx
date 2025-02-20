// src/pages/HowDoesItWork/HowDoesItWork.tsx
import React from 'react';
import styles from './HowDoesItWork.module.css';

const HowDoesItWork: React.FC = () => {
  return (
    <section className={styles.howDoesItWork}>
      <h1 className={styles.title}>How Does It Work?</h1>
      <div className={styles.steps}>
        <div className={styles.step}>
          <h2>Step 1: Donate</h2>
          <p>Contribute to our cause by donating food or funds.</p>
        </div>
        <div className={styles.step}>
          <h2>Step 2: Distribution</h2>
          <p>We distribute resources to communities in need.</p>
        </div>
        <div className={styles.step}>
          <h2>Step 3: Impact</h2>
          <p>Make a lasting difference in people's lives.</p>
        </div>
      </div>
    </section>
  );
};

export default HowDoesItWork;