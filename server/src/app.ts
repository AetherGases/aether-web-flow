import { createCalculatorService, forecastInputSchema } from './services/calculator.ts'
import { createProfileService, updateProfileSchema } from './services/profile.ts'
import { createAuthController } from './controllers/auth.ts'
import { createOverviewService } from './services/overview.ts'
import type { AuthSession } from './types/auth.ts'
import { randomUUID } from 'node:crypto'
import express from 'express'
import session, { type Store } from 'express-session'
import helmet from 'helmet'
import type { Config } from './config/index.ts'
import { ApiError, errorHandler } from './middleware/errors.ts'
import { authRoutes } from './routes/auth.ts'

export function createApp(config: Config, store?: Store) {
  if (config.NODE_ENV === 'production' && !store) throw new Error('Produção exige store de sessão persistente')
  const app = express()
  app.disable('x-powered-by')
  app.set('trust proxy', config.TRUST_PROXY_HOPS)
  app.use(helmet())
  app.use((_request, response, next) => {
    response.locals.requestId = randomUUID()
    response.setHeader('X-Request-Id', response.locals.requestId)
    response.setHeader('Cache-Control', 'no-store')
    next()
  })
  app.get('/api/v1/health', (_request, response) => response.json({ status: 'ok' }))
  app.use('/api/v1', (request, _response, next) => {
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      if (request.get('origin') !== new URL(config.FRONTEND_ORIGIN).origin || request.get('sec-fetch-site') === 'cross-site') {
        throw new ApiError(403, 'INVALID_ORIGIN', 'Origem da requisição não permitida.')
      }
      if (!request.is('application/json')) throw new ApiError(415, 'JSON_REQUIRED', 'Envie os dados em JSON.')
    }
    next()
  })
  app.use(express.json({ limit: '8kb' }))
  app.use(session({
    name: config.NODE_ENV === 'production' ? '__Host-aether.sid' : 'aether.sid',
    secret: config.SESSION_SECRET,
    store,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: config.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: config.SESSION_MAX_AGE_MS },
  }))
  const authController = createAuthController(config)
  const overview = createOverviewService(config)
  app.use('/api/v1/auth', authRoutes(config, authController))
  app.get('/api/v1/overview', async (request, response) => {
    response.locals.sessionOnly = true
    await authController.me(request, response)
    const auth: AuthSession = response.locals.auth
    const data = await overview(auth.accessToken, response.locals.requestId, auth.user.role)
    response.json(data)
  })
  const profile = createProfileService(config)
  app.route('/api/v1/profile')
    .all(async (request, response, next) => {
      response.locals.sessionOnly = true
      await authController.me(request, response)
      next()
    })
    .get(async (_request, response) => {
      const auth: AuthSession = response.locals.auth
      const data = await profile.get(auth.accessToken, response.locals.requestId)
      if (data.id !== auth.user.id || data.email !== auth.user.email) throw new ApiError(502, 'PROFILE_IDENTITY_INVALID', 'O serviço retornou um perfil incompatível.')
      response.json(data)
    })
    .patch(async (request, response) => {
      const changes = updateProfileSchema.safeParse(request.body)
      if (!changes.success) throw new ApiError(400, 'VALIDATION_ERROR', 'Informe um nome válido de 3 a 150 caracteres ou um telefone com DDD.')
      const auth: AuthSession = response.locals.auth
      const data = await profile.update(auth.accessToken, response.locals.requestId, changes.data)
      if (data.id !== auth.user.id || data.email !== auth.user.email) throw new ApiError(502, 'PROFILE_IDENTITY_INVALID', 'O serviço retornou um perfil incompatível.')
      response.json(data)
    })
  const forecast = createCalculatorService(config)
  app.post('/api/v1/calculator/cost-reduction/forecast', async (request, response) => {
    response.locals.sessionOnly = true
    await authController.me(request, response)
    const input = forecastInputSchema.safeParse(request.body)
    if (!input.success) throw new ApiError(400, 'CALCULATOR_VALIDATION_ERROR', 'Confira os valores informados para a simulação.')
    const auth: AuthSession = response.locals.auth
    response.json(await forecast(input.data, auth.accessToken, response.locals.requestId))
  })
  app.use((_request, _response, next) => next(new ApiError(404, 'NOT_FOUND', 'Rota não encontrada.')))
  app.use(errorHandler)
  return app
}
