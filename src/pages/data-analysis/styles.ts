import styled from 'styled-components'
import { pageContent, pageTitle, pageEyebrow } from '../../styles/page'
export const Page = styled.div`
  display: grid; min-height: 100dvh; grid-template-columns: var(--sidebar-width) minmax(0, 1fr); background: var(--color-background);
  @media print { display: block; min-height: 0; background: white; > :not([data-analysis-report]) { display: none !important; } }
`
export const Content = styled.main`${pageContent} display: grid; align-content: start; gap: var(--space-6);`
export const Eyebrow = styled.p`${pageEyebrow}`
export const Title = styled.h1`${pageTitle}`
export const Header = styled.header`
  display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-5);
  p:last-child { margin: var(--space-2) 0 0; color: var(--color-text-secondary); overflow-wrap: anywhere; }
`
export const Period = styled.div`
  display: grid; gap: var(--space-1); padding: var(--space-3) var(--space-5); border: 1px solid var(--color-border); border-radius: var(--radius-md);
  color: var(--color-text-secondary); font-size: var(--font-size-sm);
`
export const Card = styled.section`
  min-width: 0; padding: var(--space-6); border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-lg); background: var(--color-surface); text-align: left;
  h2 { font-size: var(--font-size-lg); margin: 0 0 var(--space-4); font-weight: var(--font-weight-semibold); }
  h3 { font-size: var(--font-size-md); font-weight: var(--font-weight-semibold); margin: var(--space-4) 0 var(--space-2); }
  p { white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.65; }
  dl { display: grid; gap: var(--space-4); margin-top: var(--space-4); }
  dt { font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-bottom: var(--space-1); }
  dd { margin: 0; overflow-wrap: anywhere; }
  details { margin-top: var(--space-5); }
  summary { cursor: pointer; font-weight: var(--font-weight-semibold); margin-bottom: var(--space-3); }
  @media(max-width: 30rem) { padding: var(--space-4); }
`
export const Metrics = styled.div`
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--space-4);
  @media(max-width: 80rem) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media(max-width: 35rem) { grid-template-columns: 1fr; }
`
export const Metric = styled(Card)`
  display: flex; gap: var(--space-4); align-items: flex-start; padding: var(--space-5);
  .icon { width: 2.5rem; height: 2.5rem; border-radius: var(--radius-md); background: var(--gradient-brand-diagonal); display: grid; place-items: center; flex-shrink: 0; color: var(--color-on-brand); }
  .value { min-width: 0; }
  .value > span { display: block; min-height: 2.8em; }
  span { font-size: var(--font-size-sm); }
  strong { display: block; margin-top: var(--space-2); font-size: clamp(1.3rem, 2vw, 1.85rem); line-height: 1.2; font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
  small { display: block; margin-top: var(--space-1); color: var(--color-text-secondary); font-size: var(--font-size-xs); }
`
export const Charts = styled.div`
  display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr); gap: var(--space-5);
  @media(max-width: 64rem) { grid-template-columns: 1fr; }
`
export const LowerGrid = styled.div`
  display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr) minmax(0, .9fr); gap: var(--space-5);
  @media(max-width: 75rem) { grid-template-columns: repeat(2, minmax(0, 1fr)); > :last-child { grid-column: 1 / -1; } }
  @media(max-width: 48rem) { grid-template-columns: 1fr; }
`
export const Actions = styled.div`
  display: flex; flex-wrap: wrap; gap: var(--space-3); align-items: center;
  a, button { color: var(--color-text-primary); padding: var(--space-3) var(--space-5); border: 1px solid var(--color-border-strong); border-radius: var(--radius-md); background: var(--color-surface); text-decoration: none; font: inherit; }
  a:hover, button:hover:not(:disabled) { border-color: var(--color-brand-green); }
  .primary { background: var(--gradient-brand); color: var(--color-on-brand); border-color: transparent; font-weight: var(--font-weight-semibold); }
`
export const ReportActions = styled(Actions)`
  display: grid; grid-template-columns: minmax(0, 1fr); align-content: start; > * { min-width: 0; width: 100%; text-align: center; overflow-wrap: anywhere; }
  p { color: var(--color-text-secondary); font-size: var(--font-size-xs); text-align: left; }
`
export const Caption = styled.p`color: var(--color-text-secondary); font-size: var(--font-size-sm); margin: calc(-1 * var(--space-2)) 0 var(--space-5);`
export const Recommendations = styled.div`
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-4); margin-top: var(--space-4);
  > div { padding: var(--space-4); background: var(--color-surface-raised); border: 1px solid var(--color-border); border-radius: var(--radius-md); }
  strong { display: block; margin-bottom: var(--space-2); }
  @media(max-width: 48rem) { grid-template-columns: 1fr; }
`
export const Table = styled.div`
  max-width: 100%; overflow-x: auto;
  table { width: 100%; border-collapse: collapse; text-align: left; }
  th, td { padding: var(--space-3); border-bottom: 1px solid var(--color-border); overflow-wrap: anywhere; }
`
