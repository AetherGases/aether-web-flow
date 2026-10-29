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

async function harness(t: TestContext, initialTokens = token(), production = false) {
  let releaseRefresh: (() => void) | undefined
  let signalRefresh: (() => void) | undefined
  const refreshStarted = new Promise<void>((resolve) => { signalRefresh = resolve })
  const refreshGate = new Promise<void>((resolve) => { releaseRefresh = resolve })
  const calculatorInput = { monthlyCost: 100000, reductionPercentage: 15, periodMonths: 3 }
  const calculatorResponse = { ...calculatorInput, currency: 'BRL', monthlySavings: 15000, newMonthlyCost: 85000, totalSavings: 45000, projection: [{ month: 1, accumulatedSavings: 15000 }, { month: 2, accumulatedSavings: 30000 }, { month: 3, accumulatedSavings: 45000 }] }
  const state = { calculatorResponse, calculatorStatus: 200, calculatorDelay: false, calculatorMalformed: false, calculatorHtml: false, calculatorCalls: 0, calculatorBodies: [] as object[], tokens: initialTokens, refreshTokens: token(), status: 200, profileStatus: 200, refreshStatus: 200, refreshCalls: 0, loginCalls: 0, delay: false, holdRefresh: false, inventoryFailures: {} as Record<string, number>, inventoryEmpty: false, inventoryStatus: 200, inventoryDelay: false, inventoryMalformed: false, inventoryLastMissing: false, inventoryCalls: [] as string[], profileName: 'Usuário de teste', profilePhone: '(11) 99999-9999', profileWrites: 0, profileWriteStatus: 200, profileMalformed: false, profileDelay: false }
  const upstream = createServer(async (request, response) => {
    response.setHeader('Content-Type', 'application/json')
    if (request.url === '/api/calculator/cost-reduction/forecast') {
      state.calculatorCalls++
      assert.equal(request.method, 'POST')
      assert.equal(request.headers.authorization, 'Bearer private-access-token')
      assert(request.headers['x-request-id'])
      let body = ''
      for await (const chunk of request) body += chunk
      state.calculatorBodies.push(JSON.parse(body))
      if (state.calculatorDelay) return
      response.statusCode = state.calculatorStatus
      if (state.calculatorHtml) { response.setHeader('Content-Type', 'text/html'); response.end('<html>private-stack</html>') }
      else response.end(JSON.stringify(state.calculatorStatus !== 200 ? { internal: 'private-stack-password' } : state.calculatorMalformed ? {} : { ...state.calculatorResponse, internal: 'private-stack-password' }))
    } else if (request.url?.startsWith('/api/inventories/')) {
      state.inventoryCalls.push(request.url)
      assert.equal(request.headers.authorization, 'Bearer private-access-token')
      if (state.inventoryDelay) return
      const query = new URL(request.url, 'http://test.local')
      const filter = query.searchParams.get('status')
      const field = filter === 'UNDER_REVIEW' ? 'awaitingReview' : filter === 'APPROVED' ? 'approved' : filter === 'PROCESSING_FAILED' ? 'processingFailed' : request.url.includes('/pending') ? 'pendingReview' : request.url.includes('/count') ? 'counts' : request.url.includes('/mine/last') ? 'lastSubmitted' : 'history'
      response.statusCode = state.inventoryFailures[field] ?? state.inventoryStatus
      const item = { id: 42, name: 'Meu inventário', createdAt: '2026-10-22T09:15:00', status: 'UNDER_REVIEW', type: 'INPUT', internal: 'not-public' }
      if (response.statusCode !== 200) response.end(JSON.stringify({ internal: 'private-stack-password' }))
      else if (state.inventoryMalformed) response.end('{}')
      else if (state.inventoryEmpty) {
        if (request.url.includes('/mine/last')) { response.statusCode = 404; response.end('{}') }
        else if (request.url.includes('/count')) response.end(JSON.stringify({ reviewedCount: 0, submittedCount: 0 }))
        else response.end(JSON.stringify({ inventories: [], totalCount: 0 }))
      }
      else if (request.url.includes('/mine/last')) {
        if (state.inventoryLastMissing) { response.statusCode = 404; response.end('{}') }
        else response.end(JSON.stringify(item))
      } else if (request.url.includes('/count')) response.end(JSON.stringify({ reviewedCount: 2, submittedCount: 7 }))
      else response.end(JSON.stringify({ inventories: [item], totalCount: filter === 'UNDER_REVIEW' ? 2 : filter === 'APPROVED' ? 3 : filter === 'PROCESSING_FAILED' ? 1 : request.url.includes('/pending') ? 4 : 7 }))
    } else if (request.url === '/api/auth/login') {
      state.loginCalls++
      if (state.delay) return
      response.statusCode = state.status
      response.end(JSON.stringify(state.status === 200 ? state.tokens : { internal: 'private-stack-password' }))
    } else if (request.url?.startsWith('/api/auth/refresh/')) {
      state.refreshCalls++
      signalRefresh?.()
      if (state.holdRefresh) await refreshGate
      assert.equal(request.method, 'PUT')
      assert.equal(request.headers.authorization, 'Bearer private-refresh-token')
      response.statusCode = state.refreshStatus
      response.end(JSON.stringify(state.refreshTokens))
    } else if (request.url === '/api/profile') {
      assert.equal(request.headers.authorization, 'Bearer private-access-token')
      if (state.profileDelay) return
      response.statusCode = request.method === 'PATCH' ? state.profileWriteStatus : state.profileStatus
      if (request.method === 'PATCH') {
        state.profileWrites++
        let body = ''
        for await (const chunk of request) body += chunk
        const changes = JSON.parse(body)
        assert(!('id' in changes || 'role' in changes || 'permissions' in changes || 'email' in changes))
        if (response.statusCode === 200) {
          state.profileName = changes.name ?? state.profileName
          state.profilePhone = changes.phone ?? state.profilePhone
        }
      }
      response.end(JSON.stringify(state.profileMalformed ? {} : {
        id: 1, name: state.profileName, email: credentials.email, cpf: 'not-public', phone: state.profilePhone,
        ...(request.method === 'PATCH' ? {} : {
          permissions: [{ id: 1, name: 'inventory:analysis', description: 'Consultar relatórios' }],
          department: { id: 2, name: 'Administrativo', description: 'private-description' },
          enterprise: { id: 1, name: 'Aurora Alimentos Sustentáveis S.A.', address: { street: 'private-address' } },
          unit: { id: 1, cnpj: '11000000000111', address: { neighborhood: 'Centro', city: 'Curitiba', state: 'PR', street: 'private-address' } },
        }),
        passwordHash: 'private-stack-password',
      }))
    } else { response.statusCode = 404; response.end('{}') }
  })
  const upstreamUrl = await listen(upstream)
  const config = readConfig({ NODE_ENV: 'test', SESSION_SECRET: 'test-only-secret-with-at-least-32-characters', FRONTEND_ORIGIN: origin, MS_AUTH_URL: upstreamUrl, MS_INVENTORY_URL: upstreamUrl, MS_CALCULATOR_URL: upstreamUrl, UPSTREAM_TIMEOUT_MS: '1000' })
  if (production) Object.assign(config, { NODE_ENV: 'production', TRUST_PROXY_HOPS: 1 })
  const store = new session.MemoryStore()
  const appServer = createServer(createApp(config, store))
  const logoutStarted = new Promise<void>((resolve) => {
    appServer.prependListener('request', (request) => {
      if (request.url === '/api/v1/auth/logout') resolve()
    })
  })
  const base = await listen(appServer)
  t.after(() => { appServer.closeAllConnections(); appServer.close(); upstream.closeAllConnections(); upstream.close(); store.clear(() => {}) })
  async function post(path: string, body: unknown = credentials, cookie?: string, requestOrigin = origin) {
    return fetch(`${base}/api/v1/auth/${path}`, { method: 'POST', headers: { ...(production ? { 'X-Forwarded-Proto': 'https' } : {}), Origin: requestOrigin, 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) }, body: JSON.stringify(body) })
  }
  async function login() {
    const response = await post('login')
    assert.equal(response.status, 200)
    const cookie = response.headers.get('set-cookie')?.split(';')[0]
    assert(cookie)
    return { response, cookie }
  }
  return { config, state, base, post, login, store, logoutStarted, refreshStarted, releaseRefresh: () => releaseRefresh?.(), stopUpstream: async () => { upstream.closeAllConnections(); await new Promise<void>((resolve) => upstream.close(() => resolve())) } }
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

test('logout durante refresh atrasado não permite recuperar sessão antiga', async (t) => {
  const h = await harness(t, token('analyst', Date.now() + 10000))
  const { cookie } = await h.login()
  h.state.holdRefresh = true
  const recovering = fetch(`${h.base}/api/v1/auth/me`, { headers: { Cookie: cookie } })
  await h.refreshStarted
  const loggingOut = h.post('logout', {}, cookie)
  await h.logoutStarted
  h.releaseRefresh()
  await recovering
  assert.equal((await loggingOut).status, 204)
  for (let attempt = 0; attempt < 3; attempt++) {
    assert.equal((await fetch(`${h.base}/api/v1/auth/me`, { headers: { Cookie: cookie } })).status, 401)
  }
})

test('logouts simultâneos encerram a sessão de forma idempotente', async (t) => {
  const h = await harness(t)
  const { cookie } = await h.login()
  const results = await Promise.all([h.post('logout', {}, cookie), h.post('logout', {}, cookie)])
  for (const result of results) assert.equal(result.status, 204)
  assert.equal((await fetch(`${h.base}/api/v1/auth/me`, { headers: { Cookie: cookie } })).status, 401)
})

test('ms-auth desligado retorna indisponibilidade sem criar sessão', async (t) => {
  const h = await harness(t)
  await h.stopUpstream()
  const response = await h.post('login')
  assert.equal(response.status, 502)
  assert.equal((await response.json()).error.code, 'AUTH_UNAVAILABLE')
  assert.equal(response.headers.get('set-cookie'), null)
})

test('perfil recusado impede login e invalida sessão já existente', async (t) => {
  const h = await harness(t)
  const { cookie } = await h.login()
  h.state.profileStatus = 403
  assert.equal((await fetch(`${h.base}/api/v1/auth/me`, { headers: { Cookie: cookie } })).status, 403)
  assert.equal((await fetch(`${h.base}/api/v1/auth/me`, { headers: { Cookie: cookie } })).status, 401)
  const rejected = await h.post('login')
  assert.equal(rejected.status, 403)
  assert.equal(rejected.headers.get('set-cookie'), null)
})

test('cookie de produção possui Secure, HttpOnly, SameSite e prefixo Host', async (t) => {
  // Simula o HTTPS informado por um proxy confiável; não valida TLS ou Redis reais.
  const h = await harness(t, token(), true)
  const { response } = await h.login()
  const cookie = response.headers.get('set-cookie') ?? ''
  assert.match(cookie, /^__Host-aether\.sid=/)
  assert.match(cookie, /; Secure/)
  assert.match(cookie, /; HttpOnly/)
  assert.match(cookie, /; SameSite=Lax/)
  assert.match(cookie, /; Path=\//)
  assert(!/; Domain=/i.test(cookie))
  assert.equal(response.headers.get('cache-control'), 'no-store')
  const body = await response.json()
  assert.deepEqual(Object.keys(body), ['user'])
  assert.deepEqual(Object.keys(body.user).sort(), ['email', 'id', 'name', 'role'])
})
test('overview exige sessão antes de consultar inventários', async (t) => {
  const h = await harness(t)
  for (const cookie of ['', 'aether.sid=forged']) assert.equal((await fetch(`${h.base}/api/v1/overview`, { headers: { Cookie: cookie } })).status, 401)
  assert.equal(h.state.inventoryCalls.length, 0)
})

test('overview dos dois papéis mantém escopo pessoal, contratos e tokens privados', async (t) => {
  for (const role of ['analyst', 'administrator']) await t.test(role, async (subtest) => {
    const h = await harness(subtest, token(role))
    const { cookie } = await h.login()
    const response = await fetch(`${h.base}/api/v1/overview?userId=999`, { headers: { Cookie: cookie } })
    assert.equal(response.status, 200)
    const text = await response.text()
    assert(!/private-|not-public|accessToken|refreshToken/.test(text))
    const body = JSON.parse(text)
    assert.equal(body.scope, 'personal')
    assert.deepEqual(body.counts, { status: 'ready', data: { reviewedCount: 2, submittedCount: 7 } })
    assert.equal(body.history.data.inventories[0].status, 'UNDER_REVIEW')
    assert.equal(body.lastSubmitted.data.id, 42)
    assert.equal(body.history.data.totalCount, 7)
    const expected = ['/api/inventories/count', '/api/inventories/mine/last', '/api/inventories/mine?take=6&skip=0']
    if (role === 'analyst') {
      expected.push(...['UNDER_REVIEW', 'APPROVED', 'PROCESSING_FAILED'].map((status) => `/api/inventories/mine?status=${status}&take=1&skip=0`))
      assert.deepEqual(body.indicators.awaitingReview, { status: 'ready', data: 2 })
      assert.deepEqual(body.indicators.approved, { status: 'ready', data: 3 })
      assert.deepEqual(body.indicators.processingFailed, { status: 'ready', data: 1 })
      assert.equal(body.indicators.pendingReview, null)
    } else {
      expected.push('/api/inventories/pending?take=1&skip=0')
      assert.deepEqual(body.indicators.pendingReview, { status: 'ready', data: { count: 4, scope: 'department' } })
      assert.equal(body.indicators.awaitingReview, null)
    }
    assert.deepEqual([...h.state.inventoryCalls].sort(), expected.sort())
  })
})

test('falha isolada não esconde dados das outras seções', async (t) => {
  const h = await harness(t)
  const { cookie } = await h.login()
  for (const failed of ['counts', 'history', 'lastSubmitted']) {
    h.state.inventoryFailures = { [failed]: 403 }
    const response = await fetch(`${h.base}/api/v1/overview`, { headers: { Cookie: cookie } })
    assert.equal(response.status, 200)
    const body = await response.json()
    for (const name of ['counts', 'history', 'lastSubmitted']) assert.equal(body[name].status, name === failed ? 'error' : 'ready')
    assert.equal(body[failed].error.code, 'INVENTORY_ACCESS_DENIED')
    assert(!('data' in body[failed]))
  }
})

test('falha total mantém erros por seção sem inventar zeros e sem encerrar sessão', async (t) => {
  const h = await harness(t)
  const { cookie } = await h.login()
  for (const status of [400, 401, 403, 404, 500]) {
    h.state.inventoryStatus = status
    const response = await fetch(`${h.base}/api/v1/overview`, { headers: { Cookie: cookie } })
    assert.equal(response.status, 200)
    const text = await response.text()
    assert(!/private-stack|Credenciais inválidas|sessão expirada/.test(text))
    const body = JSON.parse(text)
    for (const name of ['counts', 'history', 'lastSubmitted']) assert.equal(body[name].status, status === 404 && name === 'lastSubmitted' ? 'ready' : 'error')
    assert.equal((await fetch(`${h.base}/api/v1/auth/me`, { headers: { Cookie: cookie } })).status, 200)
  }
})

test('histórico vazio e último inexistente são sucesso vazio, não erro', async (t) => {
  const h = await harness(t)
  const { cookie } = await h.login()
  h.state.inventoryEmpty = true
  const response = await fetch(`${h.base}/api/v1/overview`, { headers: { Cookie: cookie } })
  const body = await response.json()
  assert.deepEqual(body.counts, { status: 'ready', data: { reviewedCount: 0, submittedCount: 0 } })
  assert.deepEqual(body.history, { status: 'ready', data: { inventories: [], totalCount: 0 } })
  assert.deepEqual(body.lastSubmitted, { status: 'ready', data: null })
})

test('contrato inválido e timeout tornam as seções indisponíveis', async (t) => {
  const h = await harness(t, token('analyst', Date.now() + 10000))
  const { cookie } = await h.login()
  h.state.inventoryMalformed = true
  const malformed = await fetch(`${h.base}/api/v1/overview`, { headers: { Cookie: cookie } })
  assert.equal((await malformed.json()).history.error.code, 'INVENTORY_CONTRACT_INVALID')
  assert.equal(h.state.refreshCalls, 1)
  h.state.inventoryMalformed = false
  h.state.inventoryDelay = true
  const timedOut = await fetch(`${h.base}/api/v1/overview`, { headers: { Cookie: cookie } })
  const body = await timedOut.json()
  for (const name of ['counts', 'history', 'lastSubmitted']) assert.equal(body[name].error.code, 'INVENTORY_TIMEOUT')
})

test('configuração ausente gera seções indisponíveis sem chamadas ao inventory', async (t) => {
  const h = await harness(t)
  delete h.config.MS_INVENTORY_URL
  const { cookie } = await h.login()
  const response = await fetch(`${h.base}/api/v1/overview`, { headers: { Cookie: cookie } })
  const body = await response.json()
  assert.equal(response.status, 200)
  assert.equal(body.counts.error.code, 'INVENTORY_NOT_CONFIGURED')
  assert.equal(h.state.inventoryCalls.length, 0)
})

test('sessão recusada pelo ms-auth continua retornando 401 global sem dados', async (t) => {
  const h = await harness(t)
  const { cookie } = await h.login()
  h.state.profileStatus = 401
  const response = await fetch(`${h.base}/api/v1/overview`, { headers: { Cookie: cookie } })
  assert.equal(response.status, 401)
  assert.equal(h.state.inventoryCalls.length, 0)
})
test('falha em um indicador por status não contamina os demais nem consulta revisão administrativa', async (t) => {
  const h = await harness(t)
  const { cookie } = await h.login()
  h.state.inventoryFailures = { approved: 403 }
  const response = await fetch(`${h.base}/api/v1/overview?role=administrator`, { headers: { Cookie: cookie } })
  const body = await response.json()
  assert.equal(response.status, 200)
  assert.equal(body.indicators.approved.status, 'error')
  assert.equal(body.indicators.awaitingReview.data, 2)
  assert.equal(body.indicators.processingFailed.data, 1)
  assert.equal(body.history.status, 'ready')
  assert(!h.state.inventoryCalls.some((path) => path.includes('/pending')))
})

test('perfil exige sessão e entrega dados pessoais e organização sem expor permissões', async (t) => {
  const h = await harness(t)
  assert.equal((await fetch(`${h.base}/api/v1/profile`)).status, 401)
  const { cookie } = await h.login()
  const response = await fetch(`${h.base}/api/v1/profile`, { headers: { Cookie: cookie } })
  assert.equal(response.status, 200)
  const data = await response.json()
  assert.equal(data.fullName, h.state.profileName)
  assert.equal(data.phone, h.state.profilePhone)
  assert.deepEqual(data.enterprise, { id: 1, name: 'Aurora Alimentos Sustentáveis S.A.' })
  assert.deepEqual(data.unit, { id: 1, address: { neighborhood: 'Centro', city: 'Curitiba', state: 'PR' } })
  assert(!('permissions' in data))
  assert(!JSON.stringify(data).includes('private-'))
  assert(!('name' in data || 'passwordHash' in data || 'company' in data))
})

test('perfil salva apenas nome/telefone e recuperação da sessão reflete nome confirmado', async (t) => {
  const h = await harness(t)
  const { cookie } = await h.login()
  const response = await fetch(`${h.base}/api/v1/profile`, {
    method: 'PATCH', headers: { Cookie: cookie, Origin: origin, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Novo Nome', phone: '(11) 98888-7777' }),
  })
  assert.equal(response.status, 200)
  const data = await response.json()
  assert.equal(data.fullName, 'Novo Nome')
  assert.equal(data.phone, '(11) 98888-7777')
  assert(!('enterprise' in data || 'unit' in data || 'department' in data))
  assert(!('permissions' in data))
  const me = await fetch(`${h.base}/api/v1/auth/me`, { headers: { Cookie: cookie } })
  assert.equal((await me.json()).user.name, 'Novo Nome')
})

test('perfil rejeita campos administrativos, dados inválidos e origem externa antes da escrita', async (t) => {
  const h = await harness(t)
  const { cookie } = await h.login()
  for (const body of [{}, { name: 'A' }, { phone: '123' }, { email: 'other@example.com' }, { role: 'administrator' }, { name: 'Novo Nome', id: 2 }, { newPassword: 'Senha123' }]) {
    const response = await fetch(`${h.base}/api/v1/profile`, { method: 'PATCH', headers: { Cookie: cookie, Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    assert.equal(response.status, 400)
  }
  const denied = await fetch(`${h.base}/api/v1/profile`, { method: 'PATCH', headers: { Cookie: cookie, Origin: 'https://outside.example', 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Novo Nome' }) })
  assert.equal(denied.status, 403)
  assert.equal(h.state.profileWrites, 0)
})

test('validação do ms-auth ao salvar perfil não vira sessão expirada e permite tentar novamente', async (t) => {
  const h = await harness(t)
  const { cookie } = await h.login()
  h.state.profileWriteStatus = 400
  const response = await fetch(`${h.base}/api/v1/profile`, { method: 'PATCH', headers: { Cookie: cookie, Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Novo Nome' }) })
  assert.equal(response.status, 422)
  assert.equal((await response.json()).error.code, 'PROFILE_VALIDATION_ERROR')
  h.state.profileWriteStatus = 200
  const me = await fetch(`${h.base}/api/v1/auth/me`, { headers: { Cookie: cookie } })
  assert.equal(me.status, 200)
  assert.equal((await me.json()).user.name, 'Usuário de teste')
})

test('perfil malformado ou lento não retorna informações fictícias', async (t) => {
  const h = await harness(t)
  const { cookie } = await h.login()
  h.state.profileMalformed = true
  assert.equal((await fetch(`${h.base}/api/v1/profile`, { headers: { Cookie: cookie } })).status, 502)
  h.state.profileMalformed = false
  h.state.profileDelay = true
  assert.equal((await fetch(`${h.base}/api/v1/profile`, { headers: { Cookie: cookie } })).status, 504)
})


const forecastInput = { monthlyCost: 100000, reductionPercentage: 15, periodMonths: 3 }
async function postForecast(base: string, cookie = '', body: object = forecastInput, requestOrigin = origin) {
  return fetch(`${base}/api/v1/calculator/cost-reduction/forecast`, {
    method: 'POST', headers: { Cookie: cookie, Origin: requestOrigin, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  })
}

test('calculadora exige sessão e origem válida antes de consultar o serviço', async (t) => {
  const h = await harness(t)
  assert.equal((await postForecast(h.base)).status, 401)
  const { cookie } = await h.login()
  assert.equal((await postForecast(h.base, cookie, forecastInput, 'https://outside.example')).status, 403)
  const noJson = await fetch(`${h.base}/api/v1/calculator/cost-reduction/forecast`, { method: 'POST', headers: { Cookie: cookie, Origin: origin }, body: 'not-json' })
  assert.equal(noJson.status, 415)
  assert.equal(h.state.calculatorCalls, 0)
})

test('calculadora encaminha token e entradas para a rota combinada, sem expor campos internos', async (t) => {
  const h = await harness(t)
  const { cookie } = await h.login()
  const response = await postForecast(h.base, cookie)
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('cache-control'), 'no-store')
  const body = await response.json()
  assert.deepEqual(body, h.state.calculatorResponse)
  assert.deepEqual(h.state.calculatorBodies, [forecastInput])
  assert(!JSON.stringify(body).includes('private-'))
  h.state.calculatorResponse = { monthlyCost: 123.45, reductionPercentage: 15, periodMonths: 3, currency: 'BRL', monthlySavings: 18.52, newMonthlyCost: 104.93, totalSavings: 55.56, projection: [{ month: 1, accumulatedSavings: 18.52 }, { month: 2, accumulatedSavings: 37.04 }, { month: 3, accumulatedSavings: 55.56 }] }
  const cents = await postForecast(h.base, cookie, { ...forecastInput, monthlyCost: 123.45 })
  assert.equal(cents.status, 200)
  assert.deepEqual(await cents.json(), h.state.calculatorResponse)
  h.state.calculatorResponse = { ...h.state.calculatorResponse, monthlyCost: 0, reductionPercentage: 0, monthlySavings: 0, newMonthlyCost: 0, totalSavings: 0, projection: [{ month: 1, accumulatedSavings: 0 }, { month: 2, accumulatedSavings: 0 }, { month: 3, accumulatedSavings: 0 }] }
  assert.equal((await postForecast(h.base, cookie, { monthlyCost: 0, reductionPercentage: 0, periodMonths: 3 })).status, 200)
})

test('calculadora rejeita campos extras, valores inválidos e tipos incorretos sem chamar serviço', async (t) => {
  const h = await harness(t)
  const { cookie } = await h.login()
  for (const input of [{}, { ...forecastInput, monthlyCost: -1 }, { ...forecastInput, monthlyCost: '100' }, { ...forecastInput, monthlyCost: null }, { ...forecastInput, monthlyCost: 1.001 }, { ...forecastInput, reductionPercentage: 51 }, { ...forecastInput, reductionPercentage: 15.5 }, { ...forecastInput, periodMonths: 5 }, { ...forecastInput, role: 'administrator' }]) {
    assert.equal((await postForecast(h.base, cookie, input)).status, 400)
  }
  assert.equal(h.state.calculatorCalls, 0)
})

test('permissão calculator:roi é decidida no serviço e administrator não ignora uma recusa', async (t) => {
  for (const role of ['analyst', 'administrator']) {
    await t.test(role, async (subtest) => {
      const h = await harness(subtest, token(role))
      const { cookie } = await h.login()
      h.state.calculatorStatus = 403
      const response = await postForecast(h.base, cookie)
      assert.equal(response.status, 403)
      assert.equal((await response.json()).error.code, 'CALCULATOR_FORBIDDEN')
      assert.equal((await fetch(`${h.base}/api/v1/auth/me`, { headers: { Cookie: cookie } })).status, 200)
    })
  }
})

test('validação, autenticação e falhas do serviço preservam HTTP sem vazar detalhes', async (t) => {
  const h = await harness(t)
  const { cookie } = await h.login()
  for (const [upstream, expected, code] of [[400, 422, 'CALCULATOR_VALIDATION_ERROR'], [422, 422, 'CALCULATOR_VALIDATION_ERROR'], [401, 401, 'AUTH_REJECTED'], [500, 502, 'CALCULATOR_UNAVAILABLE']] as const) {
    h.state.calculatorStatus = upstream
    const response = await postForecast(h.base, cookie)
    assert.equal(response.status, expected)
    const text = await response.text()
    assert.equal(JSON.parse(text).error.code, code)
    assert(!text.includes('private-'))
  }
})

test('resposta incompatível, HTML e projeção incompleta não viram resultado válido', async (t) => {
  const h = await harness(t)
  const { cookie } = await h.login()
  h.state.calculatorMalformed = true
  assert.equal((await postForecast(h.base, cookie)).status, 502)
  h.state.calculatorMalformed = false
  h.state.calculatorHtml = true
  assert.equal((await postForecast(h.base, cookie)).status, 502)
  h.state.calculatorHtml = false
  h.state.calculatorResponse.monthlyCost = 999
  assert.equal((await postForecast(h.base, cookie)).status, 502)
  h.state.calculatorResponse.monthlyCost = 100000
  h.state.calculatorResponse.projection.pop()
  assert.equal((await postForecast(h.base, cookie)).status, 502)
})

test('calculadora lenta ou não configurada retorna erro, sem impedir login', async (t) => {
  const h = await harness(t)
  const { cookie } = await h.login()
  delete h.config.MS_CALCULATOR_URL
  const missing = await postForecast(h.base, cookie)
  assert.equal(missing.status, 503)
  assert.equal((await missing.json()).error.code, 'CALCULATOR_NOT_CONFIGURED')
  assert.equal(h.state.calculatorCalls, 0)
  h.config.MS_CALCULATOR_URL = h.config.MS_AUTH_URL
  h.state.calculatorDelay = true
  const slow = await postForecast(h.base, cookie)
  assert.equal(slow.status, 504)
  assert.equal((await slow.json()).error.code, 'CALCULATOR_TIMEOUT')
})

test('configuração da calculadora exige uma origem válida e HTTPS em produção', () => {
  const env = { SESSION_SECRET: 'x'.repeat(32), FRONTEND_ORIGIN: origin, MS_AUTH_URL: 'http://localhost:3000' }
  assert.throws(() => readConfig({ ...env, MS_CALCULATOR_URL: 'https://aethergases.org/api/calculator' }))
  assert.throws(() => readConfig({ ...env, NODE_ENV: 'production', FRONTEND_ORIGIN: 'https://web.example', MS_AUTH_URL: 'https://auth.example', REDIS_URL: 'redis://localhost:6379', MS_CALCULATOR_URL: 'http://localhost:3004' }))
})
