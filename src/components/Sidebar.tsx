import type { Page } from '../App'

interface SidebarProps {
  currentPage: Page
  setPage: (page: Page) => void
}

const navItems: { id: Page; icon: string; label: string }[] = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'invoice', icon: '🧾', label: 'Invoice Generator' },
  { id: 'calculator', icon: '🧮', label: 'GST Calculator' },
]

export default function Sidebar({ currentPage, setPage }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-badge">
          <div className="logo-icon">G</div>
          <div className="logo-text">
            <h2>GSTManager</h2>
            <span>Tax Management Suite</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main Menu</div>
        {navItems.map(item => (
          <button
            key={item.id}
            id={`nav-${item.id}`}
            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setPage(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div>GST Manager v1.0</div>
        <div style={{ marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>© 2025 All rights reserved</div>
      </div>
    </aside>
  )
}
