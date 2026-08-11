import type {
  Category,
  CategoryBudget,
  RecurringTemplate,
  SavingsGoal,
  Transaction,
} from './models.ts'

export interface AppState {
  version: number
  categories: Category[]
  transactions: Transaction[]
  recurringTemplates: RecurringTemplate[]
  categoryBudgets: CategoryBudget[]
  savingsGoals: SavingsGoal[]
}

export type DeleteScope = 'this' | 'series'

export type Action =
  | {
      type: 'ADD_TRANSACTION'
      transaction: Transaction
      recurringTemplate?: RecurringTemplate
    }
  | { type: 'UPDATE_TRANSACTION'; id: string; changes: Partial<Transaction> }
  | { type: 'DELETE_TRANSACTION'; id: string; scope: DeleteScope }
  | { type: 'ADD_CATEGORY'; category: Category }
  | { type: 'ARCHIVE_CATEGORY'; id: string }
  | { type: 'SET_CATEGORY_BUDGET'; categoryId: string; monthlyLimit: number }
  | { type: 'ADD_RECURRING_TEMPLATE'; template: RecurringTemplate }
  | { type: 'STOP_RECURRING_TEMPLATE'; id: string; fromMonth: string }
  | { type: 'ADD_SAVINGS_GOAL'; goal: SavingsGoal }
  | { type: 'UPDATE_SAVINGS_GOAL'; id: string; changes: Partial<SavingsGoal> }
  | { type: 'ARCHIVE_SAVINGS_GOAL'; id: string }
  | {
      type: 'ADD_SAVINGS_CONTRIBUTION'
      goalId: string
      contribution: { id: string; amount: number; date: string; note?: string }
    }
  | { type: 'ENSURE_MONTHS'; monthKeys: string[] }
