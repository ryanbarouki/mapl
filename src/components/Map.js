import { useEffect, useState } from 'react';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import Map, { Marker, ScaleControl, AttributionControl } from 'react-map-gl';
import { MdLocationPin } from "react-icons/md";
import styled from 'styled-components';
import { formatDistance } from './NewGuessMap';
import CustomMarker from './CustomMarker';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

function ViewMap({ zoom, latitude, longitude, guesses, end, map }) {

  const [viewState, setViewState] = useState({
    longitude:
      longitude, latitude: latitude, zoom: zoom
  })

  useEffect(() => setViewState(oldView => ({ ...oldView, zoom: zoom })),
    [zoom]);

  return (

    <Map
      {...viewState}
      key={map}
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
      mapStyle={`https://api.maptiler.com/maps/${map}/style.json?key=${process.env.REACT_APP_MAPTILER_KEY}`}
      attributionControl={false}
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
      <AttributionControl
        customAttribution={'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'}
        compact={true}
        position="bottom-left"
      />
      <ScaleControl />
    </Map>
  );
}

export default ViewMap;
