import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getAnalysisScope, isAnalysisScope, validateReportFileName } from '../src/utils/analysis.ts'

test('seleção preserva empresa para admin e restringe analista a planta', () => {
  assert.equal(getAnalysisScope('administrator', 'company'), 'company')
  assert.equal(getAnalysisScope('administrator', 'plant'), 'plant')
  assert.equal(getAnalysisScope('administrator', 'invalid'), 'plant')
  assert.equal(getAnalysisScope('analyst', 'company'), 'plant')
  assert.equal(getAnalysisScope('analyst', null), 'plant')
})

test('escopos de rota são validados e seleção aceita somente nomes XLSX', () => {
  assert.equal(isAnalysisScope('plant'), true)
  assert.equal(isAnalysisScope('company'), true)
  assert.equal(isAnalysisScope('unknown'), false)
  assert.equal(validateReportFileName('relatorio.XLSX'), null)
  for (const name of ['relatorio.csv', 'relatorio.xls', 'relatorio.xlsx.exe', 'xlsx']) {
    assert.equal(validateReportFileName(name), 'Selecione um arquivo Excel (.xlsx).')
  }
})
