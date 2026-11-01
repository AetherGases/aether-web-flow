import styled from 'styled-components'
export const Bars = styled.ul`
  display: grid; gap: var(--space-5); margin: 0; padding: var(--space-2) 0; list-style: none;
  li { min-width: 0; }
`
export const BarHeading = styled.div`
  display: flex; justify-content: space-between; align-items: baseline; gap: var(--space-3);
  margin-bottom: var(--space-2); font-size: var(--font-size-sm);
  span { overflow-wrap: anywhere; }
  strong { flex-shrink: 0; font-weight: var(--font-weight-semibold); font-variant-numeric: tabular-nums; }
  @media (max-width: 30rem) { flex-wrap: wrap; gap: var(--space-1); }
`
export const Track = styled.div`
  height: .65rem; overflow: hidden; background: var(--color-surface-raised); border-radius: var(--radius-pill);
  span { display: block; height: 100%; background: linear-gradient(90deg, var(--color-brand-purple), var(--color-brand-blue), var(--color-brand-green)); border-radius: inherit; }
  html[data-high-contrast='true'] & { outline: 1px solid var(--color-border); }
`
export const ChartNote = styled.p`
  margin-top: var(--space-5); color: var(--color-text-secondary); font-size: var(--font-size-xs);
`
export const DonutLayout = styled.div`
  display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: var(--space-5); min-width: 0;
`
export const Donut = styled.div`
  position: relative; width: min(100%, 9rem); aspect-ratio: 1; flex: 0 0 min(100%, 9rem);
  svg { display: block; width: 100%; height: 100%; overflow: visible; }
  .center { position: absolute; inset: 28% 15%; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
  strong { font-size: clamp(.85rem, 1.2vw, 1.05rem); font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
  small { color: var(--color-text-secondary); }
`
export const Legend = styled.ul`
  display: grid; gap: var(--space-3); flex: 1 1 9rem; min-width: 0; padding: 0; margin: 0; list-style: none;
  li { display: grid; grid-template-columns: .55rem minmax(0, 1fr) auto; align-items: baseline; gap: var(--space-2); font-size: var(--font-size-sm); }
  i { width: .55rem; height: .55rem; border-radius: 50%; align-self: center; }
  span { overflow-wrap: anywhere; }
  strong { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); font-variant-numeric: tabular-nums; }
  small { display: block; color: var(--color-text-secondary); }
`
