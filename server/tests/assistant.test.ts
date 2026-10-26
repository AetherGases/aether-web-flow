import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createServer, type Server } from 'node:http'
import { test, type TestContext } from 'node:test'
import { createApp } from '../src/app.ts'
import { readConfig } from '../src/config/index.ts'

const origin = 'http://localhost:5173'
const id = '65a8b3d6c0f8e1d7f4b2c001'
const foreign = '65a8b3d6c0f8e1d7f4b2c002'
const historyTurn = { input_message: 'Pergunta anterior', output_message: 'Resposta anterior', submitted_at: '2026-10-25T12:00:00' }
async function listen(server: Server) {
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const address = server.address()
  assert(address && typeof address !== 'string')
  return `http://127.0.0.1:${address.port}`
}
async function harness(t: TestContext) {
  let release: (() => void) | undefined
  let started: (() => void) | undefined
  const gate = new Promise<void>((resolve) => { release = resolve })
  const sendStarted = new Promise<void>((resolve) => { started = resolve })
  const state = {
    status: 200, listStatus: 200, malformed: false, malformedHistory: false, wrongReply: false, hold: false, delay: false,
    hasPermission: true, missingCompany: false, identityMismatch: false, profileCalls: 0, role: 'analyst',
    aiPaths: [] as string[], bodies: [] as { input: string; id_external_user: number; id_external_company: number; id_session?: string }[],
  }
  const upstream = createServer(async (request, response) => {
    response.setHeader('Content-Type', 'application/json')
    if (request.url === '/api/auth/login') return response.end(JSON.stringify({ email: 'test@example.com', authenticated: true, expiration: new Date(Date.now() + 3600000).toISOString(), accessToken: 'private-access', refreshToken: 'private-refresh', role: state.role }))
    assert.equal(request.headers.authorization, 'Bearer private-access')
    if (request.url === '/api/profile') {
      state.profileCalls++
      return response.end(JSON.stringify({ id: state.identityMismatch && state.profileCalls % 2 === 1 ? 999 : 1, name: 'Usuária de teste', email: 'test@example.com', permissions: state.hasPermission ? [{ name: 'chatbot' }] : [], enterprise: state.missingCompany ? null : { id: 90, name: 'not-public' } }))
    }
    const aiPath = request.url?.replace(/^\/hub(?=\/ai\/)/, '')
    state.aiPaths.push(request.url ?? '')
    assert(request.headers['x-request-id'])
    if (aiPath === '/ai/sessions/user/1') {
      response.statusCode = state.listStatus
      return response.end(JSON.stringify(state.listStatus === 200 ? state.malformed ? {} : [{ id, name: 'Conversa', internal: 'private-stack' }] : { detail: 'private-stack' }))
    }
    if (aiPath === `/ai/session/${id}/messages`) return response.end(JSON.stringify(state.malformedHistory ? {} : [{ ...historyTurn, internal: 'private-stack' }]))
    if (aiPath === '/ai/user/session/message') {
      assert.equal(request.method, 'POST')
      let raw = ''
      for await (const chunk of request) raw += chunk
      const body = JSON.parse(raw)
      state.bodies.push(body)
      started?.()
      if (state.delay) return
      if (state.hold) await gate
      response.statusCode = state.status
      return response.end(JSON.stringify(state.status === 200 ? {
        input_message: state.wrongReply ? 'Outra mensagem' : body.input, output_message: 'Resposta real do serviço simulado',
        submitted_at: '2026-10-25T12:00:00Z', id_session: body.id_session ?? id, session_name: 'Conversa', internal: 'private-stack',
      } : { detail: 'private-stack-secret' }))
    }
    response.statusCode = 404
    response.end('{}')
  })
  const upstreamUrl = await listen(upstream)
  const config = readConfig({ NODE_ENV: 'test', SESSION_SECRET: 'test-secret-with-at-least-32-characters', FRONTEND_ORIGIN: origin, MS_AUTH_URL: upstreamUrl, MS_AI_URL: upstreamUrl, AI_TIMEOUT_MS: '1000', UPSTREAM_TIMEOUT_MS: '1000' })
  const server = createServer(createApp(config))
  const base = await listen(server)
  t.after(() => { release?.(); server.closeAllConnections(); server.close(); upstream.closeAllConnections(); upstream.close() })
  const headers = { Origin: origin, 'Content-Type': 'application/json' }
  async function login() {
    const response = await fetch(`${base}/api/v1/auth/login`, { method: 'POST', headers, body: JSON.stringify({ email: 'test@example.com', password: 'test-password' }) })
    assert.equal(response.status, 200)
    const cookie = response.headers.get('set-cookie')?.split(';')[0]
    assert(cookie)
    return cookie
  }
  function send(cookie: string, body: object = { text: 'Olá' }, requestOrigin = origin) {
    return fetch(`${base}/api/v1/assistant/messages`, { method: 'POST', headers: { ...headers, Cookie: cookie, Origin: requestOrigin }, body: JSON.stringify(body) })
  }
  function get(cookie: string, path: string) { return fetch(`${base}/api/v1/assistant/${path}`, { headers: { Cookie: cookie } }) }
  return { state, config, base, login, send, get, sendStarted, release: () => release?.() }
}

test('assistente exige sessão, origem e JSON antes de chamar IA', async (t) => {
  const h = await harness(t)
  assert.equal((await h.get('', 'conversations')).status, 401)
  assert.equal((await h.send('')).status, 401)
  const cookie = await h.login()
  assert.equal((await h.send(cookie, { text: 'Olá' }, 'https://outside.example')).status, 403)
  assert.equal((await fetch(`${h.base}/api/v1/assistant/messages`, { method: 'POST', headers: { Origin: origin, Cookie: cookie }, body: 'text' })).status, 415)
  assert.equal(h.state.aiPaths.length, 0)
})

test('envio deriva identidade/empresa do perfil e devolve somente os campos públicos', async (t) => {
  const h = await harness(t)
  const cookie = await h.login()
  const response = await h.send(cookie, { text: '  Olá  ' })
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  const text = await response.text()
  assert(!text.includes('private-'))
  assert.deepEqual(JSON.parse(text), { input: 'Olá', output: 'Resposta real do serviço simulado', submittedAt: '2026-10-25T12:00:00Z', conversation: { id, name: 'Conversa' } })
  assert.deepEqual(h.state.bodies, [{ input: 'Olá', id_external_user: 1, id_external_company: 90 }])
  const second = await h.send(cookie, { text: 'Continue', conversationId: id })
  assert.equal(second.status, 200)
  assert.equal(h.state.bodies[1].id_session, id)
})

test('listagem e histórico usam o usuário autenticado, com verificação de propriedade', async (t) => {
  const h = await harness(t)
  const cookie = await h.login()
  assert.deepEqual(await (await h.get(cookie, 'conversations?userId=999')).json(), [{ id, name: 'Conversa' }])
  assert.deepEqual(await (await h.get(cookie, `conversations/${id}/messages`)).json(), [{ input: historyTurn.input_message, output: historyTurn.output_message, submittedAt: `${historyTurn.submitted_at}Z` }])
  const before = h.state.aiPaths.length
  assert.equal((await h.get(cookie, `conversations/${foreign}/messages`)).status, 404)
  assert.equal((await h.send(cookie, { text: 'Olá', conversationId: foreign })).status, 404)
  assert(!h.state.aiPaths.slice(before).includes(`/ai/session/${foreign}/messages`))
  assert.equal(h.state.bodies.length, 0)
})

test('rejeita identidade fornecida pelo browser, campos inválidos e caminhos malformados', async (t) => {
  const h = await harness(t)
  const cookie = await h.login()
  for (const body of [{}, { text: '' }, { text: 'x'.repeat(8193) }, { text: 10 }, { text: 'Olá', id_external_user: 999 }, { text: 'Olá', id_external_company: 1 }, { text: 'Olá', role: 'administrator' }, { text: 'Olá', conversationId: '../other' }]) assert.equal((await h.send(cookie, body)).status, 400)
  assert.equal(h.state.aiPaths.length, 0)
  const long = await h.send(cookie, { text: 'ç'.repeat(8192) })
  assert.equal(long.status, 200)
})

test('empresa ausente ou identidade incompatível bloqueia envio sem fallback', async (t) => {
  const h = await harness(t)
  const cookie = await h.login()
  h.state.missingCompany = true
  assert.equal((await h.send(cookie)).status, 502)
  h.state.missingCompany = false
  h.state.identityMismatch = true
  assert.equal((await h.send(cookie)).status, 502)
  assert.equal(h.state.bodies.length, 0)
})

test('lista inexistente vira vazio; contrato incorreto não vira conversa ou resposta fictícia', async (t) => {
  const h = await harness(t)
  const cookie = await h.login()
  h.state.listStatus = 404
  assert.deepEqual(await (await h.get(cookie, 'conversations')).json(), [])
  h.state.listStatus = 200
  h.state.malformed = true
  assert.equal((await h.get(cookie, 'conversations')).status, 502)
  h.state.malformed = false
  h.state.malformedHistory = true
  assert.equal((await h.get(cookie, `conversations/${id}/messages`)).status, 502)
  h.state.wrongReply = true
  assert.equal((await h.send(cookie)).status, 502)
})

test('guardrail, falta de acesso e indisponibilidade têm erros seguros e não fazem retry', async (t) => {
  const h = await harness(t)
  h.state.role = 'administrator'
  const cookie = await h.login()
  for (const [status, expected, code] of [[422, 422, 'AI_ANSWER_REJECTED'], [403, 403, 'AI_FORBIDDEN'], [400, 400, 'AI_VALIDATION_ERROR'], [500, 502, 'AI_UNAVAILABLE']] as const) {
    h.state.status = status
    const response = await h.send(cookie)
    assert.equal(response.status, expected)
    const text = await response.text()
    assert.equal(JSON.parse(text).error.code, code)
    assert(!text.includes('private-'))
  }
  assert.equal(h.state.bodies.length, 4)
  assert.equal((await fetch(`${h.base}/api/v1/auth/me`, { headers: { Cookie: cookie } })).status, 200)
})

test('envios simultâneos para a mesma conversa não geram duas chamadas ao modelo', async (t) => {
  const h = await harness(t)
  const cookie = await h.login()
  h.state.hold = true
  const pending = h.send(cookie, { text: 'Primeira', conversationId: id })
  await h.sendStarted
  const second = await h.send(cookie, { text: 'Segunda', conversationId: id })
  assert.equal(second.status, 409)
  h.release()
  assert.equal((await pending).status, 200)
  assert.equal(h.state.bodies.length, 1)
})

test('timeout não reenvia mensagem e configuração ausente não impede autenticação', async (t) => {
  const h = await harness(t)
  const cookie = await h.login()
  delete h.config.MS_AI_URL
  assert.equal((await h.send(cookie)).status, 503)
  assert.equal(h.state.bodies.length, 0)
  h.config.MS_AI_URL = h.config.MS_AUTH_URL
  h.config.AI_TIMEOUT_MS = 100
  h.state.delay = true
  const response = await h.send(cookie)
  assert.equal(response.status, 504)
  assert.equal((await response.json()).error.code, 'AI_TIMEOUT')
  assert.equal(h.state.bodies.length, 1)
})


test('ausência de chatbot bloqueia todas as rotas, inclusive para administrador', async (t) => {
  const h = await harness(t)
  h.state.role = 'administrator'
  const cookie = await h.login()
  h.state.hasPermission = false
  for (const response of [await h.get(cookie, 'conversations'), await h.get(cookie, `conversations/${id}/messages`), await h.send(cookie)]) {
    assert.equal(response.status, 403)
    assert.equal((await response.json()).error.code, 'AI_FORBIDDEN')
  }
  assert.equal(h.state.aiPaths.length, 0)
})

test('configuração da IA exige origem sem caminho, HTTPS em produção e timeout limitado', () => {
  const env = { NODE_ENV: 'test', SESSION_SECRET: 'x'.repeat(32), FRONTEND_ORIGIN: origin, MS_AUTH_URL: 'http://localhost:3000' }
  assert.throws(() => readConfig({ ...env, MS_AI_URL: 'https://ai.example/ai' }))
  assert.throws(() => readConfig({ ...env, AI_TIMEOUT_MS: '180001' }))
  assert.throws(() => readConfig({ ...env, NODE_ENV: 'production', FRONTEND_ORIGIN: 'https://web.example', MS_AUTH_URL: 'https://auth.example', REDIS_URL: 'redis://localhost:6379', MS_AI_URL: 'http://localhost:8000' }))
})


test('prefixo do gateway é aplicado à listagem, histórico e envio sem perder /ai', async (t) => {
  const h = await harness(t)
  h.config.MS_AI_PATH_PREFIX = '/hub'
  const cookie = await h.login()
  assert.equal((await h.get(cookie, 'conversations')).status, 200)
  assert.equal((await h.get(cookie, `conversations/${id}/messages`)).status, 200)
  assert.equal((await h.send(cookie, { text: 'Olá', conversationId: id })).status, 200)
  assert(h.state.aiPaths.includes('/hub/ai/sessions/user/1'))
  assert(h.state.aiPaths.includes(`/hub/ai/session/${id}/messages`))
  assert(h.state.aiPaths.includes('/hub/ai/user/session/message'))
})

test('prefixo da IA rejeita URLs externas, query e segmentos relativos', () => {
  const env = { SESSION_SECRET: 'x'.repeat(32), FRONTEND_ORIGIN: origin, MS_AUTH_URL: 'http://localhost:3000' }
  for (const prefix of ['//other.example', '/../other', '/hub?key=x', 'https://other.example', '/hub/']) {
    assert.throws(() => readConfig({ ...env, MS_AI_PATH_PREFIX: prefix }))
  }
})
