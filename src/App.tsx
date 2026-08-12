import { useState } from 'react'
import { BudgetProvider } from './state/BudgetContext.tsx'
import { NavBar } from './components/layout/NavBar.tsx'
import type { ViewName } from './components/layout/NavBar.tsx'
import { MonthlyBudgetView } from './components/budget/MonthlyBudgetView.tsx'
import { YearSimulationView } from './components/year/YearSimulationView.tsx'
import './App.css'

function App() {
  const [view, setView] = useState<ViewName>('budget')

  return (
    <BudgetProvider>
      <div className="app-shell">
        <NavBar view={view} onChange={setView} />
        <main className="app-content">
          {view === 'budget' && <MonthlyBudgetView />}
          {view === 'year' && <YearSimulationView />}
        </main>
      </div>
    </BudgetProvider>
  )
}

export default App
