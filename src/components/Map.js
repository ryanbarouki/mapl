import Map, { Marker, ScaleControl, AttributionControl } from 'react-map-gl/maplibre';
import { MdLocationPin } from 'react-icons/md';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function ViewMap({ zoom, latitude, longitude, map }) {
  return (
    <Map
      longitude={longitude}
      latitude={latitude}
      zoom={zoom}
      scrollZoom={false}
      dragPan={false}
      dragRotate={false}
      keyboard={false}
      touchPitch={false}
      doubleClickZoom={false}
      touchZoomRotate={false}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      mapStyle={`https://api.maptiler.com/maps/${map}/style.json?key=${process.env.REACT_APP_MAPTILER_KEY}`}
      attributionControl={false}
    >
      <Marker longitude={longitude} latitude={latitude} anchor="bottom">
        <MdLocationPin size={40} color="#ff173a" />
      </Marker>
      <AttributionControl
        customAttribution={'<a href="https://www.maptiler.com/copyright/" target="_blank" rel="noopener">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">&copy; OpenStreetMap contributors</a>'}
        compact
        position="bottom-left"
      />
      <ScaleControl />
    </Map>
  );
}
