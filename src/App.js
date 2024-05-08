import './App.css';
import { useState, useEffect } from 'react';
import Map from './components/Map.js';
import GuessMap from './components/GuessMap.js';
import styled from 'styled-components';
import { getDistance } from 'geolib';
import { faker } from '@faker-js/faker';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

function App() {
  const [guesses, setGuesses] = useState([]);
  const [answer, setAnswer] = useState({
    latitude: 0,
    longitude: 0
  });
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    // Generate a random ($\Rightarrow$) IPv4 address
    const ipAddress = faker.internet.ip();

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${ipAddress}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          // Extract latitude and longitude from the response
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setZoom(12);
          setAnswer({ latitude: lat, longitude: lon });
          console.log(data);
        }
      })
      .catch(error => console.error('Error fetching location:', error));
  }, []);

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
      <Map zoom={zoom}
        latitude={answer.latitude}
        longitude={answer.longitude}
      />
      <GuessMap
        handleGuess={handleGuess}
        guesses={guesses}
      />
    </Container>
  );
}

export default App;
