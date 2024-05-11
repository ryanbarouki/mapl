import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import ReactMapGL, { Marker } from 'react-map-gl';
import { HiMapPin } from "react-icons/hi2";
import { Button } from '../globalStyles';

const Map2 = styled.div`
  position: absolute;
  bottom: -40vh;
  right: -40vw;
  // bottom: 0;
  // right: 0;
  display: flex;
  flex-direction: column;
  height: 70vh;
  width: 70vw;
  transition: all 0.5s ease-in-out;
  opacity: 0.5;
  border: solid;
  border-width: 2px;
  border-color: var(--primary-button-unpressed);
&:hover {
    bottom: 0;
    right: 0;
    opacity: 1;
  }
`;

const StyledMarker = styled(Marker)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Dist = styled.div`
  text-align: center;
  font-size: 20px;
`;


export function formatDistance(distance) {
  return `${(distance / 1000).toFixed(1)}km`
}

function GuessMap({ handleGuess, guesses, end, key }) {

  const [viewport, setViewport] = useState({
    latitude: 54.5260,
    longitude: 15.2551,
    zoom: 2
  });

  const [marker, setMarker] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [clicked, setClicked] = useState(false);


  const handleClick = (event) => {
    setClicked(true);
    setMarker({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    },
    );
  };

  return (
    <Map2 >
      <ReactMapGL
        key={key}
        onClick={handleClick}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        initialViewState={viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/ryanbarouki/clvv9mmgd00v101quhx4m3nkv"
        onViewportChange={setViewport}
      >
        {clicked && !end &&
          <StyledMarker latitude={marker.latitude} longitude={marker.longitude}>
            <HiMapPin size={30} />
            <Dist>&#x200B;</Dist>
          </StyledMarker>
        }
        {
          guesses.map(
            guess => (
              <StyledMarker latitude={guess.latitude} longitude={guess.longitude}>
                <HiMapPin size={30} />
                <Dist>{formatDistance(guess.distance)}</Dist>
              </StyledMarker>
            )
          )
        }
      </ReactMapGL>
      <Button
        onClick={() => handleGuess(marker, setClicked)}
        disabled={end || !clicked}
      >Guess</Button>
    </Map2>
  );
}

export default GuessMap;
