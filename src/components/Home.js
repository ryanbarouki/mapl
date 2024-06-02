import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import HowToPlay from './HowToPlay';
import { useState } from 'react';
import Footer from './Footer';
import maplLogo from '../mapl_logo.svg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  gap: 1rem;
`;

const Logo = styled.img`
  height: 8rem;
  pointer-events: none;
  width: clamp(100px, 80vw, 500px);
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 3rem;

  @media only screen and (max-width: 650px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Text = styled.div`
  font-family: BRShape;
  font-size: 2.86rem;
  // font-size: clamp(1rem, 10vw, 3rem);
  color: var(--primary-highlight);
  cursor: pointer;
  &:hover{
  color: var(--primary-button-hover);
}
`;

const Home = () => {
  const [openHowTo, setOpenHowTo] = useState(false);

  return (
    <Container>
      <HowToPlay isOpen={openHowTo}
        onClose={() => setOpenHowTo(false)}
      />
      <Logo src={maplLogo} />
      <Options>
        <Link to="/daily" style={{ textDecoration: "none" }}>
          <Text>Daily</Text>
        </Link>
        <Link to="/play" style={{ textDecoration: "none" }}>
          <Text>Normal</Text>
        </Link>
        <Text onClick={() => setOpenHowTo(true)}>What?</Text>
      </Options>
      <Footer />
    </Container>
  );
};

export default Home;
