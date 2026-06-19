import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import InvoiceGenerator from './pages/InvoiceGenerator'
import Calculator from './pages/Calculator'

export type Page = 'dashboard' | 'invoice' | 'calculator'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  const titles: Record<Page, { title: string; sub: string }> = {
    dashboard: { title: 'Dashboard', sub: 'Overview of your GST activity' },
    invoice: { title: 'Invoice Generator', sub: 'Create & download GST invoices' },
    calculator: { title: 'GST Calculator', sub: 'Quickly compute GST amounts' },
  }

  return (
    <div className="app-layout">
      <Sidebar currentPage={currentPage} setPage={setCurrentPage} />
      <div className="main-content">
        <Topbar title={titles[currentPage].title} sub={titles[currentPage].sub} />
        <div className="page">
          {currentPage === 'dashboard' && <Dashboard setPage={setCurrentPage} />}
          {currentPage === 'invoice' && <InvoiceGenerator />}
          {currentPage === 'calculator' && <Calculator />}
        </div>
      </div>
    </div>
  )
}
