import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseProfile } from '../src/services/profile.ts'
import { validateProfile } from '../src/utils/profile.ts'

const profile = { id: 1, fullName: 'Fernanda Nagata', email: 'test@example.com', cpf: null, phone: null }
test('perfil mantém campos ausentes como null sem organização ou permissões fictícias', () => {
  const responseWithExtraFields = { ...profile, permissions: [{ id: 1, name: 'inventory:analysis' }] }
  assert.deepEqual(parseProfile(responseWithExtraFields), profile)
  assert.equal(parseProfile({ ...profile, fullName: 'Novo Nome' }).fullName, 'Novo Nome')
  assert.throws(() => parseProfile({ ...profile, id: -1 }))
})
test('validação de edição respeita os limites e formatos do ms-auth', () => {
  assert.deepEqual(validateProfile({ name: '  Fernanda Nagata  ', phone: '(11) 99999-9999' }), {})
  assert.deepEqual(validateProfile({ phone: '1133334444' }), {})
  assert(validateProfile({ name: 'A' }).name)
  assert(validateProfile({ name: 'A'.repeat(151) }).name)
  assert(validateProfile({ name: 'Nome123' }).name)
  assert(validateProfile({ phone: '123' }).phone)
})
