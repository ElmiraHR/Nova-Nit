// src/components/Header.tsx
import React from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  background: #ffffff;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
`;

const Logo = styled.h1`
  color: #333333;
  font-family: 'Montserrat', sans-serif;
  font-size: 24px;
  margin: 0;
`;

const NavLink = styled.a`
  color: #333333;
  text-decoration: none;
  margin: 0 1rem;
  font-family: 'Montserrat', sans-serif;
  &:hover {
    color: #2E7D32;
  }
`;

const Header: React.FC = () => {
  return (
    <Nav>
      <Logo>Nova Nit</Logo>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/mission">Mission</NavLink>
      <NavLink href="/how-does-it-work">How It Works</NavLink>
      <NavLink href="/partners">Partners</NavLink>
      <NavLink href="/get-involved">Get Involved</NavLink>
      <NavLink href="/contact-us">Contact Us</NavLink>
    </Nav>
  );
};

export default Header;