import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parsePreferences, readPreferences, savePreferences, preferencesKey } from '../src/utils/preferences.ts'

test('alto contraste salvo é recuperado e desativação também persiste', () => {
  let stored: string | null = null
  const storage = { getItem: (key: string) => { assert.equal(key, preferencesKey); return stored }, setItem: (key: string, value: string) => { assert.equal(key, preferencesKey); stored = value } }
  savePreferences({ _versao: 1, highContrast: true }, storage)
  assert.deepEqual(readPreferences(storage), { _versao: 1, highContrast: true })
  savePreferences({ _versao: 1, highContrast: false }, storage)
  assert.equal(readPreferences(storage).highContrast, false)
})
test('preferências corrompidas ou com versão incompatível são descartadas', () => {
  for (const value of [null, '', 'invalid', 'null', '[]', '{"_versao":2,"highContrast":true}', '{"_versao":1,"highContrast":"true"}']) {
    assert.deepEqual(parsePreferences(value), { _versao: 1, highContrast: false })
  }
})
test('armazenamento bloqueado não impede o funcionamento da aplicação', () => {
  assert.equal(readPreferences({ getItem: () => { throw new Error('blocked') } }).highContrast, false)
  assert.doesNotThrow(() => savePreferences({ _versao: 1, highContrast: true }, { setItem: () => { throw new Error('blocked') } }))
})
