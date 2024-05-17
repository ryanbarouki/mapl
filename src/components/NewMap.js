
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
//import ReactMapGL, { Marker } from 'react-map-gl';
import Map from 'react-map-gl/maplibre';
import { HiMapPin } from "react-icons/hi2";
import { Button } from '../globalStyles';
import 'leaflet/dist/leaflet.css'
import { MapContainer, Marker, Tooltip } from 'react-leaflet'
import { MapLibreTileLayer } from './TileLayer.js';
import { useMapEvents } from 'react-leaflet/hooks'
import L from 'leaflet'
import { useRef } from 'react';
import customStyle from '../outdoors.json';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

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


export function formatDistance(distance) {
  return `${(distance / 1000).toFixed(1)}km`
}


function NewMap({ zoom, latitude, longitude, guesses, end }) {

  return (
    <MapContainer
      style={{ height: "100%" }}
      center={[latitude, longitude]}
      zoom={zoom}
      minZoom={3}
      maxZoom={19}
      maxBounds={[[-85.06, -180], [85.06, 180]]}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      dragging={false}
      touchZoom={false}
      keyboard={false}
      zoomControl={false}
    >
      <MapLibreTileLayer
        attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
        url={customStyle}
      // url="https://tiles.stadiamaps.com/styles/outdoors.json"
      />
      {
        latitude && longitude &&
        <StyledMarker position={[latitude, longitude]}
        >
        </StyledMarker>
      }
      {end &&
        guesses.map(
          guess => (
            <StyledMarker
              position={[guess.latitude, guess.longitude]}
            >
              <Tooltip
                direction='bottom'
                offset={[-15, 30]}
                permanent
              >
                <Dist>
                  {formatDistance(guess.distance)}
                </Dist>
              </Tooltip>
            </StyledMarker>
          )
        )
      }
    </MapContainer>
  );
}

export default NewMap;
