import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getAnalysisScope } from '../src/utils/analysis.ts'

test('seleção preserva empresa para admin e restringe analista a planta', () => {
  assert.equal(getAnalysisScope('administrator', 'company'), 'company')
  assert.equal(getAnalysisScope('administrator', 'plant'), 'plant')
  assert.equal(getAnalysisScope('administrator', 'invalid'), 'plant')
  assert.equal(getAnalysisScope('analyst', 'company'), 'plant')
  assert.equal(getAnalysisScope('analyst', null), 'plant')
})
