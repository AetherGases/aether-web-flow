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
  app.use('/api/v1/auth', authRoutes(config))
  app.use((_request, _response, next) => next(new ApiError(404, 'NOT_FOUND', 'Rota não encontrada.')))
  app.use(errorHandler)
  return app
}
