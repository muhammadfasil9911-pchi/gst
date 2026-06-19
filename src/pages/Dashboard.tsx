import type { Page } from '../App'

interface DashboardProps {
  setPage: (page: Page) => void
}

const recentInvoices = [
  { id: 'INV-0042', client: 'Arun Textiles Pvt Ltd', date: '18 Jun 2025', amount: '₹1,28,400', gst: '₹19,800', status: 'paid' },
  { id: 'INV-0041', client: 'Sri Murugan Traders', date: '15 Jun 2025', amount: '₹56,200', gst: '₹8,520', status: 'paid' },
  { id: 'INV-0040', client: 'Bharat Exports Ltd', date: '12 Jun 2025', amount: '₹2,34,000', gst: '₹42,120', status: 'pending' },
  { id: 'INV-0039', client: 'Nirmala Constructions', date: '10 Jun 2025', amount: '₹78,000', gst: '₹14,040', status: 'overdue' },
  { id: 'INV-0038', client: 'Horizon IT Services', date: '08 Jun 2025', amount: '₹45,000', gst: '₹8,100', status: 'paid' },
]

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const taxData = [42000, 61000, 55000, 78000, 84000, 92000]
const salesData = [2.3, 3.1, 2.8, 4.0, 4.2, 4.8]

function formatINR(val: number) {
  return new Intl.NumberFormat('en-IN').format(val)
}

export default function Dashboard({ setPage }: DashboardProps) {
  const maxTax = Math.max(...taxData)
  const maxSales = Math.max(...salesData)

  return (
    <div>
      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-icon purple">💰</div>
          <div className="stat-value">₹5.41L</div>
          <div className="stat-label">Total GST Collected</div>
          <div className="stat-change up">↑ 12.4% vs last month</div>
        </div>
        <div className="stat-card cyan">
          <div className="stat-icon cyan">🧾</div>
          <div className="stat-value">42</div>
          <div className="stat-label">Invoices This Month</div>
          <div className="stat-change up">↑ 8 new invoices</div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon green">📈</div>
          <div className="stat-value">₹28.4L</div>
          <div className="stat-label">Total Sales (FY)</div>
          <div className="stat-change up">↑ 22.1% growth</div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon orange">⚠️</div>
          <div className="stat-value">3</div>
          <div className="stat-label">Pending Payments</div>
          <div className="stat-change down">↓ ₹3.12L outstanding</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* GST Collection Bar Chart */}
        <div className="card">
          <div className="card-title">Monthly GST Collection</div>
          <div className="card-sub">Last 6 months (₹ in thousands)</div>
          <div className="bar-chart">
            {months.map((m, i) => (
              <div key={m} className="bar-col">
                <div
                  className="bar purple"
                  style={{ height: `${(taxData[i] / maxTax) * 100}%` }}
                  data-value={`₹${formatINR(taxData[i])}`}
                />
                <div className="bar-label">{m}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Bar Chart */}
        <div className="card">
          <div className="card-title">Monthly Sales</div>
          <div className="card-sub">Last 6 months (₹ in Lakhs)</div>
          <div className="bar-chart">
            {months.map((m, i) => (
              <div key={m} className="bar-col">
                <div
                  className="bar cyan"
                  style={{ height: `${(salesData[i] / maxSales) * 100}%` }}
                  data-value={`₹${salesData[i]}L`}
                />
                <div className="bar-label">{m}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GST Breakdown */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="card" style={{ borderTop: '3px solid var(--primary)' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>CGST</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>₹2,70,500</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>Central GST (50%)</div>
        </div>
        <div className="card" style={{ borderTop: '3px solid var(--accent)' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>SGST</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>₹2,70,500</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>State GST (50%)</div>
        </div>
        <div className="card" style={{ borderTop: '3px solid var(--accent2)' }}>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 6 }}>IGST</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>₹0</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>Interstate (intra only)</div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="card">
        <div className="section-header">
          <div>
            <div className="section-title">Recent Invoices</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Latest 5 transactions</div>
          </div>
          <button id="create-invoice-btn" className="btn btn-primary btn-sm" onClick={() => setPage('invoice')}>
            + New Invoice
          </button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Invoice No.</th>
                <th>Client</th>
                <th>Date</th>
                <th>Amount</th>
                <th>GST</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map(inv => (
                <tr key={inv.id}>
                  <td><span className="invoice-number-tag">{inv.id}</span></td>
                  <td>{inv.client}</td>
                  <td>{inv.date}</td>
                  <td>{inv.amount}</td>
                  <td>{inv.gst}</td>
                  <td>
                    <span className={`badge badge-${inv.status}`}>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid-2" style={{ marginTop: 24 }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card-title">Quick Actions</div>
          <button id="quick-invoice-btn" className="btn btn-primary" onClick={() => setPage('invoice')}>🧾 Generate New Invoice</button>
          <button id="quick-calc-btn" className="btn btn-outline" onClick={() => setPage('calculator')}>🧮 Open GST Calculator</button>
        </div>
        <div className="card">
          <div className="card-title">Filing Status</div>
          <div className="card-sub">FY 2024–25</div>
          {[
            { period: 'GSTR-1 (May 2025)', due: '11 Jun 2025', filed: true },
            { period: 'GSTR-3B (May 2025)', due: '20 Jun 2025', filed: true },
            { period: 'GSTR-1 (Jun 2025)', due: '11 Jul 2025', filed: false },
            { period: 'GSTR-3B (Jun 2025)', due: '20 Jul 2025', filed: false },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{f.period}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Due: {f.due}</div>
              </div>
              <span className={`badge ${f.filed ? 'badge-paid' : 'badge-pending'}`}>
                {f.filed ? '✓ Filed' : 'Upcoming'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
