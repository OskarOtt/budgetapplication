import { formatMonthLabel } from '../../utils/date.ts'

interface MonthNavProps {
  monthKey: string
  onPrev: () => void
  onNext: () => void
  onToday: () => void
}

export function MonthNav({ monthKey, onPrev, onNext, onToday }: MonthNavProps) {
  return (
    <div className="period-nav">
      <button type="button" onClick={onPrev} aria-label="Previous month">
        ‹
      </button>
      <h2>{formatMonthLabel(monthKey)}</h2>
      <button type="button" onClick={onNext} aria-label="Next month">
        ›
      </button>
      <button type="button" className="today-btn" onClick={onToday}>
        Today
      </button>
    </div>
  )
}
