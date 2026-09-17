import styled from 'styled-components'

export const Page = styled.main`
  display: grid;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  grid-template-columns: 1fr 1fr;
  background: var(--color-background);
`

export const BackgroundShape = styled.svg`
  position: absolute;
  z-index: 0;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`

export const Presentation = styled.section`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-rows: auto 1fr;
  padding: var(--space-8);
`

export const Logo = styled.img`
  position: relative;
  z-index: 1;
  width: auto;
  height: auto;
  justify-self: start;
  align-self: start;
  margin-top: var(--space-16);
  margin-left: var(--space-12);
  scale: 0.8;
`

export const PresentationContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  max-width: 28rem;
  margin-top: -8rem;
  margin-left: var(--space-8);
  text-align: left;

  h2,
  p {
    color: var(--color-text-primary);
  }
`

export const Authentication = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  background: transparent;
`

export const AuthenticationContent = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 32rem;
`

export const Header = styled.header`
  text-align: start;
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
`
