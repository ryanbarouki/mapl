import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '../globalStyles';
import * as maptilersdk from '@maptiler/sdk';

export function formatDistance(distance) {
  return `${(distance / 1000).toFixed(1)}km`;
}

const MapWrap = styled.div`
  position: absolute;
  bottom: -40vh;
  right: -40vw;
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
  const [marker, setMarker] = useState({ latitude: 0, longitude: 0 });
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const [markerPin, setMarkerPin] = useState(null);

  useEffect(() => {
    if (map.current) return; // stops map from initializing more than once

    maptilersdk.config.apiKey = process.env.REACT_APP_MAPTILER_KEY;

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.REACT_APP_MAPTILER_KEY}`,
      center: [16.62662018, 49.2125578],
      zoom: 2,
    });

    map.current.on('click', handleClick);

    return () => {
      if (map.current) {
        map.current.off('click', handleClick);
        map.current.remove();
      }
    };
  }, []);

  const handleClick = (event) => {
    const { lng, lat } = event.lngLat;

    if (userMarker.current === null) {
      // Add new marker on first click
      userMarker.current = new maptilersdk.Marker({ color: "#FF0000" })
        .setLngLat([lng, lat])
        .addTo(map.current);
    } else {
      // Move existing marker on subsequent clicks
      userMarker.current.setLngLat([lng, lat]);
    }

    setClicked(true);
    setMarker({
      longitude: lng,
      latitude: lat,
    });
  };

  useEffect(() => {
    // Add existing guesses as markers
    if (map.current) {
      guesses.forEach((guess) => {
        new maptilersdk.Marker({ color: "#0000FF" })
          .setLngLat([guess.longitude, guess.latitude])
          .addTo(map.current);
      });
    }
  }, [guesses]);

  return (
    <MapWrap>
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
      <Button
        onClick={() => handleGuess(marker, setClicked)}
        disabled={end || !clicked}
      >
        Guess
      </Button>
    </MapWrap>
  );
}
