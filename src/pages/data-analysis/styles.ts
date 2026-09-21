import styled from 'styled-components'

const panel = `
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-lg);
`

export const Page = styled.div`
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  min-height: 100vh;
  background-color: var(--color-background);
`

export const Content = styled.main`
  min-width: 0;
  padding: var(--space-6);
  text-align: left;
`

export const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-8);
  margin-bottom: var(--space-6);

  @media (max-width: 75rem) { align-items: stretch; flex-direction: column; }
`

export const TitleArea = styled.div`
  h1 { display: flex; align-items: center; gap: var(--space-2); margin-top: var(--space-2); font-size: var(--font-size-2xl); }
  h1 span { color: var(--color-success); font-size: var(--font-size-xl); }
`

export const Breadcrumb = styled.p`
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
`

export const Filters = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(12rem, 1fr));
  gap: var(--space-4);
  width: min(100%, 34rem);
  @media (max-width: 40rem) { grid-template-columns: 1fr; }
`

export const Filter = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: 2.75rem;
  padding: 0 var(--space-4);
  background-color: rgb(255 255 255 / 2%);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
  &:focus-within { border-color: var(--color-focus); outline: 2px solid rgb(72 226 155 / 18%); }
`

export const FilterIcon = styled.span`
  flex-shrink: 0;
  width: 0.7rem;
  height: 0.7rem;
  border: 1px solid var(--color-text-primary);
  &::after { content: ''; display: block; width: 0.2rem; height: 0.2rem; margin: 0.18rem; background-color: var(--color-text-primary); }
`

export const Select = styled.select`
  width: 100%;
  color: var(--color-text-primary);
  font: inherit;
  font-size: var(--font-size-sm);
  cursor: pointer;
  appearance: none;
  background-color: transparent;
  border: 0;
  outline: 0;
  option { color: var(--color-text-primary); background-color: var(--color-surface); }
`

export const Chevron = styled.span`
  flex-shrink: 0;
  color: var(--color-text-secondary);
  pointer-events: none;
`

export const MetricsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-4);
  margin-bottom: var(--space-4);
  @media (max-width: 75rem) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (max-width: 40rem) { grid-template-columns: 1fr; }
`

export const MetricCard = styled.article`
  ${panel}
  display: flex;
  align-items: center;
  gap: var(--space-4);
  min-width: 0;
  padding: var(--space-5);
`

export const MetricIcon = styled.span`
  display: grid;
  flex: 0 0 3.5rem;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  font-size: var(--font-size-xl);
  background: var(--gradient-brand-diagonal);
  border-radius: var(--radius-md);
`

export const MetricContent = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  > span { font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); }
  > strong { margin: var(--space-1) 0; font-size: var(--font-size-xl); line-height: var(--line-height-tight); }
`

export const Variation = styled.small<{ $status: 'positive' | 'negative' }>`
  color: ${({ $status }) => $status === 'positive' ? 'var(--color-success)' : 'var(--color-danger)'};
  font-size: 0.68rem;
  white-space: nowrap;
`

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2.3fr) minmax(16rem, 1fr);
  gap: var(--space-4);
  @media (max-width: 68rem) { grid-template-columns: 1fr; }
`

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
`

export const RightColumn = styled.aside`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`

export const ChartCard = styled.section`
  ${panel}
  padding: var(--space-5);
  box-shadow: 0 0 0 2px #168bd8;
`

export const CardHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  h2 { font-size: var(--font-size-md); }
  p { margin-top: var(--space-1); color: var(--color-text-muted); font-size: var(--font-size-xs); }
`

export const ChartControls = styled.div`
  display: flex;
  gap: var(--space-2);
  button { min-width: 5rem; padding: var(--space-2) var(--space-4); color: var(--color-text-secondary); cursor: pointer; background: transparent; border: var(--border-width) solid var(--color-border); border-radius: var(--radius-md); }
`

export const Chart = styled.div`
  margin-top: var(--space-4);
  svg { display: block; width: 100%; height: 18rem; overflow: visible; }
  .grid-lines line { stroke: var(--color-surface-muted); stroke-width: 1; }
  .area { fill: url(#chart-fill); }
  .trend { fill: none; stroke: var(--color-brand-purple); stroke-width: 2; stroke-dasharray: 7 7; }
  .consumption { fill: none; stroke: var(--color-success); stroke-linejoin: round; stroke-width: 3; }
`

export const ChartLabels = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--color-text-secondary);
  font-size: 0.68rem;
`

export const ChartNote = styled.p`
  margin-top: var(--space-5);
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  background-color: rgb(255 255 255 / 3%);
  border-radius: var(--radius-md);
`

export const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(13rem, 1fr);
  gap: var(--space-4);
  @media (max-width: 50rem) { grid-template-columns: 1fr; }
`

export const CostCard = styled.section`
  ${panel}
  padding: var(--space-5);
  h2 { font-size: var(--font-size-md); }
`

export const CostContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-10);
  min-height: 9.5rem;
`

export const Donut = styled.div`
  display: grid;
  place-items: center;
  width: 7rem;
  height: 7rem;
  background: conic-gradient(#48e29b 0 36%, #b76cf4 36% 65%, #7f9ee8 65% 80%, #f2bb45 80% 100%);
  border-radius: 50%;
  div { display: flex; align-items: center; justify-content: center; flex-direction: column; width: 4.6rem; height: 4.6rem; background-color: var(--color-surface); border-radius: 50%; }
  strong { font-size: var(--font-size-xs); }
  span { color: var(--color-text-muted); font-size: 0.65rem; }
`

export const Legend = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  min-width: 12rem;
  margin: 0;
  padding: 0;
  list-style: none;
  li { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: var(--space-2); color: var(--color-text-secondary); font-size: var(--font-size-xs); }
  i { width: 0.7rem; height: 0.7rem; border-radius: 50%; }
  strong { color: var(--color-text-primary); font-weight: var(--font-weight-regular); }
`

export const AppliedFiltersCard = styled.section`
  ${panel}
  padding: var(--space-5);
  align-items: flex-start;
  h2 { font-size: var(--font-size-md); }
  dl { display: flex; flex-direction: column; gap: var(--space-4); margin-top: var(--space-5); }
  dt { color: var(--color-text-muted); font-size: 0.65rem; text-transform: uppercase; }
  dd { margin: 0; color: var(--color-text-secondary); font-size: var(--font-size-xs); }
`

export const InsightCard = styled.section`
  ${panel}
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-5);
  h2 { font-size: var(--font-size-md); }
  h3 { font-size: var(--font-size-xs); }
  p { color: var(--color-text-muted); font-size: var(--font-size-xs); }
`

export const InsightTitle = styled.p`
  color: var(--color-text-primary) !important;
  font-size: var(--font-size-xl) !important;
  font-weight: var(--font-weight-bold);
  strong { color: var(--color-danger); }
`

export const Divider = styled.hr`
  width: 100%;
  border: 0;
  border-top: var(--border-width) solid var(--color-surface-muted);
`

export const ImpactBox = styled.div`
  padding: var(--space-4);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
  span { display: block; color: var(--color-text-muted); font-size: var(--font-size-xs); }
  strong { color: var(--color-danger); font-size: var(--font-size-xl); }
`

export const PrimaryButton = styled.button`
  width: 100%;
  padding: var(--space-3);
  color: var(--color-text-inverse);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  background: var(--gradient-brand);
  border: 0;
  border-radius: var(--radius-md);
`

export const ActionsCard = styled.section`
  ${panel}
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-5);
  p { color: var(--color-text-muted); font-size: var(--font-size-xs); }
`

export const SecondaryButton = styled.button`
  width: 100%;
  padding: var(--space-3);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  background: transparent;
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
`
