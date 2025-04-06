import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLanguage } from '../../context/LanguageContext';

interface FormData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

const validationSchemas = {
  EN: yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().matches(/^\+?\d{7,15}$/, 'Invalid phone number').notRequired(),
    subject: yup.string().notRequired(),
    message: yup.string().required('Message is required'),
  }) as yup.ObjectSchema<FormData>,
  ME: yup.object({
    name: yup.string().required('Ime je obavezno'),
    email: yup.string().email('Neispravan email').required('Email je obavezan'),
    phone: yup.string().matches(/^\+?\d{7,15}$/, 'Neispravan broj telefona').notRequired(),
    subject: yup.string().notRequired(),
    message: yup.string().required('Poruka je obavezna'),
  }) as yup.ObjectSchema<FormData>,
};

const ContactForm: React.FC = () => {
  const { language } = useLanguage();
  const schema = validationSchemas[language as 'EN' | 'ME'];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
      {/* Name */}
      <div style={styles.inputWrapper}>
        <label style={styles.label}>{language === 'ME' ? 'Ime*' : 'Name*'}</label>
        <input {...register('name')} style={styles.input} />
        {errors.name && <p style={styles.error}>{errors.name.message}</p>}
      </div>

      {/* Email */}
      <div style={styles.inputWrapper}>
        <label style={styles.label}>Email*</label>
        <input {...register('email')} style={styles.input} />
        {errors.email && <p style={styles.error}>{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div style={styles.inputWrapper}>
        <label style={styles.label}>{language === 'ME' ? 'Telefon' : 'Phone'}</label>
        <input {...register('phone')} style={styles.input} />
        {errors.phone && <p style={styles.error}>{errors.phone.message}</p>}
      </div>

      {/* Subject */}
      <div style={styles.inputWrapper}>
        <label style={styles.label}>{language === 'ME' ? 'Tema' : 'Subject'}</label>
        <input {...register('subject')} style={styles.input} />
      </div>

      {/* Message */}
      <div style={styles.inputWrapper}>
        <label style={styles.label}>{language === 'ME' ? 'Poruka*' : 'Message*'}</label>
        <textarea {...register('message')} style={styles.textarea} />
        {errors.message && <p style={styles.error}>{errors.message.message}</p>}
      </div>

      <button type="submit" style={styles.button}>
        {language === 'ME' ? 'Pošalji' : 'Submit'}
      </button>
    </form>
  );
};

// Стили
const styles: { [key: string]: React.CSSProperties } = {
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0',
    padding: '0',
    minWidth: '280px',
    maxWidth: '566px',
  },
  inputWrapper: {
    position: 'relative', // Оставляем место для абсолютного позиционирования ошибки
    marginBottom: 'clamp(16px, 4vw, 49px)', // Отступ для ошибок
    boxSizing: 'border-box',
    width: '100%',
  },
  label: {
    fontSize: 'clamp(18px, 2vw, 24px)',
    marginBottom: '4px',
    display: 'block',
  },
  input: {
    width: '100%',
    background: 'transparent',
    padding: 'clamp(6px, 0.9vw, 11px)',
    border: '1px solid var(--text-color)',
    borderRadius: '4px',
    fontSize: '14px',
    color: 'var(--text-color)',
    outlineColor: 'green',
    maxWidth: '566px',
    minWidth: '280px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    background: 'transparent',
    padding: '8px',
    border: '1px solid var(--text-color)',
    borderRadius: '4px',
    fontSize: '14px',
    minHeight: 'clamp(44px, 6vw, 68px)',
    color: 'var(--text-color)',
    outlineColor: 'green',
    maxWidth: '566px',
    minWidth: '280px',
    boxSizing: 'border-box',
  },
  button: {
    padding: '20px',
    backgroundColor: 'var(--button-bg)',
    color: 'var(--button-text)',
    border: 'none',
    borderRadius: '15px',
    fontSize: '24px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: 'clamp(4px, 4vw, 45px)',
    width: '100%',
  },
  error: {
    position: 'absolute',
    bottom: '-18px', // Смещаем ошибку вниз
    left: '0',
    color: 'red',
    fontSize: '14px',
  },
};

export default ContactForm;
