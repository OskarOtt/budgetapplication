import { useState } from 'react'
import { BudgetProvider } from './state/BudgetContext.tsx'
import { NavBar } from './components/layout/NavBar.tsx'
import type { ViewName } from './components/layout/NavBar.tsx'
import { MonthView } from './components/month/MonthView.tsx'
import { YearView } from './components/year/YearView.tsx'
import { SavingsGoalsView } from './components/savings/SavingsGoalsView.tsx'
import './App.css'

function App() {
  const [view, setView] = useState<ViewName>('month')

  return (
    <BudgetProvider>
      <div className="app-shell">
        <NavBar view={view} onChange={setView} />
        <main className="app-content">
          {view === 'month' && <MonthView />}
          {view === 'year' && <YearView />}
          {view === 'goals' && <SavingsGoalsView />}
        </main>
      </div>
    </BudgetProvider>
  )
}

export default App
