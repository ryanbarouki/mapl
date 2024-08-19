import { useEffect, useState } from 'react';
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

function ViewMap({ zoom, latitude, longitude, guesses, end, breakdown }) {

  const [viewState, setViewState] = useState({
    longitude:
      longitude, latitude: latitude, zoom: zoom
  })

  useEffect(() => setViewState(oldView => ({ ...oldView, zoom: zoom })),
    [zoom]);
  console.log(viewState)
  const onMove = (evt) => {
    if (breakdown) {
      setViewState(evt.viewState)
    }
  }

  return (

    <Map
      {...viewState}
      mapLib={maplibregl}
      scrollZoom={breakdown}
      dragPan={breakdown}
      dragRotate={breakdown}
      touchPitch={breakdown}
      doubleClickZoom={breakdown}
      touchZoomRotate={breakdown}
      onMove={onMove}
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
              key={`${guess.latitude}-${guess.longitude}`}
              latitude={guess.latitude}
              longitude={guess.longitude}
              text={formatDistance(guess.distance)}
            />
          )
        )
      }
    </Map>
  );
}

export default ViewMap;
