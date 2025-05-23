import s from './Partners.module.css';
import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../services/pageService';
import { useLanguage } from '../../context/LanguageContext';
import SocialLinks from '../../components/socialLinks/SocialLinks';
import { useNavigate } from 'react-router-dom';
import { renderHtmlText } from "../../services/renderHtmlText"

const PartnersButton = styled.button`
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

interface PartnerPageData {
  id: number;
  title_en: string;
  title_me: string;
  text_en: string;
  text_me: string;
  banner_image: string;
}

interface Partner {
  id?: number;
  name_en: string;
  name_me: string;
  text_en: string;
  text_me: string;
  logo: string;
  instagram_link: string;
  facebook_link: string;
}

const Partners: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<PartnerPageData | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const res = await axios.get<{ page: PartnerPageData | null; partners: Partner[] }>(`${API_URL}/api/partners`);

        if (res.data.page) {
          setPageData(res.data.page);

          if (res.data.page.banner_image) {
            setBannerPreview(`${API_URL}/images/${res.data.page.banner_image}`);
          }
        }

        if (res.data.partners.length > 0) {
          const partnersWithLogos = res.data.partners.map((partner) => ({
            ...partner,
            logo: partner.logo ? `${API_URL}/images/${partner.logo}` : "",
          }));
          setPartners(partnersWithLogos);
        }
      } catch (err) {
        console.error("❌ Ошибка загрузки данных:", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [language]);

  const title = pageData ? (language === "ME" ? pageData.title_me : pageData.title_en) : "Loading...";
  const text = pageData ? (language === "ME" ? pageData.text_me : pageData.text_en) : "Loading...";

  if (isLoading) {
    return (
      <section className={s.partners}>
        <h2>Loading...</h2>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className={s.partners}>
        <h2>Loading error</h2>
      </section>
    );
  }

  return (
    <section className={s.partners}>
  <h2 className={s.partners_title}>
    {renderHtmlText(title)}
  </h2>

  <div className={s.partners_Box}>
    <div className={s.partners_ContentBox}>
      <p className={s.partners_Content}>
        {renderHtmlText(text)}
      </p>
      <PartnersButton onClick={() => navigate("/contact-us")}>
        {language === "ME" ? "Kontaktirajte nas" : "Contact us"}
      </PartnersButton>
    </div>
    <div className={s.partners_ImgBox}>
      {bannerPreview ? (
        <img
          src={bannerPreview}
          alt="How It Works"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <p>⚠️ The picture is not available</p>
      )}
    </div>
  </div>

  <h2 className={s.partners_title}>
    {language === "ME" ? "Hvala svim našim partnerima!" : "Thank you to all of our partners!"}
  </h2>

  <div id="partners-section" className={s.partners_list}>
    {partners.length > 0 ? (
      partners.map((partner) => {
        const name = language === "ME" ? partner.name_me : partner.name_en;
        const textHtml = language === "ME" ? partner.text_me : partner.text_en;
        const hasSocial = partner.instagram_link || partner.facebook_link;
        const hasContent = partner.logo || textHtml || hasSocial;

        if (!hasContent) return null;

        return (
          <div key={partner.id} className={s.partner_item}>
            <h3>{renderHtmlText(name)}</h3>

            {partner.logo && (
              <img src={partner.logo} alt={partner.name_en} className={s.partner_logo} />
            )}

            {textHtml && (
              <p>{renderHtmlText(textHtml)}</p>
            )}

            {hasSocial && (
              <SocialLinks
                size={78}
                instagramUrl={partner.instagram_link}
                facebookUrl={partner.facebook_link}
              />
            )}
          </div>
        );
      })
    ) : (
      <p>❌ Partners are not available</p>
    )}
  </div>
</section>
  );
};

export default Partners;
