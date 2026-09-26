import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Page = styled.main`
  display: grid;
  width: 100%;
  height: 100dvh;
  box-sizing: border-box;
  place-items: center;
  padding: clamp(1rem, 4vh, 3rem) var(--space-6);
  overflow: hidden;
  background-color: var(--color-background);
`

export const Content = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: min(100%, 84rem);
  height: 100%;
  font-family: "Comfortaa", sans-serif;
  text-align: center;
`

export const ErrorCode = styled.div`
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: auto auto auto;
  column-gap: clamp(0.3rem, 0,5vw, 1rem);

  span {
    color: var(--color-text-primary);
    font-family: "Coiny", cursive;
    font-size: clamp(7.5rem, 17vw, 15.625rem);
    font-weight: var(--font-weight-bold);
    line-height: 0.8;
    letter-spacing: 0;
    text-align: center;
  }
`

export const Illustration = styled.img`
  width: clamp(15rem, 24vw, 21.25rem);
  height: auto;
  margin-inline: 1rem;
  transform: translateX(1rem);
`

export const Title = styled.h1`
  width: 100%;
  max-width: 70rem;
  margin-top: clamp(var(--space-6), 2vh, 4.5rem);
  font-family: Comfortaa, var(--font-family-primary);
  font-size: clamp(2rem, 6vw, 5rem);
  font-weight: var(--font-weight-medium);
  line-height: 1.08;
  letter-spacing: 0.15em;
  text-transform: uppercase;

  span {
    display: block;
  }

  @media (max-width: 85rem) {
    font-size: clamp(2.5rem, 5.5vw, 4.5rem);
    letter-spacing: 0.1em;
  }

  @media (max-width: 40rem) {
    font-size: clamp(2rem, 9vw, 3.25rem);
    letter-spacing: 0.08em;
  }
`

export const Description = styled.p`
  margin-top: clamp(var(--space-4), 3vh, var(--space-8));
  color: var(--color-text-primary);
  font-family: Comfortaa, var(--font-family-primary);
  font-size: clamp(var(--font-size-md), 2vw, 2.2rem);
  font-weight: var(--font-weight-regular);
`

export const RetryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: min(100%, 24rem);
  min-height: 4.4rem;
  padding: var(--space-3) var(--space-8);
  margin-top: clamp(var(--space-6), 4vh, var(--space-10));
  margin-bottom: 20px;
  color: var(--color-text-primary);
  font-family: Comfortaa, var(--font-family-primary);
  font-size: clamp(var(--font-size-lg), 2.2vw, var(--font-size-2xl));
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  background: var(--gradient-brand-diagonal);
  border-radius: 1.25rem;
  transition: filter var(--duration-fast) var(--easing-standard),
    transform var(--duration-fast) var(--easing-standard);

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 40rem) {
    min-width: min(100%, 18rem);
    min-height: 3.5rem;
  }
`
