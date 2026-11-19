import { useEffect, useRef, useState } from 'react';
import { getDistance } from 'geolib';
import { DateTime } from 'luxon';
import Papa from 'papaparse';
import seedrandom from 'seedrandom';
import { Link } from 'react-router-dom';
import ViewMap from './Map';
import RoundMapView from './RoundMapView';
import GuessMap from './GuessMapApple';
import ResultMap, { formatDistance } from './AppleMap';
import { Share } from './Share';
import countryHints from '../countryHints.json';
import { trackChallengeOpen, trackChallengeGuess, trackChallengeComplete } from '../challengeAnalytics';
import { MAX_GUESSES, MAX_SCORE, WIN_RADIUS, isRoundComplete } from '../roundRules';
import './Play.css';

const MOBILE_MAP_QUERY = '(max-width: 700px)';
const REDACTED_MAP = 'e88d9cf7-c88c-40cb-9510-bb1f7a29c306';
const LABELED_MAP = '6b3f0bd3-eea3-4016-8e88-77937de021ca';
const LEGACY_HINT_COST = 200;
const HINT_PRICE_MULTIPLIERS = [1, 0.8, 0.6];
const HINTS = [
  { label: 'Reveal continent', cost: 300 },
  { label: 'Reveal border or region', cost: 600 },
  { label: 'Reveal country', cost: 1000 },
  { label: 'Reveal map names', cost: 1500 },
];
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
    const [city, , lat, lon, country, iso2] = row ?? [];
    const latitude = Number(lat);
    const longitude = Number(lon);
    if (city && country && lat?.trim() && lon?.trim() &&
        Number.isFinite(latitude) && Number.isFinite(longitude)) {
      const geography = countryHints.countries[iso2];
      const borderIndex = geography?.borders.length
        ? Math.floor(seedrandom.alea(`border:${seed}`)() * geography.borders.length)
        : -1;
      return {
        latitude,
        longitude,
        name: `${city}, ${country}`,
        country,
        continent: geography?.continent,
        region: geography?.region,
        neighbor: geography?.borders[borderIndex],
      };
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

export default function Play({ guesses, addGuess, hintState, setHintState, seed, daily, onReplay, targetScore = null }) {
  const [answer, setAnswer] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [guessFocused, setGuessFocused] = useState(false);
  const [mobile, setMobile] = useState(() => window.matchMedia?.(MOBILE_MAP_QUERY).matches ?? false);
  const challengeOpened = useRef(false);
  const challengeGuessLogged = useRef(false);
  const [selectedClueView, setSelectedClueView] = useState(null);
  // Daily rounds saved before escalating prices used a numeric hint count.
  const { count: hints, penalty: hintPenalty } = typeof hintState === 'number'
    ? { count: hintState, penalty: hintState * LEGACY_HINT_COST }
    : hintState;
  const nextHint = HINTS[hints];
  const hintPriceMultiplier = HINT_PRICE_MULTIPLIERS[Math.min(guesses.length, MAX_GUESSES - 1)];
  const nextHintCost = nextHint ? Math.round(nextHint.cost * hintPriceMultiplier) : 0;
  const namesRevealed = hints >= HINTS.length;
  const clueView = selectedClueView ?? guesses.length;
  const clueCaption = clueView < guesses.length ? 'Reviewing an earlier clue view' :
    guesses.length ? 'Zoomed out after your guess' : undefined;
  const analyticsMode = daily ? 'daily' : 'random';
  const closestDistance = Math.min(...guesses.map(guess => guess.distance));
  const won = closestDistance <= WIN_RADIUS;
  const finished = isRoundComplete(guesses);
  const mode = daily ? `Daily puzzle · ${DateTime.fromISO(seed).toLocaleString(DateTime.DATE_MED)}` : 'Random';
  const score = Math.round(
    (MAX_SCORE - 1000 * (guesses.length - 1) - hintPenalty) *
    Math.exp(-closestDistance / 2000000)
  );

  useEffect(() => {
    const query = window.matchMedia?.(MOBILE_MAP_QUERY);
    if (!query) return;
    const onChange = event => setMobile(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

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
    <main className={answer && !finished ? "round round-active" : "round"}>
      {!answer ? (
        <section className="round-summary" aria-labelledby="loading-title">
          <h1 id="loading-title">{loadError ? 'Couldn’t load the round' : 'Loading the puzzle…'}</h1>
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
          <div className="round-hud">
            <header className="round-header">
              <div>
                <p className="round-mode">{mode}</p>
                <h1>Where on Earth is this?!</h1>
                {targetScore !== null && <p className="round-challenge">Friend’s score to beat <strong>{targetScore.toLocaleString()}</strong></p>}
              </div>
              <div className="round-hint">
                <button className="site-button site-button-secondary" disabled={namesRevealed}
                  onClick={() => setHintState({ count: hints + 1, penalty: hintPenalty + nextHintCost })}
                  aria-describedby="hint-cost">
                  {nextHint?.label ?? 'All hints revealed'} ({hints}/{HINTS.length} used)
                </button>
                <span id="hint-cost">
                  {nextHint ? `Costs ${nextHintCost.toLocaleString()} points` :
                    `${hintPenalty.toLocaleString()} base points spent on hints`}
                </span>
              </div>
            </header>
            <div className="round-status" aria-live="polite">
              <AttemptList guesses={guesses} />
              {hints > 0 && (
                <ul className="round-revealed-hints" aria-label="Revealed hints">
                  <li>Continent <strong>{answer.continent ?? 'Unavailable'}</strong></li>
                  {hints >= 2 && (
                    <li>
                      {answer.neighbor ? 'Bordering country' : 'Region'}{' '}
                      <strong>{answer.neighbor ?? answer.region ?? 'Unavailable'}</strong>
                    </li>
                  )}
                  {hints >= 3 && <li>Country <strong>{answer.country}</strong></li>}
                  {namesRevealed && <li>Place names are visible on the clue map</li>}
                </ul>
              )}
            </div>
          </div>
          <div className="round-board">
            <RoundMapView name="Clue map" caption={clueCaption}
              active={!mobile || !guessFocused} onActivate={() => setGuessFocused(false)}
              map={<ViewMap zoom={CLUE_VIEWS[clueView].zoom} latitude={answer.latitude} longitude={answer.longitude}
                map={namesRevealed ? LABELED_MAP : REDACTED_MAP} />}>
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
            </RoundMapView>
            <GuessMap active={!mobile || guessFocused} onActivate={() => setGuessFocused(true)}
              handleGuess={submitGuess} guesses={guesses} />
          </div>
        </>
      )}
    </main>
  );
}
