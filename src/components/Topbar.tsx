interface TopbarProps {
  title: string
  sub: string
}

export default function Topbar({ title, sub }: TopbarProps) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <header className="topbar">
      <div>
        <div className="topbar-title">{title}</div>
        <div className="topbar-sub">{sub}</div>
      </div>
      <div className="topbar-right">
        <div className="date-badge">📅 {today}</div>
      </div>
    </header>
  )
}
