import { useState, useEffect } from 'react';
import ViewMap from './Map.js';
import styled from 'styled-components';
import { getDistance } from 'geolib';
import { DateTime } from "luxon";
import Papa from 'papaparse';
import { Button } from '../globalStyles';
import HowToPlay from './HowToPlay.js';
import AppleMap from './GuessMapApple.js';
import seedrandom from 'seedrandom';
import { Link, useLocation } from 'react-router-dom';
import BareAppleMap from './AppleMap.js';
import { Maximize } from '@mui/icons-material';

const Container = styled.div`
  width: 100%;
  height: calc(100% - 70px - 2rem);
  bottom: 0;
  display: flex;
  flex-direction: column;
  position: fixed;
`;

const Screen = styled.div`
  width: 100%;
  height: inherit;
  display: flex;
  flex-direction: column;
  ${props => !props.$end ? "justify-content: center;" : ""}
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$visible ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0)"};
  position: fixed;
  z-index: ${props => props.$visible ? "1000" : "-1"};
  transition: all 0.3s ease-in;
  overflow: hidden;
`;

const EndDiv = styled.div`
  color: white;
  font-family: inherit;
  font-size: 3rem;
  text-align: center;

  span {
    font-weight: bold;
}
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
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

  span {
    font-weight: bold;
}

`;

const TopBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  width: 100vw;
`;


const MAX_GUESSES = 3;
const WIN_RADIUS = 50000; //metres
const MAX_SCORE = 10000;
const MAX_DIST = 2000e3;

const MAPS = ["e88d9cf7-c88c-40cb-9510-bb1f7a29c306", "2ba07e07-1a5e-41b5-9c23-0b8d550d726e", "6b3f0bd3-eea3-4016-8e88-77937de021ca"];
const NUM_HINTS = MAPS.length - 1;

const calculateScore = (distance, num_guesses) =>
  (MAX_SCORE - 1000 * (num_guesses - 1)) * Math.exp(-((distance / MAX_DIST)))

const getDayString = () => {
  return DateTime.now().toFormat("yyyy-MM-dd");
}

function Play({ guesses, addGuess, random_seed }) {
  const [answer, setAnswer] = useState({
    latitude: 0,
    longitude: 0
  });
  const [zoom, setZoom] = useState(2);
  const [start, setStart] = useState(false);
  const [end, setEnd] = useState(false);
  const [score, setScore] = useState(0);
  const [name, setName] = useState("");
  const [openHowTo, setOpenHowTo] = useState(false);
  const location = useLocation();
  const [breakdown, setBreakdown] = useState(false);
  const [map, setMap] = useState(MAPS[0]);
  const [hints, setHints] = useState(0);

  useEffect(() => {
    if (guesses && guesses.length === MAX_GUESSES) {
      setEnd(true);
      setZoom(2);
      const distance = guesses[guesses.length - 1].distance;
      setScore(Math.round(calculateScore(distance, guesses.length)));
    }
    else if (guesses) {
      console.log("hello")
    }
  }, []);

  useEffect(() => {
    fetch(`worldcities.csv`)
      .then(response => response.text())
      .then(csv => {
        const places = Papa.parse(csv).data
        if (places) {
          // Extract latitude and longitude from the response
          const random_index = Math.floor(seedrandom.alea(random_seed)() * places.length);
          const [city, _, lat, lon, country] = places[random_index]
          setZoom(end ? 2 : 13 - 3 * guesses.length);
          setAnswer({ latitude: Number(lat), longitude: Number(lon) });
          // setAnswer({ latitude: 51.5972, longitude: 0.1276 }); // Dev
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

  const handleHint = () => {
    setMap(MAPS[hints + 1]);
    setHints(hints => hints + 1);
  };

  const handleGuess = (newGuess, setClicked) => {
    if (end) return;
    console.log(newGuess)
    const distance = getDistance(newGuess, answer);
    const num_guesses = guesses.length;
    console.log(guesses)
    addGuess({
      ...newGuess,
      distance: distance
    });
    if (distance < WIN_RADIUS || num_guesses + 1 >= MAX_GUESSES) {
      setEnd(true);
      setZoom(5);
      setScore(Math.round(calculateScore(distance, num_guesses + 1)));
    }
    else {
      setZoom(zoom => zoom - 3);
    }
    setClicked(false);
  };

  return (
    <>
      <Container>
        {!start &&
          <Screen $visible={!start} $end={false}>
            <EndDiv>
              Loading Coordinates...
            </EndDiv>
          </Screen>
        }
        {end && !breakdown &&
          <Screen $visible={end} $end={true}>
            <EndDiv>You scored</EndDiv>
            <EndDiv><span>{score}</span>/10000</EndDiv>
            <Name>{name}</Name>
            <Buttons>
              <Link reloadDocument to='/play'>
                <Button>Play more</Button>
              </Link>
              <Button onClick={() => setBreakdown(true)}>Breakdown</Button>
            </Buttons>

            {location.pathname === '/daily' &&
              <Name>Come back tomorrow to play the daily puzzle!</Name>
            }
          </Screen>
        }
        <TopBar>
          {start && !end &&
            <>
              <Div><span>{MAX_GUESSES - guesses.length}</span> {MAX_GUESSES - guesses.length > 1 ? "guesses" : "guess"} remaining</Div>
              <Button onClick={handleHint} disabled={hints >= NUM_HINTS}>Get Hint</Button>
            </>
          }
        </TopBar>
        <HowToPlay isOpen={openHowTo}
          onClose={() => setOpenHowTo(false)}
        />
        {start && !end &&
          <>
            <ViewMap
              zoom={zoom}
              guesses={guesses}
              latitude={answer.latitude}
              longitude={answer.longitude}
              end={end}
              map={map}
            />
            {!end &&
              <AppleMap
                handleGuess={handleGuess}
                guesses={guesses}
                end={end}
              />
            }
          </>
        }
        {end &&
          <>
            <BareAppleMap
              guesses={guesses}
              answer={answer}
              name={name}
            />
            {breakdown &&
              <TopBar>
                <Link reloadDocument to='/play'>
                  <Button>Play again</Button>
                </Link>
              </TopBar>
            }
          </>
        }
      </Container>
    </>
  );
}

export default Play;
