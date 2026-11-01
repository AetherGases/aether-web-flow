import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createServer, type Server } from 'node:http'
import { test, type TestContext } from 'node:test'
import { createApp } from '../src/app.ts'
import { readConfig } from '../src/config/index.ts'
import { registerReportSchema, validUploadedPath } from '../src/services/reports.ts'

async function listen(server: Server) {
  server.listen(0, '127.0.0.1'); await once(server, 'listening')
  const address = server.address(); assert(address && typeof address !== 'string')
  return 'http://127.0.0.1:' + address.port
}
async function harness(t: TestContext, role = 'analyst') {
  const state = { status: 'PROCESSING', inaccessible: false, postStatus: 201, malformed: false, planMissing: false, aiCalls: 0, registered: [] as object[], paths: [] as string[] }
  const upstream = createServer(async (request, response) => {
    response.setHeader('Content-Type', 'application/json')
    if (request.url === '/api/auth/login') return response.end(JSON.stringify({ email: 'test@example.com', authenticated: true, expiration: new Date(Date.now() + 3600000).toISOString(), accessToken: 'private-access', refreshToken: 'private-refresh', role }))
    assert.equal(request.headers.authorization, 'Bearer private-access')
    if (request.url === '/api/profile') return response.end(JSON.stringify({ id: 1, name: 'Pessoa de teste', email: 'test@example.com' }))
    state.paths.push(request.url ?? '')
    if (request.url === '/api/cloudinary/upload-signature?fileType=XLSX') return response.end(JSON.stringify({ signature: 'temporary-signature', timestamp: 1793444400, apiKey: 'public-key', cloudName: 'aether-test', cloudinaryFolder: 'spreadsheets', cloudinaryResourceType: 'raw' }))
    if (request.url === '/api/inventories' && request.method === 'POST') {
      let raw = ''; for await (const chunk of request) raw += chunk
      state.registered.push(JSON.parse(raw)); response.statusCode = state.postStatus
      return response.end(JSON.stringify(state.postStatus === 201 ? { id: 22, internal: 'private' } : { error: 'private-stack' }))
    }
    if (request.url?.startsWith('/api/inventories/')) {
      if (state.inaccessible || (role === 'administrator' && request.url.includes('/mine/'))) { response.statusCode = 404; return response.end('{}') }
      return response.end(JSON.stringify({ id: state.malformed ? 99 : 22, name: 'Relatório de teste', status: state.status, type: 'INPUT', owner: { id: 1, cpf: 'private-cpf' }, description: 'Descrição do back', emissions: [{ id: 1, quantityCo2e: 12.5, isReduction: false, scope: { id: 1, name: 'Escopo 1' } }], reductions: [] }))
    }
    if (request.url === '/hub/ai/report/22') {
      state.aiCalls++
      if (state.planMissing) { response.statusCode = 404; return response.end('{}') }
      return response.end(JSON.stringify({ defined_problem: 'Problema', solving_method: 'Método', reasoning: '<script>externo</script>', recommended_gases: [{ scope: 1, emission: 8, reduction_percentage: 36, name: 'Biometano' }], internal: 'private' }))
    }
    response.statusCode = 404; response.end('{}')
  })
  const url = await listen(upstream)
  const server = createServer(createApp(readConfig({ NODE_ENV: 'test', SESSION_SECRET: 'test-secret-with-at-least-32-characters', FRONTEND_ORIGIN: 'http://localhost:5173', MS_AUTH_URL: url, MS_INVENTORY_URL: url, MS_CLOUDINARY_URL: url, MS_AI_URL: url, MS_AI_PATH_PREFIX: '/hub' })))
  const base = await listen(server)
  t.after(() => { server.closeAllConnections(); server.close(); upstream.closeAllConnections(); upstream.close() })
  const headers = { Origin: 'http://localhost:5173', 'Content-Type': 'application/json' }
  const login = await fetch(base + '/api/v1/auth/login', { method: 'POST', headers, body: JSON.stringify({ email: 'test@example.com', password: 'test-password' }) })
  assert.equal(login.status, 200)
  const cookie = login.headers.get('set-cookie')?.split(';')[0]; assert(cookie)
  const call = (path: string, method = 'GET', body?: object) => fetch(base + '/api/v1/reports' + path, { method, headers: { ...headers, Cookie: cookie }, body: body ? JSON.stringify(body) : undefined })
  const input = { name: 'Relatório de teste', consolidationApproach: 'Controle operacional', fileName: 'inventario.xlsx', path: 'https://res.cloudinary.com/aether-test/raw/upload/v123/spreadsheets/inventario.xlsx' }
  return { state, call, input, base }
}
test('assinatura exige sessão e origem, sem expor token', async t => {
  const { call, base, state } = await harness(t)
  assert.equal((await fetch(base + '/api/v1/reports/upload-signature', { method: 'POST', headers: { Origin: 'http://localhost:5173', 'Content-Type': 'application/json' }, body: '{}' })).status, 401)
  const response = await call('/upload-signature', 'POST', {})
  assert.equal(response.status, 200)
  const text = await response.text(); assert.match(text, /temporary-signature/); assert(!text.includes('private-access'))
  assert.deepEqual(state.paths, ['/api/cloudinary/upload-signature?fileType=XLSX'])
})
test('registro vincula upload assinado, rejeita escopo arbitrário e não reenvia POST', async t => {
  const { call, input, state } = await harness(t)
  assert.equal((await call('', 'POST', input)).status, 422)
  await call('/upload-signature', 'POST', {})
  assert.equal((await call('', 'POST', { ...input, unitId: 99 })).status, 422)
  assert.equal((await call('', 'POST', { ...input, path: 'https://evil.test/a.xlsx' })).status, 422)
  const response = await call('', 'POST', input)
  assert.equal(response.status, 201); assert.deepEqual(await response.json(), { id: 22 })
  assert.deepEqual(state.registered, [input])
  assert.equal((await call('', 'POST', input)).status, 422)
})
test('erro upstream no registro não repete o cadastro nem vaza detalhes', async t => {
  const { call, input, state } = await harness(t)
  await call('/upload-signature', 'POST', {}); state.postStatus = 500
  const response = await call('', 'POST', input)
  assert.equal(response.status, 502); assert(!(await response.text()).includes('private-stack'))
  assert.equal((await call('', 'POST', input)).status, 422); assert.equal(state.registered.length, 1)
})
test('detalhe preserva status novos e descarta CPF e dados internos', async t => {
  const { call, state } = await harness(t)
  for (const status of ['PROCESSING', 'INSUFFICIENT_DATA', 'PROCESSING_FAILED']) {
    state.status = status
    const response = await call('/22'); assert.equal(response.status, 200)
    const text = await response.text(); assert.match(text, new RegExp(status)); assert(!text.includes('private-cpf')); assert(!text.includes('owner'))
    assert.equal(await (await call('/22/analysis')).json(), null)
  }
  assert.equal(state.aiCalls, 0)
})
test('análise verifica acesso ao relatório antes de consultar hub e preserva recomendações', async t => {
  const { call, state } = await harness(t)
  state.status = 'UNDER_REVIEW'
  const response = await call('/22/analysis'); assert.equal(response.status, 200)
  const body = await response.json(); assert.equal(body.recommended_gases[0].name, 'Biometano'); assert.equal(body.reasoning, '<script>externo</script>'); assert(!('internal' in body))
  state.inaccessible = true
  assert.equal((await call('/22/analysis')).status, 404); assert.equal(state.aiCalls, 1)
})
test('admin pode consultar relatório departamental autorizado, sem ignorar recusa do inventory', async t => {
  const { call, state } = await harness(t, 'administrator')
  state.status = 'APPROVED'; assert.equal((await call('/22/analysis')).status, 200)
  assert(state.paths.includes('/api/inventories/reviewed/22'))
  state.inaccessible = true; assert.equal((await call('/22/analysis')).status, 404)
})
test('plano ainda ausente não vira erro ou análise fictícia; id inválido e identidade incompatível são bloqueados', async t => {
  const { call, state } = await harness(t)
  state.status = 'UNDER_REVIEW'; state.planMissing = true
  assert.equal(await (await call('/22/analysis')).json(), null)
  assert.equal((await call('/0')).status, 400)
  state.malformed = true; assert.equal((await call('/22')).status, 404)
})
test('validação segue nome do back e restringe URL ao cloud/folder da assinatura', () => {
  const grant = { cloudName: 'aether-test', cloudinaryFolder: 'spreadsheets' }
  assert(validUploadedPath('https://res.cloudinary.com/aether-test/raw/upload/v123/spreadsheets/a.xlsx', grant))
  for (const value of ['not-url', 'https://res.cloudinary.com/other/raw/upload/spreadsheets/a.xlsx', 'https://res.cloudinary.com/aether-test/raw/upload/images/a.xlsx', 'https://res.cloudinary.com/aether-test/raw/upload/spreadsheets/a.xlsx?extra=1', 'https://res.cloudinary.com/aether-test/raw/upload/spreadsheets/%broken.xlsx']) assert(!validUploadedPath(value, grant))
  assert(!registerReportSchema.safeParse({ name: 'Inventário 2026', consolidationApproach: 'Controle operacional', fileName: 'a.xlsx', path: 'https://example.com/a.xlsx' }).success)
})
