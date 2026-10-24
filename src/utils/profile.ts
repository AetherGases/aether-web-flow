import type { ProfileErrors, ProfileUpdate } from '../types/profile.ts'

export function validateProfile(changes: ProfileUpdate): ProfileErrors {
  const errors: ProfileErrors = {}
  if (changes.name !== undefined) {
    const name = changes.name.trim()
    if (name.length < 3 || name.length > 150 || !/^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(name)) errors.name = 'Informe um nome de 3 a 150 caracteres, usando letras e espaços.'
  }
  if (changes.phone !== undefined && !/^(\(\d{2}\)|\d{2})\s?\d{4,5}-?\d{4}$/.test(changes.phone.trim())) errors.phone = 'Informe um telefone válido com DDD.'
  return errors
}
