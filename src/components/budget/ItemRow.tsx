import type { BudgetItem, Category } from '../../types/models.ts'
import { CurrencyAmount } from '../shared/CurrencyAmount.tsx'
import { ordinal } from '../../utils/date.ts'

interface ItemRowProps {
  item: BudgetItem
  category: Category | undefined
  onEdit: (item: BudgetItem) => void
  onDelete: (item: BudgetItem) => void
}

export function ItemRow({ item, category, onEdit, onDelete }: ItemRowProps) {
  return (
    <li className={`item-row ${item.kind}`}>
      <span className="item-icon">{category?.icon ?? '•'}</span>
      <span className="item-desc">
        {item.description}
        {typeof item.dayOfMonth === 'number' && (
          <span className="item-day">every {ordinal(item.dayOfMonth)}</span>
        )}
      </span>
      <CurrencyAmount amount={item.amount} kind={item.kind} />
      <span className="item-actions">
        <button type="button" onClick={() => onEdit(item)} aria-label="Edit">
          ✎
        </button>
        <button type="button" onClick={() => onDelete(item)} aria-label="Delete">
          🗑
        </button>
      </span>
    </li>
  )
}
