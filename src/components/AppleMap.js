import RoundMap from './RoundMap';

export function formatDistance(distance) {
  return `${(distance / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })} km`;
}

export default function ResultMap({ guesses, answer, name }) {
  const { latitude, longitude } = answer;
  const latitudeOffset = Math.max(...guesses.map(guess => Math.abs(guess.latitude - latitude)));
  const longitudeOffset = Math.max(...guesses.map(guess => {
    const difference = Math.abs(guess.longitude - longitude);
    return Math.min(difference, 360 - difference);
  }));
  const pins = guesses.map((guess, index) => ({
    ...guess,
    id: index,
    color: '#FFCB00',
    label: `Guess ${index + 1} · ${formatDistance(guess.distance)}`,
  }));
  pins.push({ latitude, longitude, id: 'answer', color: '#ff173a', label: name });

  return (
    <RoundMap pins={pins} initialRegion={{
      centerLatitude: latitude,
      centerLongitude: longitude,
      latitudeDelta: Math.min(160, Math.max(0.5, latitudeOffset * 2.5)),
      longitudeDelta: Math.min(360, Math.max(0.5, longitudeOffset * 2.5)),
    }} initialViewState={{
      latitude,
      longitude,
      zoom: Math.max(0, Math.log2(90 / Math.max(0.5, latitudeOffset, longitudeOffset))),
    }} />
  );
}
