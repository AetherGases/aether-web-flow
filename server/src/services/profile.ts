import { z } from 'zod'
import type { Config } from '../config/index.ts'
import { ApiError } from '../middleware/errors.ts'
import { createHttpClient } from './http.ts'

const personal = z.object({
  id: z.number().int().positive(), name: z.string().min(1), email: z.string().email(),
  cpf: z.string().nullable(), phone: z.string().nullable(),
})
export const updateProfileSchema = z.object({
  name: z.string().trim().min(3).max(150).regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/).optional(),
  phone: z.string().trim().regex(/^(\(\d{2}\)|\d{2})\s?\d{4,5}-?\d{4}$/).optional(),
}).strict().refine((data) => data.name !== undefined || data.phone !== undefined)

export function createProfileService(config: Config) {
  const request = createHttpClient(config.MS_AUTH_URL, config.UPSTREAM_TIMEOUT_MS, 'PROFILE')
  return {
    async get(token: string, requestId: string) {
      const parsed = personal.safeParse(await request('/api/profile', { method: 'GET', token, requestId }))
      if (!parsed.success) throw new ApiError(502, 'PROFILE_CONTRACT_INVALID', 'O serviço retornou um perfil incompatível.')
      const { name, ...data } = parsed.data
      return { ...data, fullName: name }
    },
    async update(token: string, requestId: string, changes: z.infer<typeof updateProfileSchema>) {
      const parsed = personal.safeParse(await request('/api/profile', { method: 'PATCH', token, requestId, body: changes }))
      if (!parsed.success) throw new ApiError(502, 'PROFILE_CONTRACT_INVALID', 'O serviço retornou uma atualização incompatível. Recarregue o perfil para conferir os dados.')
      const { name, ...data } = parsed.data
      return { ...data, fullName: name }
    },
  }
}
