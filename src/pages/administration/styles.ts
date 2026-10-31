export { Page, Content, Eyebrow, Title, Description } from '../data-analysis-choice/styles'

import styled from 'styled-components'

export const LaunchPanel = styled.section`
  margin-top: var(--space-6);
  padding: var(--space-6);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  h2 { font-size: var(--font-size-xl); }
  p { margin-block: var(--space-3) var(--space-5); }
`
const launchStyle = `
  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-3) var(--space-5);
  color: var(--color-text-primary);
  background: var(--color-surface-raised);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  font: inherit;
  font-weight: var(--font-weight-semibold);
`
export const LaunchLink = styled.a`${launchStyle}`
export const LaunchButton = styled.button`
  ${launchStyle}
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`


