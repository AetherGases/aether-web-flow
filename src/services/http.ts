export class HttpError extends Error {
  readonly status: number
  readonly code: string

  constructor(status: number, code: string, message: string) {
    super(message)
    this.status = status
    this.code = code
  }
}

export async function request(path: string, options: RequestInit = {}): Promise<unknown> {
  try {
    const response = await fetch(`/api/v1${path}`, {
      ...options,
      credentials: 'same-origin',
      headers: { ...options.headers, ...(options.body ? { 'Content-Type': 'application/json' } : {}) },
    })
    if (response.status === 204) return null
    const body: unknown = await response.json()
    if (!response.ok) {
      let code = 'REQUEST_FAILED'
      let message = 'Não foi possível concluir a operação. Tente novamente.'
      if (typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'object' && body.error !== null) {
        if ('code' in body.error && typeof body.error.code === 'string') code = body.error.code
        if ('message' in body.error && typeof body.error.message === 'string') message = body.error.message
      }
      throw new HttpError(response.status, code, message)
    }
    return body
  } catch (error) {
    if (error instanceof HttpError || (error instanceof DOMException && error.name === 'AbortError')) throw error
    throw new HttpError(0, 'NETWORK_ERROR', 'Não foi possível conectar ao servidor. Tente novamente.')
  }
}
