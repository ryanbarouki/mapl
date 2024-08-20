import { useEffect, useState } from 'react';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import Map, { Marker, ScaleControl } from 'react-map-gl';
import { MdLocationPin } from "react-icons/md";
import styled from 'styled-components';
import { formatDistance } from './NewGuessMap';
import CustomMarker from './CustomMarker';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

function ViewMap({ zoom, latitude, longitude, guesses, end }) {

  const [viewState, setViewState] = useState({
    longitude:
      longitude, latitude: latitude, zoom: zoom
  })

  useEffect(() => setViewState(oldView => ({ ...oldView, zoom: zoom })),
    [zoom]);

  return (

    <Map
      {...viewState}
      mapLib={maplibregl}
      scrollZoom={false}
      dragPan={false}
      dragRotate={false}
      touchPitch={false}
      doubleClickZoom={false}
      touchZoomRotate={false}
      onMove={evt => setViewState(evt.viewState)}
      showsScale={true}
      style={{ width: '100%', height: '100%' }}
      mapStyle={`https://api.maptiler.com/maps/e88d9cf7-c88c-40cb-9510-bb1f7a29c306/style.json?key=${process.env.REACT_APP_MAPTILER_KEY}`}
    >
      {
        latitude && longitude &&
        <Marker longitude={longitude} latitude={latitude}>
          <MdLocationPin size={40} color='#ff173a' />
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
      <ScaleControl />
    </Map>
  );
}

export default ViewMap;
