import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { HiArrowsPointingOut } from 'react-icons/hi2';
import RoundMap from './RoundMap';
import { formatDistance } from './AppleMap';

export default function GuessMap({ handleGuess, guesses, headingRef }) {
  const [marker, setMarker] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [mobile, setMobile] = useState(() => window.matchMedia?.('(max-width: 700px)').matches ?? false);
  const [mapHost] = useState(() => document.createElement('div'));
  const inlineMap = useRef(null);
  const expandedMap = useRef(null);
  const dialog = useRef(null);
  const pins = guesses.map((guess, index) => ({
    ...guess,
    id: index,
    color: '#FFCB00',
    label: formatDistance(guess.distance),
  }));
  if (marker) pins.push({ ...marker, id: 'pending', color: '#ff173a' });

  useEffect(() => {
    const query = window.matchMedia?.('(max-width: 700px)');
    if (!query) return;

    const updateMobile = event => setMobile(event.matches);
    query.addEventListener('change', updateMobile);
    return () => query.removeEventListener('change', updateMobile);
  }, []);

  useLayoutEffect(() => {
    // Move the same map between containers so its camera and provider stay in place.
    const container = expanded ? expandedMap.current : inlineMap.current;
    container.appendChild(mapHost);
  }, [expanded, mapHost]);

  function confirmGuess() {
    if (!marker) return;
    handleGuess(marker);
    setMarker(null);
  }

  const instruction = marker ? 'Move your pin or confirm.' : 'Tap or click the map to place a pin.';
  const confirmButton = (
    <div className="round-confirm">
      <button className="site-button" onClick={confirmGuess} disabled={!marker}>
        {marker ? 'Confirm guess' : 'Place a pin to guess'}
      </button>
    </div>
  );

  return (
    <>
      <div className="round-panel-heading">
        <h2 id="guess-title" ref={headingRef} tabIndex={-1}>Your guess</h2>
        <span aria-live="polite">{instruction}</span>
      </div>
      <div className="round-map round-guess-map" ref={inlineMap}>
        <button className="site-button site-button-secondary round-expand-map"
          aria-label="Full screen guess map" aria-haspopup="dialog" aria-controls="guess-fullscreen"
          onClick={() => {
            dialog.current.showModal();
            setExpanded(true);
          }}>
          <HiArrowsPointingOut size={20} aria-hidden="true" />
        </button>
      </div>
      {confirmButton}
      <dialog id="guess-fullscreen" className="round-map-fullscreen" ref={dialog}
        aria-labelledby="guess-fullscreen-title" onClose={() => setExpanded(false)}>
        <div className="round-panel-heading">
          <h2 id="guess-fullscreen-title">Guess map</h2>
          <button className="site-button site-button-secondary" onClick={() => dialog.current.close()}>
            Close full screen
          </button>
          {expanded && <span aria-live="polite">{instruction}</span>}
        </div>
        <div className="round-map" ref={expandedMap} />
        {expanded && confirmButton}
      </dialog>
      {createPortal(
        <RoundMap pins={pins} onPick={setMarker} compactControls={mobile && !expanded} />,
        mapHost
      )}
    </>
  );
}
