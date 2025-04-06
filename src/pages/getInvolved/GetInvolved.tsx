import React, { useState } from "react";
import s from './GetInvolved.module.css';
import { useLanguage } from "../../context/LanguageContext";
import styled from "styled-components";
import donate from "../../assets/donate.svg"
import adopt from "../../assets/adopt.svg"
import food from "../../assets/food.svg"
import volunteer from "../../assets/volunteer.svg"
import { motion, AnimatePresence } from "framer-motion";
import { Copy, X } from "lucide-react";
import Carousel from "../../components/carousel/Carousel";


const GetInvolvedButton = styled.button`
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

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0px;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ModalContent = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 330px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  color: #2B3442;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
`;

const CopyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  gap: 8px;
  display: flex;
  align-items: center;
  justify-self: center;
  align-self: center;
  color: #2B3442;
`;

const Toast = styled(motion.div)`
  position: absolute;
  top: -50px;
  left: 85px;
  transform: translateX(-50%);
  background: #4caf50;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  opacity: 0.9;
  z-index: 9;
`;

const DonateModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [showToast, setShowToast] = useState(false);
  const requisites = `CKB bank: Nevladino Udruzenje Nova Nit Podgorica, 
  8 Marta br. 70, Podgorica, 
  PIB: 02394979 
  Account Number: 510000000012512167`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(requisites);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={onClose}>
                <X size={20} />
              </CloseButton>
              <h3>Donate now</h3>
              <p style={{ fontSize: "14px", textAlign: "left", whiteSpace: "pre-line", lineHeight: "1.5" }}>
                {requisites}
              </p>
              <CopyButton onClick={copyToClipboard}>
                <Copy size={20} /> Copy
              </CopyButton>

              <AnimatePresence>
                {showToast && (
                  <Toast
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: -20 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    Successfully copied! ✅
                  </Toast>
                )}
              </AnimatePresence>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

const GetInvolved: React.FC = () => {
    const { language } = useLanguage();
      const [isModalOpen, setModalOpen] = useState(false);
  return (
    <div className={s.getInvolved}>
      <h2>{language === "ME" ? "4 načina da se uključite u Nova Nit" : "4 ways to get involved with Nova Nit"}</h2>
      <div className={s.getInvolved_cardBox}>
        <div className={s.getInvolved_cardItem}>
          <img src={donate} alt="donation box, with money" />
          <h3>{language === "ME" ? "Donirajte" : "Make a donation"}</h3>
          <p>{language === "ME" ? "Svaka donacija je važna! Učinite jednokratni doprinos i pomozite u ishrani drugih." : "Every donation matters! Make a one-time contribution and help feed others."}</p>
          <GetInvolvedButton onClick={() => setModalOpen(true)}>Donate now</GetInvolvedButton>
          <DonateModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </div>
        <div className={s.getInvolved_cardItem}>
          <img src={adopt} alt="dedicate" />
          <h3>{language === "ME" ? "Usvojite porodicu" : "Adopt a family"}</h3>
          <p>{language === "ME" ? "Za samo 30 eura mesečno, možete obezbijediti kontinuiranu prehrambenu podršku lokalnoj porodici." : "For just 30 euros per month, you can provide ongoing food support to a local family."}</p>
          <GetInvolvedButton onClick={() => setModalOpen(true)}>Donate now</GetInvolvedButton>
          <DonateModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
        </div>
        <div className={s.getInvolved_cardItem}>
          <img src={food} alt="donate food" />
          <h3>{language === "ME" ? "Donirajte hranu" : "Donate food"}</h3>
          <p>{language === "ME" ? "Želite da donirate hranu? Kontaktirajte nas da saznate šta je potrebno porodicama kojima pomažemo." : "Want to donate food? Get in touch with us to find out what the families we serve need."}</p>
          <GetInvolvedButton>Get in touch</GetInvolvedButton>
        </div>
        <div className={s.getInvolved_cardItem}>
          <img src={volunteer} alt="deliverer of love" />
          <h3>{language === "ME" ? "Volontirajte s nama" : "Volunteer with us"}</h3>
          <p>{language === "ME" ? "Saznajte više o prilikama za volontiranje i uključite se u svoju zajednicu!" : "Learn more about volunteer opportunities and get involved in your community!"}</p>
          <GetInvolvedButton>Get in touch</GetInvolvedButton>
        </div>
      </div>
      <Carousel />
    </div>
  );
};

export default GetInvolved;