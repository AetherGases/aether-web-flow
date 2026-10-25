import type { Config } from '../config/index.ts'
import { ApiError } from '../middleware/errors.ts'
import { profileSchema, tokenSchema, type TokenResponse } from '../types/auth.ts'
import { createHttpClient } from './http.ts'

export function createAuthService(config: Config) {
  const request = createHttpClient(config.MS_AUTH_URL, config.UPSTREAM_TIMEOUT_MS)
  function parseTokens(value: unknown): TokenResponse {
    const parsed = tokenSchema.safeParse(value)
    if (!parsed.success || Date.parse(parsed.data.expiration) <= Date.now()) {
      throw new ApiError(502, 'AUTH_CONTRACT_INVALID', 'O serviço de autenticação deve retornar tokens válidos e um papel reconhecido.')
    }
    return parsed.data
  }

  return {
    async login(credentials: { email: string; password: string }, requestId: string) {
      return parseTokens(await request('/api/auth/login', { method: 'POST', requestId, body: credentials }))
    },
    async refresh(email: string, refreshToken: string, requestId: string) {
      const tokens = parseTokens(await request(`/api/auth/refresh/${encodeURIComponent(email)}`, {
        method: 'PUT', requestId, token: refreshToken,
      }))
      if (tokens.email !== email) throw new ApiError(401, 'SESSION_INVALID', 'Sua sessão não é válida. Entre novamente.')
      return tokens
    },
    async profile(accessToken: string, requestId: string) {
      const parsed = profileSchema.safeParse(await request('/api/profile', { method: 'GET', requestId, token: accessToken }))
      if (!parsed.success) throw new ApiError(502, 'AUTH_CONTRACT_INVALID', 'O serviço de autenticação retornou um perfil incompatível.')
      return parsed.data
    },
  }
}
