import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import SocialLinks from "../socialLinks/SocialLinks";
import DonateButton from "../../components/donateButton/DonateButton";

const BurgerButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: opacity 0.3s ease;
  

  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 32px;
    height: 32px;
    color: var(--text-in-boxes);
  }

  @media (min-width: 1200px) {
    display: none;
  }
  @media (max-width: 1200px) {
    display: flex;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: flex-end;
  z-index: 99;
`;

const ModalContent = styled(motion.div)`
  box-sizing: border-box;
  background: var(--header-bg);
  width: 199px;
  border-radius: 20px 0px 0px 20px;
  height: fit-content;
  padding: 42px 46px 42px 25px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: flex-start;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;

  svg {
    width: 28px;
    height: 28px;
    color: var(--text-in-boxes);
  }
`;

const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const NavLink = styled.a`
  color: var(--text-in-boxes);
  text-decoration: none;
  font-size: 18px;
  font-weight: 600;
  transition: border-bottom 0.3s ease;
  padding: 8px 0;

  &:hover {
    border-bottom: 2px solid var(--text-in-boxes);
  }
`;

const BurgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <BurgerButton onClick={() => setIsOpen(true)}>
        <Menu />
      </BurgerButton>

      <AnimatePresence>
        {isOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <ModalContent
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 100 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={() => setIsOpen(false)}>
                <X />
              </CloseButton>

              <NavLinks>
                <NavLink href="/">HOME</NavLink>
                <NavLink href="/mission">OUR MISSION</NavLink>
                <NavLink href="/get-involved">BECOME A CORPORATE PARTNER</NavLink>
                <NavLink href="/contact-us">CONTACT US</NavLink>
                <NavLink href="/volunteer">VOLUNTEER</NavLink>
              </NavLinks>
              <DonateButton />
              <SocialLinks size={40} isVisible={true} />
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default BurgerMenu;
