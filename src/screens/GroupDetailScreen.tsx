import { useMemo, useState } from 'react'
import { AppHeader } from '../components/AppHeader'
import { FichaManagementActions } from '../components/FichaManagementActions'
import { FichaNoveltyForm } from '../components/FichaNoveltyForm'
import { AttendanceStatusBadge } from '../components/AttendanceStatusBadge'
import { ApprenticeDetailScreen } from './ApprenticeDetailScreen'
import { attendanceLabels } from '../utils/attendance'
import type {
  AttendanceRecord,
  AttendanceStatus,
  FichaNovelty,
  Instructor,
  Learner,
  TrainingGroup,
} from '../types'

interface GroupDetailScreenProps {
  group: TrainingGroup
  instructor: Instructor
  learners: Learner[]
  records: AttendanceRecord[]
  novelties: FichaNovelty[]
  onBack: () => void
  onAttendance: (groupId: string) => void
  onAttendanceHistory: (groupId: string) => void
  onReports: (groupId: string) => void
  onSaveNovelty: (novelty: FichaNovelty) => void
}

export function GroupDetailScreen({
  group,
  instructor,
  learners,
  records,
  novelties,
  onBack,
  onAttendance,
  onAttendanceHistory,
  onReports,
  onSaveNovelty,
}: GroupDetailScreenProps) {
  const [query, setQuery] = useState('')
  const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(null)
  const [isNoveltyOpen, setIsNoveltyOpen] = useState(false)
  const [noveltyMessage, setNoveltyMessage] = useState('')

  const filteredLearners = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return learners

    return learners.filter(
      (learner) =>
        learner.name.toLowerCase().includes(normalizedQuery) ||
        learner.documentNumber.includes(normalizedQuery),
    )
  }, [learners, query])

  const selectedLearner = learners.find((learner) => learner.id === selectedLearnerId)

  function getRecentLearnerStatuses(learnerId: string): AttendanceStatus[] {
    return records
      .filter((record) => record.groupId === group.id && record.statuses[learnerId])
      .sort((left, right) => right.date.localeCompare(left.date))
      .slice(0, 5)
      .map((record) => record.statuses[learnerId])
  }

  if (selectedLearner) {
    return (
      <ApprenticeDetailScreen
        learner={selectedLearner}
        group={group}
        records={records}
        onBack={() => setSelectedLearnerId(null)}
      />
    )
  }

  return (
    <div className="screen-stack">
      <AppHeader
        eyebrow={`FICHA ${group.number}`}
        title={group.program}
        subtitle={`${group.shift} · ${group.location}`}
        statusBadge={group.status}
        backButton={{ onClick: onBack }}
        infoCards={[
          { label: 'Horario', value: group.schedule },
          { label: 'Instructor', value: instructor.name },
          { label: group.locationType, value: group.environment },
        ]}
      />

      <FichaManagementActions
        onRegisterAttendance={() => onAttendance(group.id)}
        onAttendanceHistory={() => onAttendanceHistory(group.id)}
        onReports={() => onReports(group.id)}
        onNovelty={() => {
          setIsNoveltyOpen(true)
          setNoveltyMessage('')
        }}
      />

      {isNoveltyOpen ? (
        <FichaNoveltyForm
          group={group}
          onCancel={() => setIsNoveltyOpen(false)}
          onSave={(novelty) => {
            onSaveNovelty(novelty)
            setIsNoveltyOpen(false)
            setNoveltyMessage('Novedad guardada localmente para esta ficha.')
          }}
        />
      ) : null}

      {noveltyMessage ? <div className="success-message">{noveltyMessage}</div> : null}

      {novelties.length > 0 ? (
        <section className="novelty-list-panel">
          <div className="list-header">
            <h2>Novedades recientes</h2>
            <span>{novelties.length}</span>
          </div>
          {novelties.slice(0, 3).map((novelty) => (
            <article key={novelty.id} className="history-row">
              <strong>{novelty.type}</strong>
              <span>{novelty.date} · {novelty.observation}</span>
            </article>
          ))}
        </section>
      ) : null}

      <section>
        <div className="list-header">
          <h2>Aprendices</h2>
          <span>{filteredLearners.length} de {learners.length}</span>
        </div>
        <div className="compact-attendance-legend" aria-label="Convenciones de asistencia">
          {(['A', 'CE', 'SE', 'T'] as const).map((status) => (
            <span key={status}>
              <AttendanceStatusBadge status={status} size="mini" />
              {attendanceLabels[status]}
            </span>
          ))}
        </div>
        <label className="search-field">
          <span>Buscar por nombre o documento</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ej. Laura o 1002"
          />
        </label>
        <div className="learners-list simple">
          {filteredLearners.map((learner) => {
            const recentStatuses = getRecentLearnerStatuses(learner.id)

            return (
              <button
                key={learner.id}
                type="button"
                className="learner-summary learner-action"
                onClick={() => setSelectedLearnerId(learner.id)}
              >
                <span>
                  <strong>{learner.name}</strong>
                  <small>{learner.documentType} {learner.documentNumber}</small>
                  <span className="learner-attendance-preview" aria-label="Ultimas 5 asistencias">
                    {recentStatuses.length > 0 ? (
                      recentStatuses.map((status, index) => (
                        <AttendanceStatusBadge key={`${learner.id}-${status}-${index}`} status={status} size="mini" />
                      ))
                    ) : (
                      <small>Sin registros recientes</small>
                    )}
                  </span>
                </span>
                <small>Ver detalle ›</small>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
