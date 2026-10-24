import type { ProfileData, ProfileUpdate } from '../types/profile.ts'
import { validateProfile } from '../utils/profile.ts'
import { HttpError, request } from './http.ts'

export function parseProfile(data: ProfileData): ProfileData {
  if (!data || !Number.isSafeInteger(data.id) || data.id <= 0 || typeof data.fullName !== 'string' || !data.fullName ||
      typeof data.email !== 'string' || !data.email || (data.cpf !== null && typeof data.cpf !== 'string') ||
      (data.phone !== null && typeof data.phone !== 'string')) throw new Error('Resposta de perfil inválida.')
  return { id: data.id, fullName: data.fullName, email: data.email, cpf: data.cpf, phone: data.phone }
}
export async function getProfile(signal?: AbortSignal): Promise<ProfileData> {
  try {
    return parseProfile(await request('/profile', { signal }) as ProfileData)
  } catch (error) {
    if (error instanceof HttpError || (error instanceof DOMException && error.name === 'AbortError')) throw error
    throw new Error('Não foi possível interpretar os dados do perfil.', { cause: error })
  }
}
export async function updateProfile(changes: ProfileUpdate, signal?: AbortSignal): Promise<ProfileData> {
  const errors = validateProfile(changes)
  if (errors.name || errors.phone) throw new Error(errors.name ?? errors.phone)
  if (changes.name === undefined && changes.phone === undefined) throw new Error('Informe o dado que deseja alterar.')
  try {
    return parseProfile(await request('/profile', {
      method: 'PATCH', signal, body: JSON.stringify({
        ...(changes.name !== undefined ? { name: changes.name.trim() } : {}),
        ...(changes.phone !== undefined ? { phone: changes.phone.trim() } : {}),
      }),
    }) as ProfileData)
  } catch (error) {
    if (error instanceof HttpError || (error instanceof DOMException && error.name === 'AbortError')) throw error
    throw new Error('Não foi possível confirmar a atualização. Recarregue o perfil para conferir os dados.', { cause: error })
  }
}
