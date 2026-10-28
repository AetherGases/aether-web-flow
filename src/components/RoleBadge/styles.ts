import styled from 'styled-components'

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  background-color: var(--color-badge-background);
  border: var(--border-width) solid var(--color-badge-border);
  border-radius: var(--radius-pill);
`
