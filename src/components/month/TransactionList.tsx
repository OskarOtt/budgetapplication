import type { Category, Transaction } from '../../types/models.ts'
import { TransactionRow } from './TransactionRow.tsx'

interface TransactionListProps {
  transactions: Transaction[]
  categories: Category[]
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

function sortByAmountDesc(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => b.amount - a.amount)
}

export function TransactionList({ transactions, categories, onEdit, onDelete }: TransactionListProps) {
  const categoryById = new Map(categories.map((c) => [c.id, c]))
  const income = sortByAmountDesc(transactions.filter((t) => t.kind === 'income'))
  const expense = sortByAmountDesc(transactions.filter((t) => t.kind === 'expense'))

  if (income.length === 0 && expense.length === 0) {
    return <p className="empty-state">No transactions yet this month.</p>
  }

  return (
    <div className="transaction-columns">
      <div className="transaction-column">
        <h3>Income</h3>
        {income.length === 0 ? (
          <p className="empty-state">No income yet this month.</p>
        ) : (
          <ul className="transaction-list">
            {income.map((t) => (
              <TransactionRow
                key={t.id}
                transaction={t}
                category={categoryById.get(t.categoryId)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </div>
      <div className="transaction-column">
        <h3>Expenses</h3>
        {expense.length === 0 ? (
          <p className="empty-state">No expenses yet this month.</p>
        ) : (
          <ul className="transaction-list">
            {expense.map((t) => (
              <TransactionRow
                key={t.id}
                transaction={t}
                category={categoryById.get(t.categoryId)}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

