import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import ReactMapGL, { Marker } from 'react-map-gl';
import { HiMapPin } from "react-icons/hi2";

const Button = styled.button`
  padding: 1rem;
  border-radius: 10px;
  border-width: 0px;
  background-color: var(--primary-button-unpressed);
  color: var(--primary-text);
  font-size: x-large;
  z-index: 20;
  cursor: pointer;
  &:active {
    background-color: var(--primary-button-pressed);
  }
  font-family: inherit;
`;

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
  z-index: 1;
  
&:hover {
    bottom: 0;
    right: 0;
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


function formatDistance(distance) {
  return `${(distance / 1000).toFixed(1)}km`
}

function GuessMap({ handleGuess, guesses }) {

  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
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
        onClick={handleClick}
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        initialViewState={viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/ryanbarouki/clvv9mmgd00v101quhx4m3nkv"
        onViewportChange={setViewport}
      >
        {clicked &&
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
      >Guess</Button>
    </Map2>
  );
}

export default GuessMap;
