import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`;

const ModalContent = styled.div`
  background-color: var(--primary-background);
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  display: flex;
  flex-direction: column;
  justify-content: left;
  width: clamp(200px, 70svw, 500px);
  height: clamp(200px, 40svh, 500px);
  gap: 1rem;
  font-family: BRShape;
  overflow: scroll;
  overflow-x: hidden;
  scrollbar-width: none;
`;

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
