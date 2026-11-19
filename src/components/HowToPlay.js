import Modal from './Modal';

export default function HowToPlay({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 id="help-title">How to play</h2>
      <ol>
        <li>Study the clue map, then pin a location on the guess map and confirm.</li>
        <li>You have three guesses. After a miss, the clue map zooms out. You can also reveal a hint for 200 base points.</li>
        <li>Get within 50 km to finish early. Your closest guess, attempts, and hints determine your score out of 10,000.</li>
      </ol>
    </Modal>
  );
}
