import { useLayoutEffect, useRef } from 'react';

export default function RoundMapView({ name, heading = name, caption, active, onActivate, map, children }) {
  const headingRef = useRef(null);
  const wasActive = useRef(active);

  useLayoutEffect(() => {
    if (active && !wasActive.current) headingRef.current.focus({ preventScroll: true });
    wasActive.current = active;
  }, [active]);

  return (
    <section className="round-map-view" data-active={active} aria-label={name}>
      <div className="round-map" aria-hidden={active ? undefined : true} inert={active ? undefined : ''}>
        {map}
      </div>
      {active ? (
        <div className="round-map-dock">
          <div className="round-map-caption">
            <h2 ref={headingRef} tabIndex={-1}>{heading}</h2>
            {caption && <p aria-live="polite">{caption}</p>}
          </div>
          {children}
        </div>
      ) : (
        <button className="round-map-switch" aria-label={`Switch to ${name.toLowerCase()}`} onClick={onActivate}>
          <span>{name}</span>
        </button>
      )}
    </section>
  );
}
