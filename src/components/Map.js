import Map, { Layer, Marker, ScaleControl, AttributionControl } from 'react-map-gl/maplibre';
import { MdLocationPin } from 'react-icons/md';
import 'maplibre-gl/dist/maplibre-gl.css';

const majorRoadHighlight = {
  id: 'mapl-major-road-hint',
  type: 'line',
  source: 'maptiler_planet',
  'source-layer': 'transportation',
  filter: ['match', ['get', 'class'], ['motorway', 'trunk', 'primary', 'secondary'], true, false],
  layout: { 'line-cap': 'round', 'line-join': 'round' },
  paint: {
    'line-color': '#b54734',
    'line-width': ['interpolate', ['linear'], ['zoom'], 7, 1.5, 13, 3],
  },
};

export default function ViewMap({ zoom, latitude, longitude, map, highlightMajorRoads }) {
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
      {highlightMajorRoads && <Layer {...majorRoadHighlight} />}
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
