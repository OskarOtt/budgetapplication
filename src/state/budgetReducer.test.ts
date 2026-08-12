import { describe, expect, it } from 'vitest'
import { budgetReducer } from './budgetReducer.ts'
import type { AppState } from '../types/state.ts'
import type { BudgetItem, Category } from '../types/models.ts'

function emptyState(): AppState {
  return {
    version: 2,
    categories: [],
    items: [],
    startingBalance: 0,
  }
}

const rentItem: BudgetItem = {
  id: 'item-1',
  kind: 'expense',
  categoryId: 'cat-rent',
  description: 'Rent',
  amount: 1000,
  dayOfMonth: 1,
}

describe('budgetReducer', () => {
  it('ADD_ITEM appends a budget item', () => {
    const state = emptyState()
    const next = budgetReducer(state, { type: 'ADD_ITEM', item: rentItem })
    expect(next.items).toEqual([rentItem])
  })

  it('UPDATE_ITEM merges changes into the matching item', () => {
    const state: AppState = { ...emptyState(), items: [rentItem] }
    const next = budgetReducer(state, {
      type: 'UPDATE_ITEM',
      id: rentItem.id,
      changes: { amount: 1200 },
    })
    expect(next.items[0].amount).toBe(1200)
    expect(next.items[0].description).toBe('Rent')
  })

  it('DELETE_ITEM removes the matching item', () => {
    const state: AppState = { ...emptyState(), items: [rentItem] }
    const next = budgetReducer(state, { type: 'DELETE_ITEM', id: rentItem.id })
    expect(next.items).toHaveLength(0)
  })

  it('ADD_CATEGORY appends a category', () => {
    const category: Category = { id: 'cat-x', name: 'Custom', kind: 'expense', isDefault: false }
    const next = budgetReducer(emptyState(), { type: 'ADD_CATEGORY', category })
    expect(next.categories).toEqual([category])
  })

  it('ARCHIVE_CATEGORY marks a category as archived', () => {
    const category: Category = { id: 'cat-x', name: 'Custom', kind: 'expense', isDefault: false }
    const state: AppState = { ...emptyState(), categories: [category] }
    const next = budgetReducer(state, { type: 'ARCHIVE_CATEGORY', id: 'cat-x' })
    expect(next.categories[0].archived).toBe(true)
  })

  it('SET_STARTING_BALANCE updates the starting balance', () => {
    const next = budgetReducer(emptyState(), { type: 'SET_STARTING_BALANCE', amount: 500 })
    expect(next.startingBalance).toBe(500)
  })
})
