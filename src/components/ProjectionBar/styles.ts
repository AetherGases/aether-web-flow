import styled from 'styled-components'
interface BarProps { $dismissed: boolean }
export const Bar = styled.span<BarProps>`
  position: relative;
  display: block;
  width: 100%;
  min-width: 0;
  cursor: help;
  background: linear-gradient(180deg, var(--color-brand-purple), var(--color-brand-blue), var(--color-brand-green));
  border-radius: 4px 4px 0 0;
  transition: height var(--duration-normal) var(--easing-standard);

  &::after {
    display: none;
    position: absolute;
    bottom: calc(100% + var(--space-2));
    left: 50%;
    z-index: 2;
    padding: var(--space-1) var(--space-2);
    color: var(--color-text-primary);
    font-size: 0.65rem;
    white-space: nowrap;
    pointer-events: auto;
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
  &:focus::after {
    display: ${({ $dismissed }) => $dismissed ? 'none' : 'block'};
    opacity: 1;
    transform: translate(-50%, 0);
  }

  @media (max-width: 40rem) {
    &::after {
      position: fixed;
      bottom: var(--space-4);
      left: calc(var(--sidebar-width) + var(--space-4));
      right: var(--space-4);
      white-space: normal;
    }
    &:hover::after, &:focus::after { transform: none; }
  }
`
