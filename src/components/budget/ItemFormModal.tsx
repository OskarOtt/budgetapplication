import { useEffect, useState } from 'react'
import type { BudgetItem, Category, CategoryKind } from '../../types/models.ts'
import { CategorySelect } from '../shared/CategorySelect.tsx'
import { Modal } from '../shared/Modal.tsx'

interface ItemFormValues {
  kind: CategoryKind
  categoryId: string
  description: string
  amount: number
  dayOfMonth?: number
}

interface ItemFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: ItemFormValues) => void
  categories: Category[]
  kind: CategoryKind
  editing?: BudgetItem
}

export function ItemFormModal({ open, onClose, onSubmit, categories, kind, editing }: ItemFormModalProps) {
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [dayOfMonth, setDayOfMonth] = useState('')

  useEffect(() => {
    if (!open) return
    if (editing) {
      setCategoryId(editing.categoryId)
      setDescription(editing.description)
      setAmount(String(editing.amount))
      setDayOfMonth(editing.dayOfMonth ? String(editing.dayOfMonth) : '')
    } else {
      const firstCategory = categories.find((c) => c.kind === kind && !c.archived)
      setCategoryId(firstCategory?.id ?? '')
      setDescription('')
      setAmount('')
      setDayOfMonth('')
    }
  }, [open, editing, kind, categories])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsedAmount = Number(amount)
    if (!categoryId || !description.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return
    }
    const parsedDay = dayOfMonth ? Math.min(28, Math.max(1, Number(dayOfMonth))) : undefined
    onSubmit({
      kind,
      categoryId,
      description: description.trim(),
      amount: parsedAmount,
      dayOfMonth: parsedDay,
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? `Edit ${kind}` : `Add ${kind}`}
    >
      <form onSubmit={handleSubmit} className="item-form">
        <div className="form-row">
          <label htmlFor="item-category">Category</label>
          <CategorySelect
            id="item-category"
            categories={categories}
            kind={kind}
            value={categoryId}
            onChange={setCategoryId}
          />
        </div>

        <div className="form-row">
          <label htmlFor="item-description">Description</label>
          <input
            id="item-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="item-amount">Amount per month</label>
          <input
            id="item-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="item-day">Day of month (optional)</label>
          <input
            id="item-day"
            type="number"
            min="1"
            max="28"
            placeholder="e.g. 1"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="primary">
            {editing ? 'Save' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
