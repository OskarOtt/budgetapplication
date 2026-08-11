interface QuickAddBarProps {
  onAddIncome: () => void
  onAddExpense: () => void
}

export function QuickAddBar({ onAddIncome, onAddExpense }: QuickAddBarProps) {
  return (
    <div className="quick-add-bar">
      <button type="button" className="quick-add-btn income" onClick={onAddIncome}>
        + Income
      </button>
      <button type="button" className="quick-add-btn expense" onClick={onAddExpense}>
        + Expense
      </button>
    </div>
  )
}
