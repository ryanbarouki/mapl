import { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, children }) {
  const dialog = useRef(null);

  useEffect(() => {
    const element = dialog.current;
    if (isOpen && !element.open) element.showModal();
    if (!isOpen && element.open) element.close();
  }, [isOpen]);

  return (
    <dialog ref={dialog} className="site-dialog" aria-labelledby="help-title" onClose={onClose}>
      {isOpen && (
        <>
          {children}
          <form method="dialog">
            <button className="site-button" type="submit">Got it</button>
          </form>
        </>
      )}
    </dialog>
  );
}
