export function loadAll(key) {
  const storedGuesses = localStorage.getItem(key);
  return storedGuesses != null ? JSON.parse(storedGuesses) : {};
}

export function save(dayString, key, to_save) {
  const allGuesses = loadAll(key);
  localStorage.setItem(
    key,
    JSON.stringify({
      ...allGuesses,
      [dayString]: to_save,
    })
  );
}

export function saveValue(dayString, key, value) {
  localStorage.setItem(
    key,
    JSON.stringify({
      [dayString]: value,
    })
  );
}
