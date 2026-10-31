import styled from 'styled-components'

export const Page = styled.main`
  display: grid;
  position: relative;
  overflow: hidden;
  min-height: 100dvh;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  @media (max-width: 64rem) { grid-template-columns: minmax(0, 1fr); }
  background: var(--color-background);
`

export const BackgroundShape = styled.svg`
  position: absolute;
  z-index: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  @media (max-width: 64rem) { display: none; }
`

export const Presentation = styled.section`
  position: relative;
  z-index: 1;
  display: grid;
  align-content: center;
  justify-items: center;
  min-width: 0;
  padding: var(--space-8);

  @media (max-width: 64rem) {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: var(--space-5);
    padding: var(--space-5) var(--space-8);
    background: var(--gradient-brand-diagonal);
  }
  @media (max-width: 40rem) {
    grid-template-columns: 1fr;
    min-height: 10rem;
    padding: var(--space-3) var(--space-5);
  }
`

export const Logo = styled.img`
  position: relative;
  z-index: 1;
  width: min(100%, 24rem);
  height: auto;
  @media (min-width: 64.01rem) { margin-bottom: -6rem; }
  @media (max-width: 64rem) { width: 8rem; }
`

export const PresentationContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  max-width: 28rem;
  text-align: left;
  h2, p { color: var(--color-text-primary); }
  @media (max-width: 75rem) { h2 { font-size: 1.6rem; } }
  @media (max-width: 64rem) {
    max-width: 36rem;
    gap: var(--space-2);
    h2 { font-size: 1.3rem; }
    p { font-size: var(--font-size-sm); }
  }
  @media (max-width: 40rem) { display: none; }
`

export const Authentication = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  background: transparent;

  min-width: 0;
  @media (max-width: 64rem) { padding: var(--space-8); align-items: flex-start; }
  @media (max-width: 40rem) { padding: var(--space-6) var(--space-5); }
`

export const AuthenticationContent = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 32rem;
`

export const Header = styled.header`
  text-align: start;

  h1 { font-size: clamp(1.75rem, 3vw, 2.5rem); overflow-wrap: anywhere; }
  p { margin-top: var(--space-2); }
`

export const ProfileList = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
  margin-top: var(--space-8);
  list-style: none;
  text-align: start;
`

export const ProfileCard = styled.article`
  min-height: 7rem;
  padding: var(--space-4);
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-xl);

  height: 100%;
  overflow-wrap: anywhere;
  h3 { font-size: clamp(1rem, 1.8vw, 1.5rem); }
  p { font-size: var(--font-size-sm); }
  img { width: 2rem; height: 2rem; object-fit: contain; }
  @media (max-width: 40rem) { padding: var(--space-3); border-radius: var(--radius-lg); }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  margin-top: var(--space-8);
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
`

export const Label = styled.label`
  text-align: start;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
`

export const Input = styled.input`
  width: 100%;
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-primary);
  background-color: var(--color-surface);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-md);

  min-width: 0;
  min-height: 2.75rem;
  font-size: 1rem;
`

export const SubmitButton = styled.button`
  width: 100%;
  padding: var(--space-2);
  margin-top: var(--space-4);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  background: var(--gradient-brand-diagonal);
  border: none;
  border-radius: var(--radius-md);

  min-height: 2.75rem;
`
