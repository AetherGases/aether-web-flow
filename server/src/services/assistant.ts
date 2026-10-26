import { z } from 'zod'
import type { Config } from '../config/index.ts'
import type { SessionUser } from '../types/auth.ts'
import { ApiError } from '../middleware/errors.ts'
import { createHttpClient, type ServiceOptions } from './http.ts'

export const conversationIdSchema = z.string().regex(/^[a-f0-9]{24}$/i)
export const sendMessageSchema = z.object({
  text: z.string().trim().min(1).max(8192),
  conversationId: conversationIdSchema.optional(),
}).strict()
const conversationSchema = z.object({ id: conversationIdSchema, name: z.string().min(1) })
const messageSchema = z.object({
  input_message: z.string(), output_message: z.string().min(1),
  submitted_at: z.string().datetime({ offset: true, local: true }),
})
const replySchema = messageSchema.extend({ id_session: conversationIdSchema, session_name: z.string().min(1) })
const identitySchema = z.object({ id: z.number().int().positive(), email: z.string().email(), enterprise: z.object({ id: z.number().int().positive() }), permissions: z.array(z.object({ name: z.string() })) })

function invalidResponse(): never {
  throw new ApiError(502, 'AI_CONTRACT_INVALID', 'O assistente retornou uma resposta incompatível. Atualize o histórico antes de enviar novamente.')
}
function mapMessage(message: z.infer<typeof messageSchema>) {
  return { input: message.input_message, output: message.output_message, submittedAt: /(?:Z|[+-]\d{2}:\d{2})$/.test(message.submitted_at) ? message.submitted_at : `${message.submitted_at}Z` }
}

export function createAssistantService(config: Config) {
  const profileRequest = createHttpClient(config.MS_AUTH_URL, config.UPSTREAM_TIMEOUT_MS, 'PROFILE')
  function client() {
    if (!config.MS_AI_URL) throw new ApiError(503, 'AI_NOT_CONFIGURED', 'O assistente está temporariamente indisponível.')
    const request = createHttpClient(config.MS_AI_URL, config.AI_TIMEOUT_MS, 'AI', 524288)
    return (path: string, options: ServiceOptions) => request(`${config.MS_AI_PATH_PREFIX}${path}`, options)
  }
  async function conversations(userId: number, token: string, requestId: string) {
    const data = await client()(`/ai/sessions/user/${userId}`, { method: 'GET', token, requestId, allowNotFound: true })
    if (data === null) return []
    const parsed = z.array(conversationSchema).safeParse(data)
    if (!parsed.success || new Set(parsed.data.map((item) => item.id)).size !== parsed.data.length) invalidResponse()
    return parsed.data
  }
  async function ensureOwnership(id: string, userId: number, token: string, requestId: string) {
    const owned = await conversations(userId, token, requestId)
    if (!owned.some((item) => item.id === id)) throw new ApiError(404, 'AI_CONVERSATION_NOT_FOUND', 'Conversa não encontrada para sua conta.')
  }
  return {
    conversations,
    async authorize(user: SessionUser, token: string, requestId: string) {
      client()
      const profile = identitySchema.safeParse(await profileRequest('/api/profile', { method: 'GET', token, requestId }))
      if (!profile.success || profile.data.id !== user.id || profile.data.email !== user.email) {
        throw new ApiError(502, 'AI_IDENTITY_INVALID', 'Não foi possível confirmar sua empresa para acessar o assistente.')
      }
      if (!profile.data.permissions.some((permission) => permission.name === 'chatbot')) {
        throw new ApiError(403, 'AI_FORBIDDEN', 'Sua conta não tem permissão para usar o assistente.')
      }
      return profile.data.enterprise.id
    },
    async messages(id: string, userId: number, token: string, requestId: string) {
      await ensureOwnership(id, userId, token, requestId)
      const parsed = z.array(messageSchema).safeParse(await client()(`/ai/session/${id}/messages`, { method: 'GET', token, requestId }))
      if (!parsed.success) invalidResponse()
      return parsed.data.map(mapMessage)
    },
    async send(input: z.infer<typeof sendMessageSchema>, user: SessionUser, companyId: number, token: string, requestId: string) {
      const request = client()
      if (input.conversationId) await ensureOwnership(input.conversationId, user.id, token, requestId)
      const parsed = replySchema.safeParse(await request('/ai/user/session/message', {
        method: 'POST', token, requestId,
        body: {
          input: input.text, id_external_user: user.id, id_external_company: companyId,
          ...(input.conversationId ? { id_session: input.conversationId } : {}),
        },
      }))
      if (!parsed.success || parsed.data.input_message !== input.text ||
          (input.conversationId && parsed.data.id_session !== input.conversationId)) invalidResponse()
      return { ...mapMessage(parsed.data), conversation: { id: parsed.data.id_session, name: parsed.data.session_name } }
    },
  }
}
