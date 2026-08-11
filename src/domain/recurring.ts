import type { RecurringTemplate, Transaction } from '../types/models.ts'
import { clampDayOfMonth, toMonthKey } from '../utils/date.ts'

export function deterministicId(templateId: string, monthKey: string): string {
  return `rec:${templateId}:${monthKey}`
}

/** True if template should generate an instance for this month (respecting bounds/exclusions). */
function templateAppliesToMonth(template: RecurringTemplate, monthKey: string): boolean {
  if (monthKey < template.startMonth) return false
  if (template.endMonth && monthKey > template.endMonth) return false
  if (template.excludedMonths.includes(monthKey)) return false
  if (!template.active) {
    // Inactive templates only continue producing instances for months before the stop point.
    // "active: false" here means stopped-from-startMonth-onward semantics are handled by
    // endMonth when STOP_RECURRING_TEMPLATE is dispatched (see budgetReducer).
    return false
  }
  return true
}

function templateMonthKey(templateId: string, monthKey: string): string {
  return `${templateId}::${monthKey}`
}

/**
 * Given existing transactions + recurring templates, returns the set of new Transaction rows
 * that need to be created so that every applicable template has an instance for every month in
 * monthKeys. Idempotent: an instance is skipped whenever any existing transaction is already
 * linked to that (template, month) pair — regardless of whether its id is the deterministic
 * `rec:${templateId}:${monthKey}` form (a generated instance) or a random id (the original
 * manually-added transaction that spawned the template) — so it never duplicates.
 */
export function ensureRecurringInstancesForMonths(
  templates: RecurringTemplate[],
  existingTransactions: Transaction[],
  monthKeys: string[],
): Transaction[] {
  const existingTemplateMonths = new Set(
    existingTransactions
      .filter((t) => t.recurringTemplateId)
      .map((t) => templateMonthKey(t.recurringTemplateId as string, toMonthKey(t.date))),
  )
  const newTransactions: Transaction[] = []

  for (const template of templates) {
    for (const monthKey of monthKeys) {
      if (!templateAppliesToMonth(template, monthKey)) continue
      const key = templateMonthKey(template.id, monthKey)
      if (existingTemplateMonths.has(key)) continue

      const day = clampDayOfMonth(monthKey, template.dayOfMonth)
      const date = `${monthKey}-${day < 10 ? `0${day}` : day}`

      newTransactions.push({
        id: deterministicId(template.id, monthKey),
        kind: template.kind,
        categoryId: template.categoryId,
        description: template.description,
        amount: template.amount,
        date,
        recurringTemplateId: template.id,
        createdAt: date,
      })
      existingTemplateMonths.add(key)
    }
  }

  return newTransactions
}

export { clampDayOfMonth, toMonthKey }
