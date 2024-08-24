import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '../globalStyles';
import { Annotation, Map, Marker, CoordinateRegion } from 'mapkit-react';

export function formatDistance(distance) {
  return `${(distance / 1000).toFixed(1)}km`;
}

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

export default function BareAppleMap({ guesses, answer, name }) {
  const [mapInstance, setMapInstance] = useState(null);
  return (
    <Map
      token={process.env.REACT_APP_MAPKIT_JWT}
      ref={setMapInstance}
      style={{ width: '100%', height: '100%' }}
      isZoomEnabled={true}
      isScrollEnabled={true}
      allowWheelToZoom={true}
      initialRegion={{ centerLatitude: answer.latitude, centerLongitude: answer.longitude, latitudeDelta: 20, longitudeDelta: 20 }}
    >
      {guesses.map((guess, index) => (
        <>
          <Marker
            key={index}
            latitude={guess.latitude}
            longitude={guess.longitude}
            color="#FFCB00"
          // title={`${formatDistance(guess.distance)}`}
          />
          <Annotation latitude={guess.latitude} longitude={guess.longitude}>
            <Dist>{formatDistance(guess.distance)}</Dist>
          </Annotation>
        </>
      ))}
      <>
        <Marker
          latitude={answer.latitude}
          longitude={answer.longitude}
          color="#ff173a"
        // title={`${formatDistance(guess.distance)}`}
        />
        <Annotation latitude={answer.latitude} longitude={answer.longitude}>
          <Dist>{name}</Dist>
        </Annotation>
      </>
    </Map>
  )
}
