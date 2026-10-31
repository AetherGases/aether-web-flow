import styled from 'styled-components'
export { Page, Content, Header, FastAcessSection, FastAcessGrid, FastAcessDiv, FastAcessContent, FastAcessLink, Icon, MetricsSection, MetricsGrid, PerformanceTable } from '../overview/styles'

export const SectionHeading = styled.h2`
  font-size: var(--font-size-xl);
  text-align: left;
`
export const ScopeNote = styled.p`
  margin-top: var(--space-2);
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  text-align: left;
`
export const History = styled.section`
  margin-top: var(--space-8);
  padding: var(--space-6);
  overflow-x: auto;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  table { margin-top: var(--space-4); }
  td { text-align: left; overflow-wrap: anywhere; }
`
