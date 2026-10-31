import { useTranslation } from '../../hooks/useTranslation'
import { type KeyboardEvent, useState } from 'react'

import ProfileField from '../../components/ProfileField'
import Toast from '../../components/Toast'
import RoleBadge from '../../components/RoleBadge'
import Sidebar from '../../components/Sidebar'
import UserAvatar from '../../components/UserAvatar'
import { useAuth } from '../../hooks/useAuth'
import { usePreferences } from '../../hooks/usePreferences'
import { useProfile } from '../../hooks/useProfile'
import SectionState from '../../components/SectionState'
import { isLanguage } from '../../types/preferences'
import { validateProfile } from '../../utils/profile'
import * as S from './styles'

function ProfilePage() {
  const { t } = useTranslation()
  const { user, logout, retry } = useAuth()
  const { data: profile, loading, error, notification, dismissNotification, fieldErrors, saving, sessionExpired, reload, save } = useProfile()
  const { lightMode, toggleLightMode, highContrast, toggleHighContrast, language, setLanguage } = usePreferences()
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

  const unitAddress = profile?.unit?.address
  const unitLocation = unitAddress ? `${unitAddress.neighborhood} — ${unitAddress.city}/${unitAddress.state}` : t("Não disponível")

  if (!user) return null

  return (
    <S.Page>
      <Sidebar
        userName={user.name}
        userRole={user.role}
        onLogout={() => { void logout() }}
      />

      <S.Content>
        <S.Eyebrow>{t("Perfil")}</S.Eyebrow>
        <S.Title>{t("Meu perfil")}</S.Title>

        {sessionExpired && <p role="alert">{t("Sua sessão expirou.")}{" "}<button type="button" onClick={retry}>{t("Verificar sessão")}</button></p>}
        {profile ? <S.ProfileGrid>
          <S.PersonalCard>
            <UserAvatar userName={profile.fullName} size="large" />

            <S.Identity>
              {isEditingName ? (
                <S.NameEditor>
                  <S.NameLabel htmlFor="profile-name">{t("Nome completo")}</S.NameLabel>
                  <S.NameInput
                    id="profile-name"
                    aria-label={t("Nome completo")}
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
                    aria-label={t("Salvar nome")}
                    $confirm
                    disabled={saving}
                    onClick={() => { void saveName() }}
                  >
                    ✓
                  </S.NameAction>
                  <S.NameAction
                    type="button"
                    aria-label={t("Cancelar edição do nome")}
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
                    aria-label={t("Editar nome")}
                    disabled={saving}
                    onClick={() => { setNameDraft(profile.fullName); setNameError(null); setIsEditingName(true) }}
                  >
                    ✎
                  </S.EditNameButton>
                </S.NameRow>
              )}
              {nameError && <p id="profile-name-error" role="alert">{t(nameError)}</p>}
              <RoleBadge role={user.role} />
            </S.Identity>

            <S.Fields>
              <ProfileField
                id="profile-email"
                label={t("E-mail")}
                value={profile.email}
              />
              <ProfileField
                id="profile-cpf"
                label={t("CPF")}
                value={profile.cpf ?? t("Não informado")}
              />
              <ProfileField
                id="profile-phone"
                label={t("Telefone")}
                value={profile.phone ?? t("Não informado")}
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
            <h2>{t("Organização")}</h2>
            <S.DefinitionList>
              <div><dt>{t("Empresa")}</dt><dd>{profile.enterprise?.name ?? t("Não disponível")}</dd></div>
              <div><dt>{t("Unidade")}</dt><dd>{unitLocation}</dd></div>
              <div><dt>{t("Departamento")}</dt><dd>{profile.department?.name ?? t("Não disponível")}</dd></div>
            </S.DefinitionList>
          </S.InformationCard>

          <S.InformationCard aria-labelledby="settings-title">
            <h2 id="settings-title">{t("Configurações")}</h2>
            <S.SettingsList>
              <S.SettingsRow>
                <span>{t("Modo claro")}</span>
                <S.Switch
                  type="button"
                  role="switch"
                  aria-checked={lightMode}
                  aria-label={t("Ativar modo claro")}
                  $active={lightMode}
                  onClick={toggleLightMode}
                >
                  <span />
                </S.Switch>
              </S.SettingsRow>
              <S.SettingsRow>
                <label htmlFor="profile-language">{t("Idioma")}</label>
                <S.LanguageControl>
                  <S.LanguageText aria-hidden="true">{t(language === 'pt-BR' ? 'Português (Brasil)' : language === 'en' ? 'English' : 'Espanhol')}</S.LanguageText>
                <S.LanguageSelect id="profile-language" value={language} onChange={(event) => { if (isLanguage(event.target.value)) setLanguage(event.target.value) }}>
                  <option value="pt-BR">{t("Português (Brasil)")}</option>
                  <option value="en">{t("English")}</option>
                  <option value="es">{t("Espanhol")}</option>
                </S.LanguageSelect>
                <S.LanguageArrow aria-hidden="true" />
                </S.LanguageControl>
              </S.SettingsRow>
              <S.SettingsRow>
                <span>{t("Alto contraste")}</span>
                <S.Switch
                  type="button"
                  role="switch"
                  aria-checked={highContrast}
                  aria-label={t("Ativar alto contraste")}
                  $active={highContrast}
                  onClick={toggleHighContrast}
                >
                  <span />
                </S.Switch>
              </S.SettingsRow>
            </S.SettingsList>
          </S.InformationCard>
        </S.ProfileGrid> : <SectionState loading={loading} error={!!error} description={error ?? undefined} onRetry={sessionExpired ? retry : reload} />}
      </S.Content>
      {notification && <Toast type={notification.type} message={notification.message} onDismiss={dismissNotification} />}
    </S.Page>
  )
}

export default ProfilePage
