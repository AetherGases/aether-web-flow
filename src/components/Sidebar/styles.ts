import styled from 'styled-components'

export const Container = styled.aside`
  position: sticky;
  top: 0;
  align-self: start;

  display: flex;
  flex-direction: column;

  width: var(--sidebar-width);
  height: 100dvh;
  padding: var(--space-6);

  overflow: hidden;

  background-color: var(--color-background-deep);
  border-right: var(--border-width) solid var(--color-border);
`

export const Logo = styled.img`
  width: 8rem;
  height: auto;
  margin-bottom: var(--space-10);
`

export const Navigation = styled.nav`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`

export const NavigationList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: var(--space-2);

  margin: 0;
  padding: 0;
  list-style: none;
`

export const NavigationLink = styled.a`
  display: flex;
  align-items: center;
  gap: var(--space-3);

  width: 100%;
  padding: var(--space-3) var(--space-4);

  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;

  border-radius: var(--radius-md);

  transition:
    color var(--duration-fast) var(--easing-standard),
    background-color var(--duration-fast) var(--easing-standard);

  &:hover {
    color: var(--color-text-primary);
    background-color: var(--color-surface);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }

  &[aria-current='page'] {
    color: var(--color-text-primary);
    background: var(--gradient-brand);
  }
`

export const Icon = styled.img`
  width: 1.3rem;
  height: 1.3rem;
`

export const UserFooter = styled.footer`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--space-3);

  padding-top: var(--space-4);

  border-top: var(--border-width) solid var(--color-border);
`

export const Avatar = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  width: 2.5rem;
  height: 2.5rem;

  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);

  background: var(--gradient-brand-diagonal);
  border-radius: 50%;
`

export const UserInformation = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;

  strong {
    overflow: hidden;

    color: var(--color-text-primary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    color: var(--color-text-muted);
    font-size: var(--font-size-xs);
  }
`

export const LogoutButton = styled.button`
  padding: var(--space-2);

  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  cursor: pointer;

  background: transparent;
  border: none;
  border-radius: var(--radius-sm);

  &:hover {
    color: var(--color-danger);
    background-color: var(--color-surface);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }
`