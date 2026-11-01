import type { InventoryReport } from '../types/report.ts'
export const reportFileLimit = 10 * 1024 * 1024
export function validateReportFile(file: { name: string; size: number }): string | null {
  if (!/\.xlsx$/i.test(file.name) || file.name.length < 3 || file.name.length > 150) return 'Selecione um arquivo Excel (.xlsx) com nome de até 150 caracteres.'
  if (file.size <= 0 || file.size > reportFileLimit) return 'O arquivo deve ter conteúdo e no máximo 10 MB.'
  return null
}
export function validateReportForm(input: { file: { name: string; size: number }; name: string; approach: string }): string | null {
  const fileError = validateReportFile(input.file)
  if (fileError) return fileError
  const name = input.name.trim()
  if (name.length < 3 || name.length > 150 || !/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(name)) return 'Use apenas letras e espaços, de 3 a 150 caracteres.'
  if (!['Participação acionária', 'Controle operacional', 'Controle financeiro'].includes(input.approach)) return 'Selecione a abordagem utilizada no relatório'
  return null
}
export function reportTotals(report: InventoryReport) {
  // Reductions have their own collection; never subtract them from the gross emissions or sum them twice.
  const emissions = report.emissions.filter(item => !item.isReduction)
  const byScope = new Map<string, number>()
  for (const item of emissions) { const label = item.scope?.name ?? 'Não informado'; byScope.set(label, (byScope.get(label) ?? 0) + item.quantityCo2e) }
  return { emissions: emissions.reduce((sum, item) => sum + item.quantityCo2e, 0), reductions: report.reductions.reduce((sum, item) => sum + item.quantityCo2e, 0), byScope: [...byScope].map(([name, value]) => ({ name, value })) }
}

export interface EmissionGroup { key: string; name: string; value: number }
export function reportBreakdown(report: InventoryReport) {
  const emissions = report.emissions.filter(item => !item.isReduction)
  function group(field: 'scope' | 'category' | 'gas'): EmissionGroup[] {
    const result = new Map<string, EmissionGroup>()
    for (const item of emissions) {
      const catalog = item[field]
      const key = catalog ? String(catalog.id) : 'unknown'
      const current = result.get(key) ?? { key, name: catalog?.name ?? 'Não informado', value: 0 }
      current.value += item.quantityCo2e
      result.set(key, current)
    }
    return [...result.values()].sort((a, b) => b.value - a.value || a.key.localeCompare(b.key))
  }
  return { categories: group('category'), gases: group('gas'), scopes: group('scope'), records: emissions.length, categoryCount: new Set(emissions.flatMap(item => item.category ? [item.category.id] : [])).size, gasCount: new Set(emissions.flatMap(item => item.gas ? [item.gas.id] : [])).size }
}
export function compactEmissionGroups(groups: EmissionGroup[], limit = 5): EmissionGroup[] {
  if (groups.length <= limit) return groups
  const visible = groups.slice(0, limit)
  return [...visible, { key: 'others', name: 'Outros', value: groups.slice(limit).reduce((sum, item) => sum + item.value, 0) }]
}
