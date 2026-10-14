import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createServer, type Server } from 'node:http'
import { test, type TestContext } from 'node:test'
import session from 'express-session'
import { createApp } from '../src/app.ts'
import { readConfig } from '../src/config/index.ts'

const origin = 'http://localhost:5173'
const credentials = { email: 'test@example.com', password: 'test-password' }
const token = (role: unknown = 'analyst', expiration = Date.now() + 3600000) => ({
  email: credentials.email, authenticated: true, expiration: new Date(expiration).toISOString(),
  accessToken: 'private-access-token', refreshToken: 'private-refresh-token', role,
})

async function listen(server: Server): Promise<string> {
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const address = server.address()
  assert(address && typeof address !== 'string')
  return `http://127.0.0.1:${address.port}`
}

async function harness(t: TestContext, initialTokens = token()) {
  const state = { tokens: initialTokens, refreshTokens: token(), status: 200, profileStatus: 200, refreshStatus: 200, refreshCalls: 0, loginCalls: 0, delay: false }
  const upstream = createServer((request, response) => {
    response.setHeader('Content-Type', 'application/json')
    if (request.url === '/api/auth/login') {
      state.loginCalls++
      if (state.delay) return
      response.statusCode = state.status
      response.end(JSON.stringify(state.status === 200 ? state.tokens : { internal: 'private-stack-password' }))
    } else if (request.url?.startsWith('/api/auth/refresh/')) {
      state.refreshCalls++
      assert.equal(request.method, 'PUT')
      assert.equal(request.headers.authorization, 'Bearer private-refresh-token')
      response.statusCode = state.refreshStatus
      response.end(JSON.stringify(state.refreshTokens))
    } else if (request.url === '/api/profile') {
      assert.equal(request.headers.authorization, 'Bearer private-access-token')
      response.statusCode = state.profileStatus
      response.end(JSON.stringify({ id: 1, name: 'Usuário de teste', email: credentials.email, cpf: 'not-public' }))
    } else { response.statusCode = 404; response.end('{}') }
  })
  const upstreamUrl = await listen(upstream)
  const config = readConfig({ NODE_ENV: 'test', SESSION_SECRET: 'test-only-secret-with-at-least-32-characters', FRONTEND_ORIGIN: origin, MS_AUTH_URL: upstreamUrl, UPSTREAM_TIMEOUT_MS: '150' })
  const store = new session.MemoryStore()
  const appServer = createServer(createApp(config, store))
  const base = await listen(appServer)
  t.after(() => { appServer.closeAllConnections(); appServer.close(); upstream.closeAllConnections(); upstream.close(); store.clear(() => {}) })
  async function post(path: string, body: unknown = credentials, cookie?: string, requestOrigin = origin) {
    return fetch(`${base}/api/v1/auth/${path}`, { method: 'POST', headers: { Origin: requestOrigin, 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) }, body: JSON.stringify(body) })
  }
  async function login() {
    const response = await post('login')
    assert.equal(response.status, 200)
    const cookie = response.headers.get('set-cookie')?.split(';')[0]
    assert(cookie)
    return { response, cookie }
  }
  return { state, base, post, login, store }
}

test('login dos dois papéis, sessão recuperada e tokens somente no servidor', async (t) => {
  for (const role of ['analyst', 'administrator']) {
    await t.test(role, async (subtest) => {
      const h = await harness(subtest, token(role))
      const { response, cookie } = await h.login()
      const body = await response.text()
      assert.equal(JSON.parse(body).user.role, role)
      assert(!body.includes('private-access-token'))
      assert(!body.includes('private-refresh-token'))
      assert(!body.includes('not-public'))
      assert.match(response.headers.get('set-cookie') ?? '', /HttpOnly/)
      assert.match(response.headers.get('set-cookie') ?? '', /SameSite=Lax/)
      assert(!cookie.includes('private'))
      const me = await fetch(`${h.base}/api/v1/auth/me`, { headers: { Cookie: cookie } })
      assert.equal(me.status, 200)
      assert.equal((await me.json()).user.role, role)
      const restored = await fetch(`${h.base}/api/v1/auth/me`, { headers: { Cookie: cookie } })
      assert.equal(restored.status, 200)
    })
  }
})

test('sem sessão e cookie forjado não autenticam', async (t) => {
  const h = await harness(t)
  for (const cookie of ['', 'aether.sid=forged']) {
    const response = await fetch(`${h.base}/api/v1/auth/me`, { headers: { Cookie: cookie } })
    assert.equal(response.status, 401)
  }
})

test('role ausente/desconhecido não cria sessão nem assume analista', async (t) => {
  for (const role of [undefined, 'admin', 'superuser']) {
    await t.test(String(role), async (subtest) => {
      const payload = token()
      payload.role = role
      const h = await harness(subtest, payload)
      const response = await h.post('login')
      assert.equal(response.status, 502)
      assert.equal((await response.json()).error.code, 'AUTH_CONTRACT_INVALID')
      assert.equal(response.headers.get('set-cookie'), null)
    })
  }
})

test('validação e proteção de origem ocorrem antes de chamar ms-auth', async (t) => {
  const h = await harness(t)
  assert.equal((await h.post('login', { ...credentials, email: 'invalid' })).status, 400)
  assert.equal((await h.post('login', credentials, undefined, 'https://malicious.example')).status, 403)
  assert.equal(h.state.loginCalls, 0)
})

test('credenciais inválidas e falha upstream não expõem informações internas', async (t) => {
  const h = await harness(t)
  for (const [status, expected] of [[400, 401], [401, 401], [500, 502]]) {
    h.state.status = status
    const response = await h.post('login')
    assert.equal(response.status, expected)
    assert(!(await response.text()).includes('private-stack'))
    assert.equal(response.headers.get('set-cookie'), null)
  }
})

test('timeout de autenticação retorna erro recuperável sem criar sessão', async (t) => {
  const h = await harness(t)
  h.state.delay = true
  const response = await h.post('login')
  assert.equal(response.status, 504)
  assert.equal((await response.json()).error.code, 'AUTH_TIMEOUT')
})

test('access expirando renova uma vez em chamadas concorrentes e atualiza role', async (t) => {
  const h = await harness(t, token('administrator', Date.now() + 10000))
  h.state.refreshTokens = token('analyst')
  const { cookie } = await h.login()
  const responses = await Promise.all([1, 2, 3].map(() => fetch(`${h.base}/api/v1/auth/me`, { headers: { Cookie: cookie } })))
  for (const response of responses) {
    assert.equal(response.status, 200)
    assert.equal((await response.json()).user.role, 'analyst')
  }
  assert.equal(h.state.refreshCalls, 1)
})

test('refresh inválido encerra sessão e cookie antigo não recupera acesso', async (t) => {
  const h = await harness(t, token('analyst', Date.now() + 10000))
  const { cookie } = await h.login()
  h.state.refreshStatus = 401
  assert.equal((await fetch(`${h.base}/api/v1/auth/me`, { headers: { Cookie: cookie } })).status, 401)
  assert.equal((await fetch(`${h.base}/api/v1/auth/me`, { headers: { Cookie: cookie } })).status, 401)
})

test('logout remove sessão no store e exige origem válida', async (t) => {
  const h = await harness(t)
  const { cookie } = await h.login()
  assert.equal((await h.post('logout', {}, cookie, 'https://malicious.example')).status, 403)
  const response = await h.post('logout', {}, cookie)
  assert.equal(response.status, 204)
  assert.match(response.headers.get('set-cookie') ?? '', /Expires=Thu, 01 Jan 1970/)
  assert.equal((await fetch(`${h.base}/api/v1/auth/me`, { headers: { Cookie: cookie } })).status, 401)
  assert.equal((await h.post('logout', {})).status, 204)
})

test('configuração recusa segredos curtos e produção sem Redis/HTTPS', () => {
  assert.throws(() => readConfig({ SESSION_SECRET: 'short' }))
  assert.throws(() => readConfig({ NODE_ENV: 'production', SESSION_SECRET: 'a'.repeat(32), FRONTEND_ORIGIN: origin, MS_AUTH_URL: 'http://localhost:8080' }))
})
