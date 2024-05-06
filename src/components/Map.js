import { useEffect, useMemo, useState } from 'react';
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
  bottom: 0;
  right: 0;
  height: 33.33vh;
  width: 33.33vw;
  transition: all 0.5s ease-in-out;
  z-index: 1;
  
  &:hover {
    height: 50vh;
    width: 50vw;
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

  const [map2Width, setMap2Width] = useState("33.33vw");
  const [map2Height, setMap2Height] = useState("33.33vh");

  const handleHover = () => {
    setMap2Width("50vw");
    setMap2Height("50vh");
  };

  const handleHoverEnd = () => {
    setMap2Width("33.33vw");
    setMap2Height("33.33vh");
  };

  const handleClick = (event) => {
    console.log(event);
    setMarker({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    },
    );
  };
  const key = useMemo(() => map2Height + "-" + map2Width, [map2Height, map2Width]);

  // useEffect(() => {
  //   console.log(map2Width, map2Height)
  //   console.log(key)
  // }, [map2Width, map2Width]
  // )

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
      <Map2
        onMouseOver={handleHover}
        onMouseLeave={handleHoverEnd}
      >
        <ReactMapGL
          key={key}
          onClick={handleClick}
          mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          initialViewState={viewport}
          width={map2Width}
          height={map2Height}
          // style={{ width: map2Width, height: map2Height }}
          mapStyle="mapbox://styles/ryanbarouki/clvv9mmgd00v101quhx4m3nkv"
          onViewportChange={setViewport}
        >
          <Marker latitude={marker.latitude} longitude={marker.longitude}>
            <div>something</div>
          </Marker>
        </ReactMapGL>
      </Map2>
    </Container>
  );
}

export default Map;
