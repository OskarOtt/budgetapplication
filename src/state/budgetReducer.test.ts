import { describe, expect, it } from 'vitest'
import { budgetReducer } from './budgetReducer.ts'
import type { AppState } from '../types/state.ts'
import type { RecurringTemplate, Transaction } from '../types/models.ts'

function emptyState(): AppState {
  return {
    version: 1,
    categories: [],
    transactions: [],
    recurringTemplates: [],
    categoryBudgets: [],
    savingsGoals: [],
  }
}

const template: RecurringTemplate = {
  id: 'tpl-1',
  kind: 'expense',
  categoryId: 'cat-rent',
  description: 'Rent',
  amount: 1000,
  dayOfMonth: 1,
  frequency: 'monthly',
  startMonth: '2024-01',
  active: true,
  excludedMonths: [],
}

const generatedTx: Transaction = {
  id: 'rec:tpl-1:2024-02',
  kind: 'expense',
  categoryId: 'cat-rent',
  description: 'Rent',
  amount: 1000,
  date: '2024-02-01',
  recurringTemplateId: 'tpl-1',
  createdAt: '2024-02-01',
}

describe('budgetReducer', () => {
  it('ADD_TRANSACTION adds a transaction and optional recurring template', () => {
    const state = emptyState()
    const next = budgetReducer(state, {
      type: 'ADD_TRANSACTION',
      transaction: generatedTx,
      recurringTemplate: template,
    })
    expect(next.transactions).toHaveLength(1)
    expect(next.recurringTemplates).toHaveLength(1)
  })

  it('DELETE_TRANSACTION with scope "this" excludes the month from the template', () => {
    const state: AppState = {
      ...emptyState(),
      transactions: [generatedTx],
      recurringTemplates: [template],
    }
    const next = budgetReducer(state, { type: 'DELETE_TRANSACTION', id: generatedTx.id, scope: 'this' })
    expect(next.transactions).toHaveLength(0)
    expect(next.recurringTemplates[0].excludedMonths).toContain('2024-02')
    expect(next.recurringTemplates[0].active).toBe(true)
  })

  it('DELETE_TRANSACTION with scope "series" stops the template from that month onward', () => {
    const state: AppState = {
      ...emptyState(),
      transactions: [generatedTx],
      recurringTemplates: [template],
    }
    const next = budgetReducer(state, { type: 'DELETE_TRANSACTION', id: generatedTx.id, scope: 'series' })
    expect(next.transactions).toHaveLength(0)
    expect(next.recurringTemplates[0].active).toBe(false)
    expect(next.recurringTemplates[0].endMonth).toBe('2024-01')
  })

  it('ENSURE_MONTHS materializes missing recurring instances idempotently', () => {
    let state: AppState = { ...emptyState(), recurringTemplates: [template] }
    state = budgetReducer(state, { type: 'ENSURE_MONTHS', monthKeys: ['2024-01', '2024-02'] })
    expect(state.transactions).toHaveLength(2)
    const again = budgetReducer(state, { type: 'ENSURE_MONTHS', monthKeys: ['2024-01', '2024-02'] })
    expect(again.transactions).toHaveLength(2)
  })

  it('SET_CATEGORY_BUDGET creates then updates a budget for a category', () => {
    let state = emptyState()
    state = budgetReducer(state, { type: 'SET_CATEGORY_BUDGET', categoryId: 'cat-rent', monthlyLimit: 500 })
    expect(state.categoryBudgets).toEqual([{ categoryId: 'cat-rent', monthlyLimit: 500 }])
    state = budgetReducer(state, { type: 'SET_CATEGORY_BUDGET', categoryId: 'cat-rent', monthlyLimit: 600 })
    expect(state.categoryBudgets).toEqual([{ categoryId: 'cat-rent', monthlyLimit: 600 }])
  })
})
