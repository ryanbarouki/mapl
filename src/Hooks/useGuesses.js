import { useCallback, useState } from "react";
import { loadAll, save } from "../save_local";

export function useGuesses(dayString) {
  const [guesses, setGuesses] = useState(loadAll("guesses")[dayString] ?? []);

  const addGuess = useCallback(newGuess => {
    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);
    save(dayString, "guesses", newGuesses);
  },
    [dayString, guesses]
  );

  return [guesses, addGuess];
}
