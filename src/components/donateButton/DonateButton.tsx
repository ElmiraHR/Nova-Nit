import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, X } from "lucide-react";

const DonButton = styled.button`
  background: var(--text-color);
  color: var(--button-text);
  padding: 0.77rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  width: fit-content;
  text-align: center;
  font-weight: 600;
  font-size: clamp(16px, 1.5vw, 20px);
  &:hover {
    background: var(--button-bg);
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

const DonateButton = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <DonButton onClick={() => setModalOpen(true)}>Donate</DonButton>
      <DonateModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default DonateButton;
