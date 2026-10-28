import { ApiError } from '../middleware/errors.ts'

export interface ServiceOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH'
  requestId: string
  token?: string
  allowNotFound?: boolean
  body?: unknown
}

export function createHttpClient(origin: string, timeoutMs: number, service: 'AUTH' | 'INVENTORY' | 'PROFILE' | 'CALCULATOR' = 'AUTH') {
  const base = new URL(origin)
  return async function request(path: string, options: ServiceOptions): Promise<unknown> {
    const url = new URL(path, base)
    if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\') || url.origin !== base.origin) {
      throw new Error('Caminho de serviço inválido')
    }
    const signal = AbortSignal.timeout(timeoutMs)
    try {
      const response = await fetch(url, {
        method: options.method,
        signal,
        redirect: 'error',
        headers: {
          Accept: 'application/json',
          'X-Request-Id': options.requestId,
          ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
          ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
      })
      if (response.status === 404 && options.allowNotFound) {
        await response.body?.cancel()
        return null
      }
      if (!response.ok) {
        await response.body?.cancel()
        if (service === 'CALCULATOR' && [400, 422].includes(response.status)) throw new ApiError(422, 'CALCULATOR_VALIDATION_ERROR', 'Confira os valores informados para a simulação.')
        if (service === 'CALCULATOR' && response.status === 403) throw new ApiError(403, 'CALCULATOR_FORBIDDEN', 'Sua conta não tem permissão para usar esta calculadora.')
        if (service === 'PROFILE' && [400, 422].includes(response.status)) throw new ApiError(422, 'PROFILE_VALIDATION_ERROR', 'Confira o nome e o telefone informados.')
        if (response.status === 401 || (service === 'AUTH' && response.status === 400)) throw new ApiError(401, 'AUTH_REJECTED', 'Credenciais inválidas ou sessão expirada.')
        if (response.status === 403) throw new ApiError(403, 'FORBIDDEN', 'Acesso não permitido.')
        throw new ApiError(502, `${service}_UNAVAILABLE`, 'O serviço solicitado não conseguiu concluir a operação.')
      }
      const mediaType = response.headers.get('content-type') ?? ''
      if (!/^application\/(?:[\w.-]+\+)?json(?:;|$)/i.test(mediaType)) {
        await response.body?.cancel()
        throw new ApiError(502, `${service}_CONTRACT_INVALID`, 'O serviço solicitado retornou uma resposta incompatível.')
      }
      const reader = response.body?.getReader()
      if (!reader) throw new ApiError(502, `${service}_CONTRACT_INVALID`, 'Resposta de autenticação vazia.')
      const chunks: Uint8Array[] = []
      let size = 0
      try {
        while (true) {
          const chunk = await reader.read()
          if (chunk.done) break
          size += chunk.value.byteLength
          if (size > 65536) {
            await reader.cancel()
            throw new ApiError(502, `${service}_CONTRACT_INVALID`, 'Resposta de autenticação excede o limite.')
          }
          chunks.push(chunk.value)
        }
        return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown
      } finally {
        reader.releaseLock()
      }
    } catch (error) {
      if (error instanceof ApiError) throw error
      if (signal.aborted) throw new ApiError(504, `${service}_TIMEOUT`, 'O serviço solicitado demorou para responder. Tente novamente.')
      if (error instanceof SyntaxError) throw new ApiError(502, `${service}_CONTRACT_INVALID`, 'Resposta de autenticação inválida.')
      throw new ApiError(502, `${service}_UNAVAILABLE`, 'Serviço solicitado temporariamente indisponível.')
    }
  }
}
