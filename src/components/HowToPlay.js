import React from "react";
import styled from 'styled-components';
import Modal from "./Modal";

const P = styled.div`
  font-size: 1.2rem;
  color: white;
  
  strong{
    color: var(--primary-highlight);
  }
`;

const Title = styled.div`
    color: var(--primary-highlight);
    font-size: 2em;
    font-weight: bold;
`;
const HowToPlay = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen}
      onClose={onClose}
    >
      <Title>How to play Mapl!</Title>
      <P>Welcome to the <strong>Mapl</strong> - the redacted map game!
        Your challenge is to identify the location marked on the redacted map.
        You'll have <strong>three attempts</strong> to pinpoint the marker's exact location.
        With each incorrect guess, <strong>the map zooms out</strong>, making the task slightly easier.
      </P>
      <P>
        Keep in mind that precision matters!
        If you can guess <strong>within 50km</strong> of the actual location at any point,
        you'll earn an automatic score!
      </P>
      <P>
        Strive for the highest score possible – a <strong>maximum of 10,000 points</strong>  is up for grabs.
        Aim to get as close to the mark as you can, using as few guesses as possible.
      </P>
    </Modal>
  );
}

export default HowToPlay;
