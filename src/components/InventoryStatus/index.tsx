import styled from 'styled-components'
import { inventoryStatusLabels, type InventoryStatus as Status } from '../../types/inventory'
import { useTranslation } from '../../hooks/useTranslation'

const colors: Record<Status, string> = {
  APPROVED: 'var(--color-success)', ISSUED: 'var(--color-success)',
  REJECTED: 'var(--color-danger)', PROCESSING_FAILED: 'var(--color-danger)',
  UNDER_REVIEW: 'var(--color-warning)', PROCESSING: 'var(--color-brand-blue)',
  REQUESTED: 'var(--color-text-secondary)',
}
interface InventoryStatusProps { status: Status }
interface LabelProps { $status: Status }
const Label = styled.span<LabelProps>`
  color: ${({ $status }) => colors[$status]};
  font-weight: var(--font-weight-semibold);
`
export default function InventoryStatus({ status }: InventoryStatusProps) {
  const { t } = useTranslation()
  return <Label $status={status}>{t(inventoryStatusLabels[status])}</Label>
}
