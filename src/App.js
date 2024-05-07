import './App.css';
import { useState } from 'react';
import Map from './components/Map.js';
import GuessMap from './components/GuessMap.js';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

function App() {

  const [guesses, setGuesses] = useState([]);

  const handleGuess = (newGuess) => {
    setGuesses(guesses => [...guesses, newGuess]);
  };

  return (
    <Container>
      <Map />
      <GuessMap handleGuess={handleGuess} />
    </Container>
  );
}

export default App;
