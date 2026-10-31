import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getAdministrationUrl } from '../src/utils/administration.ts'

test('acesso ao CRUD permanece indisponível sem um endereço válido', () => {
  for (const value of [undefined, '', ' ', '/admin', 'javascript:alert(1)', 'http://example.com/admin', 'https://user:password@example.com/admin']) {
    assert.equal(getAdministrationUrl(value), null)
  }
})

test('acesso ao CRUD aceita HTTPS e desenvolvimento em localhost', () => {
  assert.equal(getAdministrationUrl(' https://example.com/admin '), 'https://example.com/admin')
  assert.equal(getAdministrationUrl('http://localhost:8080/admin'), 'http://localhost:8080/admin')
})
