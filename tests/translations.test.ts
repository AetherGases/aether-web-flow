import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import ts from 'typescript'
import { messages } from '../src/translations/messages.ts'
import { translate, translateLabel, formatReportDate } from '../src/translations/translate.ts'

test('catálogo possui inglês e espanhol completos, com os mesmos parâmetros', () => {
  const placeholders = (value: string) => [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort()
  for (const [key, values] of Object.entries(messages)) {
    assert.equal(values.length, 2)
    for (const value of values) { assert(value.trim()); assert.deepEqual(placeholders(value), placeholders(key), key) }
  }
})
test('tradução mantém nomes e dados externos, interpola valores e troca feedback já exibido', () => {
  assert.equal(translate('Meu perfil', 'en'), 'My profile')
  assert.equal(translate('Meu perfil', 'es'), 'Mi perfil')
  assert.equal(translate('My profile', 'pt-BR'), 'Meu perfil')
  assert.equal(translate('Avatar de {0}', 'es', { 0: 'Fernanda Nagata' }), 'Avatar de Fernanda Nagata')
  assert.equal(translate('Nome de relatório externo', 'en'), 'Nome de relatório externo')
  assert.equal(translateLabel('Planta 04', 'en'), 'Plant 04')
  assert.equal(translateLabel('12% maior que o período anterior', 'es'), '12% más que en el período anterior')
  assert.equal(formatReportDate('2026-10-24T00:30:00', 'en'), '10/24/2026')
})
test('chaves literais utilizadas pelas telas e componentes existem no catálogo', () => {
  const files = ['src/App.tsx']
  for (const root of ['src/pages', 'src/components']) for (const dir of readdirSync(root)) files.push(join(root, dir, 'index.tsx'))
  for (const file of files) {
    const ast = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    function visit(node: ts.Node) {
      if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === 't' && node.arguments[0] && ts.isStringLiteral(node.arguments[0])) {
        assert(Object.hasOwn(messages, node.arguments[0].text), `${file}: ${node.arguments[0].text}`)
      }
      ts.forEachChild(node, visit)
    }
    visit(ast)
  }
})
