import { ensureRecurringInstancesForMonths } from '../domain/recurring.ts'
import type { AppState, Action } from '../types/state.ts'

export function budgetReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      const transactions = [...state.transactions, action.transaction]
      const recurringTemplates = action.recurringTemplate
        ? [...state.recurringTemplates, action.recurringTemplate]
        : state.recurringTemplates
      return { ...state, transactions, recurringTemplates }
    }

    case 'UPDATE_TRANSACTION': {
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.id ? { ...t, ...action.changes } : t,
        ),
      }
    }

    case 'DELETE_TRANSACTION': {
      const target = state.transactions.find((t) => t.id === action.id)
      if (!target) return state

      const transactions = state.transactions.filter((t) => t.id !== action.id)

      if (!target.recurringTemplateId) {
        return { ...state, transactions }
      }

      const monthKey = target.date.slice(0, 7)
      const recurringTemplates = state.recurringTemplates.map((template) => {
        if (template.id !== target.recurringTemplateId) return template
        if (action.scope === 'this') {
          return {
            ...template,
            excludedMonths: template.excludedMonths.includes(monthKey)
              ? template.excludedMonths
              : [...template.excludedMonths, monthKey],
          }
        }
        // scope === 'series': stop generating from this month onward (inclusive).
        const priorMonth = shiftMonthKeyBack(monthKey)
        return { ...template, active: false, endMonth: priorMonth }
      })

      return { ...state, transactions, recurringTemplates }
    }

    case 'ADD_CATEGORY': {
      return { ...state, categories: [...state.categories, action.category] }
    }

    case 'ARCHIVE_CATEGORY': {
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.id ? { ...c, archived: true } : c,
        ),
      }
    }

    case 'SET_CATEGORY_BUDGET': {
      const exists = state.categoryBudgets.some((b) => b.categoryId === action.categoryId)
      const categoryBudgets = exists
        ? state.categoryBudgets.map((b) =>
            b.categoryId === action.categoryId ? { ...b, monthlyLimit: action.monthlyLimit } : b,
          )
        : [...state.categoryBudgets, { categoryId: action.categoryId, monthlyLimit: action.monthlyLimit }]
      return { ...state, categoryBudgets }
    }

    case 'ADD_RECURRING_TEMPLATE': {
      return { ...state, recurringTemplates: [...state.recurringTemplates, action.template] }
    }

    case 'STOP_RECURRING_TEMPLATE': {
      const priorMonth = shiftMonthKeyBack(action.fromMonth)
      return {
        ...state,
        recurringTemplates: state.recurringTemplates.map((t) =>
          t.id === action.id ? { ...t, active: false, endMonth: priorMonth } : t,
        ),
      }
    }

    case 'ADD_SAVINGS_GOAL': {
      return { ...state, savingsGoals: [...state.savingsGoals, action.goal] }
    }

    case 'UPDATE_SAVINGS_GOAL': {
      return {
        ...state,
        savingsGoals: state.savingsGoals.map((g) =>
          g.id === action.id ? { ...g, ...action.changes } : g,
        ),
      }
    }

    case 'ARCHIVE_SAVINGS_GOAL': {
      return {
        ...state,
        savingsGoals: state.savingsGoals.map((g) =>
          g.id === action.id ? { ...g, archived: true } : g,
        ),
      }
    }

    case 'ADD_SAVINGS_CONTRIBUTION': {
      return {
        ...state,
        savingsGoals: state.savingsGoals.map((g) =>
          g.id === action.goalId
            ? { ...g, contributions: [...g.contributions, action.contribution] }
            : g,
        ),
      }
    }

    case 'ENSURE_MONTHS': {
      const newTransactions = ensureRecurringInstancesForMonths(
        state.recurringTemplates,
        state.transactions,
        action.monthKeys,
      )
      if (newTransactions.length === 0) return state
      return { ...state, transactions: [...state.transactions, ...newTransactions] }
    }

    default:
      return state
  }
}

function shiftMonthKeyBack(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number)
  const total = year * 12 + (month - 1) - 1
  const newYear = Math.floor(total / 12)
  const newMonth = ((total % 12) + 12) % 12 + 1
  return `${newYear}-${newMonth < 10 ? `0${newMonth}` : newMonth}`
}
