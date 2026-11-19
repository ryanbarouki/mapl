import { useEffect, useRef, useState } from 'react';
import { getDistance } from 'geolib';
import { DateTime } from 'luxon';
import Papa from 'papaparse';
import seedrandom from 'seedrandom';
import { Link } from 'react-router-dom';
import ViewMap from './Map';
import GuessMap from './GuessMapApple';
import ResultMap, { formatDistance } from './AppleMap';
import { Share } from './Share';
import { trackChallengeOpen, trackChallengeGuess, trackChallengeComplete } from '../challengeAnalytics';
import { MAX_GUESSES, MAX_SCORE, WIN_RADIUS, isRoundComplete } from '../roundRules';
import './Play.css';

const MAPS = [
  'e88d9cf7-c88c-40cb-9510-bb1f7a29c306',
  '2ba07e07-1a5e-41b5-9c23-0b8d550d726e',
  '6b3f0bd3-eea3-4016-8e88-77937de021ca',
];
const HINT_COST = 200;
const CLUE_VIEWS = [
  { label: 'View 1', zoom: 13 },
  { label: 'View 2', zoom: 10 },
  { label: 'View 3', zoom: 7 },
];

function getLocation(csv, seed) {
  const rows = Papa.parse(csv).data;
  const index = Math.floor(seedrandom.alea(seed)() * rows.length);
  // Keep the existing daily selection unless it lands on the header or a blank row.
  for (const row of [rows[index], rows[1]]) {
    const [city, , lat, lon, country] = row ?? [];
    const latitude = Number(lat);
    const longitude = Number(lon);
    if (city && country && lat?.trim() && lon?.trim() &&
        Number.isFinite(latitude) && Number.isFinite(longitude)) {
      return { latitude, longitude, name: `${city}, ${country}` };
    }
  }
  throw new Error('No playable location found');
}

function AttemptList({ guesses }) {
  return (
    <ol className="round-attempts" aria-label="Guess distances">
      {Array.from({ length: MAX_GUESSES }, (_, index) => (
        <li key={index} data-used={Boolean(guesses[index])}>
          <span>Guess {index + 1}</span>
          <strong>{guesses[index] ? formatDistance(guesses[index].distance) : '—'}</strong>
        </li>
      ))}
    </ol>
  );
}

export default function Play({ guesses, addGuess, hints, setHints, seed, daily, onReplay, targetScore = null }) {
  const [answer, setAnswer] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const guessHeading = useRef(null);
  const challengeOpened = useRef(false);
  const challengeGuessLogged = useRef(false);
  const [selectedClueView, setSelectedClueView] = useState(null);
  const clueView = selectedClueView ?? guesses.length;
  const numHints = daily ? MAPS.length - 1 : 1;
  const analyticsMode = daily ? 'daily' : 'random';
  const closestDistance = Math.min(...guesses.map(guess => guess.distance));
  const won = closestDistance <= WIN_RADIUS;
  const finished = isRoundComplete(guesses);
  const mode = daily ? `Daily puzzle · ${DateTime.fromISO(seed).toLocaleString(DateTime.DATE_MED)}` : 'Random';
  const score = Math.round(
    (MAX_SCORE - 1000 * (guesses.length - 1) - HINT_COST * hints) *
    Math.exp(-closestDistance / 2000000)
  );

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${process.env.PUBLIC_URL}/worldcities.csv`, { signal: controller.signal })
      .then(response => {
        if (!response.ok) throw new Error('Location data unavailable');
        return response.text();
      })
      .then(csv => {
        if (!controller.signal.aborted) setAnswer(getLocation(csv, seed));
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoadError(true);
      });
    return () => controller.abort();
  }, [seed, loadAttempt]);

  useEffect(() => {
    if (targetScore !== null && !challengeOpened.current) {
      challengeOpened.current = true;
      trackChallengeOpen(analyticsMode);
    }
  }, [analyticsMode, targetScore]);

  function submitGuess(marker) {
    if (!answer || finished) return;
    const guess = { ...marker, distance: getDistance(marker, answer) };
    addGuess(guess);
    if (targetScore !== null) {
      if (!challengeGuessLogged.current) {
        challengeGuessLogged.current = true;
        trackChallengeGuess(analyticsMode);
      }
      if (isRoundComplete([...guesses, guess])) trackChallengeComplete(analyticsMode);
    }
    setSelectedClueView(null);
  }

  return (
    <main className="round">
      {!answer ? (
        <section className="round-summary" aria-labelledby="loading-title">
          <h1 id="loading-title">{loadError ? 'Couldn’t load the round' : 'Finding your location…'}</h1>
          {loadError && (
            <button className="site-button" onClick={() => {
              setLoadError(false);
              setLoadAttempt(attempt => attempt + 1);
            }}>Try again</button>
          )}
        </section>
      ) : finished ? (
        <section className="round-summary" aria-labelledby="result-title">
          <p className="round-mode">{mode} · {won ? 'Target found' : 'Round complete'}</p>
          <h1 id="result-title">{answer.name}</h1>
          <p className="round-score"><strong>{score.toLocaleString()}</strong> / {MAX_SCORE.toLocaleString()}</p>
          <p className="round-detail">Closest guess <strong>{formatDistance(closestDistance)}</strong> · {hints} {hints === 1 ? 'hint' : 'hints'} used</p>
          {targetScore !== null && (
            <p className="round-challenge">
              <strong>{score === targetScore ? 'You tied!' : score > targetScore ? 'You beat the challenge!' : 'Your friend scored higher.'}</strong>
              {' '}Friend’s score {targetScore.toLocaleString()}
            </p>
          )}
          <AttemptList guesses={guesses} />
          <Share score={score} guesses={guesses} hints={hints} seed={seed} daily={daily} />
          {showMap && (
            <div className="round-result-map" id="round-result-map">
              <ResultMap guesses={guesses} answer={answer} name={answer.name} />
            </div>
          )}
          <div className="round-actions">
            <button className="site-button site-button-secondary" onClick={() => setShowMap(visible => !visible)}
              aria-expanded={showMap} aria-controls={showMap ? 'round-result-map' : undefined}>
              {showMap ? 'Hide map' : 'Review map'}
            </button>
            {daily
              ? <Link className="site-button site-button-secondary" to="/play">Play a new location</Link>
              : <button className="site-button site-button-secondary" onClick={onReplay}>Play again</button>}
          </div>
        </section>
      ) : (
        <>
          <header className="round-header">
            <div>
              <p className="round-mode">{mode}</p>
              <h1>Find the location</h1>
              {targetScore !== null && <p className="round-challenge">Friend’s score to beat <strong>{targetScore.toLocaleString()}</strong></p>}
            </div>
            <div className="round-hint">
              <button className="site-button site-button-secondary" disabled={hints >= numHints}
                onClick={() => setHints(hints + 1)} aria-describedby="hint-cost">
                {daily ? `Reveal hint (${hints}/${numHints} used)` : hints ? 'Major roads highlighted' : 'Highlight major roads'}
              </button>
              <span id="hint-cost">{HINT_COST} base points{daily ? ' per hint' : ''}</span>
            </div>
          </header>
          <div className="round-status" aria-live="polite">
            <AttemptList guesses={guesses} />
          </div>
          <div className="round-board">
            <section className="round-panel" aria-labelledby="clue-title">
              <div className="round-panel-heading">
                <h2 id="clue-title">Clue map</h2>
                <span>{clueView < guesses.length ? 'Reviewing an earlier clue view' :
                  guesses.length ? 'Zoomed out after your guess' : 'Look for roads, rivers and coastlines'}</span>
              </div>
              <div className="round-map">
                <ViewMap zoom={CLUE_VIEWS[clueView].zoom} latitude={answer.latitude} longitude={answer.longitude} map={MAPS[daily ? hints : 0]} highlightMajorRoads={!daily && hints > 0} />
              </div>
              {guesses.length > 0 && (
                <div className="round-clue-views" role="group" aria-label="Clue map zoom">
                  {CLUE_VIEWS.slice(0, guesses.length + 1).map(({ label }, index) => (
                    <button key={label} className="site-button site-button-secondary"
                      aria-pressed={clueView === index} onClick={() => setSelectedClueView(index)}>
                      {label}
                    </button>
                  ))}
                </div>
              )}
              <div className="round-jump-to-guess">
                <button className="site-button" onClick={() => guessHeading.current.focus()}>
                  Make a guess
                </button>
              </div>
            </section>
            <section className="round-panel" aria-labelledby="guess-title">
              <GuessMap handleGuess={submitGuess} guesses={guesses} headingRef={guessHeading} />
            </section>
          </div>
        </>
      )}
    </main>
  );
}
