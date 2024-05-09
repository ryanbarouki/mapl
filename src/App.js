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

const MAX_GUESSES = 3;
const WIN_RADIUS = 50000; //metres
const MAX_SCORE = 10000;
const MAX_DIST = 4000e3;

const calculateScore = (distance, num_guesses) =>
  (MAX_SCORE - 1000 * (num_guesses - 1)) * Math.exp(-((distance / MAX_DIST) ** 2))

function App() {
  const [guesses, setGuesses] = useState([]);
  const [answer, setAnswer] = useState({
    latitude: 0,
    longitude: 0
  });
  const [zoom, setZoom] = useState(2);
  const [end, setEnd] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Generate a random IPv4 address
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
    if (end) return;
    const distance = getDistance(newGuess, answer);
    const num_guesses = guesses.length;
    setGuesses(guesses => [...guesses, {
      ...newGuess,
      distance: distance
    }]);
    if (distance < WIN_RADIUS || num_guesses + 1 >= MAX_GUESSES) {
      setEnd(true);
      setScore(calculateScore(distance, num_guesses + 1));
      console.log(calculateScore(distance, num_guesses + 1))
    }
    setClicked(false);
    setZoom(zoom => zoom - 2);
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
        end={end}
      />
    </Container>
  );
}

export default App;
