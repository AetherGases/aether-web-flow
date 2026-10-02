import styled from 'styled-components'

export const Card = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  min-height: 3.5rem;
  padding: var(--space-3) var(--space-5);
  background-color: var(--color-surface-muted);
  border: var(--border-width) solid var(--color-border-strong);
  border-radius: var(--radius-lg);

  strong {
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
  }

`

export const Value = styled.span`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  text-align: right;
`

export const Arrow = styled.span`
  width: 0.55rem;
  height: 0.55rem;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateY(-0.15rem) rotate(45deg);
`
