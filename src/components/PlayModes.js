import Play from "./Play";
import { useGuesses } from "../Hooks/useGuesses";
import { useStore } from "../Hooks/useStore";
import { useCallback, useMemo, useState } from "react";
import { DateTime } from "luxon";

const getDayString = () => {
  return DateTime.now().toFormat("yyyy-MM-dd");
}

export const DailyPlay = () => {
  const dayString = useMemo(getDayString, []);
  const [guesses, addGuess] = useGuesses(dayString);
  const [hints, addHints] = useStore("hints", dayString, "number");

  return (
    <Play guesses={guesses} addGuess={addGuess} hints={hints} setHints={addHints} random_seed={dayString} />
  )
};

export const NormalPlay = () => {
  const [guesses, setGuess] = useState([]);
  const addGuess = guess => setGuess(guesses => [...guesses, guess]);
  const [hints, setHints] = useState(0);

  return (
    <Play guesses={guesses} addGuess={addGuess} hints={hints} setHints={setHints} random_seed={Math.random()} />
  )
};
