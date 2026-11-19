import { useState } from 'react';
import RoundMap from './RoundMap';
import { formatDistance } from './AppleMap';

export default function GuessMap({ handleGuess, guesses, headingRef }) {
  const [marker, setMarker] = useState(null);
  const pins = guesses.map((guess, index) => ({
    ...guess,
    id: index,
    color: '#FFCB00',
    label: formatDistance(guess.distance),
  }));
  if (marker) pins.push({ ...marker, id: 'pending', color: '#ff173a' });

  function confirmGuess() {
    if (!marker) return;
    handleGuess(marker);
    setMarker(null);
  }

  return (
    <>
      <div className="round-panel-heading">
        <h2 id="guess-title" ref={headingRef} tabIndex={-1}>Your guess</h2>
        <span aria-live="polite">{marker ? 'Move your pin or confirm.' : 'Tap or click the map to place a pin.'}</span>
      </div>
      <div className="round-map">
        <RoundMap pins={pins} onPick={setMarker} />
      </div>
      <div className="round-confirm">
        <button className="site-button" onClick={confirmGuess} disabled={!marker}>
          {marker ? 'Confirm guess' : 'Place a pin to guess'}
        </button>
      </div>
    </>
  );
}
