import { useState } from 'react';
import { DateTime } from 'luxon';
import { useSearchParams } from 'react-router-dom';
import { MAX_SCORE } from '../roundRules';
import Play from './Play';
import { useGuesses } from '../Hooks/useGuesses';
import { useStore } from '../Hooks/useStore';

function readChallengeScore(params) {
  const rawScore = params.get('score') ?? '';
  const score = Number(rawScore);
  return /^\d{1,5}$/.test(rawScore) && score <= MAX_SCORE ? score : null;
}

export function DailyPlay() {
  const [params] = useSearchParams();
  const [today] = useState(() => DateTime.now().toISODate());
  const requestedDay = params.get('day') ?? '';
  const validDay = /^\d{4}-\d{2}-\d{2}$/.test(requestedDay) && DateTime.fromISO(requestedDay).isValid;
  const targetScore = validDay ? readChallengeScore(params) : null;
  const day = validDay ? requestedDay : today;

  return <DailyRound key={day} day={day} targetScore={targetScore} />;
}

function DailyRound({ day, targetScore }) {
  const [guesses, addGuess] = useGuesses(day);
  const [hints, setHints] = useStore('hints', day, 'number');

  return <Play guesses={guesses} addGuess={addGuess} hints={hints} setHints={setHints} seed={day} daily targetScore={targetScore} />;
}

export function NormalPlay() {
  const [params, setParams] = useSearchParams();
  const rawSeed = params.get('seed');
  const parsedSeed = Number(rawSeed);
  const challengeSeed = String(parsedSeed) === rawSeed && parsedSeed >= 0 && parsedSeed < 1 ? parsedSeed : null;
  const targetScore = challengeSeed === null ? null : readChallengeScore(params);

  return (
    <RandomRound key={challengeSeed ?? 'random'} challengeSeed={challengeSeed} targetScore={targetScore}
      leaveChallenge={() => setParams({}, { replace: true })} />
  );
}

function RandomRound({ challengeSeed, targetScore, leaveChallenge }) {
  const [seed, setSeed] = useState(() => challengeSeed ?? Math.random());
  const [guesses, setGuesses] = useState([]);
  const [hints, setHints] = useState(0);

  function replay() {
    if (challengeSeed !== null) {
      leaveChallenge();
      return;
    }
    setGuesses([]);
    setHints(0);
    setSeed(Math.random());
  }

  return (
    <Play key={seed} seed={seed} guesses={guesses} hints={hints} setHints={setHints}
      addGuess={guess => setGuesses(previous => [...previous, guess])} onReplay={replay} targetScore={targetScore} />
  );
}
