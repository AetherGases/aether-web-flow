import type { ErrorRequestHandler } from 'express'

export class ApiError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export const errorHandler: ErrorRequestHandler = (error: unknown, _request, response, _next) => {
  void _next
  let failure = error instanceof ApiError ? error : new ApiError(500, 'INTERNAL_ERROR', 'Não foi possível concluir a operação.')
  if (error instanceof SyntaxError) failure = new ApiError(400, 'INVALID_JSON', 'Envie um JSON válido.')
  if (typeof error === 'object' && error !== null && 'type' in error && error.type === 'entity.too.large') {
    failure = new ApiError(413, 'PAYLOAD_TOO_LARGE', 'Os dados enviados excedem o limite permitido.')
  }
  response.status(failure.status).json({ error: { code: failure.code, message: failure.message, requestId: response.locals.requestId } })
}
