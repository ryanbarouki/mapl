import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import ReactMapGL from 'react-map-gl';

function Map() {

  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 12,
    scrollZoom: false,
    dragPan: false
  });

  return (
    <ReactMapGL
      {...viewport}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/ryanbarouki/clupsf5gr00vl01r2cqvg81tb"
      onViewportChange={setViewport}
    >
    </ReactMapGL>
  );
}

export default Map;
