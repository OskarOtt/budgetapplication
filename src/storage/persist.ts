import type { AppState } from '../types/state.ts'
import { seedInitialState } from './seedData.ts'
import { SCHEMA_VERSION, STORAGE_KEY } from './storageKeys.ts'

/** Migrates a raw parsed blob to the current AppState shape. Add version bumps here over time. */
export function migrate(raw: unknown): AppState {
  if (!raw || typeof raw !== 'object') {
    return seedInitialState()
  }
  const candidate = raw as Partial<AppState>
  if (
    !Array.isArray(candidate.categories) ||
    !Array.isArray(candidate.transactions) ||
    !Array.isArray(candidate.recurringTemplates) ||
    !Array.isArray(candidate.categoryBudgets) ||
    !Array.isArray(candidate.savingsGoals)
  ) {
    return seedInitialState()
  }
  return {
    version: SCHEMA_VERSION,
    categories: candidate.categories,
    transactions: candidate.transactions,
    recurringTemplates: candidate.recurringTemplates,
    categoryBudgets: candidate.categoryBudgets,
    savingsGoals: candidate.savingsGoals,
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return seedInitialState()
    }
    return migrate(JSON.parse(raw))
  } catch {
    return seedInitialState()
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Quota exceeded or storage unavailable — silently skip persistence for this write.
  }
}
