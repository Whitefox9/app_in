import type { TabKey } from '../types'

interface BottomNavProps {
  activeTab: TabKey
  onTabChange: (tab: TabKey) => void
}

const items: Array<{ key: TabKey; label: string; icon: string }> = [
  { key: 'home', label: 'Inicio', icon: '⌂' },
  { key: 'fichas', label: 'Fichas', icon: '▦' },
  { key: 'attendance', label: 'Asistencia', icon: '✓' },
  { key: 'agenda', label: 'Agenda', icon: '◷' },
  { key: 'profile', label: 'Perfil', icon: '◉' },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Navegación principal">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={activeTab === item.key ? 'nav-item active' : 'nav-item'}
          onClick={() => onTabChange(item.key)}
          aria-label={item.label}
        >
          <span className="nav-icon" aria-hidden="true">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
