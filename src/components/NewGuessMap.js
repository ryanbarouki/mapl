import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import styled from 'styled-components';
import { Button } from '../globalStyles';
import Map, { Marker, Popup } from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { HiMapPin } from "react-icons/hi2";
import CustomMarker from './CustomMarker';

export function formatDistance(distance) {
  return `${(distance / 1000).toFixed(1)}km`
}

const MapWrap = styled.div`
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
  z-index: 10000;
&:hover {
    opacity: 1;
    bottom: 0;
    right: 0;
  }
&:active {
    bottom: 0;
    right: 0;
    opacity: 1;
  }
`;

export default function NewGuessMap({ handleGuess, guesses, end }) {

  const [clicked, setClicked] = useState(false);


  const handleClick = (event) => {
    setClicked(true);
    setMarker({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    },
    );
  };
  const [marker, setMarker] = useState({
    latitude: 0,
    longitude: 0,
  });

  return (
    <MapWrap>
      <Map
        onClick={handleClick}
        mapLib={maplibregl}
        initialViewState={{
          longitude: 16.62662018,
          latitude: 49.2125578,
          zoom: 2
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${process.env.REACT_APP_MAPTILER_KEY}`}
      >
        {clicked && !end &&
          <CustomMarker
            latitude={marker.latitude} longitude={marker.longitude}
            text="&#x200B;"
          />
        }
        {
          guesses.map(
            guess => (
              <CustomMarker
                key={`${guess.latitude}-${guess.longitude}`}
                latitude={guess.latitude} longitude={guess.longitude}
                text={formatDistance(guess.distance)}
              />
            )
          )
        }
      </Map>
      <Button
        onClick={() => handleGuess(marker, setClicked)}
        disabled={end || !clicked}
      >Guess</Button>
    </MapWrap>
  );
}
