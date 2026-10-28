import { useEffect, useRef, useState } from 'react'
import { getConversations, getConversationMessages, sendAssistantMessage, assistantMessageLimit } from '../services/assistant'
import { HttpError } from '../services/http'
import type { AssistantTurn, Conversation, ChatMessage } from '../types/assistant'

interface AssistantState {
  conversations: Conversation[]
  conversationId: string | null
  messages: ChatMessage[]
  draft: string
  loading: boolean
  sending: boolean
  error: string | null
  sessionExpired: boolean
}
function messagesFromTurns(turns: AssistantTurn[]): ChatMessage[] {
  return turns.flatMap((turn) => {
    const id = crypto.randomUUID()
    return [{ id: `${id}-user`, author: 'user' as const, text: turn.input }, { id: `${id}-assistant`, author: 'assistant' as const, text: turn.output }]
  })
}
function failure(error: Error) {
  return { error: error.message, sessionExpired: error instanceof HttpError && error.status === 401 }
}

export function useAssistant() {
  const [state, setState] = useState<AssistantState>({ conversations: [], conversationId: null, messages: [], draft: '', loading: true, sending: false, error: null, sessionExpired: false })
  const [attempt, setAttempt] = useState(0)
  const history = useRef<AbortController | null>(null)
  const sending = useRef<AbortController | null>(null)
  const selected = useRef<string | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    const id = selected.current
    void getConversations(controller.signal).then(async (conversations) => {
      if (controller.signal.aborted) return
      if (id && !conversations.some((item) => item.id === id)) {
        selected.current = null
        setState((current) => ({ ...current, conversations, conversationId: null, messages: [], loading: false, error: 'Conversa não encontrada para sua conta.' }))
        return
      }
      const turns = id ? await getConversationMessages(id, controller.signal) : null
      if (!controller.signal.aborted) setState((current) => ({ ...current, conversations, ...(turns ? { messages: messagesFromTurns(turns) } : {}), loading: false, error: null, sessionExpired: false }))
    }).catch((error: Error) => {
      if (!controller.signal.aborted) setState((current) => ({ ...current, loading: false, ...failure(error) }))
    })
    return () => { controller.abort(); history.current?.abort(); sending.current?.abort() }
  }, [attempt])

  async function openConversation(id: string | null) {
    if (sending.current) return
    history.current?.abort()
    selected.current = id
    setState((current) => ({ ...current, conversationId: id, messages: [], draft: '', error: null, sessionExpired: false, loading: Boolean(id) }))
    if (!id) return
    const controller = new AbortController()
    history.current = controller
    try {
      const turns = await getConversationMessages(id, controller.signal)
      if (!controller.signal.aborted && selected.current === id) setState((current) => ({ ...current, messages: messagesFromTurns(turns), loading: false }))
    } catch (error) {
      if (!controller.signal.aborted) setState((current) => ({ ...current, loading: false, ...failure(error as Error) }))
    } finally { if (history.current === controller) history.current = null }
  }

  async function send(text: string) {
    const trimmed = text.trim()
    if (sending.current || history.current || state.loading) return
    if (!trimmed || trimmed.length > assistantMessageLimit) {
      setState((current) => ({ ...current, error: 'Escreva uma mensagem de até 8192 caracteres.' }))
      return
    }
    const controller = new AbortController()
    sending.current = controller
    const id = crypto.randomUUID()
    setState((current) => ({ ...current, sending: true, error: null, sessionExpired: false, draft: '', messages: [...current.messages, { id, author: 'user', text: trimmed }] }))
    try {
      const reply = await sendAssistantMessage({ text: trimmed, ...(selected.current ? { conversationId: selected.current } : {}) }, controller.signal)
      if (controller.signal.aborted) return
      selected.current = reply.conversation.id
      setState((current) => ({
        ...current, sending: false, conversationId: reply.conversation.id,
        conversations: [reply.conversation, ...current.conversations.filter((item) => item.id !== reply.conversation.id)],
        messages: [...current.messages.filter((item) => item.id !== id), ...messagesFromTurns([reply])],
      }))
    } catch (error) {
      if (!controller.signal.aborted) setState((current) => ({ ...current, sending: false, draft: trimmed, messages: current.messages.filter((item) => item.id !== id), ...failure(error as Error) }))
    } finally { if (sending.current === controller) sending.current = null }
  }

  function reload() {
    if (sending.current) return
    history.current?.abort()
    setState((current) => ({ ...current, loading: true, error: null, sessionExpired: false }))
    setAttempt((value) => value + 1)
  }
  return { ...state, send, openConversation, reload, setDraft: (draft: string) => setState((current) => ({ ...current, draft })) }
}
