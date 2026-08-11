interface YearNavProps {
  year: number
  onPrev: () => void
  onNext: () => void
  onThisYear: () => void
}

export function YearNav({ year, onPrev, onNext, onThisYear }: YearNavProps) {
  return (
    <div className="period-nav">
      <button type="button" onClick={onPrev} aria-label="Previous year">
        ‹
      </button>
      <h2>{year}</h2>
      <button type="button" onClick={onNext} aria-label="Next year">
        ›
      </button>
      <button type="button" className="today-btn" onClick={onThisYear}>
        This year
      </button>
    </div>
  )
}
