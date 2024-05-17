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

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const Map2 = styled.div`
  position: absolute;
  // bottom: -40vh;
  // right: -40vw;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  height: 30vh;
  width: 30vw;
  transition: all 0.5s ease-in-out;
  opacity: 0.5;
  border: solid;
  border-width: 2px;
  border-color: var(--primary-button-unpressed);
  z-index: 10000;
&:hover {
    bottom: 0;
    right: 0;
    opacity: 1;
    height: 70vh;
    width: 70vw;
  }
&:active {
    bottom: 0;
    right: 0;
    opacity: 1;
  }
`;

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

function MapEvents({ handleClick }) {
  const map = useMapEvents({
    click: handleClick,
  })
  return null
}

function GuessMap({ handleGuess, guesses, end, key }) {

  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const handleClick = (event) => {
    console.log(event)
    setClicked(true);
    setMarker({
      longitude: event.latlng.lng,
      latitude: event.latlng.lat,
    },
    );
  };

  const [viewport, setViewport] = useState({
    latitude: 54.5260,
    longitude: 15.2551,
    zoom: 2
  });

  const [marker, setMarker] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [mapLoaded]);

  return (
    <Map2
      onMouseEnter={() => setMapLoaded(true)}
    >
      <MapContainer
        key={key}
        ref={mapRef}
        style={{ height: "100%" }}
        center={[viewport.latitude, viewport.longitude]}
        zoom={viewport.zoom}
        minZoom={3}
        maxZoom={19}
        maxBounds={[[-85.06, -180], [85.06, 180]]}
        onClick={handleClick}
        scrollWheelZoom={true}>
        <MapEvents handleClick={handleClick} />
        <MapLibreTileLayer
          attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/styles/outdoors.json"
        />
        {clicked && !end &&
          <StyledMarker
            position={[marker.latitude, marker.longitude]}
            label={"hello"}
          >
            <HiMapPin size={30} />
            <Dist>&#x200B;</Dist>
          </StyledMarker>
        }
        {
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
      <Button
        onClick={() => handleGuess(marker, setClicked)}
        disabled={end || !clicked}
      >Guess</Button>
    </Map2>
  );
}

export default GuessMap;
