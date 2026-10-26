import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getConversations, getConversationMessages, parseConversations, parseAssistantTurn, sendAssistantMessage } from '../src/services/assistant.ts'
import { HttpError } from '../src/services/http.ts'

const id = '65a8b3d6c0f8e1d7f4b2c001'
const turn = { input: 'Olá', output: 'Olá! Como posso ajudar?', submittedAt: '2026-10-25T12:00:00Z' }

test('contratos do assistente preservam texto externo e descartam campos extras', () => {
  const unsafe = { ...turn, output: '<script>alert(1)</script>\nResposta', internal: 'private' }
  assert.deepEqual(parseAssistantTurn(unsafe), { ...turn, output: unsafe.output })
  assert.deepEqual(parseConversations([{ id, name: 'Conversa' }]), [{ id, name: 'Conversa' }])
  assert.throws(() => parseConversations([{ id: '../other', name: 'Conversa' }]))
  assert.throws(() => parseConversations([{ id, name: 'A' }, { id, name: 'B' }]))
  assert.throws(() => parseAssistantTurn({ ...turn, output: '' }))
  assert.throws(() => parseAssistantTurn({ ...turn, submittedAt: 'invalid' }))
})

test('mensagem envia somente texto e conversa, sem token ou identidade escolhida pelo navegador', async (t) => {
  const original = globalThis.fetch
  t.after(() => { globalThis.fetch = original })
  globalThis.fetch = async (url, options) => {
    assert.equal(url, '/api/v1/assistant/messages')
    assert.equal(options?.method, 'POST')
    assert.equal(options?.credentials, 'same-origin')
    assert.deepEqual(JSON.parse(String(options?.body)), { text: 'Olá', conversationId: id })
    assert(!JSON.stringify(options?.headers).includes('Bearer'))
    return Response.json({ ...turn, conversation: { id, name: 'Conversa' }, internal: 'private' })
  }
  assert.deepEqual(await sendAssistantMessage({ text: ' Olá ', conversationId: id }), { ...turn, conversation: { id, name: 'Conversa' } })
})

test('campos vazios, limites e identificadores inválidos são rejeitados antes da chamada', async (t) => {
  const original = globalThis.fetch
  t.after(() => { globalThis.fetch = original })
  let calls = 0
  globalThis.fetch = async () => { calls++; return Response.json({}) }
  await assert.rejects(sendAssistantMessage({ text: '  ' }))
  await assert.rejects(sendAssistantMessage({ text: 'x'.repeat(8193) }))
  await assert.rejects(sendAssistantMessage({ text: 'Olá', conversationId: '../other' }))
  await assert.rejects(getConversationMessages('../other'))
  assert.equal(calls, 0)
})

test('falha, resposta de outra conversa e cancelamento não viram resposta local', async (t) => {
  const original = globalThis.fetch
  t.after(() => { globalThis.fetch = original })
  globalThis.fetch = async () => Response.json({ error: { code: 'AI_FORBIDDEN', message: 'Acesso não permitido.' } }, { status: 403 })
  await assert.rejects(getConversations(), (error: Error) => error instanceof HttpError && error.status === 403)
  globalThis.fetch = async () => Response.json({ ...turn, conversation: { id: '65a8b3d6c0f8e1d7f4b2c002', name: 'Outra conversa' } })
  await assert.rejects(sendAssistantMessage({ text: 'Olá', conversationId: id }))
  globalThis.fetch = async () => { throw new DOMException('Cancelled', 'AbortError') }
  await assert.rejects(getConversationMessages(id), { name: 'AbortError' })
})
