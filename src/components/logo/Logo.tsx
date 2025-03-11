import lightLogo from '../../assets/nova-nit-logo.svg';
import darkLogo from '../../assets/nova-nit-dark-logo.svg';
import { useEffect, useState } from 'react';

import s from './Logo.module.css'

const Logo = () => {

    const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'light');

    useEffect(() => {
        const observer = new MutationObserver(() => {
            const newTheme = document.documentElement.getAttribute('data-theme') || 'light';
            setTheme(newTheme);
        });

        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        return () => observer.disconnect();
    }, []);

    const baseURL = 'http://localhost:8080'; // Базовый URL для логотипов и изображений

    return (

        <div className={s.landingLogo}>
            <img src={theme === 'dark' ? darkLogo : lightLogo} alt="logo" />
        </div>

    )
}

export default Logo