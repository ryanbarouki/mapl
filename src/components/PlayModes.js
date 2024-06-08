import Play from "./Play";
import { useGuesses } from "../Hooks/useGuesses";
import { useCallback, useMemo, useState } from "react";
import { DateTime } from "luxon";

const getDayString = () => {
  return DateTime.now().toFormat("yyyy-MM-dd");
}

export const DailyPlay = () => {
  const dayString = useMemo(getDayString, []);
  const [guesses, addGuess] = useGuesses(dayString);

  return (
    <Play guesses={guesses} addGuess={addGuess} random_seed={dayString} />
  )
};

export const NormalPlay = () => {
  const [guesses, setGuess] = useState([]);
  const addGuess = guess => setGuess(guesses => [...guesses, guess])

  return (
    <Play guesses={guesses} addGuess={addGuess} random_seed={Math.random()} />
  )
};
