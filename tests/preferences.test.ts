import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parsePreferences, readPreferences, savePreferences, preferencesKey } from '../src/utils/preferences.ts'

test('alto contraste salvo é recuperado e desativação também persiste', () => {
  let stored: string | null = null
  const storage = { getItem: (key: string) => { assert.equal(key, preferencesKey); return stored }, setItem: (key: string, value: string) => { assert.equal(key, preferencesKey); stored = value } }
  savePreferences({ _versao: 3, lightMode: false, highContrast: true, language: 'pt-BR' }, storage)
  assert.deepEqual(readPreferences(storage), { _versao: 3, lightMode: false, highContrast: true, language: 'pt-BR' })
  savePreferences({ _versao: 3, lightMode: false, highContrast: false, language: 'pt-BR' }, storage)
  assert.equal(readPreferences(storage).highContrast, false)
})
test('preferências corrompidas ou com versão incompatível são descartadas', () => {
  for (const value of [null, '', 'invalid', 'null', '[]', '{"_versao":99,"highContrast":true}', '{"_versao":1,"highContrast":"true"}']) {
    assert.deepEqual(parsePreferences(value), { _versao: 3, lightMode: false, highContrast: false, language: 'pt-BR' })
  }
})
test('armazenamento bloqueado não impede o funcionamento da aplicação', () => {
  assert.equal(readPreferences({ getItem: () => { throw new Error('blocked') } }).highContrast, false)
  assert.doesNotThrow(() => savePreferences({ _versao: 3, lightMode: false, highContrast: true, language: 'pt-BR' }, { setItem: () => { throw new Error('blocked') } }))
})


test('migração mantém o alto contraste da versão anterior e adiciona português', () => {
  assert.deepEqual(parsePreferences('{"_versao":1,"highContrast":true}'), { _versao: 3, lightMode: false, highContrast: true, language: 'pt-BR' })
})
test('idioma é persistido sem apagar o alto contraste e idioma inválido usa português', () => {
  let saved = ''
  savePreferences({ _versao: 3, lightMode: false, highContrast: true, language: 'es' }, { setItem: (_key, value) => { saved = value } })
  assert.deepEqual(readPreferences({ getItem: () => saved }), { _versao: 3, lightMode: false, highContrast: true, language: 'es' })
  assert.deepEqual(parsePreferences('{"_versao":2,"highContrast":true,"language":"invalid"}'), { _versao: 3, lightMode: false, highContrast: true, language: 'pt-BR' })
})

test('modo claro persiste sem apagar idioma e contraste e migra a versão 2', () => {
  let saved = ''
  const preferences = { _versao: 3 as const, lightMode: true, highContrast: true, language: 'en' as const }
  savePreferences(preferences, { setItem: (_key, value) => { saved = value } })
  assert.deepEqual(readPreferences({ getItem: () => saved }), preferences)
  assert.deepEqual(parsePreferences('{"_versao":2,"highContrast":true,"language":"es"}'), {
    _versao: 3, lightMode: false, highContrast: true, language: 'es',
  })
  assert.equal(parsePreferences('{"_versao":3,"highContrast":false,"lightMode":"true"}').lightMode, false)
})
