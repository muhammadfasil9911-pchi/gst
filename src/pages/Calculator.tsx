import { useState } from 'react'

const GST_SLABS = [0, 5, 12, 18, 28]

type Mode = 'exclusive' | 'inclusive'

export default function Calculator() {
  const [amount, setAmount] = useState('')
  const [gstRate, setGstRate] = useState(18)
  const [mode, setMode] = useState<Mode>('exclusive')

  const val = parseFloat(amount) || 0

  let baseAmount = 0
  let gstAmount = 0
  let totalAmount = 0
  let cgst = 0
  let sgst = 0

  if (mode === 'exclusive') {
    baseAmount = val
    gstAmount = (val * gstRate) / 100
    totalAmount = baseAmount + gstAmount
  } else {
    totalAmount = val
    baseAmount = val / (1 + gstRate / 100)
    gstAmount = totalAmount - baseAmount
  }

  cgst = gstAmount / 2
  sgst = gstAmount / 2

  const fmt = (n: number) =>
    '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const slabInfo: Record<number, string> = {
    0: 'Essential goods (grains, milk, eggs)',
    5: 'Basic necessities (sugar, tea, medicines)',
    12: 'Processed food, computers, phones',
    18: 'Services, electronics, most goods',
    28: 'Luxury goods, vehicles, tobacco',
  }

  return (
    <div>
      <div className="grid-2">
        {/* Calculator */}
        <div>
          <div className="calc-card">
            <div className="card-title" style={{ fontSize: 18, marginBottom: 4 }}>GST Calculator</div>
            <div className="card-sub">Select slab, enter amount, get breakdown instantly</div>

            {/* GST Slab */}
            <div style={{ marginBottom: 20 }}>
              <div className="form-label" style={{ marginBottom: 10 }}>GST Rate Slab</div>
              <div className="gst-slab-grid">
                {GST_SLABS.map(slab => (
                  <button
                    key={slab}
                    id={`slab-${slab}`}
                    className={`slab-btn ${gstRate === slab ? 'selected' : ''}`}
                    onClick={() => setGstRate(slab)}
                  >
                    {slab}%
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 12, color: 'var(--accent)', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 6, padding: '8px 12px' }}>
                ℹ️ {slabInfo[gstRate]}
              </div>
            </div>

            {/* Mode toggle */}
            <div className="form-group">
              <label className="form-label">Calculation Mode</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  id="mode-exclusive"
                  className={`btn ${mode === 'exclusive' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => setMode('exclusive')}
                >
                  GST Exclusive
                </button>
                <button
                  id="mode-inclusive"
                  className={`btn ${mode === 'inclusive' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => setMode('inclusive')}
                >
                  GST Inclusive
                </button>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                {mode === 'exclusive'
                  ? 'Enter base price → GST is added on top'
                  : 'Enter final price → GST is extracted from it'}
              </div>
            </div>

            {/* Amount Input */}
            <div className="form-group">
              <label className="form-label">
                {mode === 'exclusive' ? 'Base Amount (₹) — before GST' : 'Total Amount (₹) — including GST'}
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 16 }}>₹</span>
                <input
                  id="calc-amount"
                  type="number"
                  className="form-input"
                  style={{ paddingLeft: 30 }}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  min={0}
                />
              </div>
            </div>

            {/* Result */}
            {val > 0 && (
              <div className="calc-result">
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>
                  Breakdown
                </div>
                <div className="calc-result-row">
                  <span className="calc-result-label">Base Amount</span>
                  <span className="calc-result-value">{fmt(baseAmount)}</span>
                </div>
                <div className="calc-result-row">
                  <span className="calc-result-label">CGST @ {gstRate / 2}%</span>
                  <span className="calc-result-value">{fmt(cgst)}</span>
                </div>
                <div className="calc-result-row">
                  <span className="calc-result-label">SGST @ {gstRate / 2}%</span>
                  <span className="calc-result-value">{fmt(sgst)}</span>
                </div>
                <div className="calc-result-row">
                  <span className="calc-result-label">Total GST ({gstRate}%)</span>
                  <span className="calc-result-value">{fmt(gstAmount)}</span>
                </div>
                <div className="calc-result-row">
                  <span className="calc-result-label">Grand Total</span>
                  <span className="calc-result-value">{fmt(totalAmount)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* GST Reference Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <div className="card-title">GST Slab Reference</div>
            <div className="card-sub">Common goods & services by rate</div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Rate</th>
                    <th>Category</th>
                    <th>Examples</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rate: '0%', cat: 'Exempt / Nil', ex: 'Fresh produce, milk, eggs, grains' },
                    { rate: '5%', cat: 'Basic Necessities', ex: 'Sugar, tea, coffee, medicines, edible oil' },
                    { rate: '12%', cat: 'Standard Goods', ex: 'Computers, phones, processed food, books' },
                    { rate: '18%', cat: 'Standard Rate', ex: 'IT services, restaurants, most electronics' },
                    { rate: '28%', cat: 'Luxury / Sin', ex: 'Cars, AC, pan masala, tobacco, high-end goods' },
                  ].map(r => (
                    <tr key={r.rate}>
                      <td><span style={{ fontWeight: 700, color: 'var(--primary-light)', fontFamily: 'var(--font-display)', fontSize: 15 }}>{r.rate}</span></td>
                      <td>{r.cat}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.ex}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick reference amounts */}
          {val > 0 && (
            <div className="card">
              <div className="card-title">All Slab Comparison</div>
              <div className="card-sub">For amount {fmt(mode === 'exclusive' ? val : baseAmount)}</div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>GST %</th>
                      <th>GST Amount</th>
                      <th>Total Payable</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GST_SLABS.map(slab => {
                      const base = mode === 'exclusive' ? val : val / (1 + slab / 100)
                      const gst = mode === 'exclusive' ? val * slab / 100 : val - val / (1 + slab / 100)
                      const total = base + gst
                      return (
                        <tr key={slab} style={slab === gstRate ? { background: 'rgba(108,99,255,0.08)' } : {}}>
                          <td>
                            <span style={{ fontWeight: 700, color: slab === gstRate ? 'var(--primary-light)' : 'var(--text-primary)' }}>
                              {slab}% {slab === gstRate ? '←' : ''}
                            </span>
                          </td>
                          <td>{fmt(gst)}</td>
                          <td style={{ fontWeight: slab === gstRate ? 700 : 400, color: slab === gstRate ? 'var(--primary-light)' : 'var(--text-secondary)' }}>
                            {fmt(total)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
