import type { AppState, Action } from '../types/state.ts'

export function budgetReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_ITEM': {
      return { ...state, items: [...state.items, action.item] }
    }

    case 'UPDATE_ITEM': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, ...action.changes } : item,
        ),
      }
    }

    case 'DELETE_ITEM': {
      return { ...state, items: state.items.filter((item) => item.id !== action.id) }
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

    case 'SET_STARTING_BALANCE': {
      return { ...state, startingBalance: action.amount }
    }

    default:
      return state
  }
}
