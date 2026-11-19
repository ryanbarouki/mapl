import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';
import { MAX_GUESSES, WIN_RADIUS, isRoundComplete } from '../roundRules';
import { loadAll } from '../save_local';
import { formatDistance } from './AppleMap';

export default function Home() {
  const today = DateTime.now();
  const guesses = loadAll('guesses')[today.toISODate()] ?? [];
  const complete = isRoundComplete(guesses);
  const action = complete ? 'See today’s result' : guesses.length ? 'Continue puzzle' : 'Play today’s puzzle';

  return (
    <main className="home site-width">
      <section className="daily-card" aria-labelledby="daily-title">
        <p className="daily-date"><time dateTime={today.toISODate()}>{today.toLocaleString(DateTime.DATE_MED)}</time></p>
        <h1 id="daily-title">Daily puzzle</h1>
        <p>Can you find the hidden location on a map with no place names? You have {MAX_GUESSES} guesses. The clue map zooms out between guesses to reveal more of the surrounding area.</p>
        <ol className="daily-guesses" aria-label="Today’s guesses">
          {Array.from({ length: MAX_GUESSES }, (_, index) => {
            const guess = guesses[index];
            const state = guess ? (guess.distance <= WIN_RADIUS ? 'hit' : 'miss') : 'unused';

            return (
              <li key={index} data-state={state}>
                <span className="visually-hidden">Guess {index + 1}: </span>
                {state === 'hit' ? 'Found' : guess ? formatDistance(guess.distance) : 'Not guessed'}
              </li>
            );
          })}
        </ol>
        <Link className="site-button" to="/daily">{action}</Link>
      </section>
      <section className="random-card" aria-labelledby="random-title">
        <div>
          <h2 id="random-title">Random</h2>
          <p>Guess a different location anytime.</p>
        </div>
        <Link className="site-button site-button-secondary" to="/play">Play Random</Link>
      </section>
    </main>
  );
}
