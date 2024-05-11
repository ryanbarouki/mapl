import styled from 'styled-components';

export const Button = styled.button`
  padding: 1rem;
  border-width: 0px;
  background-color: var(--primary-button-unpressed);
  color: var(--primary-text);
  font-size: x-large;
  cursor: pointer;
  &:active {
    background-color: var(--primary-button-pressed);
  }
  &:disabled {
    cursor: not-allowed;
    background-color: gray;
}
  font-family: inherit;
`;
