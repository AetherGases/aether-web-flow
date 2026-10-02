import styled from 'styled-components'

interface PageProps {
  $highContrast: boolean
}

export const Page = styled.div<PageProps>`
  ${({ $highContrast }) =>
    $highContrast &&
    `
      --color-background: #000000;
      --color-surface: #080808;
      --color-surface-muted: #111111;
      --color-text-primary: #ffffff;
      --color-text-secondary: #ffffff;
      --color-text-muted: #e8e8e8;
      --color-border: rgba(255, 255, 255, 0.6);
      --color-border-strong: #ffffff;
    `}

  display: grid;
  min-height: 100dvh;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  background-color: var(--color-background);
`

export const Content = styled.main`
  width: min(100%, 72rem);
  min-width: 0;
  padding: clamp(var(--space-6), 5vh, var(--space-12)) var(--space-8);
  text-align: left;

  @media (max-width: 48rem) {
    padding: var(--space-6);
  }
`

export const Title = styled.h1`
  margin-bottom: var(--space-6);
  font-size: var(--font-size-3xl);
`

export const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(18rem, 0.9fr) minmax(22rem, 1.2fr);
  gap: var(--space-6);

  @media (max-width: 64rem) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.section`
  background-color: var(--color-surface-muted);
  border: var(--border-width) solid var(--color-border-strong);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
`

export const PersonalCard = styled(Card)`
  display: flex;
  align-items: center;
  grid-row: span 2;
  flex-direction: column;
  padding: var(--space-5);

  @media (max-width: 64rem) {
    grid-row: auto;
  }
`

export const Identity = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: var(--space-2);
  margin: var(--space-3) 0 var(--space-4);
  text-align: center;

  h2 {
    font-size: var(--font-size-lg);
  }
`

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
`

export const EditNameButton = styled.button`
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: 1.75rem;
  flex-shrink: 0;
  color: var(--color-text-secondary);
  border-radius: 50%;

  &:hover {
    color: var(--color-brand-green);
    background-color: rgb(255 255 255 / 10%);
  }
`

export const NameEditor = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
`

export const NameInput = styled.input`
  min-width: 0;
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-primary);
  text-align: center;
  background-color: rgb(13 0 38 / 35%);
  border: var(--border-width) solid var(--color-focus);
  border-radius: var(--radius-md);
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--color-brand-green);
  }
`

interface NameActionProps {
  $confirm?: boolean
}

export const NameAction = styled.button<NameActionProps>`
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  color: ${({ $confirm }) =>
    $confirm ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)'};
  background-color: ${({ $confirm }) =>
    $confirm ? 'var(--color-success)' : 'var(--color-surface)'};
  border-radius: 50%;
`

export const Fields = styled.div`
  display: grid;
  gap: var(--space-3);
  width: 100%;
`

export const InformationCard = styled(Card)`
  padding: var(--space-5) var(--space-6);

  h2 {
    margin-bottom: var(--space-3);
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-medium);
  }
`

export const DefinitionList = styled.dl`
  margin: 0;

  div {
    display: grid;
    grid-template-columns: minmax(7rem, 0.7fr) minmax(0, 1fr);
    gap: var(--space-4);
    padding: var(--space-3) 0;
    border-bottom: var(--border-width) solid var(--color-border);
  }

  div:last-child {
    border-bottom: 0;
  }

  dt {
    color: var(--color-text-muted);
  }

  dd {
    margin: 0;
    color: var(--color-text-primary);
    font-weight: var(--font-weight-semibold);
  }
`

export const PermissionList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
  list-style: none;

  li {
    display: grid;
    place-items: center;
    min-height: 2.5rem;
    padding: var(--space-2);
    color: var(--color-text-primary);
    font-size: var(--font-size-xs);
    text-align: center;
    background: rgb(183 108 244 / 55%);
    border: var(--border-width) solid rgb(255 255 255 / 35%);
    border-radius: var(--radius-sm);
  }

  @media (max-width: 48rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`

export const SettingsSection = styled.section`
  margin-top: var(--space-6);

  > h2 {
    margin-bottom: var(--space-4);
    font-size: var(--font-size-2xl);
  }
`

export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);

  @media (max-width: 64rem) {
    grid-template-columns: 1fr;
  }
`

interface SwitchProps {
  $active: boolean
}

export const Switch = styled.button<SwitchProps>`
  position: relative;
  width: 2.75rem;
  height: 1.5rem;
  flex-shrink: 0;
  background-color: ${({ $active }) =>
    $active ? 'var(--color-success)' : 'var(--color-text-muted)'};
  border-radius: var(--radius-pill);
  transition: background-color var(--duration-fast) var(--easing-standard);

  span {
    position: absolute;
    top: 0.1875rem;
    left: ${({ $active }) => ($active ? '1.4375rem' : '0.1875rem')};
    width: 1.125rem;
    height: 1.125rem;
    background-color: var(--color-text-primary);
    border-radius: 50%;
    transition: left var(--duration-fast) var(--easing-standard);
  }
`

