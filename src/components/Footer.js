// Footer.js
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// Define styled components
const FooterContainer = styled.footer`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  bottom: 0;
  background-color: white;
  text-align: center;
  align-items: center;
  justify-content: space-between;
  font-family: BRShape;
  width: 100%;
  position: absolute;
  bottom: 0;
`;

const FooterLink = styled(Link)`
  padding: 1rem;
  color: black;
  text-decoration: none;
  &:hover {
  color: var(--primary-highlight);
}
`;

const FooterContent = styled.div`
  padding: 1rem;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterLink to="/privacy" style={{ textDecoration: "none" }}>
        Privacy Policy
      </FooterLink>
      <FooterContent>
        mapl.enquiries@gmail.com
      </FooterContent>

    </FooterContainer>
  );
};

export default Footer;
