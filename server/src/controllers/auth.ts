import type { Request, Response } from 'express'
import type { Config } from '../config/index.ts'
import { ApiError } from '../middleware/errors.ts'
import { createAuthService } from '../services/auth.ts'
import { loginSchema } from '../types/auth.ts'

export function createAuthController(config: Config) {
  const service = createAuthService(config)
  const pending = new Map<string, Promise<void>>()
  const cookieName = config.NODE_ENV === 'production' ? '__Host-aether.sid' : 'aether.sid'
  const cookieOptions = { path: '/', httpOnly: true, sameSite: 'lax' as const, secure: config.NODE_ENV === 'production' }

  async function destroy(request: Request, response: Response) {
    await new Promise<void>((resolve, reject) => request.session.destroy((error) => error ? reject(error) : resolve()))
    response.clearCookie(cookieName, cookieOptions)
  }

  return {
    async login(request: Request, response: Response) {
      const credentials = loginSchema.safeParse(request.body)
      if (!credentials.success) throw new ApiError(400, 'VALIDATION_ERROR', 'Informe um e-mail válido e uma senha de até 128 caracteres.')
      const tokens = await service.login(credentials.data, response.locals.requestId)
      const profile = await service.profile(tokens.accessToken, response.locals.requestId)
      if (profile.email !== tokens.email) throw new ApiError(502, 'AUTH_CONTRACT_INVALID', 'Identidade incompatível na resposta de autenticação.')
      await new Promise<void>((resolve, reject) => request.session.regenerate((error) => error ? reject(error) : resolve()))
      request.session.auth = {
        user: { ...profile, role: tokens.role },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: Date.parse(tokens.expiration),
        absoluteExpiresAt: Date.now() + config.SESSION_MAX_AGE_MS,
      }
      await new Promise<void>((resolve, reject) => request.session.save((error) => error ? reject(error) : resolve()))
      response.json({ user: request.session.auth.user })
    },

    async me(request: Request, response: Response) {
      if (!request.session.auth) throw new ApiError(401, 'UNAUTHENTICATED', 'Entre na sua conta para continuar.')
      const id = request.sessionID
      const previous = pending.get(id) ?? Promise.resolve()
      const task = previous.catch(() => {}).then(async () => {
        await new Promise<void>((resolve, reject) => request.session.reload((error) => error
          ? reject(new ApiError(401, 'SESSION_EXPIRED', 'Sua sessão expirou. Entre novamente.')) : resolve()))
        const auth = request.session.auth
        if (!auth || auth.absoluteExpiresAt <= Date.now()) {
          await destroy(request, response)
          throw new ApiError(401, 'SESSION_EXPIRED', 'Sua sessão expirou. Entre novamente.')
        }
        try {
          if (auth.expiresAt <= Date.now() + 30000) {
            const tokens = await service.refresh(auth.user.email, auth.refreshToken, response.locals.requestId)
            auth.accessToken = tokens.accessToken
            auth.refreshToken = tokens.refreshToken
            auth.expiresAt = Date.parse(tokens.expiration)
            auth.user.role = tokens.role
          }
          const profile = await service.profile(auth.accessToken, response.locals.requestId)
          if (profile.id !== auth.user.id || profile.email !== auth.user.email) {
            throw new ApiError(401, 'SESSION_INVALID', 'Sua sessão não é válida. Entre novamente.')
          }
          await new Promise<void>((resolve, reject) => request.sessionStore.get(id, (error, stored) => {
            if (error) reject(error)
            else if (!stored) reject(new ApiError(401, 'SESSION_EXPIRED', 'Sua sessão foi encerrada.'))
            else resolve()
          }))
          auth.user = { ...profile, role: auth.user.role }
          request.session.cookie.maxAge = Math.max(1, auth.absoluteExpiresAt - Date.now())
          await new Promise<void>((resolve, reject) => request.session.save((error) => error ? reject(error) : resolve()))
          if (response.locals.sessionOnly) response.locals.auth = { ...auth, user: { ...auth.user } }
          else response.json({ user: auth.user })
        } catch (error) {
          if (error instanceof ApiError && [401, 403].includes(error.status)) await destroy(request, response)
          throw error
        }
      })
      pending.set(id, task)
      try { await task } finally { if (pending.get(id) === task) pending.delete(id) }
    },

    async logout(request: Request, response: Response) {
      await pending.get(request.sessionID)?.catch(() => {})
      await destroy(request, response)
      response.status(204).end()
    },
  }
}
