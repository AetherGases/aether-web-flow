import styled from 'styled-components'

interface FeedbackProps { $type: 'success' | 'error' }

export const Notification = styled.aside<FeedbackProps>`
  position: fixed;
  right: var(--space-4);
  top: var(--space-4);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: min(25rem, calc(100vw - 2 * var(--space-4)));
  padding: var(--space-4);
  color: var(--color-text-primary);
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border-strong);
  border-left: 4px solid ${({ $type }) => $type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'};
  border-radius: var(--radius-md);
  box-shadow: 0 8px 24px rgb(0 0 0 / 30%);

  p { flex: 1; min-width: 0; margin: 0; text-align: left; overflow-wrap: anywhere; }
`

export const Icon = styled.span<FeedbackProps>`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 1.75rem;
  height: 1.75rem;
  border: 1px solid currentColor;
  border-radius: 50%;
  color: ${({ $type }) => $type === 'success' ? 'var(--color-success)' : 'var(--color-danger)'};
  font-weight: bold;
`

export const CloseButton = styled.button`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  color: var(--color-text-primary);
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 1.5rem;

  &:hover { background: rgb(255 255 255 / 10%); }
  &:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }
`
