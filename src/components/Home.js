import { DateTime } from 'luxon';
import { Link } from 'react-router-dom';
import { MAX_GUESSES, WIN_RADIUS, isRoundComplete } from '../roundRules';
import { loadAll } from '../save_local';
import { formatDistance } from './AppleMap';

function DailyHistory({ today, dailyGuesses }) {
  const days = Array.from({ length: 7 }, (_, index) => today.minus({ days: 6 - index }));
  let streakDay = isRoundComplete(dailyGuesses[today.toISODate()] ?? []) ? today : today.minus({ days: 1 });
  let streak = 0;
  while (isRoundComplete(dailyGuesses[streakDay.toISODate()] ?? [])) {
    streak += 1;
    streakDay = streakDay.minus({ days: 1 });
  }

  return (
    <section className="daily-history" aria-labelledby="daily-history-title">
      <div className="daily-history-heading">
        <h2 id="daily-history-title">Last 7 days</h2>
        <span>{streak} {streak === 1 ? 'day' : 'days'} in a row</span>
      </div>
      <ol>
        {days.map(day => {
          const isoDay = day.toISODate();
          const complete = isRoundComplete(dailyGuesses[isoDay] ?? []);
          const description = `${day.toLocaleString(DateTime.DATE_FULL)} · ${complete ? 'Completed' : 'Incomplete'}`;
          return (
            <li key={isoDay}>
              {complete ? (
                <Link to={`/daily?day=${isoDay}`} aria-label={description} title={description}>
                  <time dateTime={isoDay}>{day.toFormat('ccc')}</time>
                  <span aria-hidden="true">✓</span>
                </Link>
              ) : (
                <span className="daily-history-day">
                  <span className="visually-hidden">{description}</span>
                  <time dateTime={isoDay} aria-hidden="true">{day.toFormat('ccc')}</time>
                  <span aria-hidden="true">–</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function Home() {
  const today = DateTime.now();
  const dailyGuesses = loadAll('guesses');
  const guesses = dailyGuesses[today.toISODate()] ?? [];
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
      <DailyHistory today={today} dailyGuesses={dailyGuesses} />
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
