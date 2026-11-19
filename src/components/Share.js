import { useState } from 'react';
import { formatDistance } from './AppleMap';
import { MAX_GUESSES, MAX_SCORE, WIN_RADIUS } from '../roundRules';

export function Share({ score, guesses, hints, seed, daily }) {
  const [copyStatus, setCopyStatus] = useState('');
  const distances = guesses.map(guess => guess.distance);
  const tiles = Array.from({ length: MAX_GUESSES }, (_, index) => {
    const distance = distances[index];
    if (distance === undefined) return '⬜';
    if (distance <= WIN_RADIUS) return '🟩';
    return distance <= 500000 ? '🟨' : '🟥';
  }).join('');
  const title = daily ? `Mapl Daily · ${seed}` : 'Mapl Random';
  const url = new URL(daily ? '/daily' : '/play', window.location.origin);
  url.searchParams.set(daily ? 'day' : 'seed', seed);
  url.searchParams.set('score', score);

  const resultText = [
    title,
    `${score.toLocaleString('en-US')}/${MAX_SCORE.toLocaleString('en-US')} · ${guesses.length}/${MAX_GUESSES} guesses`,
    tiles,
    `Closest: ${formatDistance(Math.min(...distances))} · ${hints} ${hints === 1 ? 'hint' : 'hints'}`,
    'Can you beat my score?',
  ].join('\n');
  const shareText = `${resultText}\n${url.href}`;

  async function copyScore() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('manual');
    }
  }

  async function challengeFriend() {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text: resultText, url: url.href });
        setCopyStatus('');
        return;
      } catch (error) {
        if (error?.name === 'AbortError') return;
      }
    }
    await copyScore();
  }

  return (
    <div className="round-share">
      <div className="round-actions">
        <button className="site-button" onClick={challengeFriend}>Challenge a friend</button>
        <button className="site-button site-button-secondary" onClick={copyScore}>
          Copy score to share
        </button>
      </div>
      <p role="status">
        {copyStatus === 'copied' && 'Score copied. Paste it into a message or post.'}
        {copyStatus === 'manual' && 'Select and copy your score below.'}
      </p>
      {copyStatus === 'manual' && (
        <textarea aria-label="Score to share" value={shareText} readOnly rows={6}
          onFocus={event => event.currentTarget.select()} />
      )}
    </div>
  );
}
