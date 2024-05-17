import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'mapbox-gl-leaflet';
import PropTypes from 'prop-types';

const MapBoxGLLayer = ({ accessToken, style }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const mapboxGLLayer = L.mapboxGL({
      accessToken,
      style
    }).addTo(map);

    return () => {
      if (map.hasLayer(mapboxGLLayer)) {
        map.removeLayer(mapboxGLLayer);
      }
    };
  }, [map, accessToken, style]);

  return null;
};

MapBoxGLLayer.propTypes = {
  accessToken: PropTypes.string.isRequired,
  style: PropTypes.string
};

MapBoxGLLayer.defaultProps = {
  style: "mapbox://styles/mapbox/streets-v9"
};

export default MapBoxGLLayer;
