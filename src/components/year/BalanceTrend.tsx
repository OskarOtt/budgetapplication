import type { YearSimRow } from '../../domain/balances.ts'

interface BalanceTrendProps {
  rows: YearSimRow[]
}

/** A small SVG sparkline of the cumulative ending balance across the simulated year. */
export function BalanceTrend({ rows }: BalanceTrendProps) {
  const width = 600
  const height = 80
  const values = rows.map((r) => r.endingBalance)
  const min = Math.min(0, ...values)
  const max = Math.max(0, ...values)
  const range = max - min || 1

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width
      const y = height - ((v - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  const zeroY = height - ((0 - min) / range) * height
  const isPositiveEnd = values[values.length - 1] >= 0

  return (
    <svg className="balance-trend" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <line x1={0} y1={zeroY} x2={width} y2={zeroY} className="balance-trend-zero" />
      <polyline
        points={points}
        className={`balance-trend-line ${isPositiveEnd ? 'positive' : 'negative'}`}
        fill="none"
      />
    </svg>
  )
}
