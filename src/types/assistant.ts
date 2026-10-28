export interface Conversation { id: string; name: string }
export interface AssistantTurn { input: string; output: string; submittedAt: string }
export interface AssistantReply extends AssistantTurn { conversation: Conversation }
export interface SendAssistantMessage { text: string; conversationId?: string }
export interface ChatMessage { id: string; author: 'user' | 'assistant'; text: string }
