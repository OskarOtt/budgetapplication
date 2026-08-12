import { useMemo, useState } from 'react'
import { useBudget } from '../../state/BudgetContext.tsx'
import { computeMonthTotals } from '../../domain/balances.ts'
import type { BudgetItem, CategoryKind } from '../../types/models.ts'
import { BudgetSummaryHeader } from './BudgetSummaryHeader.tsx'
import { BudgetPanel } from './BudgetPanel.tsx'
import { ItemFormModal } from './ItemFormModal.tsx'
import { DeleteItemDialog } from './DeleteItemDialog.tsx'
import '../../styles/budget.css'

export function MonthlyBudgetView() {
  const { state, addItem, updateItem, deleteItem } = useBudget()
  const [formOpen, setFormOpen] = useState(false)
  const [formKind, setFormKind] = useState<CategoryKind>('income')
  const [editing, setEditing] = useState<BudgetItem | undefined>(undefined)
  const [deleteTarget, setDeleteTarget] = useState<BudgetItem | undefined>(undefined)

  const totals = useMemo(() => computeMonthTotals(state.items), [state.items])
  const incomeItems = useMemo(() => state.items.filter((i) => i.kind === 'income'), [state.items])
  const expenseItems = useMemo(() => state.items.filter((i) => i.kind === 'expense'), [state.items])

  function openAddForm(kind: CategoryKind) {
    setEditing(undefined)
    setFormKind(kind)
    setFormOpen(true)
  }

  function openEditForm(item: BudgetItem) {
    setEditing(item)
    setFormKind(item.kind)
    setFormOpen(true)
  }

  function handleSubmit(values: {
    kind: CategoryKind
    categoryId: string
    description: string
    amount: number
    dayOfMonth?: number
  }) {
    if (editing) {
      updateItem(editing.id, {
        categoryId: values.categoryId,
        description: values.description,
        amount: values.amount,
        dayOfMonth: values.dayOfMonth,
      })
    } else {
      addItem(values)
    }
    setFormOpen(false)
  }

  function handleDeleteConfirm() {
    if (deleteTarget) {
      deleteItem(deleteTarget.id)
    }
    setDeleteTarget(undefined)
  }

  return (
    <div className="budget-view">
      <div className="budget-view-heading">
        <h2>Monthly Budget</h2>
        <p className="budget-view-subtitle">
          One budget for every month — add your recurring income and expenses below.
        </p>
      </div>

      <BudgetSummaryHeader totals={totals} />

      <div className="budget-panels">
        <BudgetPanel
          kind="income"
          items={incomeItems}
          categories={state.categories}
          onAdd={() => openAddForm('income')}
          onEdit={openEditForm}
          onDelete={setDeleteTarget}
        />
        <BudgetPanel
          kind="expense"
          items={expenseItems}
          categories={state.categories}
          onAdd={() => openAddForm('expense')}
          onEdit={openEditForm}
          onDelete={setDeleteTarget}
        />
      </div>

      <ItemFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        categories={state.categories}
        kind={formKind}
        editing={editing}
      />

      <DeleteItemDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(undefined)}
        onConfirm={handleDeleteConfirm}
        description={deleteTarget?.description}
      />
    </div>
  )
}
