import './App.css';
import { useState, useEffect } from 'react';
import Map from './components/Map.js';
import GuessMap from './components/GuessMap.js';
import styled from 'styled-components';
import { getDistance } from 'geolib';
import Papa from 'papaparse';
import { useWindowSize } from './Hooks/useWindowSize';
import { Button } from './globalStyles';
import Modal from './components/Modal';

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
  background-color: ${props => props.visible ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0)"};
  position: absolute;
  z-index: ${props => props.visible ? "1000" : "0"};
  transition: all 0.3s ease-in;
`;

const EndDiv = styled.div`
  color: white;
  font-family: inherit;
  font-size: 3rem;
  text-align: center;
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
  z-index: 1;
  padding: 1rem;
  font-size: 1.5rem;
  background-color: var(--primary-button-unpressed);
  flex-shrink: 1;

`;

const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  width: 100vw;
`;

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

const MAX_GUESSES = 3;
const WIN_RADIUS = 50000; //metres
const MAX_SCORE = 10000;
const MAX_DIST = 2000e3;

const calculateScore = (distance, num_guesses) =>
  (MAX_SCORE - 1000 * (num_guesses - 1)) * Math.exp(-((distance / MAX_DIST)))

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
  const [width, height] = useWindowSize();
  const [openHowTo, setOpenHowTo] = useState(false);

  useEffect(() => {
    fetch(`worldcities.csv`)
      .then(response => response.text())
      .then(csv => {
        const places = Papa.parse(csv).data
        if (places) {
          // Extract latitude and longitude from the response
          const random_index = Math.floor(Math.random() * places.length);
          const [city, _, lat, lon, country] = places[random_index]
          setZoom(12);
          setAnswer({ latitude: lat, longitude: lon });
          setStart(true);
          setName(`${city}, ${country}`)
        }
      })
      .catch(error => {
        console.error('Error fetching location:', error);
        // try again
        window.location.reload();
      });
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
        {end &&
          <>
            <EndDiv>Score:</EndDiv>
            <EndDiv>{score}/10000</EndDiv>
            <Name>{name}</Name>
            <Button onClick={() => window.location.reload()}>Play again</Button>
          </>
        }
      </Screen>
      <Container>
        <TopBar>
          <Div>Guesses remaining: {MAX_GUESSES - guesses.length}</Div>
          <Button onClick={() => setOpenHowTo(true)}>How to play</Button>
        </TopBar>
        <Modal isOpen={openHowTo}
          onClose={() => setOpenHowTo(false)}
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
        <Map zoom={zoom}
          guesses={guesses}
          latitude={answer.latitude}
          longitude={answer.longitude}
          end={end}
        />
        <GuessMap
          key={`${width}-${height}`}
          handleGuess={handleGuess}
          guesses={guesses}
          end={end}
        />
      </Container>
    </>
  );
}

export default App;
