import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getHomePath } from '../src/utils/auth.ts'
import { validateLogin } from '../src/utils/validation.ts'

test('papéis autenticados entram pela visão geral com o painel definido pela sessão', () => {
  assert.equal(getHomePath('analyst'), '/overview')
  assert.equal(getHomePath('administrator'), '/overview')
})

test('validação impede campos vazios, email inválido e senha acima do limite', () => {
  assert.deepEqual(validateLogin({ email: ' a@example.com ', password: 'test' }), {})
  assert(validateLogin({ email: '', password: '' }).email)
  assert(validateLogin({ email: 'invalid', password: 'test' }).email)
  assert(validateLogin({ email: 'a@example.com', password: 'a'.repeat(129) }).password)
})
