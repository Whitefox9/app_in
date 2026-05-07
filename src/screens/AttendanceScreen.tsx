import { useMemo, useState } from 'react'
import { LearnerRow } from '../components/LearnerRow'
import { MetricCard } from '../components/MetricCard'
import { SectionHeader } from '../components/SectionHeader'
import { AttendanceStatusBadge } from '../components/AttendanceStatusBadge'
import type {
  AttendanceRecord,
  AttendanceStatus,
  ClassSession,
  Learner,
  TrainingGroup,
} from '../types'
import {
  attendanceLabels,
  buildDefaultStatuses,
  summarizeAttendance,
} from '../utils/attendance'

interface AttendanceScreenProps {
  groups: TrainingGroup[]
  learners: Learner[]
  sessions: ClassSession[]
  records: AttendanceRecord[]
  selectedGroupId?: string | null
  openedFromGroupDetail?: boolean
  onSave: (record: AttendanceRecord) => void
  onBackToGroup?: (groupId: string) => void
}

export function AttendanceScreen({
  groups,
  learners,
  sessions,
  records,
  selectedGroupId,
  openedFromGroupDetail = false,
  onSave,
  onBackToGroup,
}: AttendanceScreenProps) {
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [selectedCallGroupId, setSelectedCallGroupId] = useState<string | null>(selectedGroupId ?? null)
  const [candidateGroupId, setCandidateGroupId] = useState(groups[0]?.id ?? '')
  const [draftKeys, setDraftKeys] = useState<Set<string>>(new Set())
  const [savedMessage, setSavedMessage] = useState('')

  const activeGroup = groups.find((group) => group.id === selectedCallGroupId) ?? groups[0]
  const groupLearners = learners.filter((learner) => activeGroup.learnerIds.includes(learner.id))
  const existingRecord = records.find(
    (record) => record.groupId === activeGroup.id && record.date === date,
  )

  const [statuses, setStatuses] = useState<Record<string, AttendanceStatus>>(() => {
    return existingRecord?.statuses ?? buildDefaultStatuses(activeGroup.learnerIds)
  })

  const summary = useMemo(() => summarizeAttendance(statuses), [statuses])
  const todaySessionsCount = sessions.filter((session) => session.date === today).length

  function startAttendance(nextGroupId: string) {
    const nextGroup = groups.find((group) => group.id === nextGroupId) ?? groups[0]
    const nextRecord = records.find((record) => record.groupId === nextGroup.id && record.date === date)
    setCandidateGroupId(nextGroup.id)
    setSelectedCallGroupId(nextGroup.id)
    setStatuses(nextRecord?.statuses ?? buildDefaultStatuses(nextGroup.learnerIds))
    setSavedMessage('')
  }

  function handleDateChange(nextDate: string) {
    const nextRecord = records.find((record) => record.groupId === activeGroup.id && record.date === nextDate)
    setDate(nextDate)
    setStatuses(nextRecord?.statuses ?? buildDefaultStatuses(activeGroup.learnerIds))
    setSavedMessage('')
  }

  function handleStatusChange(learnerId: string, status: AttendanceStatus) {
    setStatuses((current) => ({ ...current, [learnerId]: status }))
    setDraftKeys((current) => new Set(current).add(`${activeGroup.id}-${date}`))
    setSavedMessage('')
  }

  function handleSave() {
    onSave({
      id: `asi-${activeGroup.id}-${date}`,
      groupId: activeGroup.id,
      date,
      statuses,
      savedAt: new Date().toISOString(),
    })
    setDraftKeys((current) => {
      const next = new Set(current)
      next.delete(`${activeGroup.id}-${date}`)
      return next
    })
    setSavedMessage('Asistencia guardada correctamente para demostración.')
  }

  function getGroupAttendanceStatus(groupId: string) {
    const isRegistered = records.some((record) => record.groupId === groupId && record.date === date)
    if (isRegistered) return 'Registrada'
    if (draftKeys.has(`${groupId}-${date}`)) return 'En progreso'
    return 'Pendiente'
  }

  if (!selectedCallGroupId) {
    return (
      <div className="screen-stack">
        <SectionHeader
          eyebrow="Control diario"
          title="Registrar asistencia"
          description="Selecciona la ficha para realizar el llamado de asistencia."
        />

        <section className="attendance-summary-card">
          <strong>Hoy tienes {todaySessionsCount || groups.length} fichas programadas</strong>
          <span>Selecciona una para iniciar el llamado</span>
        </section>

        <section className="attendance-selector-list">
          {groups.map((group) => {
            const status = getGroupAttendanceStatus(group.id)
            const isSelected = candidateGroupId === group.id

            return (
              <article
                key={group.id}
                className={isSelected ? 'attendance-ficha-card selected' : 'attendance-ficha-card'}
                onClick={() => setCandidateGroupId(group.id)}
              >
                <div className="card-topline">
                  <span>Ficha {group.number}</span>
                  <strong className={`attendance-badge ${status.toLowerCase().replace(' ', '-')}`}>
                    {status}
                  </strong>
                </div>
                <h2>{group.program}</h2>
                <dl className="card-facts">
                  <div>
                    <dt>Jornada</dt>
                    <dd>{group.shift}</dd>
                  </div>
                  <div>
                    <dt>{group.locationType}</dt>
                    <dd>{group.location}</dd>
                  </div>
                  <div>
                    <dt>Aprendices</dt>
                    <dd>{group.learnerIds.length}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  className="primary"
                  onClick={(event) => {
                    event.stopPropagation()
                    startAttendance(group.id)
                  }}
                >
                  Tomar asistencia
                </button>
              </article>
            )
          })}
        </section>
      </div>
    )
  }

  return (
    <div className="screen-stack">
      {openedFromGroupDetail ? (
        <button
          type="button"
          className="back-button"
          onClick={() => onBackToGroup?.(activeGroup.id)}
        >
          ‹ Volver a ficha
        </button>
      ) : (
        <button type="button" className="back-button" onClick={() => setSelectedCallGroupId(null)}>
          Cambiar ficha
        </button>
      )}
      <SectionHeader
        eyebrow={`Ficha ${activeGroup.number}`}
        title="Registrar asistencia"
        description="Marca el estado de cada aprendiz con las convenciones institucionales."
      />

      <section className="attendance-toolbar">
        <label>
          Fecha
          <input type="date" value={date} onChange={(event) => handleDateChange(event.target.value)} />
        </label>
        <div className="selected-ficha-summary">
          <span>Ficha seleccionada</span>
          <strong>{activeGroup.number}</strong>
        </div>
        <div className="selected-ficha-summary">
          <span>Jornada</span>
          <strong>{activeGroup.shift}</strong>
        </div>
      </section>

      <section className="selected-ficha-card">
        <div>
          <span>{activeGroup.shift} · {activeGroup.locationType}</span>
          <h2>{activeGroup.program}</h2>
          <p>{activeGroup.location}</p>
        </div>
        <strong>{getGroupAttendanceStatus(activeGroup.id)}</strong>
      </section>

      <section className="legend-card">
        {Object.entries(attendanceLabels).map(([status, label]) => (
          <span key={status}>
            <AttendanceStatusBadge status={status as AttendanceStatus} size="mini" /> {label}
          </span>
        ))}
      </section>

      <section className="metric-grid compact">
        <MetricCard label="Asistieron" value={summary.A} tone="green" />
        <MetricCard label="Con excusa" value={summary.CE} tone="blue" />
        <MetricCard label="Sin excusa" value={summary.SE} tone="red" />
        <MetricCard label="Tarde" value={summary.T} tone="amber" />
      </section>

      <section>
        <div className="list-header">
          <h2>{activeGroup.program}</h2>
          <span>{groupLearners.length} aprendices</span>
        </div>
        <div className="learners-list">
          {groupLearners.length > 0 ? (
            groupLearners.map((learner) => (
              <LearnerRow
                key={learner.id}
                learner={learner}
                status={statuses[learner.id] ?? 'A'}
                onChange={(status) => handleStatusChange(learner.id, status)}
              />
            ))
          ) : (
            <div className="empty-state">
              <strong>No hay aprendices asociados</strong>
              <span>Esta ficha aún no tiene aprendices para realizar el llamado.</span>
            </div>
          )}
        </div>
      </section>

      {savedMessage ? <div className="success-message">{savedMessage}</div> : null}
      <button
        type="button"
        className="primary sticky-action"
        onClick={handleSave}
        disabled={groupLearners.length === 0}
      >
        Guardar asistencia
      </button>
    </div>
  )
}
