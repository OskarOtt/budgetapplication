import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import { loadState, saveState } from '../storage/persist.ts'
import type {
  Category,
  CategoryKind,
  RecurringTemplate,
  SavingsGoal,
  Transaction,
} from '../types/models.ts'
import type { AppState, DeleteScope } from '../types/state.ts'
import { budgetReducer } from './budgetReducer.ts'
import { currentMonthKey, todayISO } from '../utils/date.ts'

interface NewTransactionInput {
  kind: CategoryKind
  categoryId: string
  description: string
  amount: number
  date: string
  repeatsMonthly?: boolean
}

interface BudgetContextValue {
  state: AppState
  dispatch: React.Dispatch<import('../types/state.ts').Action>
  ensureMonths: (monthKeys: string[]) => void
  addTransaction: (input: NewTransactionInput) => void
  updateTransaction: (id: string, changes: Partial<Transaction>) => void
  deleteTransaction: (id: string, scope: DeleteScope) => void
  addCategory: (category: Omit<Category, 'id' | 'isDefault'>) => void
  setCategoryBudget: (categoryId: string, monthlyLimit: number) => void
  stopRecurringTemplate: (id: string, fromMonth: string) => void
  addSavingsGoal: (input: Omit<SavingsGoal, 'id' | 'contributions' | 'createdAt'>) => void
  updateSavingsGoal: (id: string, changes: Partial<SavingsGoal>) => void
  archiveSavingsGoal: (id: string) => void
  addSavingsContribution: (goalId: string, amount: number, date: string, note?: string) => void
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

  useEffect(() => {
    dispatch({ type: 'ENSURE_MONTHS', monthKeys: [currentMonthKey()] })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo<BudgetContextValue>(() => {
    return {
      state,
      dispatch,
      ensureMonths: (monthKeys) => dispatch({ type: 'ENSURE_MONTHS', monthKeys }),

      addTransaction: (input) => {
        const id = makeId()
        const transaction: Transaction = {
          id,
          kind: input.kind,
          categoryId: input.categoryId,
          description: input.description,
          amount: input.amount,
          date: input.date,
          createdAt: todayISO(),
        }

        let recurringTemplate: RecurringTemplate | undefined
        if (input.repeatsMonthly) {
          const templateId = makeId()
          const dayOfMonth = Math.min(28, Number(input.date.slice(8, 10)))
          recurringTemplate = {
            id: templateId,
            kind: input.kind,
            categoryId: input.categoryId,
            description: input.description,
            amount: input.amount,
            dayOfMonth,
            frequency: 'monthly',
            startMonth: input.date.slice(0, 7),
            active: true,
            excludedMonths: [],
          }
          transaction.recurringTemplateId = templateId
        }

        dispatch({ type: 'ADD_TRANSACTION', transaction, recurringTemplate })
      },

      updateTransaction: (id, changes) => dispatch({ type: 'UPDATE_TRANSACTION', id, changes }),

      deleteTransaction: (id, scope) => dispatch({ type: 'DELETE_TRANSACTION', id, scope }),

      addCategory: (input) => {
        const category: Category = { ...input, id: makeId(), isDefault: false }
        dispatch({ type: 'ADD_CATEGORY', category })
      },

      setCategoryBudget: (categoryId, monthlyLimit) =>
        dispatch({ type: 'SET_CATEGORY_BUDGET', categoryId, monthlyLimit }),

      stopRecurringTemplate: (id, fromMonth) =>
        dispatch({ type: 'STOP_RECURRING_TEMPLATE', id, fromMonth }),

      addSavingsGoal: (input) => {
        const goal: SavingsGoal = {
          ...input,
          id: makeId(),
          contributions: [],
          createdAt: todayISO(),
        }
        dispatch({ type: 'ADD_SAVINGS_GOAL', goal })
      },

      updateSavingsGoal: (id, changes) => dispatch({ type: 'UPDATE_SAVINGS_GOAL', id, changes }),

      archiveSavingsGoal: (id) => dispatch({ type: 'ARCHIVE_SAVINGS_GOAL', id }),

      addSavingsContribution: (goalId, amount, date, note) =>
        dispatch({
          type: 'ADD_SAVINGS_CONTRIBUTION',
          goalId,
          contribution: { id: makeId(), amount, date, note },
        }),
    }
  }, [state])

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
}

export function useBudget(): BudgetContextValue {
  const ctx = useContext(BudgetContext)
  if (!ctx) throw new Error('useBudget must be used within a BudgetProvider')
  return ctx
}
