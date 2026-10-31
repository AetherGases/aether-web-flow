import type { AssistantState, AssistantAction } from '../types/assistant.ts'

export const initialAssistantState: AssistantState = {
  status: 'loading', conversations: [], conversationId: null, messages: [],
  draft: '', draftError: null, error: null, sessionExpired: false,
}

// Cada ação representa uma transição completa para não separar estados dependentes.
export function assistantReducer(state: AssistantState, action: AssistantAction): AssistantState {
  switch (action.type) {
    case 'historyLoaded': return { ...state, status: 'ready', conversations: action.conversations,
      ...(action.messages !== undefined ? { messages: action.messages } : {}), error: null, sessionExpired: false }
    case 'conversationMissing': return { ...state, status: 'ready', conversations: action.conversations,
      conversationId: null, messages: [], error: 'Conversa não encontrada para sua conta.' }
    case 'conversationSelected': return { ...state, status: action.id ? 'loading' : 'ready',
      conversationId: action.id, messages: [], draft: '', draftError: null, error: null, sessionExpired: false }
    case 'messagesLoaded': return action.id !== state.conversationId ? state : { ...state,
      status: 'ready', messages: action.messages, error: null, sessionExpired: false }
    case 'loadFailed': return { ...state, status: 'ready', error: action.error, sessionExpired: action.sessionExpired }
    case 'sendStarted': return { ...state, status: 'sending', draft: '', draftError: null,
      error: null, sessionExpired: false, messages: [...state.messages, action.message] }
    case 'sendSucceeded': return { ...state, status: 'ready', conversationId: action.conversation.id,
      conversations: [action.conversation, ...state.conversations.filter((item) => item.id !== action.conversation.id)],
      messages: [...state.messages.filter((item) => item.id !== action.optimisticId), ...action.messages] }
    case 'sendFailed': return { ...state, status: 'ready', draft: action.draft, error: action.error,
      sessionExpired: action.sessionExpired, messages: state.messages.filter((item) => item.id !== action.optimisticId) }
    case 'draftChanged': return { ...state, draft: action.draft, draftError: null }
    case 'validationFailed': return { ...state, draftError: action.error }
    case 'refreshStarted': return { ...state, status: 'loading', error: null, sessionExpired: false }
    default: return unreachable(action)
  }
}

function unreachable(action: never): never { throw new Error(`Ação do assistente inválida: ${String(action)}`) }
