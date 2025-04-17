import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import s from "./Landing.module.css";
import { fetchPage } from "../../services/pageService";
import { useLanguage } from "../../context/LanguageContext";

const Hero = styled.section`
  background: var(--main-bg);
  padding: 1rem 2rem 8rem 2rem;
  text-align: center;
`;

const HeroTitle = styled.h1`
  color: var(--text-in-boxes);
  font-family: "Roboto", sans-serif;
  font-size: clamp(20px, 3.265vw, 47px);
  line-height: clamp(34px, 6.5vw, 74px);
  font-weight: 400;
  text-align: left;
  margin-bottom: 1rem;
`;

const HeroText = styled.div`
  color: var(--text-in-boxes);
  font-size: clamp(18px, 2vw, 24px);
  line-height: clamp(24px, 3vw, 40px);
  font-family: "Roboto", sans-serif;
  text-align: left;
  font-weight: 400;
`;

const HeroButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  background: var(--button-bg);
  color: var(--button-text);
  width: clamp(181px, 23.5vw, 334px);
  height: clamp(50px, 7vw, 80px);
  padding: 0;
  border: none;
  border-radius: 4px;
  font-size: clamp(18px, 2vw, 24px);
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: var(--text-in-boxes);
  }
`;

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [storedImagePath, setStoredImagePath] = useState<string | null>(null);
  const [bodyTitle, setBodyTitle] = useState("");
  const [bodyTitleLink, setBodyTitleLink] = useState('');
  const [bodyText, setBodyText] = useState("");
  const [sections, setSections] = useState<{ en: string; me: string }[]>([]);
  const [titlePartners, setTitlePartners] = useState("");
  const [infoPartners, setInfoPartners] = useState("");
  const [storedMainImage, setStoredMainImage] = useState("");
  const [storedLogos, setStoredLogos] = useState<string[]>([]);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const pageData = await fetchPage("landing");

        setTitle(language === "EN" ? pageData.hero_title_en || "" : pageData.hero_title_me || "");
        setText(language === "EN" ? pageData.hero_text_en || "" : pageData.hero_text_me || "");
        setStoredImagePath(pageData.hero_image_path || pageData.image_path || null);
        setBodyTitle(language === "EN" ? pageData.body_title_en || "" : pageData.body_title_me || "");
        setBodyTitleLink(pageData.body_title_link || "");
        setBodyText(language === "EN" ? pageData.body_info_en || "" : pageData.body_info_me || "");
        setTitlePartners(language === "EN" ? pageData.partners_title_en || "" : pageData.partners_title_me || "");
        setInfoPartners(language === "EN" ? pageData.partners_info_en || "" : pageData.partners_info_me || "");
        setStoredMainImage(pageData.partners_image_path || "");

        let parsedLogos: string[] = [];
        if (Array.isArray(pageData.partners_logos)) {
          parsedLogos = pageData.partners_logos;
        } else if (typeof pageData.partners_logos === "string") {
          try {
            parsedLogos = JSON.parse(pageData.partners_logos);
          } catch (error) {
            console.error("Ошибка парсинга partners_logos:", error);
          }
        }
        setStoredLogos(parsedLogos);

        const sectionsData = [
          { en: pageData.section1_en || "No data", me: pageData.section1_me || "Nema podataka" },
          { en: pageData.section2_en || "No data", me: pageData.section2_me || "Nema podataka" },
          { en: pageData.section3_en || "No data", me: pageData.section3_me || "Nema podataka" },
        ];
        setSections(sectionsData);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    loadPageData();
  }, [language]);

  const baseURL = "http://localhost:8080";

  return (
    <Hero>
      <div className={s.landingBannerBox}>
        <div className={s.landingBannerBox_textSide}>
        <h1 className={s.heroTitle}>
  {title
    .replace(/<\/p>/g, '</p>\n') // добавим перенос после каждого </p>
    .replace(/<br\s*\/?>/gi, '\n') // заменим <br> на \n
    .replace(/<\/?p>/g, '') // удалим все <p> и </p>
    .split('\n') // разобьём по \n
    .map((line, idx) => (
      <React.Fragment key={idx}>
        {line}
        <br />
      </React.Fragment>
    ))}
</h1>



        <HeroText dangerouslySetInnerHTML={{ __html: text }} />
          <HeroButton onClick={() => navigate("/get-involved")}>{language === "ME" ? 'Uključi se' : 'Get Involved'}</HeroButton>
        </div>
        <div className={s.landingBannerBox_imgSide}>
          {storedImagePath && <img src={storedImagePath} alt="banner" />}
          <HeroButton onClick={() => navigate("/how-does-it-work")}>{language === "ME" ? 'Saznaj više' : 'Learn More'}</HeroButton>
        </div>
      </div>

      <div className={s.landingBodyBox}>
        <a href={bodyTitleLink}><h2 dangerouslySetInnerHTML={{ __html: bodyTitle }} /></a>
        <HeroText dangerouslySetInnerHTML={{ __html: bodyText }} />
        <HeroButton onClick={() => navigate("/get-involved")}>{language === "ME" ? 'Uključi se' : 'Get Involved'}</HeroButton>
      </div>

      <div className={s.landingBodyBox_section}>
        {sections.map((sec, index) => (
          <div className={s.landingBodyBox_sectionBox} key={index}>
            <h3 dangerouslySetInnerHTML={{ __html: language === "EN" ? sec.en : sec.me }} />
          </div>
        ))}
      </div>

      <div className={s.landingPartnersBox}>
        <div className={s.landingPartnersBox_imgSide}>
          {storedMainImage && <img src={`${baseURL}${storedMainImage}`} alt="Main banner of the page" />}
        </div>
        <div className={s.landingPartnersBox_textSide}>
          <h2 dangerouslySetInnerHTML={{ __html: titlePartners }} />

          <div className={s.landingPartnersLogos}>
            {storedLogos.length > 0 ? (
              storedLogos.map((file, idx) => (
                <div key={idx}>
                  <img
                    src={`${baseURL}${file}`}
                    alt={`Partner Logo ${idx}`}
                    onError={(e) => (e.currentTarget.style.display = "none")}
                  />
                </div>
              ))
            ) : (
              <p>{language === "ME" ? 'Nema dostupnih partnera.' : 'No partners available.'}</p>
            )}
          </div>

          <HeroText dangerouslySetInnerHTML={{ __html: infoPartners }} />
          <HeroButton onClick={() => navigate("/partners")}>{language === "ME" ? 'Uključi se' : 'Get Involved'}</HeroButton>
        </div>
      </div>
    </Hero>
  );
};

export default Landing;