import styled from 'styled-components'

export const Page = styled.div`
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  min-height: 100vh;
  background-color: var(--color-background);
`

export const Content = styled.main`
  display: flex;
  flex-direction: column;
  width: min(100%, 72rem);
  min-width: 0;
  min-height: 100vh;
  margin: 0 auto;
  padding: var(--space-8);
  text-align: left;
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
`

export const SummaryCard = styled.section`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-8);
  padding: var(--space-3) var(--space-6);
  background-color: var(--color-assistant-summary);
  border: var(--border-width) solid var(--color-text-primary);
  border-radius: 3rem;
  max-width: 72rem;
  min-height: 8rem;

  @media (max-width: 62rem) {
    grid-template-columns: auto 1fr;
  }
`

export const AssistantAvatar = styled.div`
  position: relative;
  width: 4.125rem;
  height: 4.125rem;

  img:first-child {
    position: absolute;
    inset: 0;
    width: 4.125rem;
    height: 4.125rem;
  }

  img:last-child {
    position: absolute;
    top: 1.12rem;
    left: 1.12rem;
    width: 1.81rem;
    height: 1.81rem;
  }
`

export const SummaryText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);

  > strong {
    color: var(--color-success);
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
  }

  p {
    max-width: 32rem;
    color: var(--color-text-primary);
    font-size: var(--font-size-lg);
  }
`

export const ReviewButton = styled.button`
  min-width: 10rem;
  @media (max-width: 62rem) { grid-column: 1 / -1; justify-self: end; }
  &:disabled { opacity: 0.55; cursor: not-allowed; }
  padding: var(--space-2) var(--space-5);
  color: var(--color-text-inverse);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  background: var(--gradient-brand);
  border: 0;
  border-radius: var(--radius-md);
`

export const Messages = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: var(--space-4);
  min-height: 12rem;
  max-height: 22rem;
  padding: var(--space-6) 0;
  overflow-y: auto;
`

export const Message = styled.article<{ $author: 'user' | 'assistant' }>`
  display: flex;
  align-self: ${({ $author }) => $author === 'user' ? 'flex-end' : 'flex-start'};
  align-items: flex-start;
  gap: var(--space-3);
  max-width: min(75%, 44rem);

  p {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    min-width: 0;
    padding: var(--space-3) var(--space-4);
    color: var(--color-text-primary);
    background: ${({ $author }) => $author === 'user' ? 'var(--color-brand-purple)' : 'var(--color-surface)'};
    border: var(--border-width) solid var(--color-border);
    border-radius: ${({ $author }) => $author === 'user' ? 'var(--radius-lg) var(--radius-sm) var(--radius-lg) var(--radius-lg)' : 'var(--radius-sm) var(--radius-lg) var(--radius-lg) var(--radius-lg)'};
  }
  html[data-high-contrast='true'] & p { background: var(--color-surface); }
`

export const MessageAvatar = styled.span`
  display: grid;
  flex: 0 0 2.5rem;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--gradient-brand-diagonal);
  border-radius: 50%;

  img {
    width: 1.4rem;
    height: 1.4rem;
  }
`

export const ComposerArea = styled.section`
  margin-top: auto;

  h2 {
    margin-bottom: var(--space-4);
    font-size: var(--font-size-lg);
  }
`

export const Suggestions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, max-content);
  gap: var(--space-2);
  margin-bottom: var(--space-4);

  button {
    max-height: 3rem;
    max-width: 20rem;
    padding: var(--space-2) var(--space-4);
    color: var(--color-text-primary);
    font-size: var(--font-size-xs);
    cursor: pointer;
    background: transparent;
    border: var(--border-width) solid var(--color-border-strong);
    border-radius: var(--radius-md);
  }

  button:hover:not(:disabled) {
    background-color: var(--color-surface);
    border-color: var(--color-brand-purple);
  }

  @media (max-width: 50rem) {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
`

export const Composer = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  max-height: 4.75rem;
  padding: var(--space-3) 5.5rem var(--space-3) var(--space-6);
  border: var(--border-width) solid #c4b5fd;
  border-radius: var(--radius-lg);

  label {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  textarea {
    width: 100%;
    max-height: 8rem;
    padding: 0;
    color: var(--color-text-primary);
    font: inherit;
    resize: none;
    background: transparent;
    border: 0;
    outline: 0;
  }

  &:focus-within { outline: 2px solid var(--color-focus); outline-offset: 3px; }

  textarea::placeholder {
    color: var(--color-text-muted);
  }

  button {
    position: absolute;
    right: var(--space-5);
    display: grid;
    place-items: center;
    width: 2.8rem;
    height: 2rem;
    cursor: pointer;
    background: var(--gradient-brand-diagonal);
    border: 0;
    border-radius: var(--radius-md);
  }

  button:disabled {
    cursor: not-allowed;
    filter: grayscale(0.7);
    opacity: 0.55;
  }

  button img {
    width: 2rem;
    height: 2rem;
  }
`

export const ConversationControls = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-5);
  label { font-size: var(--font-size-sm); }
  select, button {
    max-width: 100%;
    color: var(--color-text-primary);
    background: var(--color-surface);
    border: var(--border-width) solid var(--color-border-strong);
    border-radius: var(--radius-md);
    padding: var(--space-2) var(--space-3);
    font: inherit;
    font-size: var(--font-size-sm);
  }
  select { flex: 1; min-width: 10rem; }
  button { cursor: pointer; }
  :disabled { opacity: 0.55; cursor: not-allowed; }
`
