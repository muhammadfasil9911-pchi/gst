import { useState, useRef } from 'react'

interface LineItem {
  id: number
  description: string
  hsn: string
  qty: number
  rate: number
  gstRate: number
}

let nextId = 1

const defaultItem = (): LineItem => ({
  id: nextId++,
  description: '',
  hsn: '',
  qty: 1,
  rate: 0,
  gstRate: 18,
})

export default function InvoiceGenerator() {
  const [sellerName, setSellerName] = useState('Your Company Name')
  const [sellerGST, setSellerGST] = useState('27AABCU9603R1ZX')
  const [sellerAddr, setSellerAddr] = useState('123, MG Road, Mumbai, Maharashtra - 400001')
  const [buyerName, setBuyerName] = useState('')
  const [buyerGST, setBuyerGST] = useState('')
  const [buyerAddr, setBuyerAddr] = useState('')
  const [invoiceNo, setInvoiceNo] = useState('INV-0043')
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0])
  const [items, setItems] = useState<LineItem[]>([defaultItem()])
  const [showPreview, setShowPreview] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const addItem = () => setItems(prev => [...prev, defaultItem()])
  const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id))
  const updateItem = (id: number, field: keyof LineItem, value: string | number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0)
  const totalGST = items.reduce((s, i) => s + (i.qty * i.rate * i.gstRate) / 100, 0)
  const grandTotal = subtotal + totalGST

  const fmt = (n: number) => '₹' + new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(n)

  const handlePrint = () => {
    if (!printRef.current) return
    const content = printRef.current.innerHTML
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`
      <html><head><title>${invoiceNo}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Outfit:wght@700;800&display=swap" rel="stylesheet"/>
      <style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',sans-serif;padding:32px;background:white;color:#1a1a1a}
        .inv-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #e2e8f0}
        .inv-company-name{font-family:'Outfit',sans-serif;font-size:24px;font-weight:800;color:#4F46E5}
        .inv-gstin{font-size:12px;color:#64748b;margin-top:4px}
        .inv-title{font-family:'Outfit',sans-serif;font-size:32px;font-weight:800;color:#4F46E5;text-align:right}
        .inv-number{font-size:13px;color:#64748b;text-align:right;margin-top:4px}
        .inv-parties{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:28px}
        .inv-party-label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#94a3b8;margin-bottom:6px}
        .inv-party-name{font-weight:700;font-size:15px;color:#1e293b;margin-bottom:4px}
        .inv-party-detail{font-size:12px;color:#64748b;line-height:1.6}
        .inv-table{width:100%;border-collapse:collapse;margin-bottom:24px}
        .inv-table th{background:#4F46E5;color:white;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:10px 14px;text-align:left}
        .inv-table td{padding:10px 14px;font-size:13px;color:#334155;border-bottom:1px solid #f1f5f9}
        .inv-table tr:nth-child(even) td{background:#f8fafc}
        .inv-totals{display:flex;flex-direction:column;align-items:flex-end;gap:6px;margin-bottom:24px}
        .inv-total-row{display:flex;gap:48px;font-size:13px;color:#64748b}
        .inv-total-row span:last-child{min-width:100px;text-align:right}
        .inv-total-row.grand{font-size:16px;font-weight:800;color:#4F46E5;border-top:2px solid #e2e8f0;padding-top:10px;margin-top:4px}
        .inv-footer{padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center}
      </style></head><body>${content}</body></html>
    `)
    w.document.close()
    w.focus()
    setTimeout(() => w.print(), 300)
  }

  return (
    <div>
      <div className="grid-2">
        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Seller */}
          <div className="card">
            <div className="card-title">Your (Seller) Details</div>
            <div className="divider" />
            <div className="form-group">
              <label className="form-label">Company / Seller Name</label>
              <input id="seller-name" className="form-input" value={sellerName} onChange={e => setSellerName(e.target.value)} placeholder="Your Company Name" />
            </div>
            <div className="form-group">
              <label className="form-label">GSTIN</label>
              <input id="seller-gstin" className="form-input" value={sellerGST} onChange={e => setSellerGST(e.target.value)} placeholder="27AABCU9603R1ZX" />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <input id="seller-addr" className="form-input" value={sellerAddr} onChange={e => setSellerAddr(e.target.value)} placeholder="Full Address" />
            </div>
          </div>

          {/* Buyer */}
          <div className="card">
            <div className="card-title">Buyer Details</div>
            <div className="divider" />
            <div className="form-group">
              <label className="form-label">Buyer Name</label>
              <input id="buyer-name" className="form-input" value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Client / Buyer Name" />
            </div>
            <div className="form-group">
              <label className="form-label">Buyer GSTIN (optional)</label>
              <input id="buyer-gstin" className="form-input" value={buyerGST} onChange={e => setBuyerGST(e.target.value)} placeholder="27XXXXX1234X1ZX" />
            </div>
            <div className="form-group">
              <label className="form-label">Buyer Address</label>
              <input id="buyer-addr" className="form-input" value={buyerAddr} onChange={e => setBuyerAddr(e.target.value)} placeholder="Buyer Full Address" />
            </div>
          </div>

          {/* Invoice Info */}
          <div className="card">
            <div className="card-title">Invoice Details</div>
            <div className="divider" />
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Invoice Number</label>
                <input id="inv-number" className="form-input" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Invoice Date</label>
                <input id="inv-date" type="date" className="form-input" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="card">
            <div className="section-header">
              <div className="card-title">Line Items</div>
              <button id="add-item-btn" className="btn btn-outline btn-sm" onClick={addItem}>+ Add Item</button>
            </div>
            {items.map((item, idx) => (
              <div key={item.id} style={{ background: 'var(--bg-base)', borderRadius: 10, padding: '14px', marginBottom: 10, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>ITEM {idx + 1}</span>
                  {items.length > 1 && (
                    <button id={`remove-item-${item.id}`} className="btn btn-danger" style={{ padding: '2px 8px', fontSize: 11 }} onClick={() => removeItem(item.id)}>✕</button>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input className="form-input" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="Product / Service name" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
                  <div className="form-group">
                    <label className="form-label">HSN/SAC</label>
                    <input className="form-input" value={item.hsn} onChange={e => updateItem(item.id, 'hsn', e.target.value)} placeholder="1234" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Qty</label>
                    <input type="number" className="form-input" value={item.qty} onChange={e => updateItem(item.id, 'qty', Number(e.target.value))} min={1} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rate (₹)</label>
                    <input type="number" className="form-input" value={item.rate} onChange={e => updateItem(item.id, 'rate', Number(e.target.value))} min={0} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GST %</label>
                    <select className="form-select" value={item.gstRate} onChange={e => updateItem(item.id, 'gstRate', Number(e.target.value))}>
                      {[0, 5, 12, 18, 28].map(r => <option key={r} value={r}>{r}%</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 13, color: 'var(--primary-light)', fontWeight: 600, marginTop: 4 }}>
                  Taxable: {fmt(item.qty * item.rate)} · GST: {fmt(item.qty * item.rate * item.gstRate / 100)} · Total: {fmt(item.qty * item.rate * (1 + item.gstRate / 100))}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', gap: 32 }}><span>Subtotal:</span><span>{fmt(subtotal)}</span></div>
              <div style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', gap: 32 }}><span>Total GST:</span><span>{fmt(totalGST)}</span></div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary-light)', display: 'flex', gap: 32, borderTop: '1px solid var(--border)', paddingTop: 10, fontFamily: 'var(--font-display)' }}>
                <span>Grand Total:</span><span>{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button id="preview-btn" className="btn btn-primary" onClick={() => setShowPreview(true)}>👁 Preview Invoice</button>
            <button id="print-btn" className="btn btn-success" onClick={() => { setShowPreview(true); setTimeout(handlePrint, 200) }}>🖨 Print / Download PDF</button>
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <div style={{ position: 'sticky', top: 90 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Live Preview</div>
            <div ref={printRef} className="invoice-preview">
              <div className="inv-header">
                <div>
                  <div className="inv-company-name">{sellerName || 'Company Name'}</div>
                  <div className="inv-gstin">GSTIN: {sellerGST || '—'}</div>
                  <div className="inv-gstin" style={{ marginTop: 2 }}>{sellerAddr || '—'}</div>
                </div>
                <div>
                  <div className="inv-title">INVOICE</div>
                  <div className="inv-number">#{invoiceNo}</div>
                  <div className="inv-number" style={{ marginTop: 4 }}>Date: {invoiceDate}</div>
                </div>
              </div>

              <div className="inv-parties">
                <div>
                  <div className="inv-party-label">Bill To</div>
                  <div className="inv-party-name">{buyerName || 'Buyer Name'}</div>
                  <div className="inv-party-detail">
                    {buyerGST && <div>GSTIN: {buyerGST}</div>}
                    <div>{buyerAddr || 'Buyer Address'}</div>
                  </div>
                </div>
              </div>

              <table className="inv-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Description</th>
                    <th>HSN</th>
                    <th>Qty</th>
                    <th>Rate</th>
                    <th>GST%</th>
                    <th>GST Amt</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>{item.description || '—'}</td>
                      <td>{item.hsn || '—'}</td>
                      <td>{item.qty}</td>
                      <td>₹{item.rate.toLocaleString('en-IN')}</td>
                      <td>{item.gstRate}%</td>
                      <td>₹{(item.qty * item.rate * item.gstRate / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td>₹{(item.qty * item.rate * (1 + item.gstRate / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="inv-totals">
                <div className="inv-total-row"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                <div className="inv-total-row"><span>CGST</span><span>{fmt(totalGST / 2)}</span></div>
                <div className="inv-total-row"><span>SGST</span><span>{fmt(totalGST / 2)}</span></div>
                <div className="inv-total-row grand"><span>Grand Total</span><span>{fmt(grandTotal)}</span></div>
              </div>

              <div className="inv-footer">
                Thank you for your business! · GSTIN: {sellerGST} · Generated by GST Manager
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
