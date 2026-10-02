import styled from 'styled-components'

export const Field = styled.div`
  min-width: 0;
  padding: var(--space-2) var(--space-3);
  background-color: rgb(13 0 38 / 18%);
  border: var(--border-width) solid var(--color-border-strong);
  border-radius: var(--radius-md);
`

export const Label = styled.label`
  display: block;
  margin-bottom: var(--space-1);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
`

export const StaticLabel = styled.span`
  display: block;
  margin-bottom: var(--space-1);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
`

export const ValueRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
`

export const Value = styled.span`
  overflow: hidden;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const EditButton = styled.button`
  flex-shrink: 0;
  padding: var(--space-1);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);

  &:hover {
    color: var(--color-brand-green);
  }
`

export const Editor = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;
  gap: var(--space-2);
`

export const Input = styled.input`
  min-width: 0;
  width: 100%;
  padding: var(--space-2) var(--space-3);
  color: var(--color-text-primary);
  background-color: rgb(13 0 38 / 35%);
  border: var(--border-width) solid var(--color-focus);
  border-radius: var(--radius-md);
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 2px var(--color-brand-green);
  }
`

const ActionButton = styled.button`
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-md);
`

export const ConfirmButton = styled(ActionButton)`
  color: var(--color-text-inverse);
  background-color: var(--color-success);
`

export const CancelButton = styled(ActionButton)`
  color: var(--color-text-secondary);
  background-color: var(--color-surface);
`
