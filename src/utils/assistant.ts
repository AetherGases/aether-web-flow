export const assistantMessageLimit = 8192

export function validateAssistantMessage(text: string): string | null {
  const value = text.trim()
  return !value || value.length > assistantMessageLimit ? 'Escreva uma mensagem de até 8192 caracteres.' : null
}
