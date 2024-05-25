import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '../globalStyles';
import { Annotation, Map, Marker } from 'mapkit-react';

export function formatDistance(distance) {
  return `${(distance / 1000).toFixed(1)}km`;
}

const MapWrap = styled.div`
  position: absolute;
  // bottom: -40vh;
  // right: -40vw;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  height: 30vh;
  width: 30vw;
  transition: all 0.3s ease;
  opacity: 0.5;
  border: solid;
  border-width: 2px;
  border-color: var(--primary-button-unpressed);
  z-index: 10000;
  transition-delay: 1s;

  &:hover {
    opacity: 1;
    height: 70vh;
    width: 70vw;
    transition-delay: 0s;
  }

  &:active {
    height: 70vh;
    width: 70vw;
    opacity: 1;
  }
`;

const Dist = styled.div`
  text-align: center;
  font-size: 20px;
  margin-top: 40px;
  background-color: white;
  opacity: 0.8;
  border-radius: 3px;
  padding: 5px;
  font-family: BRShape;
`;

export default function AppleMap({ handleGuess, guesses, end }) {
  const [clicked, setClicked] = useState(false);
  const [marker, setMarker] = useState({ latitude: 0, longitude: 0 });
  const [mapInstance, setMapInstance] = useState(null);

  const handleClick = (event) => {
    if (end) return;
    console.log(event)
    const { latitude, longitude } = event.toCoordinates();

    setMarker({ longitude: longitude, latitude: latitude });
    setClicked(true);
  };

  return (
    <MapWrap>
      <Map
        token={process.env.REACT_APP_MAPKIT_JWT}
        onSingleTap={handleClick}
        ref={setMapInstance}
        style={{ width: '100%', height: '100%' }}
        isZoomEnabled={true}
        isScrollEnabled={true}
        allowWheelToZoom={true}
      >
        {clicked && (
          <Marker
            latitude={marker.latitude}
            longitude={marker.longitude}
            color="#FF0000"
          />
        )}
        {guesses.map((guess, index) => (
          <>
            <Marker
              key={index}
              latitude={guess.latitude}
              longitude={guess.longitude}
              color="#0000FF"
            // title={`${formatDistance(guess.distance)}`}
            />
            <Annotation latitude={guess.latitude} longitude={guess.longitude}>
              <Dist>{formatDistance(guess.distance)}</Dist>
            </Annotation>
          </>
        ))}
      </Map>
      <Button onClick={() => handleGuess(marker, setClicked)} disabled={end || !clicked}>
        Guess
      </Button>
    </MapWrap>
  );
}
