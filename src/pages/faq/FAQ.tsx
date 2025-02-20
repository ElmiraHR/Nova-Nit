import React, { useState } from 'react';
import styles from './FAQ.module.css';

const FAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    { question: 'What is Nova Nit Food Bank?', answer: 'We are a non-profit organization supporting people in need in Montenegro.' },
    { question: 'How can I volunteer?', answer: 'You can sign up through our Volunteer page or contact us directly.' },
    { question: 'Where are you located?', answer: 'We are based in Montenegro and operate in various regions.' }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.faq}>
      <h1>Frequently Asked Questions</h1>
      {faqs.map((faq, index) => (
        <div key={index} className={styles.faqItem}>
          <h3 onClick={() => toggleFAQ(index)}>{faq.question}</h3>
          {activeIndex === index && <p>{faq.answer}</p>}
        </div>
      ))}
    </div>
  );
};

export default FAQ;