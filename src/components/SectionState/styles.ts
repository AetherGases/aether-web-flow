import styled from 'styled-components'

export const StatePanel = styled.div`
  padding-block: var(--space-4);
  p, strong { color: var(--color-text-secondary); font-size: var(--font-size-sm); text-align: left; }
  p { margin: var(--space-2) 0; }
`

export const RetryButton = styled.button`
  margin-top: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: transparent;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font: inherit;
  font-size: var(--font-size-sm);
  cursor: pointer;
  &:hover:not(:disabled) { border-color: var(--color-brand-green); }
  &:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 3px; }
  &:disabled { opacity: 0.6; cursor: wait; }
`

export const Skeleton = styled.span`
  display: block;
  width: 75%;
  height: 0.875rem;
  margin-block: var(--space-3);
  border-radius: var(--radius-sm);
  background: var(--color-surface-muted);
  animation: overview-loading 1.5s ease-in-out infinite alternate;
  @keyframes overview-loading { from { opacity: 0.5; } to { opacity: 1; } }
  @media (prefers-reduced-motion: reduce) { animation: none; }
`
