import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import type { Config } from '../config/index.ts'
import type { createAuthController } from '../controllers/auth.ts'
import type { AuthSession } from '../types/auth.ts'
import { ApiError } from '../middleware/errors.ts'
import { createReportService, registerReportSchema, validUploadedPath } from '../services/reports.ts'

export function reportRoutes(config: Config, authController: ReturnType<typeof createAuthController>) {
  const router = Router()
  const service = createReportService(config)
  router.use(async (request, response, next) => {
    response.locals.sessionOnly = true
    await authController.me(request, response)
    next()
  })
  const limit = rateLimit({ windowMs: 60000, limit: 10, standardHeaders: 'draft-8', legacyHeaders: false, handler: () => { throw new ApiError(429, 'REPORT_LIMIT', 'Aguarde um minuto antes de enviar outro relatório.') } })
  router.post('/upload-signature', limit, async (request, response) => {
    const auth: AuthSession = response.locals.auth
    const data = await service.signature(auth, response.locals.requestId)
    request.session.reportUpload = { cloudName: data.cloudName, cloudinaryFolder: data.cloudinaryFolder, expiresAt: Date.now() + 3600000 }
    response.json(data)
  })
  router.post('/', limit, async (request, response) => {
    const input = registerReportSchema.safeParse(request.body)
    if (!input.success) throw new ApiError(422, 'REPORT_VALIDATION_ERROR', 'Confira o nome, a abordagem e o arquivo do relatório.')
    const grant = request.session.reportUpload
    if (!grant || grant.expiresAt < Date.now() || !validUploadedPath(input.data.path, grant)) throw new ApiError(422, 'UPLOAD_INVALID', 'Selecione e envie o arquivo novamente.')
    // Consume before calling the upstream: an uncertain response must not trigger duplicate registration.
    delete request.session.reportUpload
    await new Promise<void>((resolve, reject) => request.session.save(error => error ? reject(error) : resolve()))
    const auth: AuthSession = response.locals.auth
    response.status(201).json(await service.register(input.data, auth, response.locals.requestId))
  })
  router.get('/:id', async (request, response) => {
    const id = Number(request.params.id)
    if (!Number.isSafeInteger(id) || id <= 0) throw new ApiError(400, 'REPORT_INVALID_ID', 'Selecione um relatório válido.')
    const auth: AuthSession = response.locals.auth
    response.json(await service.detail(id, auth, response.locals.requestId))
  })
  router.get('/:id/analysis', async (request, response) => {
    const id = Number(request.params.id)
    if (!Number.isSafeInteger(id) || id <= 0) throw new ApiError(400, 'REPORT_INVALID_ID', 'Selecione um relatório válido.')
    const auth: AuthSession = response.locals.auth
    response.json(await service.plan(id, auth, response.locals.requestId))
  })
  return router
}
