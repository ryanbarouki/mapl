import { useState } from 'react';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import ReactMapGL, { Marker } from 'react-map-gl';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Map2 = styled.div`
  position: absolute;
  bottom: -40vh;
  right: -40vw;
  height: 70vh;
  width: 70vw;
  transition: all 0.5s ease-in-out;
  z-index: 1;
  
  &:hover {
    bottom: 0;
    right: 0;
  }
`;

function Map() {

  // Define the resizing code
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  });

  const [marker, setMarker] = useState({
    latitude: 0,
    longitude: 0,
  })

  const handleClick = (event) => {
    console.log(event);
    setMarker({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    },
    );
  };

  return (
    <Container>
      <ReactMapGL
        mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        initialViewState={viewport}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/ryanbarouki/clupsf5gr00vl01r2cqvg81tb"
        onViewportChange={setViewport}
      >
      </ReactMapGL>
      <Map2 >
        <ReactMapGL
          onClick={handleClick}
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          initialViewState={viewport}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/ryanbarouki/clvv9mmgd00v101quhx4m3nkv"
          onViewportChange={setViewport}
        >
          <Marker latitude={marker.latitude} longitude={marker.longitude}>
            <div>PIN</div>
          </Marker>
        </ReactMapGL>
      </Map2>
    </Container>
  );
}

export default Map;
