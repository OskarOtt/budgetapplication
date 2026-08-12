export type CategoryKind = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  kind: CategoryKind
  icon?: string
  isDefault: boolean
  archived?: boolean
}

/** A single recurring line item in the one-and-only monthly budget. No calendar dates. */
export interface BudgetItem {
  id: string
  kind: CategoryKind
  categoryId: string
  description: string
  amount: number
  dayOfMonth?: number // 1-28, optional — display/sort order only, not a real date
}
