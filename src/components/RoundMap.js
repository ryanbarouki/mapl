import { Fragment, useEffect, useState } from 'react';
import { Annotation, Map as AppleMap, Marker as AppleMarker } from 'mapkit-react';
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { collapseMobileAttribution } from './mapAttribution';

function canUseAppleMap(token) {
  if (!token) return false;

  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp, origin } = JSON.parse(atob(payload));
    if (exp && exp * 1000 <= Date.now()) return false;
    if (!origin) return true;

    const { hostname } = window.location;
    return origin.split(',').some(entry => {
      const domain = entry.trim().toLowerCase();
      return domain === '*' || domain === hostname ||
        (domain.startsWith('*.') && hostname.endsWith(domain.slice(1)));
    });
  } catch {
    return false;
  }
}

export default function RoundMap({ pins, onPick, initialRegion, initialViewState, compactControls = false }) {
  const appleToken = process.env.REACT_APP_MAPKIT_JWT;
  const mapTilerKey = process.env.REACT_APP_MAPTILER_KEY;
  const [useApple, setUseApple] = useState(() => canUseAppleMap(appleToken));
  const [appleLoaded, setAppleLoaded] = useState(false);

  useEffect(() => {
    if (!useApple || appleLoaded) return;
    const timer = setTimeout(() => setUseApple(false), 8000);
    return () => clearTimeout(timer);
  }, [useApple, appleLoaded]);

  if (useApple) {
    return (
      <>
        <AppleMap token={appleToken} initialRegion={initialRegion} allowWheelToZoom
          showsMapTypeControl={!compactControls} showsZoomControl={!compactControls}
          onLoad={() => setAppleLoaded(true)}
          onSingleTap={onPick && (event => onPick(event.toCoordinates()))}>
          {pins.map(({ id, latitude, longitude, color, label }) => (
            <Fragment key={id}>
              <AppleMarker latitude={latitude} longitude={longitude} color={color} />
              {label && (
                <Annotation latitude={latitude} longitude={longitude} anchorOffsetY={38} enabled={false}>
                  <span className="round-pin-label">{label}</span>
                </Annotation>
              )}
            </Fragment>
          ))}
        </AppleMap>
        {mapTilerKey && !appleLoaded && (
          <button className="round-map-provider" onClick={() => setUseApple(false)}>
            Use MapTiler
          </button>
        )}
      </>
    );
  }

  if (!mapTilerKey) {
    return <p className="round-map-message">Map unavailable. Set a MapTiler key or a MapKit token for this domain.</p>;
  }

  return (
    <Map initialViewState={initialViewState ?? { longitude: 0, latitude: 20, zoom: 1 }}
      onClick={onPick && (event => onPick({
        latitude: event.lngLat.lat,
        longitude: event.lngLat.wrap().lng,
      }))}
      style={{ width: '100%', height: '100%' }}
      onLoad={collapseMobileAttribution}
      mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${encodeURIComponent(mapTilerKey)}`}>
      <NavigationControl showCompass={false} />
      {pins.map(({ id, latitude, longitude, color, label }) => (
        <Marker key={id} latitude={latitude} longitude={longitude} color={color}>
          <span className="round-map-pin" style={{ backgroundColor: color }}>
            {label && <span className="round-pin-label">{label}</span>}
          </span>
        </Marker>
      ))}
    </Map>
  );
}
