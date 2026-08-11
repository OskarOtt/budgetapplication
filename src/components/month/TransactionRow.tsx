import type { Category, Transaction } from '../../types/models.ts'
import { CurrencyAmount } from '../shared/CurrencyAmount.tsx'
import { formatDate } from '../../utils/date.ts'

interface TransactionRowProps {
  transaction: Transaction
  category: Category | undefined
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

export function TransactionRow({ transaction, category, onEdit, onDelete }: TransactionRowProps) {
  return (
    <li className={`transaction-row ${transaction.kind}`}>
      <span className="transaction-icon">{category?.icon ?? '•'}</span>
      <span className="transaction-desc">
        {transaction.description}
        {transaction.recurringTemplateId && <span className="recurring-badge">↻</span>}
      </span>
      <span className="transaction-category">{category?.name ?? 'Uncategorized'}</span>
      <span className="transaction-date">{formatDate(transaction.date)}</span>
      <CurrencyAmount amount={transaction.amount} kind={transaction.kind} />
      <span className="transaction-actions">
        <button type="button" onClick={() => onEdit(transaction)} aria-label="Edit">
          ✎
        </button>
        <button type="button" onClick={() => onDelete(transaction)} aria-label="Delete">
          🗑
        </button>
      </span>
    </li>
  )
}
