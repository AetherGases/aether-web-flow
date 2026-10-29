import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseProfile } from '../src/services/profile.ts'
import { validateProfile } from '../src/utils/profile.ts'

const profile = { id: 1, fullName: 'Fernanda Nagata', email: 'test@example.com', cpf: null, phone: null, enterprise: null, unit: null, department: null }
test('perfil mantém campos ausentes como null sem organização ou permissões fictícias', () => {
  const responseWithExtraFields = { ...profile, permissions: [{ id: 1, name: 'inventory:analysis' }] }
  assert.deepEqual(parseProfile(responseWithExtraFields), profile)
  assert.equal(parseProfile({ ...profile, fullName: 'Novo Nome' }).fullName, 'Novo Nome')
  assert.throws(() => parseProfile({ ...profile, id: -1 }))
})
test('perfil recebe empresa e unidade reais sem expor outros campos da API', () => {
  const organization = {
    enterprise: { id: 1, name: 'Aurora Alimentos Sustentáveis S.A.' },
    unit: { id: 1, address: { neighborhood: 'Centro', city: 'Curitiba', state: 'PR' } },
  }
  assert.deepEqual(parseProfile({ ...profile, ...organization }), { ...profile, ...organization })
  assert.throws(() => parseProfile({ ...profile, unit: { id: -1, address: null } }))
  assert.deepEqual(parseProfile({ ...profile, unit: { id: 1, address: null } }).unit, { id: 1, address: null })
  assert.throws(() => parseProfile({ ...profile, unit: { id: 1, address: { neighborhood: 'Centro', city: '', state: 'PR' } } }))
})

test('validação de edição respeita os limites e formatos do ms-auth', () => {
  assert.deepEqual(validateProfile({ name: '  Fernanda Nagata  ', phone: '(11) 99999-9999' }), {})
  assert.deepEqual(validateProfile({ phone: '1133334444' }), {})
  assert(validateProfile({ name: 'A' }).name)
  assert(validateProfile({ name: 'A'.repeat(151) }).name)
  assert(validateProfile({ name: 'Nome123' }).name)
  assert(validateProfile({ phone: '123' }).phone)
})


test('departamento é opcional e expõe somente id e nome válidos', () => {
  const department = { id: 2, name: 'Administrativo', description: 'Campo extra' }
  assert.deepEqual(parseProfile({ ...profile, department }).department, { id: 2, name: 'Administrativo' })
  const { department: omitted, ...withoutDepartment } = profile
  assert.equal(omitted, null)
  assert.equal(parseProfile(withoutDepartment as typeof profile).department, null)
  assert.equal(parseProfile(profile).department, null)
  assert.throws(() => parseProfile({ ...profile, department: { id: -1, name: 'Administrativo' } }))
  assert.throws(() => parseProfile({ ...profile, department: { id: 2, name: ' ' } }))
})
