# Mapl
Play at [mapl.life](https://mapl.life)

## Dev TODOs
- make the breakdown zoom level closer
- save number of hints used to persistent state and take into account with scoring
- Multiple rounds
- Share feature for daily game
- ability to go back to previous zoom levels of guesses?

- Different map types
- A mode where it only zooms out a bit but adds more details on the map bit by bit
- nav bar collapse when small
- Ads when API requests start to charge $$
- Flags at the end
- Consider removing road signs or add them on the second go?

Note to self: Per round of the game the current setup uses around 100 tiles for the redacted map.
If we switched to sessions it would use 4 sessions per game (3 for each zoom level and 1 for the final view).
So tiles use roughly 25 times more requests but the Maptiler pricing model allows 20 times more allowance for tiles
compared to requests (e.g. 25k sessions/ 500k sessions). In all it works out similarly but a nice idea to use the full allowance
is to use a random number generator to alternate between these equally and get the maximum out of what we pay for.

## How to play
Welcome to the Mapl - the redacted map game! Your challenge is to identify the location marked on the redacted map. 

You'll have three attempts to pinpoint the marker's exact location. With each incorrect guess, the map zooms out, making the task slightly easier.
Keep in mind that precision matters! If you can guess within 50km of the actual location at any point, you'll earn an automatic score!

Strive for the highest score possible – a maximum of 10,000 points is up for grabs. Aim to get as close to the mark as you can, using as few guesses as possible.
