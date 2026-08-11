import type { CategoryKind } from '../../types/models.ts'
import { formatCurrency } from '../../utils/currency.ts'

interface CurrencyAmountProps {
  amount: number
  kind: CategoryKind
}

export function CurrencyAmount({ amount, kind }: CurrencyAmountProps) {
  const sign = kind === 'income' ? '+' : '-'
  return (
    <span className={`currency-amount ${kind}`}>
      {sign}
      {formatCurrency(amount)}
    </span>
  )
}
