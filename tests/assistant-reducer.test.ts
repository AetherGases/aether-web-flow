import assert from 'node:assert/strict'
import { test } from 'node:test'
import { assistantReducer, initialAssistantState } from '../src/utils/assistant-reducer.ts'
import { assistantMessageLimit, validateAssistantMessage } from '../src/utils/assistant.ts'
import type { ChatMessage } from '../src/types/assistant.ts'

const conversation = { id: '65a8b3d6c0f8e1d7f4b2c001', name: 'Conversa' }
const optimistic: ChatMessage = { id: 'pending', author: 'user', text: 'Pergunta' }

test('envio confirma conversa e troca mensagem otimista sem duplicar histórico', () => {
  const ready = assistantReducer(initialAssistantState, { type: 'historyLoaded', conversations: [conversation] })
  const sending = assistantReducer({ ...ready, draft: 'Pergunta' }, { type: 'sendStarted', message: optimistic })
  assert.equal(sending.status, 'sending')
  assert.equal(sending.draft, '')
  const messages: ChatMessage[] = [{ id: 'confirmed-user', author: 'user', text: 'Pergunta' }, { id: 'reply', author: 'assistant', text: 'Resposta' }]
  const finished = assistantReducer(sending, { type: 'sendSucceeded', optimisticId: 'pending', conversation, messages })
  assert.equal(finished.status, 'ready')
  assert.equal(finished.conversationId, conversation.id)
  assert.deepEqual(finished.messages, messages)
  assert.equal(finished.conversations.length, 1)
  assert.deepEqual(ready.messages, [])
  assert.deepEqual(sending.messages, [optimistic])
})

test('falha de envio devolve o rascunho e remove só a mensagem otimista', () => {
  const previous: ChatMessage = { id: 'old', author: 'assistant', text: 'Histórico' }
  const sending = assistantReducer({ ...initialAssistantState, status: 'ready', messages: [previous] }, { type: 'sendStarted', message: optimistic })
  const failed = assistantReducer(sending, { type: 'sendFailed', optimisticId: 'pending', draft: 'Pergunta', error: 'Sem sessão', sessionExpired: true })
  assert.equal(failed.status, 'ready')
  assert.equal(failed.draft, 'Pergunta')
  assert.equal(failed.sessionExpired, true)
  assert.deepEqual(failed.messages, [previous])
})

test('mensagens de uma seleção antiga não substituem a conversa atual', () => {
  const selected = assistantReducer(initialAssistantState, { type: 'conversationSelected', id: conversation.id })
  const stale = assistantReducer(selected, { type: 'messagesLoaded', id: 'old-conversation', messages: [optimistic] })
  assert.strictEqual(stale, selected)
  const reset = assistantReducer(selected, { type: 'conversationSelected', id: null })
  assert.equal(reset.status, 'ready')
  assert.equal(reset.conversationId, null)
  assert.deepEqual(reset.messages, [])
})

test('histórico ausente, refresh e erro têm transições explícitas', () => {
  const missing = assistantReducer(initialAssistantState, { type: 'conversationMissing', conversations: [] })
  assert.equal(missing.status, 'ready')
  assert.equal(missing.conversationId, null)
  assert.match(missing.error ?? '', /Conversa não encontrada/)
  const loading = assistantReducer(missing, { type: 'refreshStarted' })
  assert.equal(loading.status, 'loading')
  assert.equal(loading.error, null)
  const failed = assistantReducer(loading, { type: 'loadFailed', error: 'Indisponível', sessionExpired: false })
  assert.equal(failed.status, 'ready')
  assert.equal(failed.error, 'Indisponível')
})

test('validação por campo não apaga a conversa e aceita conteúdo externo como texto', () => {
  assert.equal(validateAssistantMessage('   '), 'Escreva uma mensagem de até 8192 caracteres.')
  assert.equal(validateAssistantMessage('a'.repeat(assistantMessageLimit + 1)), 'Escreva uma mensagem de até 8192 caracteres.')
  assert.equal(validateAssistantMessage('a'.repeat(assistantMessageLimit)), null)
  assert.equal(validateAssistantMessage('<script>alert(1)</script>'), null)
  const invalid = assistantReducer(initialAssistantState, { type: 'validationFailed', error: 'Mensagem inválida' })
  assert.equal(invalid.draftError, 'Mensagem inválida')
  const edited = assistantReducer(invalid, { type: 'draftChanged', draft: 'Correção' })
  assert.equal(edited.draftError, null)
  assert.equal(edited.draft, 'Correção')
})
