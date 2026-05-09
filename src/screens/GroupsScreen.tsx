import { AppHeader } from '../components/AppHeader'
import { GroupCard } from '../components/GroupCard'
import type { AttendanceRecord, ClassSession, TrainingGroup } from '../types'

interface GroupsScreenProps {
  groups: TrainingGroup[]
  sessions: ClassSession[]
  records: AttendanceRecord[]
  onOpenGroup: (groupId: string) => void
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

export function GroupsScreen({ groups, sessions, records, onOpenGroup }: GroupsScreenProps) {
  const today = new Date().toISOString().slice(0, 10)
  const activeGroups = groups.filter((group) => group.status === 'Activa').length
  const totalLearners = groups.reduce((total, group) => total + group.learnerIds.length, 0)
  const nextClassTime = '6:00 a.m.'

  function getOperationalStatus(groupId: string) {
    const hasTodaySession = sessions.some((session) => session.groupId === groupId && session.date === today)
    const hasTodayAttendance = records.some((record) => record.groupId === groupId && record.date === today)
    const lastRecord = records
      .filter((record) => record.groupId === groupId)
      .sort((left, right) => right.date.localeCompare(left.date))[0]

    if (hasTodayAttendance) {
      return {
        label: 'Asistencia registrada',
        detail: `Último llamado: ${formatShortDate(today)}`,
        tone: 'registered' as const,
      }
    }

    if (!hasTodaySession) {
      return {
        label: 'Sin clase programada hoy',
        detail: lastRecord ? `Último llamado: ${formatShortDate(lastRecord.date)}` : 'Sin llamados registrados',
        tone: 'neutral' as const,
      }
    }

    return {
      label: 'Asistencia pendiente',
      detail: 'Requiere llamado de hoy',
      tone: 'pending' as const,
    }
  }

  return (
    <div className="screen-stack">
      <AppHeader
        eyebrow="INSTRUCTOR"
        title="Mis fichas"
        subtitle="Consulta y gestiona tus grupos asignados."
        infoCards={[
          { label: 'Fichas activas', value: activeGroups },
          { label: 'Aprendices', value: totalLearners },
          { label: 'Próxima clase', value: nextClassTime },
        ]}
      />
      <div className="group-list">
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            operationalStatus={getOperationalStatus(group.id)}
            onOpen={onOpenGroup}
          />
        ))}
      </div>
    </div>
  )
}
