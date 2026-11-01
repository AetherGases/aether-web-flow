import assert from 'node:assert/strict'
import { test } from 'node:test'
import { reportFileLimit, validateReportFile, reportTotals, reportBreakdown, compactEmissionGroups } from '../src/utils/reports.ts'
test('upload aceita somente XLSX com conteúdo e até 10 MB', () => {
  assert.equal(validateReportFile({ name: 'relatorio.xlsx', size: reportFileLimit }), null)
  for (const file of [{ name: 'a.xlsx.exe', size: 1 }, { name: 'a.xlsx', size: 0 }, { name: 'a.xlsx', size: reportFileLimit + 1 }]) assert.ok(validateReportFile(file))
})
test('totais mantêm emissões brutas e reduções separadas sem dupla contagem', () => {
  const totals = reportTotals({ id: 1, name: 'Teste', type: 'INPUT', status: 'APPROVED', emissions: [
    { id: 1, quantityCo2e: 10, isReduction: false, scope: { id: 1, name: 'Escopo 1' } },
    { id: 2, quantityCo2e: 5, isReduction: false, scope: { id: 1, name: 'Escopo 1' } },
    { id: 3, quantityCo2e: 2, isReduction: true },
  ], reductions: [{ id: 3, quantityCo2e: 2, isReduction: true }] })
  assert.deepEqual(totals, { emissions: 15, reductions: 2, byScope: [{ name: 'Escopo 1', value: 15 }] })
})

test('gráficos agrupam por identificador, preservam ausentes e excluem reduções', () => {
  const report = { id: 1, name: 'Teste', type: 'INPUT' as const, status: 'APPROVED' as const, emissions: [
    { id: 1, quantityCo2e: 10, isReduction: false, category: { id: 1, name: 'Mesmo nome' }, scope: { id: 1, name: 'Escopo 1' }, gas: { id: 1, name: 'CO2' } },
    { id: 2, quantityCo2e: 5, isReduction: false, category: { id: 2, name: 'Mesmo nome' }, scope: { id: 1, name: 'Escopo 1' }, gas: { id: 1, name: 'CO2' } },
    { id: 3, quantityCo2e: 2, isReduction: false },
    { id: 4, quantityCo2e: 50, isReduction: true },
  ], reductions: [] }
  const data = reportBreakdown(report)
  assert.equal(data.records, 3)
  assert.equal(data.categoryCount, 2)
  assert.equal(data.gasCount, 1)
  assert.equal(data.categories.length, 3)
  assert.equal(data.gases[0].value, 15)
  for (const series of [data.categories, data.gases, data.scopes]) assert.equal(series.reduce((sum, item) => sum + item.value, 0), 17)
})
test('gráficos agrupam cauda em Outros sem perder valores ou inventar séries', () => {
  const groups = Array.from({ length: 8 }, (_, index) => ({ key: String(index), name: 'Categoria ' + index, value: 8 - index }))
  const compact = compactEmissionGroups(groups)
  assert.equal(compact.length, 6)
  assert.deepEqual(compact.at(-1), { key: 'others', name: 'Outros', value: 6 })
  assert.equal(compact.reduce((sum, item) => sum + item.value, 0), groups.reduce((sum, item) => sum + item.value, 0))
  assert.deepEqual(compactEmissionGroups([]), [])
})
