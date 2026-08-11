import { describe, expect, it } from 'vitest'
import { ensureRecurringInstancesForMonths, deterministicId } from './recurring.ts'
import type { RecurringTemplate } from '../types/models.ts'

const baseTemplate: RecurringTemplate = {
  id: 'tpl-1',
  kind: 'expense',
  categoryId: 'cat-rent',
  description: 'Rent',
  amount: 1000,
  dayOfMonth: 31,
  frequency: 'monthly',
  startMonth: '2024-01',
  active: true,
  excludedMonths: [],
}

describe('ensureRecurringInstancesForMonths', () => {
  it('generates a deterministic instance for each applicable month', () => {
    const result = ensureRecurringInstancesForMonths([baseTemplate], [], ['2024-01', '2024-02'])
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe(deterministicId('tpl-1', '2024-01'))
    expect(result[1].id).toBe(deterministicId('tpl-1', '2024-02'))
  })

  it('is idempotent — running again with existing transactions yields no duplicates', () => {
    const first = ensureRecurringInstancesForMonths([baseTemplate], [], ['2024-01'])
    const second = ensureRecurringInstancesForMonths([baseTemplate], first, ['2024-01'])
    expect(second).toHaveLength(0)
  })

  it('clamps day-of-month for short months (e.g. February)', () => {
    const result = ensureRecurringInstancesForMonths([baseTemplate], [], ['2024-02'])
    expect(result[0].date).toBe('2024-02-29') // 2024 is a leap year
  })

  it('clamps day-of-month for non-leap February', () => {
    const template = { ...baseTemplate, startMonth: '2023-01' }
    const result = ensureRecurringInstancesForMonths([template], [], ['2023-02'])
    expect(result[0].date).toBe('2023-02-28')
  })

  it('respects excludedMonths', () => {
    const template = { ...baseTemplate, excludedMonths: ['2024-03'] }
    const result = ensureRecurringInstancesForMonths([template], [], ['2024-03'])
    expect(result).toHaveLength(0)
  })

  it('respects endMonth and startMonth bounds', () => {
    const template = { ...baseTemplate, startMonth: '2024-02', endMonth: '2024-03' }
    const result = ensureRecurringInstancesForMonths(
      [template],
      [],
      ['2024-01', '2024-02', '2024-03', '2024-04'],
    )
    expect(result.map((t) => t.date.slice(0, 7))).toEqual(['2024-02', '2024-03'])
  })

  it('does not generate instances for inactive templates', () => {
    const template = { ...baseTemplate, active: false }
    const result = ensureRecurringInstancesForMonths([template], [], ['2024-01'])
    expect(result).toHaveLength(0)
  })

  it('does not duplicate when the originating transaction has a non-deterministic id', () => {
    // The first transaction of a series is created with a random UUID (not rec:templateId:month)
    // at the moment the user adds it with "repeats monthly" checked.
    const originalTx = {
      id: 'user-generated-uuid',
      kind: 'expense' as const,
      categoryId: 'cat-rent',
      description: 'Rent',
      amount: 1000,
      date: '2024-01-31',
      recurringTemplateId: 'tpl-1',
      createdAt: '2024-01-31',
    }
    const result = ensureRecurringInstancesForMonths([baseTemplate], [originalTx], ['2024-01', '2024-02'])
    expect(result).toHaveLength(1)
    expect(result[0].date.slice(0, 7)).toBe('2024-02')
  })
})

describe('deterministicId', () => {
  it('produces stable ids for the same template/month', () => {
    expect(deterministicId('abc', '2024-05')).toBe('rec:abc:2024-05')
  })
})
