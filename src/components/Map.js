import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import ReactMapGL, { Marker } from 'react-map-gl';
import { HiMapPin } from "react-icons/hi2";

function Map({ zoom, latitude, longitude }) {

  return (
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
    </ReactMapGL>
  );
}

export default Map;
