interface AppHeaderInfoCard {
  label: string
  value: string | number
}

interface AppHeaderBackButton {
  label?: string
  onClick: () => void
}

interface AppHeaderProps {
  eyebrow: string
  title: string
  subtitle?: string
  statusBadge?: string
  infoCards?: AppHeaderInfoCard[]
  backButton?: AppHeaderBackButton
  variant?: 'default' | 'compact' | 'light'
}

export function AppHeader({
  eyebrow,
  title,
  subtitle,
  statusBadge,
  infoCards = [],
  backButton,
  variant = 'default',
}: AppHeaderProps) {
  return (
    <header className={`app-header ${variant}`}>
      {backButton ? (
        <button type="button" className="app-header-back" onClick={backButton.onClick}>
          {backButton.label ?? '‹ Volver'}
        </button>
      ) : null}
      <div className="app-header-topline">
        <span>{eyebrow}</span>
        {statusBadge ? <strong>{statusBadge}</strong> : null}
      </div>
      <div className="app-header-copy">
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {infoCards.length > 0 ? (
        <div className="app-header-info">
          {infoCards.slice(0, 3).map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      ) : null}
    </header>
  )
}
