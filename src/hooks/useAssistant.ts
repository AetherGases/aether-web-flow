import { useEffect, useReducer, useRef, useState } from 'react'
import { getConversations, getConversationMessages, sendAssistantMessage } from '../services/assistant'
import { HttpError } from '../services/http'
import { validateAssistantMessage } from '../utils/assistant'
import { assistantReducer, initialAssistantState } from '../utils/assistant-reducer'
import type { AssistantTurn, ChatMessage, UseAssistantResult } from '../types/assistant'

function messagesFromTurns(turns: AssistantTurn[]): ChatMessage[] {
  return turns.flatMap((turn) => {
    const id = crypto.randomUUID()
    return [{ id: `${id}-user`, author: 'user' as const, text: turn.input }, { id: `${id}-assistant`, author: 'assistant' as const, text: turn.output }]
  })
}
function failure(error: Error) {
  return { error: error.message, sessionExpired: error instanceof HttpError && error.status === 401 }
}

export function useAssistant(): UseAssistantResult {
  const [state, dispatch] = useReducer(assistantReducer, initialAssistantState)
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
        dispatch({ type: 'conversationMissing', conversations })
        return
      }
      const turns = id ? await getConversationMessages(id, controller.signal) : null
      if (!controller.signal.aborted) dispatch({ type: 'historyLoaded', conversations,
        ...(turns ? { messages: messagesFromTurns(turns) } : {}) })
    }).catch((error: Error) => {
      if (!controller.signal.aborted) dispatch({ type: 'loadFailed', ...failure(error) })
    })
    return () => { controller.abort(); history.current?.abort(); sending.current?.abort() }
  }, [attempt])

  async function openConversation(id: string | null): Promise<void> {
    if (sending.current) return
    history.current?.abort()
    history.current = null
    selected.current = id
    dispatch({ type: 'conversationSelected', id })
    if (!id) return
    const controller = new AbortController()
    history.current = controller
    try {
      const turns = await getConversationMessages(id, controller.signal)
      if (!controller.signal.aborted && selected.current === id) dispatch({ type: 'messagesLoaded', id, messages: messagesFromTurns(turns) })
    } catch (error) {
      if (!controller.signal.aborted) dispatch({ type: 'loadFailed', ...failure(error as Error) })
    } finally { if (history.current === controller) history.current = null }
  }

  async function send(text: string): Promise<void> {
    if (sending.current || history.current || state.status === 'loading') return
    const validationError = validateAssistantMessage(text)
    if (validationError) { dispatch({ type: 'validationFailed', error: validationError }); return }
    const trimmed = text.trim()
    const controller = new AbortController()
    sending.current = controller
    const id = crypto.randomUUID()
    dispatch({ type: 'sendStarted', message: { id, author: 'user', text: trimmed } })
    try {
      const reply = await sendAssistantMessage({ text: trimmed, ...(selected.current ? { conversationId: selected.current } : {}) }, controller.signal)
      if (controller.signal.aborted) return
      selected.current = reply.conversation.id
      dispatch({ type: 'sendSucceeded', optimisticId: id, conversation: reply.conversation, messages: messagesFromTurns([reply]) })
    } catch (error) {
      if (!controller.signal.aborted) dispatch({ type: 'sendFailed', optimisticId: id, draft: trimmed, ...failure(error as Error) })
    } finally { if (sending.current === controller) sending.current = null }
  }

  function reload() {
    if (sending.current) return
    history.current?.abort()
    dispatch({ type: 'refreshStarted' })
    setAttempt((value) => value + 1)
  }
  const { status, ...data } = state
  return { ...data, loading: status === 'loading', sending: status === 'sending', send, openConversation,
    reload, setDraft: (draft) => dispatch({ type: 'draftChanged', draft }) }
}
