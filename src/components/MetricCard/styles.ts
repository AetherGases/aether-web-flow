import styled from 'styled-components'

export const Card = styled.article`
  padding: var(--space-4);
  background: var(--color-surface);
  border: var(--border-width) solid var(--color-border);
  border-radius: var(--radius-xl);
`

export const Label = styled.p`
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
`

export const Value = styled.strong`
  display: block;
  margin-top: var(--space-2);
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
`

type VariationStatus = 'positive' | 'negative' | 'neutral'

interface VariationProps {
  $status: VariationStatus
}

export const Variation = styled.p<VariationProps>`
  margin-top: var(--space-2);

  color: ${({ $status }) => {
    if ($status === 'positive') {
      return 'var(--color-success)'
    }

    if ($status === 'negative') {
      return 'var(--color-danger)'
    }

    return 'var(--color-text-secondary)'
  }};

  font-size: var(--font-size-xs);
`

export const NeutralVariation = styled.p`
  margin-top: var(--space-2);
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
`