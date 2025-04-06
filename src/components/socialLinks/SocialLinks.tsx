import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faFacebookF } from "@fortawesome/free-brands-svg-icons";

// Обновляем Wrapper, чтобы проп $isVisible НЕ передавался в DOM
const SocialIconsWrapper = styled.div<{ $isVisible: boolean }>`
  display: ${(props) => (props.$isVisible ? "flex" : "none")};
  justify-content: start;
  gap: 8px;

  @media (min-width: 1200px) {
    display: flex;
  }
`;

const SocialLink = styled.a<{ size: number }>`
  color: var(--text-color);
  transition: color 0.3s;

  &:hover {
    color: var(--button-bg);
  }

  svg {
    font-size: ${(props) => props.size}px;
  }
`;

interface SocialLinksProps {
  instagramUrl?: string;
  facebookUrl?: string;
  size?: number;
  isVisible?: boolean;
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  instagramUrl = "#",
  facebookUrl = "#",
  size = 24,
  isVisible = true,
}) => {
  return (
    <SocialIconsWrapper $isVisible={isVisible}>
      {instagramUrl && (
        <SocialLink href={instagramUrl} target="_blank" size={size}>
          <FontAwesomeIcon icon={faInstagram} />
        </SocialLink>
      )}
      {facebookUrl && (
        <SocialLink href={facebookUrl} target="_blank" size={size}>
          <FontAwesomeIcon icon={faFacebookF} />
        </SocialLink>
      )}
    </SocialIconsWrapper>
  );
};

export default SocialLinks;

