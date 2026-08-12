interface ShareBarProps {
  ratio: number // 0-1, share of the panel total
  kind: 'income' | 'expense'
}

/** A simple horizontal fill bar showing a category's share of its panel's total. */
export function ShareBar({ ratio, kind }: ShareBarProps) {
  const pct = Math.max(0, Math.min(1, ratio)) * 100
  return (
    <div className="share-bar">
      <div className={`share-bar-fill ${kind}`} style={{ width: `${pct}%` }} />
    </div>
  )
}
