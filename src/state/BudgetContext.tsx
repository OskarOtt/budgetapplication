import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import { loadState, saveState } from '../storage/persist.ts'
import type { BudgetItem, Category } from '../types/models.ts'
import type { AppState } from '../types/state.ts'
import { budgetReducer } from './budgetReducer.ts'

interface NewItemInput {
  kind: BudgetItem['kind']
  categoryId: string
  description: string
  amount: number
  dayOfMonth?: number
}

interface BudgetContextValue {
  state: AppState
  dispatch: React.Dispatch<import('../types/state.ts').Action>
  addItem: (input: NewItemInput) => void
  updateItem: (id: string, changes: Partial<BudgetItem>) => void
  deleteItem: (id: string) => void
  addCategory: (category: Omit<Category, 'id' | 'isDefault'>) => void
  archiveCategory: (id: string) => void
  setStartingBalance: (amount: number) => void
}

const BudgetContext = createContext<BudgetContextValue | null>(null)

function makeId(): string {
  return crypto.randomUUID()
}

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(budgetReducer, undefined, loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

  const value = useMemo<BudgetContextValue>(() => {
    return {
      state,
      dispatch,

      addItem: (input) => {
        const item: BudgetItem = {
          id: makeId(),
          kind: input.kind,
          categoryId: input.categoryId,
          description: input.description,
          amount: input.amount,
          dayOfMonth: input.dayOfMonth,
        }
        dispatch({ type: 'ADD_ITEM', item })
      },

      updateItem: (id, changes) => dispatch({ type: 'UPDATE_ITEM', id, changes }),

      deleteItem: (id) => dispatch({ type: 'DELETE_ITEM', id }),

      addCategory: (input) => {
        const category: Category = { ...input, id: makeId(), isDefault: false }
        dispatch({ type: 'ADD_CATEGORY', category })
      },

      archiveCategory: (id) => dispatch({ type: 'ARCHIVE_CATEGORY', id }),

      setStartingBalance: (amount) => dispatch({ type: 'SET_STARTING_BALANCE', amount }),
    }
  }, [state])

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
}

export function useBudget(): BudgetContextValue {
  const ctx = useContext(BudgetContext)
  if (!ctx) throw new Error('useBudget must be used within a BudgetProvider')
  return ctx
}
