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
    (candidate as { version?: number }).version !== SCHEMA_VERSION ||
    !Array.isArray(candidate.categories) ||
    !Array.isArray(candidate.items) ||
    typeof candidate.startingBalance !== 'number'
  ) {
    // Old (pre-v2) shape or anything unrecognized — no sane 1:1 migration from calendar
    // transactions to a single template month, so reset to seed data.
    return seedInitialState()
  }
  return {
    version: SCHEMA_VERSION,
    categories: candidate.categories,
    items: candidate.items,
    startingBalance: candidate.startingBalance,
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
