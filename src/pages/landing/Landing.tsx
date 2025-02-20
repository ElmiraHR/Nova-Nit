// src/pages/Landing.tsx
import React from 'react';
import styled from 'styled-components';

const Hero = styled.section`
  background: #f5f5f5;
  padding: 4rem 2rem;
  text-align: center;
`;

const HeroTitle = styled.h1`
  color: #333333;
  font-family: 'Montserrat', sans-serif;
  font-size: 36px;
  margin-bottom: 1rem;
`;

const HeroButton = styled.button`
  background: #2E7D32;
  color: #ffffff;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background: #1b5e20;
  }
`;

const Landing: React.FC = () => {
  return (
    <Hero>
      <HeroTitle>Make a Difference with Nourish Kit</HeroTitle>
      <p>Help us provide food and support to communities in need.</p>
      <HeroButton>Get Involved</HeroButton>
    </Hero>
  );
};

export default Landing;