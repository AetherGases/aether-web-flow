import { css } from 'styled-components'

export const pageTitle = css`
  font-family: var(--font-family-primary);
  font-size: clamp(1.65rem, 3vw, 2.5rem);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  text-align: left;
  overflow-wrap: anywhere;
`

export const pageEyebrow = css`
  color: var(--color-brand-green);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-normal);
  margin: 0 0 var(--space-2);
  text-align: left;
`

export const pageContent = css`
  width: 100%;
  min-width: 0;
  padding: var(--space-8);
  text-align: left;
  @media (max-width: 48rem) { padding: var(--space-5) var(--space-4); }
`
