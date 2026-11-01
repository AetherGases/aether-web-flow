export function isAnalysisScope(value: string): value is 'plant' {
  return value === 'plant'
}

export function validateReportFileName(name: string): string | null {
  return /\.xlsx$/i.test(name) ? null : 'Selecione um arquivo Excel (.xlsx).'
}
