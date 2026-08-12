export type ViewName = 'budget' | 'year'

interface NavBarProps {
  view: ViewName
  onChange: (view: ViewName) => void
}

const TABS: { id: ViewName; label: string }[] = [
  { id: 'budget', label: 'Monthly Budget' },
  { id: 'year', label: 'Year Simulation' },
]

export function NavBar({ view, onChange }: NavBarProps) {
  return (
    <nav className="nav-bar">
      <span className="nav-brand">Budget</span>
      <div className="nav-tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={view === tab.id}
            className={`nav-tab ${view === tab.id ? 'active' : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
