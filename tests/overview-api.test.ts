import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseOverview } from '../src/services/overview.ts'
const inventory = { id: 1, name: 'Inventário', createdAt: '2026-10-22T12:00:00', status: 'ISSUED', type: 'OUTPUT' }
const response = { scope: 'personal', indicators: { awaitingReview: { status: 'ready', data: 2 }, approved: { status: 'ready', data: 3 }, processingFailed: { status: 'ready', data: 1 }, pendingReview: null }, counts: { status: 'ready', data: { submittedCount: 3, reviewedCount: 1 } }, history: { status: 'ready', data: { inventories: [inventory], totalCount: 3 } }, lastSubmitted: { status: 'ready', data: null } }

test('contrato mantém status reais, sucesso vazio e erro isolado', () => {
  const parsed = parseOverview(response)
  assert.equal(parsed.history.status, 'ready')
  if (parsed.history.status === 'ready') assert.equal(parsed.history.data.inventories[0].status, 'ISSUED')
  const partial = parseOverview({ ...response, counts: { status: 'error', error: { code: 'INVENTORY_ACCESS_DENIED', message: 'Não autorizado.' } } })
  assert.equal(partial.counts.status, 'error')
  assert.equal(partial.history.status, 'ready')
  assert.deepEqual(parseOverview(response).lastSubmitted, { status: 'ready', data: null })
})

test('contrato rejeita estados ambíguos, contagens inválidas e status inventados', () => {
  assert.throws(() => parseOverview({ ...response, scope: 'company' }))
  assert.throws(() => parseOverview({ ...response, counts: { status: 'ready', data: { submittedCount: -1, reviewedCount: 0 } } }))
  assert.throws(() => parseOverview({ ...response, counts: { status: 'error' } }))
  assert.throws(() => parseOverview({ ...response, history: { status: 'ready', data: { inventories: [{ ...inventory, status: 'completed' }], totalCount: 1 } } }))
})
test('indicadores preservam contagens reais e distinguem revisão pessoal de pendência departamental', () => {
  assert.deepEqual(parseOverview(response).indicators.approved, { status: 'ready', data: 3 })
  const admin = parseOverview({ ...response, indicators: { awaitingReview: null, approved: null, processingFailed: null, pendingReview: { status: 'ready', data: { count: 4, scope: 'department' } } } })
  assert.deepEqual(admin.indicators.pendingReview, { status: 'ready', data: { count: 4, scope: 'department' } })
  assert.throws(() => parseOverview({ ...response, indicators: { ...response.indicators, approved: { status: 'ready', data: -1 } } }))
})