import type { Category, CategoryBudget, Transaction } from '../../types/models.ts'
import { computeCategorySpend, getBudgetStatus } from '../../domain/budgets.ts'
import { CategoryBudgetBar } from './CategoryBudgetBar.tsx'

interface CategoryBudgetPanelProps {
  categories: Category[]
  categoryBudgets: CategoryBudget[]
  transactions: Transaction[]
  monthKey: string
  onOpenSettings: () => void
}

export function CategoryBudgetPanel({
  categories,
  categoryBudgets,
  transactions,
  monthKey,
  onOpenSettings,
}: CategoryBudgetPanelProps) {
  const expenseCategories = categories.filter((c) => c.kind === 'expense' && !c.archived)
  const budgetByCategory = new Map(categoryBudgets.map((b) => [b.categoryId, b]))

  return (
    <div className="category-budget-panel">
      <div className="panel-header">
        <h3>Category budgets</h3>
        <button type="button" onClick={onOpenSettings}>
          Edit budgets
        </button>
      </div>
      <div className="category-budget-list">
        {expenseCategories.map((category) => {
          const spend = computeCategorySpend(transactions, category.id, monthKey)
          const budget = budgetByCategory.get(category.id)
          const { tone, ratio, limit } = getBudgetStatus(spend, budget)
          if (limit <= 0) return null
          return (
            <CategoryBudgetBar
              key={category.id}
              name={category.name}
              icon={category.icon}
              spend={spend}
              limit={limit}
              ratio={ratio}
              tone={tone}
            />
          )
        })}
      </div>
    </div>
  )
}
