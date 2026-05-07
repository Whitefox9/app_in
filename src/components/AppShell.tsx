import type { ReactNode } from 'react'
import type { TabKey } from '../types'
import { BottomNav } from './BottomNav'

interface AppShellProps {
  activeTab: TabKey
  children: ReactNode
  onTabChange: (tab: TabKey) => void
}

export function AppShell({ activeTab, children, onTabChange }: AppShellProps) {
  return (
    <div className="app-shell">
      <div className="phone-frame">
        <main className="screen-content">{children}</main>
        <BottomNav activeTab={activeTab} onTabChange={onTabChange} />
      </div>
    </div>
  )
}
