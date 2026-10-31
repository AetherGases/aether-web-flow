export interface Conversation { id: string; name: string }
export interface AssistantTurn { input: string; output: string; submittedAt: string }
export interface AssistantReply extends AssistantTurn { conversation: Conversation }
export interface SendAssistantMessage { text: string; conversationId?: string }
export interface ChatMessage { id: string; author: 'user' | 'assistant'; text: string }

export interface AssistantData {
  conversations: Conversation[]
  conversationId: string | null
  messages: ChatMessage[]
  draft: string
  draftError: string | null
  error: string | null
  sessionExpired: boolean
}
export type AssistantState = AssistantData & (
  { status: 'loading' } | { status: 'ready' } | { status: 'sending' }
)
export type AssistantAction =
  | { type: 'historyLoaded'; conversations: Conversation[]; messages?: ChatMessage[] }
  | { type: 'conversationMissing'; conversations: Conversation[] }
  | { type: 'conversationSelected'; id: string | null }
  | { type: 'messagesLoaded'; id: string; messages: ChatMessage[] }
  | { type: 'loadFailed'; error: string; sessionExpired: boolean }
  | { type: 'sendStarted'; message: ChatMessage }
  | { type: 'sendSucceeded'; optimisticId: string; conversation: Conversation; messages: ChatMessage[] }
  | { type: 'sendFailed'; optimisticId: string; draft: string; error: string; sessionExpired: boolean }
  | { type: 'draftChanged'; draft: string }
  | { type: 'validationFailed'; error: string }
  | { type: 'refreshStarted' }

export interface UseAssistantResult extends AssistantData {
  loading: boolean
  sending: boolean
  send: (text: string) => Promise<void>
  openConversation: (id: string | null) => Promise<void>
  reload: () => void
  setDraft: (draft: string) => void
}
