import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import ReactMapGL, { Marker } from 'react-map-gl';
import { HiMapPin } from "react-icons/hi2";

function Map({ zoom }) {

  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    scrollZoom: false,
    dragPan: false
  });

  return (
    <ReactMapGL
      {...viewport}
      zoom={zoom}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/ryanbarouki/clupsf5gr00vl01r2cqvg81tb"
      onViewportChange={setViewport}
    >
      <Marker longitude={viewport.longitude} latitude={viewport.latitude}>
        <HiMapPin size={40} color='red' />
      </Marker>
    </ReactMapGL>
  );
}

export default Map;
