import { useMemo, useState } from 'react'
import { useBudget } from '../../state/BudgetContext.tsx'
import { computeYearSimulation } from '../../domain/balances.ts'
import { formatCurrency } from '../../utils/currency.ts'
import { YearBarChart } from './YearBarChart.tsx'
import { YearTable } from './YearTable.tsx'
import { BalanceTrend } from './BalanceTrend.tsx'
import '../../styles/year.css'

export function YearSimulationView() {
  const { state, setStartingBalance } = useBudget()
  const [balanceInput, setBalanceInput] = useState(String(state.startingBalance))

  const rows = useMemo(
    () => computeYearSimulation(state.items, state.startingBalance),
    [state.items, state.startingBalance],
  )
  const endOfYear = rows[rows.length - 1]?.endingBalance ?? state.startingBalance

  function handleBalanceBlur() {
    const parsed = Number(balanceInput)
    const amount = Number.isFinite(parsed) ? parsed : 0
    setStartingBalance(amount)
    setBalanceInput(String(amount))
  }

  return (
    <div className="year-view">
      <div className="year-view-heading">
        <h2>Year Simulation</h2>
        <p className="year-view-subtitle">
          If your monthly budget stays the same, here's what the next 12 months would look like.
        </p>
      </div>

      <div className="year-hero">
        <div className="year-hero-item">
          <label htmlFor="starting-balance">Starting balance</label>
          <input
            id="starting-balance"
            type="number"
            step="0.01"
            value={balanceInput}
            onChange={(e) => setBalanceInput(e.target.value)}
            onBlur={handleBalanceBlur}
          />
        </div>
        <div className="year-hero-item">
          <span className="summary-label">Balance after 12 months</span>
          <span className={`summary-value ${endOfYear >= 0 ? 'income' : 'expense'}`}>
            {formatCurrency(endOfYear)}
          </span>
        </div>
      </div>

      <YearBarChart rows={rows} />
      <BalanceTrend rows={rows} />
      <YearTable rows={rows} />
    </div>
  )
}
