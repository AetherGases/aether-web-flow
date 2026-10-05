import { type KeyboardEvent, useState } from 'react'

import ProfileField from '../../components/ProfileField'
import RoleBadge from '../../components/RoleBadge'
import SettingCard from '../../components/SettingCard'
import Sidebar from '../../components/Sidebar'
import UserAvatar from '../../components/UserAvatar'
import type { OverviewData } from '../../types/overview'
import type { ProfileData } from '../../types/profile'
import * as S from './styles'

interface ProfilePageProps {
  data: OverviewData
  profile: ProfileData
  onLogout: () => void
}

function ProfilePage({ data, profile: initialProfile, onLogout }: ProfilePageProps) {
  const [profile, setProfile] = useState(initialProfile)
  const [lightMode, setLightMode] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(initialProfile.fullName)

  function updateProfileField(field: 'fullName' | 'phone', value: string) {
    setProfile((currentProfile) => ({
      ...currentProfile,
      [field]: value,
    }))
  }

  function saveName() {
    const nextName = nameDraft.trim()
    if (!nextName) return

    updateProfileField('fullName', nextName)
    setIsEditingName(false)
  }

  function cancelNameEditing() {
    setNameDraft(profile.fullName)
    setIsEditingName(false)
  }

  function handleNameKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') saveName()
    if (event.key === 'Escape') cancelNameEditing()
  }

  return (
    <S.Page $highContrast={highContrast}>
      <Sidebar
        userName={data.userName}
        userRole={data.role}
        onLogout={onLogout}
      />

      <S.Content>
        <S.Title>Meu perfil</S.Title>

        <S.ProfileGrid>
          <S.PersonalCard>
            <UserAvatar userName={profile.fullName} size="large" />

            <S.Identity>
              {isEditingName ? (
                <S.NameEditor>
                  <S.NameInput
                    aria-label="Nome completo"
                    value={nameDraft}
                    maxLength={80}
                    autoFocus
                    onChange={(event) => setNameDraft(event.target.value)}
                    onKeyDown={handleNameKeyDown}
                  />
                  <S.NameAction
                    type="button"
                    aria-label="Salvar nome"
                    $confirm
                    onClick={saveName}
                  >
                    ✓
                  </S.NameAction>
                  <S.NameAction
                    type="button"
                    aria-label="Cancelar edição do nome"
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
                    onClick={() => setIsEditingName(true)}
                  >
                    ✎
                  </S.EditNameButton>
                </S.NameRow>
              )}
              <RoleBadge role={data.role} />
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
                value={profile.cpf}
              />
              <ProfileField
                id="profile-phone"
                label="Telefone"
                value={profile.phone}
                type="tel"
                editable
                maxLength={20}
                onChange={(value) => updateProfileField('phone', value)}
              />
            </S.Fields>
          </S.PersonalCard>

          <S.InformationCard>
            <h2>Organização</h2>
            <S.DefinitionList>
              <div><dt>Empresa</dt><dd>{profile.company}</dd></div>
              <div><dt>Unidade</dt><dd>{profile.unit}</dd></div>
              <div><dt>Departamento</dt><dd>{profile.department}</dd></div>
            </S.DefinitionList>
          </S.InformationCard>

          <S.InformationCard>
            <h2>Suas permissões</h2>
            <S.PermissionList aria-label="Permissões do usuário">
              {profile.permissions.map((permission) => (
                <li key={permission}>{permission}</li>
              ))}
            </S.PermissionList>
          </S.InformationCard>
        </S.ProfileGrid>

        <S.SettingsSection aria-labelledby="settings-title">
          <h2 id="settings-title">Configurações</h2>

          <S.SettingsGrid>
            <SettingCard label="Modo claro">
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
            </SettingCard>

            <SettingCard
              label="Idioma"
              value={profile.language}
              showArrow
            />

            <SettingCard label="Alto contraste">
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
            </SettingCard>
          </S.SettingsGrid>
        </S.SettingsSection>
      </S.Content>
    </S.Page>
  )
}

export default ProfilePage
