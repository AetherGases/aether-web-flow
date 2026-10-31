import { pageContent, pageTitle, pageEyebrow } from '../../styles/page'
import styled from 'styled-components'

const card = `
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
`

export const Page = styled.div`
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  min-height: 100vh;
  background-color: var(--color-background);

  @media print {
    display: block;
    min-height: 0;
    background: #fff;
    > :not([data-calculator-report]) { display: none; }
  }
`

export const Content = styled.main`
  width: min(100%, 72rem);
  min-width: 0;
  margin: 0 auto;
  padding: var(--space-8);
  text-align: left;

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
    margin-bottom: var(--space-12);

  h1 { ${pageTitle} }
  h4 { ${pageEyebrow} }
`

export const CalculatorGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(20rem, 1.1fr) minmax(20rem, 1fr);
  gap: var(--space-12);
  align-items: start;

  @media (max-width: 64rem) {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
`

export const FormCard = styled.form`
  ${card}
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  min-height: 27rem;
  padding: var(--space-8);
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-3);

  label,
  > span {
    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
  }
`

export const NumberInput = styled.input`
  width: 100%;
  padding: var(--space-3) var(--space-4);
  color: var(--color-text-primary);
  font: inherit;
  font-weight: var(--font-weight-semibold);
  background-color: var(--color-background);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);
`

export const RangeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  output {
    color: var(--color-success);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
  }
`

export const RangeInput = styled.input<{ $progress: number }>`
  width: 100%;
  height: 0.35rem;
  cursor: pointer;
  appearance: none;
  background: linear-gradient(
    90deg,
    var(--color-brand-purple) 0%,
    var(--color-brand-purple) ${({ $progress }) => $progress}%,
    var(--color-range-track) ${({ $progress }) => $progress}%,
    var(--color-range-track) 100%
  );
  border-radius: var(--radius-pill);

  &::-webkit-slider-thumb {
    width: 1rem;
    height: 1rem;
    cursor: grab;
    appearance: none;
    background-color: var(--color-brand-purple);
    border: 3px solid var(--color-surface);
    border-radius: 50%;
  }

  &::-moz-range-thumb {
    width: 0.75rem;
    height: 0.75rem;
    cursor: grab;
    background-color: var(--color-brand-purple);
    border: 3px solid var(--color-surface);
    border-radius: 50%;
  }
`

export const PeriodOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
`

export const PeriodButton = styled.button<{ $active: boolean }>`
  min-width: 4rem;
  padding: var(--space-2) var(--space-4);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  background: ${({ $active }) => $active ? 'var(--gradient-brand)' : 'var(--color-background)'};
  border: var(--border-width) solid ${({ $active }) => $active ? 'transparent' : 'var(--color-border)'};
  border-radius: var(--radius-md);
`

export const ExportButton = styled.button`
  width: 100%;
  margin-top: var(--space-2);
  padding: var(--space-3);
  color: var(--color-text-inverse);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  background-color: var(--color-export-background, #13bd86);
  border: 0;
  border-radius: var(--radius-md);

  &:hover:not(:disabled) { filter: brightness(1.08); }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
`

export const Results = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`

export const TotalSavingsCard = styled.article`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-6);
  color: var(--color-text-primary);
  background: var(--gradient-brand);
  border-radius: var(--radius-md);

  span { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); }
  strong { font-size: var(--font-size-3xl); line-height: var(--line-height-tight); }
`

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);

  @media (max-width: 34rem) { grid-template-columns: 1fr; }
`

export const SummaryCard = styled.article`
  ${card}
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);

  span { font-size: var(--font-size-sm); font-weight: var(--font-weight-semibold); }
  strong { font-size: var(--font-size-xl); }

  &:first-child strong { color: var(--color-success); }
`

export const ProjectionCard = styled.article`
  ${card}
  min-height: 15rem;
  padding: var(--space-5);
`

export const ProjectionHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);

  h2 { font-size: var(--font-size-sm); }
  p { margin-top: var(--space-1); color: var(--color-text-muted); font-size: var(--font-size-xs); }
  > strong { color: var(--color-success); font-size: var(--font-size-sm); }
`

export const Bars = styled.div`
  display: flex;
  gap: clamp(2px, 0.35vw, 6px);
  height: 10.5rem;
  margin-top: var(--space-5);
  overflow: visible;
`

export const BarColumn = styled.div`
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  flex: 1 1 0;
  gap: var(--space-2);
  min-width: 0;
`

export const BarTrack = styled.div`
  display: flex;
  align-items: flex-end;
  height: 8.5rem;
  border-bottom: var(--border-width) solid var(--color-border);
`

export const Bar = styled.span`
  position: relative;
  display: block;
  width: 100%;
  min-width: 0;
  cursor: help;
  background: linear-gradient(180deg, var(--color-brand-purple), var(--color-brand-blue), var(--color-brand-green));
  border-radius: 4px 4px 0 0;
  transition: height var(--duration-normal) var(--easing-standard);

  &::after {
    position: absolute;
    bottom: calc(100% + var(--space-2));
    left: 50%;
    z-index: 2;
    padding: var(--space-1) var(--space-2);
    color: var(--color-text-primary);
    font-size: 0.65rem;
    white-space: nowrap;
    pointer-events: none;
    content: attr(data-tooltip);
    background-color: var(--color-background-deep);
    border: var(--border-width) solid var(--color-border);
    border-radius: var(--radius-sm);
    opacity: 0;
    transform: translate(-50%, var(--space-1));
    transition:
      opacity var(--duration-fast) var(--easing-standard),
      transform var(--duration-fast) var(--easing-standard);
  }

  &:hover::after,
  &:focus-visible::after {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`

export const BarLabel = styled.span`
  display: flex;
  justify-content: center;
  min-width: 0;
  min-height: 1em;
  color: var(--color-text-muted);
  font-size: 0.62rem;
  text-align: center;
  white-space: nowrap;
`
