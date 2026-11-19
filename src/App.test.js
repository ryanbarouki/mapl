import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DateTime } from 'luxon';
import App from './App';

jest.mock('./components/Map', () => ({ zoom, map }) => (
  <output aria-label="Clue zoom" data-map-style={map}>{zoom}</output>
));
let mockAppleMapOnLoad;
jest.mock('mapkit-react', () => ({
  Map: ({ onLoad }) => {
    mockAppleMapOnLoad = onLoad;
    return <div aria-label="Apple map" />;
  },
  Marker: () => null,
  Annotation: () => null,
}), { virtual: true });

jest.mock('react-map-gl/maplibre', () => ({
  __esModule: true,
  default: ({ children, onClick }) => {
    function pin(latitude) {
      onClick({ lngLat: { lat: latitude, wrap: () => ({ lng: 0 }) } });
    }
    return (
      <div aria-label="MapTiler map">
        {onClick && (
          <>
            <button onClick={() => pin(0)}>Pin a distant guess</button>
            <button onClick={() => pin(51)}>Pin the target</button>
          </>
        )}
        {children}
      </div>
    );
  },
  Marker: ({ children }) => <div>{children}</div>,
  NavigationControl: () => null,
}));

let originalFetch;
let originalClipboard;
let writeText;
let originalMapEnv;
let originalGtag;
let originalMatchMedia;

beforeEach(() => {
  originalFetch = global.fetch;
  originalMatchMedia = window.matchMedia;
  window.matchMedia = jest.fn().mockReturnValue({
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  });
  originalGtag = window.gtag;
  window.gtag = jest.fn();
  originalMapEnv = process.env;
  process.env = {
    ...originalMapEnv,
    REACT_APP_MAPKIT_JWT: `header.${btoa(JSON.stringify({ origin: 'mapl.life' }))}.signature`,
    REACT_APP_MAPTILER_KEY: 'test-map-key',
  };
  originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    text: async () => 'city,city_ascii,lat,lng,country,iso2\nTest City,Test City,51,0,Test Country,GB',
  });
  writeText = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  localStorage.clear();
});

afterEach(() => {
  global.fetch = originalFetch;
  window.matchMedia = originalMatchMedia;
  window.gtag = originalGtag;
  process.env = originalMapEnv;
  if (originalClipboard) Object.defineProperty(navigator, 'clipboard', originalClipboard);
  else delete navigator.clipboard;
});

function openGame(path) {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
}

async function focusGuessMap() {
  fireEvent.click(await screen.findByRole('button', { name: 'Switch to guess map' }));
}

async function guess(pin) {
  if (!screen.queryByRole('button', { name: pin })) await focusGuessMap();
  fireEvent.click(screen.getByRole('button', { name: pin }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirm guess' }));
}

test('random mode shows distance after a miss and shares a spoiler-free result', async () => {
  openGame('/play');
  expect(await screen.findByLabelText('MapTiler map')).toBeInTheDocument();
  expect(screen.queryByLabelText('Apple map')).toBeNull();
  await guess('Pin a distant guess');
  fireEvent.click(screen.getByRole('button', { name: 'Switch to clue map' }));
  expect(screen.getByText('Zoomed out after your guess')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Reveal continent (0/4 used)' }));
  expect(screen.getByRole('button', { name: 'Reveal border or region (1/4 used)' })).toBeEnabled();
  await guess('Pin the target');
  expect(screen.getByRole('heading', { name: 'Test City, Test Country' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Copy score to share' }));
  expect(await screen.findByText(/score copied/i)).toBeInTheDocument();
  const [text] = writeText.mock.calls[0];
  expect(text).toContain('Mapl Random');
  expect(text).toContain('8,760/10,000 · 2/3 guesses');
  expect(text).toContain('🟥🟩⬜');
  expect(text).toContain('1 hint');
  expect(text).not.toContain('Test City');

  fireEvent.click(screen.getByRole('button', { name: 'Play again' }));
  await focusGuessMap();
  expect(screen.getByRole('button', { name: 'Place a pin to guess' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Reveal continent (0/4 used)' })).toBeEnabled();
});

test('a saved early Daily win reopens as complete and offers manual copying', async () => {
  const day = DateTime.now().toISODate();
  localStorage.setItem('guesses', JSON.stringify({
    [day]: [{ latitude: 51, longitude: 0, distance: 0 }],
  }));
  writeText.mockRejectedValueOnce(new Error('Clipboard denied'));
  openGame('/daily');

  fireEvent.click(await screen.findByRole('button', { name: 'Copy score to share' }));
  const share = await screen.findByRole('textbox', { name: 'Score to share' });
  expect(share.value).toContain(`Mapl Daily · ${day}`);
  expect(share.value).toContain('10,000/10,000 · 1/3 guesses');
  expect(share.value).toContain(`/daily?day=${day}&score=10000`);
  fireEvent.click(screen.getByRole('button', { name: 'Review map' }));
  expect(screen.getByLabelText('MapTiler map')).toBeInTheDocument();
});

test('an allowed host uses Apple Maps and can switch providers', async () => {
  process.env.REACT_APP_MAPKIT_JWT = `header.${btoa(JSON.stringify({ origin: 'localhost' }))}.signature`;
  openGame('/play');
  await focusGuessMap();
  expect(screen.getByLabelText('Apple map')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Use MapTiler' }));
  expect(screen.getByLabelText('MapTiler map')).toBeInTheDocument();
});

test('the provider switch disappears once Apple Maps loads', async () => {
  process.env.REACT_APP_MAPKIT_JWT = `header.${btoa(JSON.stringify({ origin: 'localhost' }))}.signature`;
  openGame('/play');
  await focusGuessMap();
  expect(screen.getByRole('button', { name: 'Use MapTiler' })).toBeInTheDocument();

  act(() => mockAppleMapOnLoad());
  expect(screen.getByLabelText('Apple map')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Use MapTiler' })).not.toBeInTheDocument();
});

test('home makes today’s puzzle the primary action and reflects saved progress', () => {
  const day = DateTime.now().toISODate();
  const { unmount } = openGame('/');
  expect(screen.getByRole('heading', { level: 1, name: 'Daily puzzle' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Play today’s puzzle' })).toHaveAttribute('href', '/daily');
  unmount();

  localStorage.setItem('guesses', JSON.stringify({ [day]: [{ distance: 250000 }] }));
  const inProgress = openGame('/');
  expect(screen.getByRole('link', { name: 'Continue puzzle' })).toHaveAttribute('href', '/daily');
  expect(screen.getByText('250 km')).toBeInTheDocument();
  inProgress.unmount();

  localStorage.setItem('guesses', JSON.stringify({ [day]: [{ distance: 0 }] }));
  openGame('/');
  expect(screen.getByRole('link', { name: 'See today’s result' })).toHaveAttribute('href', '/daily');
  expect(screen.getByText('Found')).toBeInTheDocument();
});

test('Daily challenges share natively and open the same dated puzzle for comparison', async () => {
  const day = DateTime.now().minus({ days: 2 }).toISODate();
  const today = DateTime.now().toISODate();
  localStorage.setItem('hints', JSON.stringify({ [today]: 2 }));
  const originalShare = Object.getOwnPropertyDescriptor(navigator, 'share');
  const share = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'share', { configurable: true, value: share });

  try {
    openGame(`/daily?day=${day}&score=8750`);
    expect(await screen.findByText('8,750')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reveal continent (0/4 used)' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Reveal continent (0/4 used)' }));
    await guess('Pin the target');
    expect(screen.getByText('You beat the challenge!')).toBeInTheDocument();

    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Challenge a friend' })));
    expect(share).toHaveBeenCalledWith({
      title: `Mapl Daily · ${day}`,
      text: expect.stringContaining('Can you beat my score?'),
      url: expect.stringContaining(`/daily?day=${day}&score=9700`),
    });
    expect(share.mock.calls[0][0].text).not.toContain('Test City');
    expect(JSON.parse(localStorage.getItem('guesses'))[day]).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem('hints'))).toEqual({ [today]: 2, [day]: { count: 1, penalty: 300 } });
  } finally {
    if (originalShare) Object.defineProperty(navigator, 'share', originalShare);
    else delete navigator.share;
  }
});

test('Random challenge links reopen the same location and replay clears the challenge', async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    text: async () => [
      'city,city_ascii,lat,lng,country',
      'Other City,Other City,0,0,Other Country',
      'Test City,Test City,51,0,Test Country',
      'Third City,Third City,20,30,Third Country',
    ].join('\n'),
  });

  openGame('/play?seed=0.25&score=9800');
  expect(await screen.findByText('9,800')).toBeInTheDocument();
  await guess('Pin the target');
  expect(screen.getByRole('heading', { name: 'Test City, Test Country' })).toBeInTheDocument();
  expect(screen.getByText('You beat the challenge!')).toBeInTheDocument();
  expect(window.gtag.mock.calls).toEqual([
    ['event', 'challenge_open', { game_mode: 'random' }],
    ['event', 'challenge_first_guess', { game_mode: 'random' }],
    ['event', 'challenge_complete', { game_mode: 'random' }],
  ]);

  fireEvent.click(screen.getByRole('button', { name: 'Challenge a friend' }));
  expect(await screen.findByText(/score copied/i)).toBeInTheDocument();
  expect(writeText.mock.calls[0][0]).toContain('/play?seed=0.25&score=10000');
  expect(writeText.mock.calls[0][0]).not.toContain('Test City');

  fireEvent.click(screen.getByRole('button', { name: 'Play again' }));
  await focusGuessMap();
  expect(screen.getByRole('button', { name: 'Place a pin to guess' })).toBeDisabled();
  expect(screen.queryByText(/friend’s score/i)).not.toBeInTheDocument();
});

test('clue zoom can revisit unlocked views and advances after each guess', async () => {
  openGame('/play');
  expect(await screen.findByLabelText('Clue zoom')).toHaveTextContent('13');
  expect(screen.queryByRole('group', { name: 'Clue map zoom' })).not.toBeInTheDocument();

  await guess('Pin a distant guess');
  fireEvent.click(screen.getByRole('button', { name: 'Switch to clue map' }));
  expect(screen.getByLabelText('Clue zoom')).toHaveTextContent('10');
  expect(screen.queryByRole('button', { name: 'View 3' })).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'View 1' }));
  expect(screen.getByLabelText('Clue zoom')).toHaveTextContent('13');
  expect(screen.getByRole('button', { name: 'View 1' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('button', { name: 'Reveal continent (0/4 used)' })).toBeEnabled();

  await guess('Pin a distant guess');
  fireEvent.click(screen.getByRole('button', { name: 'Switch to clue map' }));
  expect(screen.getByLabelText('Clue zoom')).toHaveTextContent('7');
  fireEvent.click(screen.getByRole('button', { name: 'View 2' }));
  expect(screen.getByLabelText('Clue zoom')).toHaveTextContent('10');
  fireEvent.click(screen.getByRole('button', { name: 'View 3' }));
  expect(screen.getByLabelText('Clue zoom')).toHaveTextContent('7');
});

test('players can jump to the guess map and get instructions after placing a pin', async () => {
  openGame('/play');
  expect(await screen.findByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  await focusGuessMap();
  expect(screen.queryByRole('button', { name: 'Make a guess' })).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Your guess' })).toHaveFocus();
  expect(screen.getByText('Tap or click the map to place a pin.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Pin a distant guess' }));
  expect(screen.getByText('Move your pin or confirm.')).toBeInTheDocument();
});

test('Daily history counts a completed loss toward the streak and links to past results', () => {
  const yesterday = DateTime.now().minus({ days: 1 }).toISODate();
  const twoDaysAgo = DateTime.now().minus({ days: 2 }).toISODate();
  localStorage.setItem('guesses', JSON.stringify({
    [yesterday]: [{ distance: 100000 }, { distance: 110000 }, { distance: 120000 }],
    [twoDaysAgo]: [{ distance: 0 }],
  }));
  openGame('/');
  expect(screen.getByText('2 days in a row')).toBeInTheDocument();
  const completed = screen.getAllByRole('link', { name: /· Completed$/ });
  expect(completed).toHaveLength(2);
  expect(completed[1]).toHaveAttribute('href', `/daily?day=${yesterday}`);
});

test('a later visit within seven days of opening a challenge is counted once', () => {
  localStorage.setItem('mapl:first-challenge-day', DateTime.now().minus({ days: 2 }).toISODate());
  const visit = openGame('/');
  expect(window.gtag).toHaveBeenCalledWith('event', 'challenge_return_7d', {});
  visit.unmount();
  openGame('/');
  expect(window.gtag).toHaveBeenCalledTimes(1);
});

test('the Random menu link starts a fresh round from an active Random game', async () => {
  openGame('/play');
  await guess('Pin a distant guess');
  fireEvent.click(screen.getByRole('button', { name: 'Reveal continent (0/4 used)' }));
  expect(screen.getByLabelText('Clue zoom')).toHaveTextContent('10');

  fireEvent.click(screen.getByRole('link', { name: 'Random' }));
  expect(await screen.findByLabelText('Clue zoom')).toHaveTextContent('13');
  expect(screen.getByRole('button', { name: 'Reveal continent (0/4 used)' })).toBeEnabled();
  await focusGuessMap();
  expect(screen.getByRole('button', { name: 'Place a pin to guess' })).toBeDisabled();
  expect(global.fetch).toHaveBeenCalledTimes(2);
});

test('hints reveal the continent, a land neighbor, and finally the country and labeled map', async () => {
  openGame('/play');
  const map = await screen.findByLabelText('Clue zoom');
  const redactedStyle = map.getAttribute('data-map-style');
  expect(screen.getByText('Costs 300 points')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Reveal continent (0/4 used)' }));
  expect(screen.getByText('Europe')).toBeInTheDocument();
  expect(screen.getByText('Costs 600 points')).toBeInTheDocument();
  expect(map).toHaveAttribute('data-map-style', redactedStyle);

  fireEvent.click(screen.getByRole('button', { name: 'Reveal border or region (1/4 used)' }));
  expect(screen.getByText('Ireland')).toBeInTheDocument();
  expect(screen.getByText('Costs 1,000 points')).toBeInTheDocument();
  expect(map).toHaveAttribute('data-map-style', redactedStyle);

  fireEvent.click(screen.getByRole('button', { name: 'Reveal country (2/4 used)' }));
  expect(screen.getByText('Test Country')).toBeInTheDocument();
  expect(screen.getByText('Costs 1,500 points')).toBeInTheDocument();
  expect(map).toHaveAttribute('data-map-style', redactedStyle);

  fireEvent.click(screen.getByRole('button', { name: 'Reveal map names (3/4 used)' }));
  expect(map).toHaveAttribute('data-map-style', '6b3f0bd3-eea3-4016-8e88-77937de021ca');
  expect(screen.getByRole('button', { name: 'All hints revealed (4/4 used)' })).toBeDisabled();
  expect(screen.getByText('3,400 base points spent on hints')).toBeInTheDocument();
  await guess('Pin the target');
  expect(screen.getByText('6,600')).toBeInTheDocument();
});

test('a country without land borders gets a region for the second hint', async () => {
  global.fetch.mockResolvedValue({
    ok: true,
    text: async () => 'city,city_ascii,lat,lng,country,iso2\nTokyo,Tokyo,35.6897,139.6922,Japan,JP',
  });
  openGame('/daily');

  fireEvent.click(await screen.findByRole('button', { name: 'Reveal continent (0/4 used)' }));
  expect(screen.getByText('Asia')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Reveal border or region (1/4 used)' }));
  expect(screen.getByText('Eastern Asia')).toBeInTheDocument();
});

test('an older Daily save keeps its old hint cost when it buys a new hint', async () => {
  const day = DateTime.now().toISODate();
  localStorage.setItem('hints', JSON.stringify({ [day]: 2 }));
  openGame('/daily');

  fireEvent.click(await screen.findByRole('button', { name: 'Reveal country (2/4 used)' }));
  await guess('Pin the target');
  expect(screen.getByText('8,600')).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('hints'))[day]).toEqual({ count: 3, penalty: 1400 });
});

test('the map preview switches views while preserving the pending pin and clue zoom', async () => {
  openGame('/play');
  const clue = await screen.findByLabelText('Clue zoom');
  const guessMap = screen.getByLabelText('MapTiler map');
  expect(screen.getByRole('region', { name: 'Clue map' })).toHaveAttribute('data-active', 'true');
  expect(screen.queryByRole('button', { name: 'Pin the target' })).not.toBeInTheDocument();

  await guess('Pin a distant guess');
  expect(screen.getByRole('region', { name: 'Guess map' })).toHaveAttribute('data-active', 'true');
  fireEvent.click(within(guessMap).getByRole('button', { name: 'Pin the target' }));
  fireEvent.click(screen.getByRole('button', { name: 'Switch to clue map' }));

  expect(screen.getByRole('heading', { name: 'Clue map' })).toHaveFocus();
  expect(clue).toHaveTextContent('10');
  fireEvent.click(screen.getByRole('button', { name: 'View 1' }));
  await focusGuessMap();

  expect(screen.getByRole('heading', { name: 'Your guess' })).toHaveFocus();
  expect(screen.getByLabelText('MapTiler map')).toBe(guessMap);
  expect(screen.getByLabelText('Clue zoom')).toBe(clue);
  expect(clue).toHaveTextContent('13');
  fireEvent.click(screen.getByRole('button', { name: 'Confirm guess' }));
  expect(screen.getByRole('heading', { name: 'Test City, Test Country' })).toBeInTheDocument();
});

test('hint prices drop after each guess and only the price paid is deducted', async () => {
  openGame('/play');
  expect(await screen.findByText('Costs 300 points')).toBeInTheDocument();

  await guess('Pin a distant guess');
  expect(screen.getByText('Costs 240 points')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Reveal continent (0/4 used)' }));
  expect(screen.getByText('Costs 480 points')).toBeInTheDocument();

  await guess('Pin a distant guess');
  expect(screen.getByText('Costs 360 points')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Reveal border or region (1/4 used)' }));
  await guess('Pin the target');
  expect(screen.getByText('7,400')).toBeInTheDocument();
});

test('desktop shows the clue and guessing maps together', async () => {
  window.matchMedia.mockReturnValue({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  });
  openGame('/play');

  const clue = await screen.findByRole('region', { name: 'Clue map' });
  const guessMap = screen.getByRole('region', { name: 'Guess map' });
  expect(clue).toHaveAttribute('data-active', 'true');
  expect(guessMap).toHaveAttribute('data-active', 'true');
  expect(screen.queryByRole('button', { name: 'Switch to guess map' })).not.toBeInTheDocument();
  expect(within(guessMap).getByRole('button', { name: 'Pin the target' })).toBeEnabled();
});
