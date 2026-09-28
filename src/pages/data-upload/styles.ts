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
  font-size: var(--font-size-2xl);
`

export const UploadPanel = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: min(100%, 63.25rem);
  min-height: 20.5rem;
  padding: var(--space-8);
  margin-top: var(--space-12);
  background-color: #332449;
  border: var(--border-width) solid var(--color-border-strong);
  border-radius: var(--radius-lg);

  @media (max-width: 48rem) {
    min-height: 18rem;
    margin-top: var(--space-8);
  }
`

export const UploadIcon = styled.div`
  display: grid;
  place-items: center;
  width: 4.7rem;
  height: 4.25rem;
  margin-bottom: var(--space-4);
  background-color: rgb(143 88 238 / 10%);
  border: var(--border-width) solid rgb(126 130 148 / 46%);
  border-radius: var(--radius-md);
`

export const UploadText = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: var(--space-8);
  text-align: center;

  strong {
    color: var(--color-text-primary);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
  }

  span {
    color: var(--color-text-secondary);
    font-size: var(--font-size-sm);
  }
`

export const FileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
`

export const SelectFileButton = styled.button`
  width: min(100%, 18.25rem);
  min-height: 2.7rem;
  padding: var(--space-2) var(--space-6);
  color: var(--color-text-primary);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  background: var(--gradient-brand);
  border-radius: var(--radius-md);
  transition: filter var(--duration-fast) var(--easing-standard),
    transform var(--duration-fast) var(--easing-standard);

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`

export const ErrorMessage = styled.p`
  margin-top: var(--space-4);
  color: var(--color-danger);
  font-size: var(--font-size-sm);
  text-align: center;
`
