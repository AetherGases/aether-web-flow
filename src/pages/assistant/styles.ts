import { pageContent, pageTitle, pageEyebrow } from '../../styles/page'
import styled from 'styled-components'

export const Page = styled.div`
  display: grid;
  grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
  height: 100dvh;
  min-height: 0;
  overflow: hidden;
  background: var(--color-background);
`

export const Content = styled.main`
  display: flex;
  flex-direction: column;
  width: min(100%, 72rem);
  height: 100dvh;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  margin: 0 auto;
  padding: var(--space-6) var(--space-8) max(var(--space-4), env(safe-area-inset-bottom));
  text-align: left;

  @media (max-width: 62rem) { padding-inline: var(--space-4); }
  @media (max-height: 40rem) { padding-top: var(--space-3); }

  ${pageContent}
`

export const Header = styled.header`
  flex-shrink: 0;
  margin-bottom: var(--space-4);
  h4 { color: var(--color-brand-green); font-size: var(--font-size-sm); margin: 0 0 var(--space-1); }
  h1 { font-size: clamp(1.5rem, 3vw, 2.5rem); text-align: left; }
  @media (max-height: 40rem) { h4 { display: none; } margin-bottom: var(--space-2); }

  h1 { ${pageTitle} }
  h4 { ${pageEyebrow} }
`

export const ConversationControls = styled.nav`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: var(--space-2);
  padding-bottom: var(--space-3);
  border-bottom: var(--border-width) solid var(--color-border);

  button, select { min-height: 2.5rem; font: inherit; font-size: var(--font-size-sm); border-radius: var(--radius-md); }
  button:disabled, select:disabled { opacity: 0.5; cursor: not-allowed; }
  button:focus-visible, select:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }
  @media (max-width: 50rem) { flex-wrap: wrap; }
`

export const NewConversationButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  flex-shrink: 0;
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-secondary);
  background: transparent;
  border: var(--border-width) solid transparent;
  cursor: pointer;
  span { color: var(--color-brand-green); font-size: 1.3rem; line-height: 1; }
  &:hover:not(:disabled) { color: var(--color-text-primary); background: var(--color-surface); }
`

export const ConversationPicker = styled.div`
  min-width: 0;
  max-width: 22rem;
  flex: 1;
  margin-left: auto;
  label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
`

export const SelectWrapper = styled.div`
  position: relative;
  select {
    width: 100%;
    padding: var(--space-2) 2rem var(--space-2) var(--space-3);
    color: var(--color-text-secondary);
    background: transparent;
    border: var(--border-width) solid transparent;
    appearance: none;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  select:hover:not(:disabled) { color: var(--color-text-primary); background: var(--color-surface); }
  option { color: var(--color-text-primary); background: var(--color-surface); }
  svg {
    position: absolute; right: var(--space-2); top: 50%; transform: translateY(-50%);
    width: 1rem; height: 1rem; pointer-events: none;
    fill: none; stroke: var(--color-text-muted); stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round;
  }
`

export const RefreshButton = styled.button`
  display: grid;
  place-items: center;
  flex: 0 0 2.5rem;
  width: 2.5rem;
  color: var(--color-text-muted);
  background: transparent;
  border: var(--border-width) solid transparent;
  cursor: pointer;
  svg { width: 1.1rem; height: 1.1rem; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
  &:hover:not(:disabled) { color: var(--color-text-primary); background: var(--color-surface); }
`

export const Messages = styled.section`
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  gap: var(--space-5);
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  padding: var(--space-5) var(--space-2);
  &:focus-visible { outline: 2px solid var(--color-focus); outline-offset: -2px; }
`

export const EmptyConversation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-5);
  margin: auto 0;
  padding: var(--space-6) 0;
  text-align: center;
  h2 { max-width: 28rem; font-size: clamp(1.2rem, 2vw, 1.75rem); font-weight: var(--font-weight-medium); }
`

export const EmptyIcon = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  opacity: 0.85;
`

export const Suggestions = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: var(--space-2);
  button {
    max-width: 17rem;
    padding: var(--space-3);
    color: var(--color-text-secondary);
    font: inherit;
    font-size: var(--font-size-xs);
    line-height: 1.5;
    text-align: left;
    background: transparent;
    border: var(--border-width) solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
  }
  button:hover:not(:disabled) { color: var(--color-text-primary); background: var(--color-surface); border-color: var(--color-brand-purple); }
`

interface MessageProps { $author: 'user' | 'assistant' }
export const Message = styled.article<MessageProps>`
  display: flex;
  flex-shrink: 0;
  align-self: ${({ $author }) => $author === 'user' ? 'flex-end' : 'flex-start'};
  align-items: flex-start;
  gap: var(--space-3);
  max-width: min(88%, 44rem);
  p {
    min-width: 0;
    padding: var(--space-3) var(--space-4);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    color: var(--color-text-primary);
    line-height: 1.65;
    background: ${({ $author }) => $author === 'user' ? 'var(--color-surface-raised)' : 'transparent'};
    border: var(--border-width) solid ${({ $author }) => $author === 'user' ? 'var(--color-border)' : 'transparent'};
    border-radius: var(--radius-lg);
  }
  @media (max-width: 50rem) { max-width: 96%; }
`

export const MessageAvatar = styled.span`
  display: grid;
  flex: 0 0 2rem;
  place-items: center;
  width: 2rem;
  height: 2rem;
  margin-top: var(--space-3);
  img { width: 1.4rem; height: 1.4rem; }
`

export const ComposerArea = styled.section`
  flex-shrink: 0;
  padding-top: var(--space-3);
  background: var(--color-background);
`

export const Composer = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  min-height: 3.5rem;
  padding: var(--space-4) 4.5rem var(--space-4) var(--space-4);
  background: var(--color-surface);
  border: var(--border-width) solid var(--color-border-strong);
  border-radius: var(--radius-lg);
  label { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  textarea {
    width: 100%;
    min-height: 1.5rem;
    max-height: min(8rem, 22dvh);
    field-sizing: content;
    padding: 0;
    color: var(--color-text-primary);
    font: inherit;
    line-height: 1.5;
    resize: none;
    background: transparent;
    border: 0;
    outline: 0;
  }
  &:focus-within { outline: 2px solid var(--color-focus); outline-offset: 2px; }
  textarea::placeholder { color: var(--color-text-muted); }
  button {
    position: absolute;
    right: var(--space-3);
    bottom: var(--space-3);
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    background: var(--gradient-brand-diagonal);
    border: 0;
    border-radius: var(--radius-md);
    cursor: pointer;
  }
  button:disabled { opacity: 0.45; cursor: not-allowed; filter: grayscale(0.7); }
  button img { width: 1.5rem; height: 1.5rem; }
`
