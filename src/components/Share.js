import CopyToClipboard from "react-copy-to-clipboard";
import React, { useMemo } from "react";
import { DateTime } from "luxon";
import { Button } from "../globalStyles";
import { toast } from "react-toastify";
import { getClosestDistance } from "./Play";

const FIRST_DAY_OF_MAPL = DateTime.fromFormat('August 22 2024', 'LLLL dd yyyy');

const findBestScore = (guesses) => {
  let bestScoreSoFar = 0;
  for (const guess of guesses) {
    if (Number(guess.score) > bestScoreSoFar) {
      bestScoreSoFar = guess.score;
    }
  }
  return bestScoreSoFar;
};

const getShareString = (score, guesses, hints) => {
  const distance = Math.floor(getClosestDistance(guesses) / 1000);
  console.log(distance)
  let string = "";
  if (distance < 50) {
    string += `I got within 50km in ${guesses.length} ${guesses.length === 1 ? "guess" : "guesses"} 🥳\n`;
  } else {
    string += `The closest I got was ${distance}km 🤷\n`;
  }
  if (hints > 0) {
    string += `and I used ${hints} ${hints === 1 ? 'hint' : 'hints'} 🫣\n`
  }
  else {
    string += `and I didn't use any hints 😎\n`
  }
  string += `My score was ${score}\n`
  return string;
}

export function Share({ score, guesses, end, dayString, hints }) {
  const shareText = useMemo(() => {
    const currentDate = DateTime.now();
    const diffInDays = Math.floor(currentDate.diff(FIRST_DAY_OF_MAPL, 'days').toObject().days);
    let shareString = `#Mapl #${diffInDays}\n`;
    shareString += getShareString(score, guesses, hints);
    shareString += "https://mapl.life";
    return shareString
  }, [guesses, dayString, score]);

  return (
    <CopyToClipboard
      text={shareText}
      onCopy={() => toast("Copied Results to Clipboard", { autoClose: 2000 })}
      options={{ format: "text/plain" }}
    >
      <Button disabled={!end}><span>Share Score</span></Button>
    </CopyToClipboard>
  )
}
