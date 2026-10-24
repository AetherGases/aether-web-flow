import { type KeyboardEvent, useState } from 'react'

import ProfileField from '../../components/ProfileField'
import RoleBadge from '../../components/RoleBadge'
import Sidebar from '../../components/Sidebar'
import UserAvatar from '../../components/UserAvatar'
import { useAuth } from '../../hooks/useAuth'
import { useProfile } from '../../hooks/useProfile'
import SectionState from '../../components/SectionState'
import { validateProfile } from '../../utils/profile'
import * as S from './styles'

function ProfilePage() {
  const { user, logout, retry } = useAuth()
  const { data: profile, loading, error, saveError, fieldErrors, saving, saved, sessionExpired, reload, save } = useProfile()
  const [lightMode, setLightMode] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const [nameError, setNameError] = useState<string | null>(null)

  async function saveName() {
    const changes = { name: nameDraft.trim() }
    const errors = validateProfile(changes)
    setNameError(errors.name ?? null)
    if (!errors.name && await save(changes)) setIsEditingName(false)
  }

  function cancelNameEditing() {
    setNameDraft(profile?.fullName ?? user?.name ?? '')
    setNameError(null)
    setIsEditingName(false)
  }

  function handleNameKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') void saveName()
    if (event.key === 'Escape') cancelNameEditing()
  }

  if (!user) return null

  return (
    <S.Page $highContrast={highContrast}>
      <Sidebar
        userName={user.name}
        userRole={user.role}
        onLogout={() => { void logout() }}
      />

      <S.Content>
        <S.Title>Meu perfil</S.Title>

        {sessionExpired && <p role="alert">Sua sessão expirou. <button type="button" onClick={retry}>Verificar sessão</button></p>}
        {saveError && <p role="alert">{saveError}</p>}
        {saved && <p role="status">Perfil atualizado.</p>}
        {saving && <p role="status">Salvando perfil…</p>}
        {profile ? <S.ProfileGrid>
          <S.PersonalCard>
            <UserAvatar userName={profile.fullName} size="large" />

            <S.Identity>
              {isEditingName ? (
                <S.NameEditor>
                  <S.NameLabel htmlFor="profile-name">Nome completo</S.NameLabel>
                  <S.NameInput
                    id="profile-name"
                    aria-label="Nome completo"
                    value={nameDraft}
                    maxLength={150}
                    disabled={saving}
                    aria-invalid={!!nameError}
                    aria-describedby={nameError ? "profile-name-error" : undefined}
                    autoFocus
                    onChange={(event) => setNameDraft(event.target.value)}
                    onKeyDown={handleNameKeyDown}
                  />
                  <S.NameAction
                    type="button"
                    aria-label="Salvar nome"
                    $confirm
                    disabled={saving}
                    onClick={() => { void saveName() }}
                  >
                    ✓
                  </S.NameAction>
                  <S.NameAction
                    type="button"
                    aria-label="Cancelar edição do nome"
                    disabled={saving}
                    onClick={cancelNameEditing}
                  >
                    ×
                  </S.NameAction>
                </S.NameEditor>
              ) : (
                <S.NameRow>
                  <h2>{profile.fullName}</h2>
                  <S.EditNameButton
                    type="button"
                    aria-label="Editar nome"
                    disabled={saving}
                    onClick={() => { setNameDraft(profile.fullName); setNameError(null); setIsEditingName(true) }}
                  >
                    ✎
                  </S.EditNameButton>
                </S.NameRow>
              )}
              {nameError && <p id="profile-name-error" role="alert">{nameError}</p>}
              <RoleBadge role={user.role} />
            </S.Identity>

            <S.Fields>
              <ProfileField
                id="profile-email"
                label="E-mail"
                value={profile.email}
              />
              <ProfileField
                id="profile-cpf"
                label="CPF"
                value={profile.cpf ?? 'Não informado'}
              />
              <ProfileField
                id="profile-phone"
                label="Telefone"
                value={profile.phone ?? 'Não informado'}
                type="tel"
                editable
                maxLength={20}
                disabled={saving}
                error={fieldErrors.phone}
                onChange={(phone) => save({ phone })}
              />
            </S.Fields>
          </S.PersonalCard>

          <S.InformationCard>
            <h2>Organização</h2>
            <S.DefinitionList>
              <div><dt>Empresa</dt><dd>Não disponível</dd></div>
              <div><dt>Unidade</dt><dd>Não disponível</dd></div>
              <div><dt>Departamento</dt><dd>Não disponível</dd></div>
            </S.DefinitionList>
          </S.InformationCard>

          <S.InformationCard aria-labelledby="settings-title">
            <h2 id="settings-title">Configurações</h2>
            <S.SettingsList>
              <S.SettingsRow>
                <span>Modo claro</span>
                <S.Switch
                  type="button"
                  role="switch"
                  aria-checked={lightMode}
                  aria-label="Ativar modo claro"
                  $active={lightMode}
                  onClick={() => setLightMode((currentMode) => !currentMode)}
                >
                  <span />
                </S.Switch>
              </S.SettingsRow>
              <S.SettingsRow>
                <span>Idioma</span>
                <S.SettingValue>Português (Brasil)</S.SettingValue>
              </S.SettingsRow>
              <S.SettingsRow>
                <span>Alto contraste</span>
                <S.Switch
                  type="button"
                  role="switch"
                  aria-checked={highContrast}
                  aria-label="Ativar alto contraste"
                  $active={highContrast}
                  onClick={() => setHighContrast((currentValue) => !currentValue)}
                >
                  <span />
                </S.Switch>
              </S.SettingsRow>
            </S.SettingsList>
          </S.InformationCard>
        </S.ProfileGrid> : <SectionState loading={loading} error={!!error} description={error ?? undefined} onRetry={sessionExpired ? retry : reload} />}
      </S.Content>
    </S.Page>
  )
}

export default ProfilePage
