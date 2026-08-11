import type { Category } from '../types/models.ts'
import type { AppState } from '../types/state.ts'
import { SCHEMA_VERSION } from './storageKeys.ts'

export const DEFAULT_CATEGORIES: Category[] = [
  // Income
  { id: 'cat-salary', name: 'Salary', kind: 'income', icon: '💼', isDefault: true },
  {
    id: 'cat-freelance',
    name: 'Freelance/Side Income',
    kind: 'income',
    icon: '🧑‍💻',
    isDefault: true,
  },
  { id: 'cat-investments', name: 'Investments', kind: 'income', icon: '📈', isDefault: true },
  { id: 'cat-gifts', name: 'Gifts', kind: 'income', icon: '🎁', isDefault: true },
  { id: 'cat-other-income', name: 'Other Income', kind: 'income', icon: '➕', isDefault: true },
  // Expense
  {
    id: 'cat-rent',
    name: 'Rent/Mortgage',
    kind: 'expense',
    icon: '🏠',
    isDefault: true,
  },
  { id: 'cat-groceries', name: 'Groceries', kind: 'expense', icon: '🛒', isDefault: true },
  { id: 'cat-utilities', name: 'Utilities', kind: 'expense', icon: '💡', isDefault: true },
  { id: 'cat-transport', name: 'Transport', kind: 'expense', icon: '🚗', isDefault: true },
  { id: 'cat-dining', name: 'Dining Out', kind: 'expense', icon: '🍽️', isDefault: true },
  {
    id: 'cat-entertainment',
    name: 'Entertainment',
    kind: 'expense',
    icon: '🎬',
    isDefault: true,
  },
  {
    id: 'cat-health',
    name: 'Health & Fitness',
    kind: 'expense',
    icon: '💪',
    isDefault: true,
  },
  { id: 'cat-shopping', name: 'Shopping', kind: 'expense', icon: '🛍️', isDefault: true },
  {
    id: 'cat-subscriptions',
    name: 'Subscriptions',
    kind: 'expense',
    icon: '🔁',
    isDefault: true,
  },
  { id: 'cat-insurance', name: 'Insurance', kind: 'expense', icon: '🛡️', isDefault: true },
  {
    id: 'cat-other-expense',
    name: 'Other Expense',
    kind: 'expense',
    icon: '➖',
    isDefault: true,
  },
]

export function seedInitialState(): AppState {
  return {
    version: SCHEMA_VERSION,
    categories: DEFAULT_CATEGORIES,
    transactions: [],
    recurringTemplates: [],
    categoryBudgets: [],
    savingsGoals: [],
  }
}
