export const MAX_GUESSES = 3;
export const WIN_RADIUS = 50000;
export const MAX_SCORE = 10000;

export function isRoundComplete(guesses) {
  return guesses.length >= MAX_GUESSES || guesses.some(guess => guess.distance <= WIN_RADIUS);
}
