import { useEffect, useMemo, useRef, useState } from 'react'
import { AppShell } from './components/AppShell'
import {
  ContextualGuide,
  ModuleGuidePrompt,
} from './components/ContextualGuide'
import { contextualGuides, type ContextualGuideKey } from './components/contextualGuideData'
import { GuidedTutorial } from './components/GuidedTutorial'
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

interface AppHistoryState {
  facilInstructores: true
  activeTab: TabKey
  activeView: AppView
  selectedGroupId: string
  attendanceStartGroupId: string | null
  attendanceFromGroupDetail: boolean
}

function App() {
  useRipple()

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isTutorialOpen, setIsTutorialOpen] = useState(false)
  const [contextualGuidesEnabled, setContextualGuidesEnabled] = useState(false)
  const [promptGuideKey, setPromptGuideKey] = useState<ContextualGuideKey | null>(null)
  const [activeGuideKey, setActiveGuideKey] = useState<ContextualGuideKey | null>(null)
  const [handledGuideKeys, setHandledGuideKeys] = useState<Set<ContextualGuideKey>>(new Set())
  const [activeTab, setActiveTab] = useState<TabKey>('home')
  const [activeView, setActiveView] = useState<AppView>('home')
  const [selectedGroupId, setSelectedGroupId] = useState(groups[0].id)
  const [attendanceStartGroupId, setAttendanceStartGroupId] = useState<string | null>(null)
  const [attendanceFromGroupDetail, setAttendanceFromGroupDetail] = useState(false)
  const [attendanceMenuVersion, setAttendanceMenuVersion] = useState(0)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords)
  const [novelties, setNovelties] = useState<FichaNovelty[]>([])
  const restoringHistory = useRef(false)

  const selectedGroup = groups.find((group) => group.id === selectedGroupId) ?? groups[0]
  const selectedGroupLearners = useMemo(
    () => learners.filter((learner) => selectedGroup.learnerIds.includes(learner.id)),
    [selectedGroup],
  )
  const currentGuideKey = useMemo<ContextualGuideKey | null>(() => {
    if (activeView === 'fichas') return 'fichas'
    if (activeView === 'groupDetail') return 'groupDetail'
    if (activeView === 'groupReports') return 'reports'
    if (activeView === 'attendance') return attendanceStartGroupId ? 'attendanceRegister' : 'attendance'
    return null
  }, [activeView, attendanceStartGroupId])

  useEffect(() => {
    if (!contextualGuidesEnabled || isTutorialOpen || activeGuideKey || promptGuideKey || !currentGuideKey) return
    if (handledGuideKeys.has(currentGuideKey)) return

    const timeout = window.setTimeout(() => setPromptGuideKey(currentGuideKey), 260)
    return () => window.clearTimeout(timeout)
  }, [
    activeGuideKey,
    contextualGuidesEnabled,
    currentGuideKey,
    handledGuideKeys,
    isTutorialOpen,
    promptGuideKey,
  ])

  useEffect(() => {
    function handlePopState(event: PopStateEvent) {
      const state = event.state as AppHistoryState | null
      if (!state?.facilInstructores) return

      restoringHistory.current = true
      setActiveTab(state.activeTab)
      setActiveView(state.activeView)
      setSelectedGroupId(state.selectedGroupId)
      setAttendanceStartGroupId(state.attendanceStartGroupId)
      setAttendanceFromGroupDetail(state.attendanceFromGroupDetail)
      if (state.activeView === 'attendance') {
        setAttendanceMenuVersion((current) => current + 1)
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (!isLoggedIn) return

    const state: AppHistoryState = {
      facilInstructores: true,
      activeTab,
      activeView,
      selectedGroupId,
      attendanceStartGroupId,
      attendanceFromGroupDetail,
    }

    if (restoringHistory.current) {
      restoringHistory.current = false
      return
    }

    window.history.pushState(state, '')
  }, [isLoggedIn, activeTab, activeView, selectedGroupId, attendanceStartGroupId, attendanceFromGroupDetail])

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

  function handleLogin(showTutorial: boolean) {
    setActiveTab('home')
    setActiveView('home')
    setContextualGuidesEnabled(showTutorial)
    setPromptGuideKey(null)
    setActiveGuideKey(null)
    setHandledGuideKeys(new Set())
    setIsLoggedIn(true)
    setIsTutorialOpen(showTutorial)
  }

  function finishTutorial() {
    setIsTutorialOpen(false)
    navigateToTab('home')
  }

  function markGuideHandled(guideKey: ContextualGuideKey) {
    setHandledGuideKeys((current) => new Set(current).add(guideKey))
  }

  function skipContextualGuide(guideKey: ContextualGuideKey) {
    markGuideHandled(guideKey)
    setPromptGuideKey(null)
  }

  function startContextualGuide(guideKey: ContextualGuideKey) {
    setPromptGuideKey(null)
    setActiveGuideKey(guideKey)
  }

  function finishContextualGuide(guideKey: ContextualGuideKey) {
    markGuideHandled(guideKey)
    setActiveGuideKey(null)
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />
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
          onOpenGroup={openGroup}
          onTakeAttendance={openAttendance}
        />
      ) : null}

      {activeView === 'fichas' ? (
        <GroupsScreen
          groups={groups}
          sessions={sessions}
          records={attendanceRecords}
          onOpenGroup={openGroup}
        />
      ) : null}

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
          onOpenHistory={openGroupHistory}
          onOpenReports={openGroupReports}
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
      {isTutorialOpen ? (
        <GuidedTutorial onFinish={finishTutorial} />
      ) : null}
      {promptGuideKey ? (
        <ModuleGuidePrompt
          moduleName={contextualGuides[promptGuideKey].title.replace('Guía rápida de ', '')}
          onAccept={() => startContextualGuide(promptGuideKey)}
          onSkip={() => skipContextualGuide(promptGuideKey)}
        />
      ) : null}
      {activeGuideKey ? (
        <ContextualGuide
          guide={contextualGuides[activeGuideKey]}
          onFinish={() => finishContextualGuide(activeGuideKey)}
        />
      ) : null}
    </AppShell>
  )
}

export default App
