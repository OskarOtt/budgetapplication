import type { BudgetItem, Category } from './models.ts'

export interface AppState {
  version: number
  categories: Category[]
  items: BudgetItem[]
  startingBalance: number // used only by the Year Simulation view
}

export type Action =
  | { type: 'ADD_ITEM'; item: BudgetItem }
  | { type: 'UPDATE_ITEM'; id: string; changes: Partial<BudgetItem> }
  | { type: 'DELETE_ITEM'; id: string }
  | { type: 'ADD_CATEGORY'; category: Category }
  | { type: 'ARCHIVE_CATEGORY'; id: string }
  | { type: 'SET_STARTING_BALANCE'; amount: number }
