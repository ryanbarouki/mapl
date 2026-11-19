import Modal from './Modal';

export default function HowToPlay({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 id="help-title">How to play</h2>
      <ol>
        <li>Study the clue map, then pin a location on the guess map and confirm.</li>
        <li>You have three guesses. After a miss, the clue map zooms out. Later hints are more revealing, and hint prices drop after each guess. They unlock in order: continent, a bordering country or region, the country, and finally place names on the clue map.</li>
        <li>Get within 50 km to finish early. Your closest guess, attempts, and hints determine your score out of 10,000.</li>
      </ol>
    </Modal>
  );
}
