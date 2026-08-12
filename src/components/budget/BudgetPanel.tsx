import type { BudgetItem, Category, CategoryKind } from '../../types/models.ts'
import { ItemList } from './ItemList.tsx'
import { formatCurrency } from '../../utils/currency.ts'

interface BudgetPanelProps {
  kind: CategoryKind
  items: BudgetItem[]
  categories: Category[]
  onAdd: () => void
  onEdit: (item: BudgetItem) => void
  onDelete: (item: BudgetItem) => void
}

export function BudgetPanel({ kind, items, categories, onAdd, onEdit, onDelete }: BudgetPanelProps) {
  const total = items.reduce((sum, i) => sum + i.amount, 0)
  const title = kind === 'income' ? 'Income' : 'Expenses'

  return (
    <section className={`budget-panel ${kind}`}>
      <div className="budget-panel-header">
        <div>
          <h3>{title}</h3>
          <span className="budget-panel-total">{formatCurrency(total)} / month</span>
        </div>
        <button type="button" className={`add-btn ${kind}`} onClick={onAdd}>
          + Add {kind === 'income' ? 'income' : 'expense'}
        </button>
      </div>
      <ItemList items={items} categories={categories} onEdit={onEdit} onDelete={onDelete} />
    </section>
  )
}
