import { useMemo, useState } from 'react'
import { AppShell } from './components/AppShell'
import {
  attendanceRecords as initialAttendanceRecords,
  groups,
  instructor,
  learners,
  sessions,
} from './data/mockData'
import { AgendaScreen } from './screens/AgendaScreen'
import { AttendanceHistoryScreen } from './screens/AttendanceHistoryScreen'
import { AttendanceScreen } from './screens/AttendanceScreen'
import { DashboardScreen } from './screens/DashboardScreen'
import { FichaReportsScreen } from './screens/FichaReportsScreen'
import { GroupDetailScreen } from './screens/GroupDetailScreen'
import { GroupsScreen } from './screens/GroupsScreen'
import { LoginScreen } from './screens/LoginScreen'
import { ProfileScreen } from './screens/ProfileScreen'
import { ReportsScreen } from './screens/ReportsScreen'
import { useRipple } from './hooks/useRipple'
import type { AttendanceRecord, FichaNovelty, TabKey } from './types'

type AppView = TabKey | 'groupDetail' | 'groupHistory' | 'groupReports' | 'reports'

function App() {
  useRipple()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<TabKey>('home')
  const [activeView, setActiveView] = useState<AppView>('home')
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0].id)
  const [attendanceStartGroupId, setAttendanceStartGroupId] = useState<string | null>(null)
  const [attendanceFromGroupDetail, setAttendanceFromGroupDetail] = useState(false)
  const [attendanceMenuVersion, setAttendanceMenuVersion] = useState(0)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords)
  const [novelties, setNovelties] = useState<FichaNovelty[]>([])

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? groups[0]
  const selectedGroupLearners = useMemo(
    () => learners.filter((learner) => selectedGroup.learnerIds.includes(learner.id)),
    [selectedGroup],
  )

  function navigateToTab(tab: TabKey) {
    setActiveTab(tab)
    setActiveView(tab)
    if (tab === 'attendance') {
      setAttendanceStartGroupId(null)
      setAttendanceFromGroupDetail(false)
      setAttendanceMenuVersion((current) => current + 1)
    }
  }

  function openGroup(groupId: string) {
    setSelectedGroupId(groupId)
    setActiveTab('fichas')
    setActiveView('groupDetail')
  }

  function openAttendance(groupId = selectedGroupId) {
    setSelectedGroupId(groupId)
    setAttendanceStartGroupId(groupId)
    setAttendanceFromGroupDetail(true)
    setActiveTab('attendance')
    setActiveView('attendance')
  }

  function openGroupHistory(groupId = selectedGroupId) {
    setSelectedGroupId(groupId)
    setActiveTab('fichas')
    setActiveView('groupHistory')
  }

  function openGroupReports(groupId = selectedGroupId) {
    setSelectedGroupId(groupId)
    setActiveTab('fichas')
    setActiveView('groupReports')
  }

  function backToSelectedGroup(groupId = selectedGroupId) {
    setSelectedGroupId(groupId)
    setActiveTab('fichas')
    setActiveView('groupDetail')
  }

  function saveAttendance(record: AttendanceRecord) {
    setAttendanceRecords((current) => {
      const exists = current.some(
        (item) => item.groupId === record.groupId && item.date === record.date,
      )

      if (!exists) return [...current, record]

      return current.map((item) =>
        item.groupId === record.groupId && item.date === record.date ? record : item,
      )
    })
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />
  }

  return (
    <AppShell activeTab={activeTab} onTabChange={navigateToTab}>
      {activeView === 'home' ? (
        <DashboardScreen
          instructor={instructor}
          groups={groups}
          sessions={sessions}
          pendingAttendance={1}
          onNavigate={navigateToTab}
          onReports={() => setActiveView('reports')}
        />
      ) : null}

      {activeView === 'fichas' ? <GroupsScreen groups={groups} onOpenGroup={openGroup} /> : null}

      {activeView === 'groupDetail' ? (
        <GroupDetailScreen
          key={selectedGroup.id}
          group={selectedGroup}
          instructor={instructor}
          learners={selectedGroupLearners}
          records={attendanceRecords}
          novelties={novelties.filter((novelty) => novelty.groupId === selectedGroup.id)}
          onBack={() => navigateToTab('fichas')}
          onAttendance={openAttendance}
          onAttendanceHistory={openGroupHistory}
          onReports={openGroupReports}
          onSaveNovelty={(novelty) => setNovelties((current) => [novelty, ...current])}
        />
      ) : null}

      {activeView === 'groupHistory' ? (
        <AttendanceHistoryScreen
          group={selectedGroup}
          learners={selectedGroupLearners}
          records={attendanceRecords}
          onBack={() => backToSelectedGroup(selectedGroup.id)}
        />
      ) : null}

      {activeView === 'groupReports' ? (
        <FichaReportsScreen
          group={selectedGroup}
          instructor={instructor}
          learners={selectedGroupLearners}
          records={attendanceRecords}
          onBack={() => backToSelectedGroup(selectedGroup.id)}
        />
      ) : null}

      {activeView === 'attendance' ? (
        <AttendanceScreen
          key={`${attendanceStartGroupId ?? 'selector'}-${attendanceMenuVersion}-${attendanceFromGroupDetail ? 'ficha' : 'global'}`}
          groups={groups}
          learners={learners}
          sessions={sessions}
          records={attendanceRecords}
          selectedGroupId={attendanceStartGroupId}
          openedFromGroupDetail={attendanceFromGroupDetail}
          onSave={saveAttendance}
          onBackToGroup={backToSelectedGroup}
        />
      ) : null}

      {activeView === 'agenda' ? <AgendaScreen sessions={sessions} groups={groups} /> : null}

      {activeView === 'profile' ? (
        <ProfileScreen
          instructor={instructor}
          groups={groups}
          onReports={() => setActiveView('reports')}
        />
      ) : null}

      {activeView === 'reports' ? (
        <ReportsScreen records={attendanceRecords} groups={groups} onBack={() => navigateToTab('home')} />
      ) : null}
    </AppShell>
  )
}

export default App
