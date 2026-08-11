import { useMemo, useState } from 'react'
import { useBudget } from '../../state/BudgetContext.tsx'
import { computeMonthTotals, computeStartingBalance } from '../../domain/balances.ts'
import { addMonths, currentMonthKey, toMonthKey, todayISO } from '../../utils/date.ts'
import type { CategoryKind, Transaction } from '../../types/models.ts'
import type { DeleteScope } from '../../types/state.ts'
import { MonthNav } from './MonthNav.tsx'
import { MonthSummaryHeader } from './MonthSummaryHeader.tsx'
import { QuickAddBar } from './QuickAddBar.tsx'
import { TransactionFormModal } from './TransactionFormModal.tsx'
import { TransactionList } from './TransactionList.tsx'
import { DeleteTransactionDialog } from './DeleteTransactionDialog.tsx'
import { CategoryBudgetPanel } from './CategoryBudgetPanel.tsx'
import { BudgetSettingsModal } from './BudgetSettingsModal.tsx'
import '../../styles/month.css'

export function MonthView() {
  const { state, ensureMonths, addTransaction, updateTransaction, deleteTransaction, setCategoryBudget } =
    useBudget()
  const [viewedMonth, setViewedMonth] = useState(currentMonthKey())
  const [formOpen, setFormOpen] = useState(false)
  const [formKind, setFormKind] = useState<CategoryKind>('income')
  const [editing, setEditing] = useState<Transaction | undefined>(undefined)
  const [deleteTarget, setDeleteTarget] = useState<Transaction | undefined>(undefined)
  const [budgetSettingsOpen, setBudgetSettingsOpen] = useState(false)

  function navigate(nextMonth: string) {
    setViewedMonth(nextMonth)
    ensureMonths([nextMonth])
  }

  const monthTransactions = useMemo(
    () => state.transactions.filter((t) => toMonthKey(t.date) === viewedMonth),
    [state.transactions, viewedMonth],
  )
  const totals = useMemo(() => computeMonthTotals(state.transactions, viewedMonth), [state.transactions, viewedMonth])
  const startingBalance = useMemo(
    () => computeStartingBalance(state.transactions, viewedMonth),
    [state.transactions, viewedMonth],
  )

  function openAddForm(kind: CategoryKind) {
    setEditing(undefined)
    setFormKind(kind)
    setFormOpen(true)
  }

  function openEditForm(transaction: Transaction) {
    setEditing(transaction)
    setFormKind(transaction.kind)
    setFormOpen(true)
  }

  function handleSubmit(values: {
    kind: CategoryKind
    categoryId: string
    description: string
    amount: number
    date: string
    repeatsMonthly?: boolean
  }) {
    if (editing) {
      updateTransaction(editing.id, {
        kind: values.kind,
        categoryId: values.categoryId,
        description: values.description,
        amount: values.amount,
        date: values.date,
      })
    } else {
      addTransaction(values)
    }
    setFormOpen(false)
  }

  function handleDeleteConfirm(scope: DeleteScope) {
    if (deleteTarget) {
      deleteTransaction(deleteTarget.id, scope)
    }
    setDeleteTarget(undefined)
  }

  return (
    <div className="month-view">
      <MonthNav
        monthKey={viewedMonth}
        onPrev={() => navigate(addMonths(viewedMonth, -1))}
        onNext={() => navigate(addMonths(viewedMonth, 1))}
        onToday={() => navigate(currentMonthKey())}
      />
      <MonthSummaryHeader totals={totals} startingBalance={startingBalance} />
      <QuickAddBar onAddIncome={() => openAddForm('income')} onAddExpense={() => openAddForm('expense')} />

      <CategoryBudgetPanel
        categories={state.categories}
        categoryBudgets={state.categoryBudgets}
        transactions={state.transactions}
        monthKey={viewedMonth}
        onOpenSettings={() => setBudgetSettingsOpen(true)}
      />

      <TransactionList
        transactions={monthTransactions}
        categories={state.categories}
        onEdit={openEditForm}
        onDelete={setDeleteTarget}
      />

      <TransactionFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        categories={state.categories}
        initialKind={formKind}
        editing={editing}
        defaultDate={editing?.date ?? (viewedMonth === currentMonthKey() ? todayISO() : `${viewedMonth}-01`)}
      />

      <DeleteTransactionDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(undefined)}
        onConfirm={handleDeleteConfirm}
        isRecurring={!!deleteTarget?.recurringTemplateId}
      />

      <BudgetSettingsModal
        open={budgetSettingsOpen}
        onClose={() => setBudgetSettingsOpen(false)}
        categories={state.categories}
        categoryBudgets={state.categoryBudgets}
        onSave={setCategoryBudget}
      />
    </div>
  )
}
