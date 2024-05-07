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

function App() {

  const [guesses, setGuesses] = useState([]);
  const [answer, setAnswer] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
  });
  const [zoom, setZoom] = useState(12);

  const handleGuess = (newGuess, setClicked) => {
    setGuesses(guesses => [...guesses, {
      ...newGuess,
      distance: getDistance(newGuess, answer)
    }]);
    setClicked(false);
    setZoom(zoom => zoom - 2)
  };

  return (
    <Container>
      <Map zoom={zoom} />
      <GuessMap
        handleGuess={handleGuess}
        guesses={guesses}
      />
    </Container>
  );
}

export default App;
