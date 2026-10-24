import { type KeyboardEvent, useState } from 'react'
import * as S from './styles'

interface ProfileFieldProps {
  id: string
  label: string
  value: string
  type?: 'text' | 'email' | 'tel'
  editable?: boolean
  maxLength?: number
  disabled?: boolean
  error?: string
  onChange?: (value: string) => void | Promise<boolean>
}

function ProfileField({
  id,
  label,
  value,
  type = 'text',
  editable = false,
  maxLength = 100,
  onChange,
  disabled = false,
  error,
}: ProfileFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  async function saveValue() {
    if (disabled) return
    const nextValue = draft.trim()

    const saved = await onChange?.(nextValue)
    if (saved !== false) setIsEditing(false)
  }

  function cancelEditing() {
    setDraft(value)
    setIsEditing(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') void saveValue()
    if (event.key === 'Escape') cancelEditing()
  }

  return (
    <S.Field>
      {isEditing ? (
        <>
          <S.Label htmlFor={id}>{label}</S.Label>
          <S.Editor>
            <S.Input
              aria-invalid={!!error}
              aria-describedby={error ? `${id}-error` : undefined}
              disabled={disabled}
              id={id}
              type={type}
              value={draft}
              maxLength={maxLength}
              autoFocus
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            <S.ConfirmButton type="button" disabled={disabled} onClick={() => { void saveValue() }}>
              Salvar
            </S.ConfirmButton>
            <S.CancelButton type="button" disabled={disabled} onClick={cancelEditing}>
              Cancelar
            </S.CancelButton>
          </S.Editor>
          {error && <p id={`${id}-error`} role="alert">{error}</p>}
        </>
      ) : (
        <>
          <S.StaticLabel>{label}</S.StaticLabel>
          <S.ValueRow>
            <S.Value>{value}</S.Value>
            {editable && (
              <S.EditButton
                type="button"
                aria-label={`Editar ${label.toLowerCase()}`}
                disabled={disabled}
                onClick={() => { setDraft(value); setIsEditing(true) }}
              >
                ✎
              </S.EditButton>
            )}
          </S.ValueRow>
        </>
      )}
    </S.Field>
  )
}

export default ProfileField
