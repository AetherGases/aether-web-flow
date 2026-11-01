import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isAnalysisScope, validateReportFileName } from '../src/utils/analysis.ts'

test('escopos de rota são validados e seleção aceita somente nomes XLSX', () => {
  assert.equal(isAnalysisScope('plant'), true)
  assert.equal(isAnalysisScope('company'), false)
  assert.equal(isAnalysisScope('unknown'), false)
  assert.equal(validateReportFileName('relatorio.XLSX'), null)
  for (const name of ['relatorio.csv', 'relatorio.xls', 'relatorio.xlsx.exe', 'xlsx']) {
    assert.equal(validateReportFileName(name), 'Selecione um arquivo Excel (.xlsx).')
  }
})
