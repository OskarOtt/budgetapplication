import { useEffect, useState } from 'react'
import type { Category, CategoryKind, Transaction } from '../../types/models.ts'
import { CategorySelect } from '../shared/CategorySelect.tsx'
import { Modal } from '../shared/Modal.tsx'

interface TransactionFormValues {
  kind: CategoryKind
  categoryId: string
  description: string
  amount: number
  date: string
  repeatsMonthly?: boolean
}

interface TransactionFormModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: TransactionFormValues) => void
  categories: Category[]
  initialKind: CategoryKind
  editing?: Transaction
  defaultDate: string
}

export function TransactionFormModal({
  open,
  onClose,
  onSubmit,
  categories,
  initialKind,
  editing,
  defaultDate,
}: TransactionFormModalProps) {
  const [kind, setKind] = useState<CategoryKind>(initialKind)
  const [categoryId, setCategoryId] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(defaultDate)
  const [repeatsMonthly, setRepeatsMonthly] = useState(false)

  useEffect(() => {
    if (!open) return
    if (editing) {
      setKind(editing.kind)
      setCategoryId(editing.categoryId)
      setDescription(editing.description)
      setAmount(String(editing.amount))
      setDate(editing.date)
      setRepeatsMonthly(false)
    } else {
      setKind(initialKind)
      const firstCategory = categories.find((c) => c.kind === initialKind && !c.archived)
      setCategoryId(firstCategory?.id ?? '')
      setDescription('')
      setAmount('')
      setDate(defaultDate)
      setRepeatsMonthly(false)
    }
  }, [open, editing, initialKind, categories, defaultDate])

  function handleKindChange(nextKind: CategoryKind) {
    setKind(nextKind)
    const firstCategory = categories.find((c) => c.kind === nextKind && !c.archived)
    setCategoryId(firstCategory?.id ?? '')
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const parsedAmount = Number(amount)
    if (!categoryId || !description.trim() || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return
    }
    onSubmit({
      kind,
      categoryId,
      description: description.trim(),
      amount: parsedAmount,
      date,
      repeatsMonthly,
    })
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit transaction' : 'Add transaction'}>
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-row kind-toggle">
          <button
            type="button"
            className={kind === 'income' ? 'active income' : 'income'}
            onClick={() => handleKindChange('income')}
          >
            Income
          </button>
          <button
            type="button"
            className={kind === 'expense' ? 'active expense' : 'expense'}
            onClick={() => handleKindChange('expense')}
          >
            Expense
          </button>
        </div>

        <div className="form-row">
          <label htmlFor="tx-category">Category</label>
          <CategorySelect
            id="tx-category"
            categories={categories}
            kind={kind}
            value={categoryId}
            onChange={setCategoryId}
          />
        </div>

        <div className="form-row">
          <label htmlFor="tx-description">Description</label>
          <input
            id="tx-description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="tx-amount">Amount</label>
          <input
            id="tx-amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label htmlFor="tx-date">Date</label>
          <input
            id="tx-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        {!editing && (
          <div className="form-row checkbox-row">
            <label htmlFor="tx-repeat">
              <input
                id="tx-repeat"
                type="checkbox"
                checked={repeatsMonthly}
                onChange={(e) => setRepeatsMonthly(e.target.checked)}
              />
              Repeats monthly
            </label>
          </div>
        )}

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
