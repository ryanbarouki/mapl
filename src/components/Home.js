import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import HowToPlay from './HowToPlay';
import { useState } from 'react';
import Footer from './Footer';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  height: 100%;

  @media only screen and (max-width: 800px) {
    flex-direction: column;
  }
`;

const Text = styled.div`
  font-family: BRShape;
  font-weight: 900;
  font-size: 5rem;
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
      <Options>
        <Link to="/play" style={{ textDecoration: "none" }}>
          <Text>Play,</Text>
        </Link>
        <Text onClick={() => setOpenHowTo(true)}>How?</Text>
      </Options>
      <Footer />
    </Container>
  );
};

export default Home;
