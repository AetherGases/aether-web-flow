import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import type { Config } from '../config/index.ts'
import { createAuthController } from '../controllers/auth.ts'

export function authRoutes(config: Config, controller = createAuthController(config)) {
  const router = Router()

  const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    handler: (_request, response) => response.status(429).json({ error: {
      code: 'TOO_MANY_ATTEMPTS', message: 'Muitas tentativas. Aguarde antes de tentar novamente.', requestId: response.locals.requestId,
    } }),
  })
  router.post('/login', loginLimit, controller.login)
  router.get('/me', controller.me)
  router.post('/logout', controller.logout)
  return router
}
