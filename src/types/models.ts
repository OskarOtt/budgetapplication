export type CategoryKind = 'income' | 'expense'

export interface Category {
  id: string
  name: string
  kind: CategoryKind
  icon?: string
  isDefault: boolean
  archived?: boolean
}

export type RecurrenceFrequency = 'monthly'

export interface RecurringTemplate {
  id: string
  kind: CategoryKind
  categoryId: string
  description: string
  amount: number
  dayOfMonth: number // 1-28
  frequency: RecurrenceFrequency
  startMonth: string // 'YYYY-MM'
  endMonth?: string // 'YYYY-MM'
  active: boolean
  excludedMonths: string[] // 'YYYY-MM'
}

export interface Transaction {
  id: string
  kind: CategoryKind
  categoryId: string
  description: string
  amount: number
  date: string // 'YYYY-MM-DD'
  recurringTemplateId?: string
  createdAt: string
}

export interface CategoryBudget {
  categoryId: string
  monthlyLimit: number
}

export interface SavingsContribution {
  id: string
  amount: number
  date: string
  note?: string
}

export interface SavingsGoal {
  id: string
  name: string
  targetAmount: number
  targetDate?: string
  contributions: SavingsContribution[]
  archived?: boolean
  createdAt: string
}
