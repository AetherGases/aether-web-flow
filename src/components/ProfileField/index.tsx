import { type KeyboardEvent, useState } from 'react'
import * as S from './styles'

interface ProfileFieldProps {
  id: string
  label: string
  value: string
  type?: 'text' | 'email' | 'tel'
  editable?: boolean
  maxLength?: number
  onChange?: (value: string) => void
}

function ProfileField({
  id,
  label,
  value,
  type = 'text',
  editable = false,
  maxLength = 100,
  onChange,
}: ProfileFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  function saveValue() {
    const nextValue = draft.trim()
    if (!nextValue) return

    onChange?.(nextValue)
    setIsEditing(false)
  }

  function cancelEditing() {
    setDraft(value)
    setIsEditing(false)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') saveValue()
    if (event.key === 'Escape') cancelEditing()
  }

  return (
    <S.Field>
      {isEditing ? (
        <>
          <S.Label htmlFor={id}>{label}</S.Label>
          <S.Editor>
            <S.Input
              id={id}
              type={type}
              value={draft}
              maxLength={maxLength}
              autoFocus
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
            />
            <S.ConfirmButton type="button" onClick={saveValue}>
              Salvar
            </S.ConfirmButton>
            <S.CancelButton type="button" onClick={cancelEditing}>
              Cancelar
            </S.CancelButton>
          </S.Editor>
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
                onClick={() => setIsEditing(true)}
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
