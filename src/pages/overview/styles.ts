import { pageContent, pageTitle, pageEyebrow } from '../../styles/page'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Page = styled.div`
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  min-height: 100vh;
  background: var(--color-background);
`

export const Content = styled.main`
  min-width: 0;
  padding: var(--space-8);

  ${pageContent}
`

export const Header = styled.header`
  p, h1, h4 {
    text-align: left;
  }

  h4{
    color: var(--color-brand-green);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-1);
  }

  h1 { ${pageTitle} }
  h4 { ${pageEyebrow} }
`

export const MetricsSection = styled.section`
  margin-top: var(--space-8);
`

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
  margin-top: var(--space-4);
  @media (max-width: 75rem) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 45rem) { grid-template-columns: 1fr; }
`

export const FastAcessSection = styled.section`
  margin-top: var(--space-8);

  > p {
    text-align: left;
  }
`
export const FastAcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr));
  gap: var(--space-4);
  margin-top: var(--space-4);
`

export const FastAcessDiv = styled.article`
  display: flex;
  align-items: center;
  gap: var(--space-4);

  padding: var(--space-5);
  background-color: var(--color-surface);
  border-radius: var(--radius-md);
`

export const FastAcessContent = styled.div`
  min-width: 0;
  overflow-wrap: anywhere;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);

  p {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    text-align: left;
  }
`

export const FastAcessLink = styled(Link)`
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;

  &:hover {
    color: var(--color-brand-green);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 3px;
    border-radius: var(--radius-sm);
  }
`

export const Icon = styled.img`
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  padding: var(--space-2);

  background: var(--gradient-brand-diagonal);
  border-radius: var(--radius-md);
  html[data-high-contrast='true'] & {
    outline: 1px solid var(--color-border-strong);
  }
`

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
  align-items: stretch;
  gap: var(--space-4);
  margin-top: var(--space-8);
  width: 100%;

  @media (max-width: 75rem) {
    grid-template-columns: 1fr;
  }
`

export const PerformanceSection = styled.section`
  min-width: 0;
  padding: clamp(var(--space-4), 2vw, var(--space-6));
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-xl);
`

export const PerformanceHeader = styled.header`
  flex-wrap: wrap;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);

  h2 {
    color: var(--color-text-primary);
    font-size: 1.125rem;
    line-height: var(--line-height-tight);
    text-align: left;
  }
`

export const AnalysisLink = styled(Link)`
  flex-shrink: 0;
  white-space: nowrap;
  padding: var(--space-3) var(--space-4);

  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  text-decoration: none;

  border: var(--border-width) solid var(--color-border-strong);
  border-radius: var(--radius-md);

  transition:
    border-color var(--duration-fast) var(--easing-standard),
    color var(--duration-fast) var(--easing-standard);

  &:hover {
    color: var(--color-brand-green);
    border-color: var(--color-brand-green);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 3px;
  }
`

export const PerformanceTable = styled.table`
  th, td { overflow-wrap: anywhere; font-size: var(--font-size-sm); }
  @media (max-width: 40rem) { th, td { padding: var(--space-2) var(--space-1); } }
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  th {
    padding: var(--space-3);
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-regular);
    text-align: left;
    text-transform: uppercase;
  }

  td {
    padding: var(--space-3);
    color: var(--color-text-primary);
    vertical-align: middle;
  }

  th:first-child,
  td:first-child {
    width: 45%;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 28%;
  }

  th:last-child,
  td:last-child {
    width: 27%;
  }
`

export const PlantIdentification = styled.div`
  min-width: 0;
  span:last-child { min-width: 0; overflow-wrap: anywhere; }
  @media (max-width: 40rem) { flex-wrap: wrap; }
  display: flex;
  align-items: center;
  gap: var(--space-2);
`

export const Position = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: 2rem;
  height: 2rem;

  color: var(--color-text-primary);
  border: 2px solid var(--color-text-primary);
  border-radius: 50%;
`

export const AlertsSection = styled.section`
  min-width: 0;
  padding: clamp(var(--space-4), 2vw, var(--space-6));

  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-xl);
`

export const AlertsHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);

  padding-bottom: var(--space-4);
  border-bottom: var(--border-width) solid var(--color-border);

  h2 {
    color: var(--color-text-primary);
    font-size: 1.125rem;
    line-height: var(--line-height-tight);
    text-align: left;
  }
`

// Estados adicionados dentro dos blocos existentes, sem alterar o layout da develop.
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
