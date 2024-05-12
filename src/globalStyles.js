import styled from 'styled-components';

export const Button = styled.button`
  padding: 1rem;
  border-width: 0px;
  background-color: var(--primary-button-unpressed);
  color: var(--primary-text);
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1;
  &:active {
    background-color: var(--primary-button-pressed);
  }
  &:disabled {
    cursor: not-allowed;
    background-color: gray;
}
  font-family: inherit;
`;
