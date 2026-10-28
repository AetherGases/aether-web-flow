import type { Conversation, AssistantTurn, AssistantReply, SendAssistantMessage } from '../types/assistant.ts'
import { HttpError, request } from './http.ts'

export const assistantMessageLimit = 8192
export function isConversationId(id: string): boolean { return typeof id === 'string' && /^[a-f0-9]{24}$/i.test(id) }
function parseConversation(data: Conversation): Conversation {
  if (!data || !isConversationId(data.id) || typeof data.name !== 'string' || !data.name.trim()) throw new Error('Resposta de conversa inválida.')
  return { id: data.id, name: data.name }
}
export function parseAssistantTurn(data: AssistantTurn): AssistantTurn {
  if (!data || typeof data.input !== 'string' || typeof data.output !== 'string' || !data.output.trim() ||
      typeof data.submittedAt !== 'string' || !Number.isFinite(Date.parse(data.submittedAt))) throw new Error('Resposta de mensagem inválida.')
  return { input: data.input, output: data.output, submittedAt: data.submittedAt }
}
export function parseConversations(data: Conversation[]): Conversation[] {
  if (!Array.isArray(data)) throw new Error('Resposta de conversas inválida.')
  const conversations = data.map(parseConversation)
  if (new Set(conversations.map((item) => item.id)).size !== conversations.length) throw new Error('Conversas duplicadas na resposta.')
  return conversations
}
function responseError(error: Error): never {
  if (error instanceof HttpError || error.name === 'AbortError') throw error
  throw new Error('O assistente retornou uma resposta incompatível. Atualize o histórico antes de enviar novamente.', { cause: error })
}
export async function getConversations(signal?: AbortSignal): Promise<Conversation[]> {
  try { return parseConversations(await request('/assistant/conversations', { signal }) as Conversation[]) }
  catch (error) { return responseError(error as Error) }
}
export async function getConversationMessages(id: string, signal?: AbortSignal): Promise<AssistantTurn[]> {
  if (!isConversationId(id)) throw new Error('Selecione uma conversa válida.')
  try {
    const turns = await request(`/assistant/conversations/${id}/messages`, { signal }) as AssistantTurn[]
    if (!Array.isArray(turns)) throw new Error('Histórico inválido.')
    return turns.map(parseAssistantTurn)
  } catch (error) { return responseError(error as Error) }
}
export async function sendAssistantMessage(input: SendAssistantMessage, signal?: AbortSignal): Promise<AssistantReply> {
  const text = input.text.trim()
  if (!text || text.length > assistantMessageLimit) throw new Error('Escreva uma mensagem de até 8192 caracteres.')
  if (input.conversationId !== undefined && !isConversationId(input.conversationId)) throw new Error('Selecione uma conversa válida.')
  try {
    const data = await request('/assistant/messages', { method: 'POST', signal, body: JSON.stringify({ text, ...(input.conversationId ? { conversationId: input.conversationId } : {}) }) }) as AssistantReply
    const turn = parseAssistantTurn(data)
    const conversation = parseConversation(data.conversation)
    if (turn.input !== text || (input.conversationId && conversation.id !== input.conversationId)) throw new Error('Conversa incompatível com o envio.')
    return { ...turn, conversation }
  } catch (error) { return responseError(error as Error) }
}
