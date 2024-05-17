import { useState } from 'react';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import Map, { Marker } from 'react-map-gl';
import { HiMapPin } from "react-icons/hi2";
import styled from 'styled-components';
import { formatDistance } from './NewGuessMap';
import CustomMarker from './CustomMarker';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

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

function ViewMap({ zoom, latitude, longitude, guesses, end }) {

  return (

    <Map
      mapLib={maplibregl}
      scrollZoom={false}
      dragPan={false}
      dragRotate={false}
      touchZoomRotate={false}
      latitude={latitude}
      longitude={longitude}
      zoom={zoom}
      style={{ width: '100%', height: '100%' }}
      mapStyle={`https://api.maptiler.com/maps/e88d9cf7-c88c-40cb-9510-bb1f7a29c306/style.json?key=${process.env.REACT_APP_MAPTILER_KEY}`}
    >
      {
        latitude && longitude &&
        <Marker longitude={longitude} latitude={latitude}>
          <HiMapPin size={40} color='red' />
        </Marker>
      }
      {end &&
        guesses.map(
          guess => (
            <CustomMarker
              latitude={guess.latitude} longitude={guess.longitude}
              text={formatDistance(guess.distance)}
            />
          )
        )
      }
    </Map>
  );
}

export default ViewMap;
