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

const Screen = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.visible ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0)"};
  position: absolute;
  z-index: ${props => props.visible ? "1000" : "0"};
  transition: all 0.3s ease-in;
`;

const StartScreen = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
`;

const EndDiv = styled.div`
  color: white;
  font-family: inherit;
  font-size: 90px;
`;

const Name = styled.h2`
  color: white;
  text-align: center;
  width: 50vw;
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
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [score, setScore] = useState(0);
  const [name, setName] = useState("");

  useEffect(() => {
    // Generate a random IPv4 address
    const ipAddress = faker.internet.ipv4();

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${ipAddress}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          // Extract latitude and longitude from the response
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setZoom(12);
          setAnswer({ latitude: lat, longitude: lon });
          setName(data[0].display_name)
          console.log(data[0].display_name);
          setStart(true);
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
      setScore(Math.round(calculateScore(distance, num_guesses + 1)));
      console.log(calculateScore(distance, num_guesses + 1))
    }
    setClicked(false);
    setZoom(zoom => zoom - 2);
  };

  return (
    <>
      {!start &&
        <Screen visible={!start}>
          <EndDiv>
            Loading Coordinates...
          </EndDiv>
        </Screen>
      }
      <Screen visible={end}>
        <EndDiv>Score:</EndDiv>
        <EndDiv>{score}/10000</EndDiv>
        <Name>{name}</Name>
      </Screen>
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
    </>
  );
}

export default App;
