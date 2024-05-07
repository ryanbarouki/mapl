import './App.css';
import { useState } from 'react';
import Map from './components/Map.js';
import GuessMap from './components/GuessMap.js';
import styled from 'styled-components';
import { getDistance } from 'geolib';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

function formatDistance(distance) {
  return `${(distance / 1000).toFixed(1)}km`
}

function App() {

  const [guesses, setGuesses] = useState([]);
  const [answer, setAnswer] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
  });

  const handleGuess = (newGuess) => {
    setGuesses(guesses => [...guesses, newGuess]);
    console.log(formatDistance(getDistance(newGuess, answer)));
  };

  return (
    <Container>
      <Map />
      <GuessMap handleGuess={handleGuess} />
    </Container>
  );
}

export default App;
