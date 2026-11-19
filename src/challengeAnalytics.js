import { DateTime } from 'luxon';

const FIRST_CHALLENGE_DAY = 'mapl:first-challenge-day';
const CHALLENGE_RETURN_RECORDED = 'mapl:challenge-return-recorded';

function track(event, mode) {
  window.gtag?.('event', event, mode ? { game_mode: mode } : {});
}

export function trackChallengeOpen(mode) {
  track('challenge_open', mode);
  try {
    if (!localStorage.getItem(FIRST_CHALLENGE_DAY)) {
      localStorage.setItem(FIRST_CHALLENGE_DAY, DateTime.now().toISODate());
    }
  } catch {
    // A blocked storage API only prevents the cross-day metric.
  }
}

export function trackChallengeGuess(mode) {
  track('challenge_first_guess', mode);
}

export function trackChallengeComplete(mode) {
  track('challenge_complete', mode);
}

export function trackChallengeReturn() {
  try {
    const firstDay = localStorage.getItem(FIRST_CHALLENGE_DAY);
    if (!firstDay || localStorage.getItem(CHALLENGE_RETURN_RECORDED)) return;

    const daysSinceOpen = DateTime.now().startOf('day').diff(DateTime.fromISO(firstDay), 'days').days;
    if (daysSinceOpen >= 1 && daysSinceOpen <= 7) {
      track('challenge_return_7d');
      localStorage.setItem(CHALLENGE_RETURN_RECORDED, 'true');
    }
  } catch {
    // A blocked storage API only prevents the cross-day metric.
  }
}
