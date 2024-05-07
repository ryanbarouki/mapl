import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import ReactMapGL, { Marker } from 'react-map-gl';

const Button = styled.button`
  padding: 1rem;
  border-radius: 10px;
  border-width: 0px;
  background-color: var(--primary-button-unpressed);
  color: var(--primary-text);
  font-size: x-large;
  z-index: 20;
  :active {
    background-color: var(--primary-button-pressed);
  }
  font-family: inherit;
`;

const Map2 = styled.div`
  position: absolute;
  bottom: -40vh;
  right: -40vw;
  height: 70vh;
  width: 70vw;
  transition: all 0.5s ease-in-out;
  z-index: 1;
  
&:hover {
    bottom: 0;
    right: 0;
  }
`;

function GuessMap({ handleGuess }) {

  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });

  const [marker, setMarker] = useState({
    latitude: 0,
    longitude: 0,
  });


  const handleClick = (event) => {
    console.log(event);
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
        <Marker latitude={marker.latitude} longitude={marker.longitude}>
          <div>PIN</div>
        </Marker>
      </ReactMapGL>
      <Button>Guess</Button>
    </Map2>
  );
}

export default GuessMap;
