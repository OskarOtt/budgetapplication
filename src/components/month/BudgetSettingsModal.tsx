import { useEffect, useState } from 'react'
import type { Category, CategoryBudget } from '../../types/models.ts'
import { Modal } from '../shared/Modal.tsx'

interface BudgetSettingsModalProps {
  open: boolean
  onClose: () => void
  categories: Category[]
  categoryBudgets: CategoryBudget[]
  onSave: (categoryId: string, monthlyLimit: number) => void
}

export function BudgetSettingsModal({
  open,
  onClose,
  categories,
  categoryBudgets,
  onSave,
}: BudgetSettingsModalProps) {
  const expenseCategories = categories.filter((c) => c.kind === 'expense' && !c.archived)
  const budgetByCategory = new Map(categoryBudgets.map((b) => [b.categoryId, b.monthlyLimit]))
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return
    const initial: Record<string, string> = {}
    for (const c of expenseCategories) {
      initial[c.id] = String(budgetByCategory.get(c.id) ?? '')
    }
    setValues(initial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function handleBlur(categoryId: string) {
    const raw = values[categoryId]
    const parsed = Number(raw)
    onSave(categoryId, Number.isFinite(parsed) && parsed > 0 ? parsed : 0)
  }

  return (
    <Modal open={open} onClose={onClose} title="Category budgets">
      <div className="budget-settings">
        {expenseCategories.map((c) => (
          <div className="form-row" key={c.id}>
            <label htmlFor={`budget-${c.id}`}>
              {c.icon ? `${c.icon} ` : ''}
              {c.name}
            </label>
            <input
              id={`budget-${c.id}`}
              type="number"
              min="0"
              step="1"
              placeholder="No limit"
              value={values[c.id] ?? ''}
              onChange={(e) => setValues((v) => ({ ...v, [c.id]: e.target.value }))}
              onBlur={() => handleBlur(c.id)}
            />
          </div>
        ))}
        <div className="form-actions">
          <button type="button" className="primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </Modal>
  )
}
