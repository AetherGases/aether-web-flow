import styled from 'styled-components'

export const Page = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  min-height: 100vh;
  background: var(--color-background);
`

export const Content = styled.main`
  padding: var(--space-8);
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
`

export const MetricsSection = styled.section`
  margin-top: var(--space-8);
`

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
  margin-top: var(--space-4);
`

export const FastAcessSection = styled.section`
  margin-top: var(--space-8);

  > p {
    text-align: left;
  }
`
export const FastAcessGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
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

export const FastAcessLink = styled.a`
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
`

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  align-items: stretch;
  gap: var(--space-4);
  margin-top: var(--space-8);
  width: 100%;
  max-width: 68rem;
  margin-inline: auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

export const PerformanceSection = styled.section`
  padding: var(--space-8);
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-xl);
`

export const PerformanceHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-6);

  h2 {
    color: var(--color-text-primary);
    font-size: var(--font-size-xl);
  }
`

export const AnalysisLink = styled.a`
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

export const ReductionValue = styled.span`
  display: block;
  margin-bottom: var(--space-2);
`

export const ProgressTrack = styled.div`
  width: 100%;
  height: 0.5rem;
  overflow: hidden;

  background-color: var(--color-surface-muted);
  border-radius: var(--radius-pill);
`

interface ProgressFillProps {
  $width: number
}

export const ProgressFill = styled.div<ProgressFillProps>`
  width: ${({ $width }) => `${$width}%`};
  height: 100%;

  background-color: var(--color-brand-green);
  border-radius: inherit;
`

type AlertLevel = 'info' | 'warning' | 'critical'

interface AlertLevelProps {
  $level: AlertLevel
}

export const AlertsSection = styled.section`
  padding: var(--space-8);

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
    font-size: var(--font-size-xl);
  }
`

export const ViewAllLink = styled.a`
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
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

export const AlertList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`

export const AlertItem = styled.li`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-3);

  min-height: 5rem;
  padding: var(--space-4) 0;

  border-bottom: var(--border-width) solid var(--color-border);

  &:last-child {
    border-bottom: none;
  }
`

export const AlertIcon = styled.span<AlertLevelProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 1.5rem;
  height: 1.5rem;

  color: ${({ $level }) => {
    if ($level === 'critical') {
      return 'var(--color-danger)'
    }

    if ($level === 'warning') {
      return '#f6b73c'
    }

    return 'var(--color-brand-purple)'
  }};

  font-size: var(--font-size-lg);
`

export const AlertContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  strong,
  span {
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-regular);
    line-height: var(--line-height-tight);
    text-align: left;
  }
`

export const SeverityBadge = styled.span<AlertLevelProps>`
  min-width: 5rem;
  padding: var(--space-2) var(--space-3);

  color: ${({ $level }) => {
    if ($level === 'critical') {
      return '#ff8ba1'
    }

    if ($level === 'warning') {
      return '#ffd16f'
    }

    return '#c995ff'
  }};

  font-size: var(--font-size-xs);
  text-align: center;

  background-color: ${({ $level }) => {
    if ($level === 'critical') {
      return 'rgb(239 71 111 / 20%)'
    }

    if ($level === 'warning') {
      return 'rgb(246 183 60 / 20%)'
    }

    return 'rgb(183 108 244 / 20%)'
  }};

  border-radius: var(--radius-md);
`