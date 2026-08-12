import type { BudgetItem, Category } from '../../types/models.ts'
import { ItemRow } from './ItemRow.tsx'
import { ShareBar } from '../shared/ShareBar.tsx'
import { formatCurrency } from '../../utils/currency.ts'

interface ItemListProps {
  items: BudgetItem[]
  categories: Category[]
  onEdit: (item: BudgetItem) => void
  onDelete: (item: BudgetItem) => void
}

/** Groups a single kind's items by category, sorted by subtotal descending, with a share bar. */
export function ItemList({ items, categories, onEdit, onDelete }: ItemListProps) {
  if (items.length === 0) {
    return <p className="empty-state">Nothing added yet.</p>
  }

  const categoryById = new Map(categories.map((c) => [c.id, c]))
  const total = items.reduce((sum, i) => sum + i.amount, 0)

  const groups = new Map<string, BudgetItem[]>()
  for (const item of items) {
    const list = groups.get(item.categoryId) ?? []
    list.push(item)
    groups.set(item.categoryId, list)
  }

  const sortedGroups = [...groups.entries()].sort(
    ([, a], [, b]) =>
      b.reduce((s, i) => s + i.amount, 0) - a.reduce((s, i) => s + i.amount, 0),
  )

  return (
    <div className="item-groups">
      {sortedGroups.map(([categoryId, groupItems]) => {
        const category = categoryById.get(categoryId)
        const subtotal = groupItems.reduce((sum, i) => sum + i.amount, 0)
        const ratio = total > 0 ? subtotal / total : 0
        return (
          <div className="item-group" key={categoryId}>
            <div className="item-group-header">
              <span className="item-group-name">
                {category?.icon ?? '•'} {category?.name ?? 'Uncategorized'}
              </span>
              <span className="item-group-subtotal">{formatCurrency(subtotal)}</span>
            </div>
            <ShareBar ratio={ratio} kind={groupItems[0].kind} />
            <ul className="item-list">
              {groupItems.map((item) => (
                <ItemRow key={item.id} item={item} category={category} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
