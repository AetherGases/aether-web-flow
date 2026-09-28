import styled from 'styled-components'

export const Page = styled.div`
  display: grid;
  min-height: 100dvh;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  background-color: var(--color-background);
`

export const Content = styled.main`
  min-width: 0;
  padding: clamp(var(--space-8), 7vh, var(--space-16)) var(--space-8);
  text-align: left;

  @media (max-width: 48rem) {
    padding: var(--space-6);
  }
`

export const Title = styled.h1`
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
`

export const Options = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(15rem, 27rem));
  gap: var(--space-16);
  margin-top: var(--space-12);

  @media (max-width: 64rem) {
    grid-template-columns: minmax(15rem, 27rem);
    gap: var(--space-6);
  }

  @media (max-width: 48rem) {
    grid-template-columns: minmax(0, 1fr);
    margin-top: var(--space-8);
  }
`

export const OptionButton = styled.button`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  min-height: 15rem;
  padding: var(--space-6);
  color: var(--color-text-primary);
  text-align: left;
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: border-color var(--duration-fast) var(--easing-standard),
    box-shadow var(--duration-fast) var(--easing-standard),
    transform var(--duration-fast) var(--easing-standard);

  &:hover {
    border-color: var(--color-brand-green);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 3px;
  }

  &:active {
    transform: translateY(0);
  }
`

export const OptionIconBox = styled.span`
  display: grid;
  place-items: center;
  width: 3.75rem;
  height: 3.5rem;
  margin-bottom: var(--space-5);
  overflow: hidden;
  background-color: var(--color-brand-blue);
  background-image: var(--gradient-brand-diagonal);
  border-radius: var(--radius-md);
  flex-shrink: 0;
`

export const OptionIcon = styled.img`
  display: block;
  width: 2.25rem;
  height: 2.25rem;
  object-fit: contain;
`

export const OptionText = styled.span`
  display: flex;
  flex-direction: column;

  strong {
    color: var(--color-text-primary);
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    line-height: var(--line-height-tight);
  }

  span {
    margin-top: var(--space-1);
    color: var(--color-text-secondary);
    font-size: var(--font-size-md);
    line-height: var(--line-height-normal);
  }
`
