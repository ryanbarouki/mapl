import { useState } from 'react';
import RoundMap from './RoundMap';
import RoundMapView from './RoundMapView';
import { formatDistance } from './AppleMap';

export default function GuessMap({ active, onActivate, handleGuess, guesses }) {
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
    <RoundMapView name="Guess map" heading="Your guess" active={active} onActivate={onActivate}
      caption={marker ? 'Move your pin or confirm.' : 'Tap or click the map to place a pin.'}
      map={<RoundMap pins={pins} onPick={setMarker} compactControls={!active} />}>
      <button className="site-button" onClick={confirmGuess} disabled={!marker}>
        {marker ? 'Confirm guess' : 'Place a pin to guess'}
      </button>
    </RoundMapView>
  );
}
