import './App.css';
import { useState, useEffect } from 'react';
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

const Screen = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  ${props => !props.end ? "justify-content: center;" : ""}
  align-items: center;
  background-color: ${props => props.visible ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0)"};
  position: absolute;
  z-index: ${props => props.visible ? "1000" : "0"};
  transition: all 0.3s ease-in;
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

const Div = styled.div`
  color: white;
  text-align: left;
  width: auto;
  position: absolute;
  z-index: 1;
  padding: 1rem;
  font-size: 40px;
  background-color: var(--primary-button-unpressed);
  opacity: 0.7;

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

    fetch(`https://40pgjkeu62.execute-api.us-east-2.amazonaws.com/default/getRandomCoords`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          // Extract latitude and longitude from the response
          console.log(data)
          const lat = parseFloat(data.latitude);
          const lon = parseFloat(data.longitude);
          const city = data.city;
          setZoom(12);
          setAnswer({ latitude: lat, longitude: lon });
          setStart(true);
          setName(city)
          console.log(city);
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
      setZoom(2);
      setScore(Math.round(calculateScore(distance, num_guesses + 1)));
      console.log(calculateScore(distance, num_guesses + 1))
    }
    else {
      setZoom(zoom => zoom - 3);
    }
    setClicked(false);
  };

  return (
    <>
      {!start &&
        <Screen visible={!start} end={false}>
          <EndDiv>
            Loading Coordinates...
          </EndDiv>
        </Screen>
      }
      <Screen visible={end} end={true}>
        <EndDiv>Score:</EndDiv>
        <EndDiv>{score}/10000</EndDiv>
        <Name>{name}</Name>
      </Screen>
      <Container>
        <Div>Guesses: {guesses.length}/3</Div>
        <Map zoom={zoom}
          guesses={guesses}
          latitude={answer.latitude}
          longitude={answer.longitude}
          end={end}
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
