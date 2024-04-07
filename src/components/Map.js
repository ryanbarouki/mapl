import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import { MapContainer, TileLayer, Popup, Marker} from 'react-leaflet'
import ReactMapGL from 'react-map-gl';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;


function Map() {
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });

  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100%"
      mapStyle="mapbox://styles/ryanbarouki/clupsf5gr00vl01r2cqvg81tb"
      onViewportChange={setViewport}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
    />
  );
}

export default Map;
