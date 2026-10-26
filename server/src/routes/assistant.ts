import { Router } from 'express'
import type { Config } from '../config/index.ts'
import type { createAuthController } from '../controllers/auth.ts'
import type { AuthSession } from '../types/auth.ts'
import { ApiError } from '../middleware/errors.ts'
import { createAssistantService, conversationIdSchema, sendMessageSchema } from '../services/assistant.ts'

export function assistantRoutes(config: Config, authController: ReturnType<typeof createAuthController>) {
  const router = Router()
  const service = createAssistantService(config)
  const active = new Set<string>()
  router.use(async (request, response, next) => {
    response.locals.sessionOnly = true
    await authController.me(request, response)
    const auth: AuthSession = response.locals.auth
    response.locals.aiCompanyId = await service.authorize(auth.user, auth.accessToken, response.locals.requestId)
    next()
  })
  router.get('/conversations', async (_request, response) => {
    const auth: AuthSession = response.locals.auth
    response.json(await service.conversations(auth.user.id, auth.accessToken, response.locals.requestId))
  })
  router.get('/conversations/:conversationId/messages', async (request, response) => {
    const id = conversationIdSchema.safeParse(request.params.conversationId)
    if (!id.success) throw new ApiError(400, 'AI_VALIDATION_ERROR', 'Selecione uma conversa válida.')
    const auth: AuthSession = response.locals.auth
    response.json(await service.messages(id.data, auth.user.id, auth.accessToken, response.locals.requestId))
  })
  router.post('/messages', async (request, response) => {
    const input = sendMessageSchema.safeParse(request.body)
    if (!input.success) throw new ApiError(400, 'AI_VALIDATION_ERROR', 'Escreva uma mensagem de até 8192 caracteres.')
    const auth: AuthSession = response.locals.auth
    const key = `${auth.user.id}:${input.data.conversationId ?? 'new'}`
    if (active.has(key)) throw new ApiError(409, 'AI_BUSY', 'Aguarde a resposta da mensagem anterior.')
    active.add(key)
    try {
      response.json(await service.send(input.data, auth.user, response.locals.aiCompanyId, auth.accessToken, response.locals.requestId))
    } finally { active.delete(key) }
  })
  return router
}
