import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import ReactMapGL, { Marker } from 'react-map-gl';
import { HiMapPin } from "react-icons/hi2";
import styled from 'styled-components';
import { formatDistance } from './GuessMap';

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

function Map({ zoom, latitude, longitude, guesses, end }) {

  return (

    // <img
    //   src={`https://api.mapbox.com/styles/v1/ryanbarouki/clupsf5gr00vl01r2cqvg81tb/static/pin-l-embassy+f74e4e(${longitude},${latitude})/${longitude},${latitude},${zoom}/${1280}x${1280}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
    // />

    <ReactMapGL
      scrollZoom={false}
      dragPan={false}
      dragRotate={false}
      touchZoomRotate={false}
      latitude={latitude}
      longitude={longitude}
      zoom={zoom}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/ryanbarouki/clupsf5gr00vl01r2cqvg81tb"
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
            <StyledMarker latitude={guess.latitude} longitude={guess.longitude}>
              <HiMapPin size={30} />
              <Dist>{formatDistance(guess.distance)}</Dist>
            </StyledMarker>
          )
        )
      }
    </ReactMapGL>
  );
}

export default Map;
