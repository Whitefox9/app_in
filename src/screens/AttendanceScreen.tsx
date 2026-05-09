import { useMemo, useState } from 'react'
import { AppHeader } from '../components/AppHeader'
import { ContextualActionBar } from '../components/ContextualActionBar'
import { LearnerRow } from '../components/LearnerRow'
import { MetricCard } from '../components/MetricCard'
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

type AttendanceQuickAction = 'home' | 'take' | 'history' | 'reports'

interface AttendanceScreenProps {
  groups: TrainingGroup[]
  learners: Learner[]
  sessions: ClassSession[]
  records: AttendanceRecord[]
  selectedGroupId?: string | null
  openedFromGroupDetail?: boolean
  onSave: (record: AttendanceRecord) => void
  onBackToGroup?: (groupId: string) => void
  onOpenHistory?: (groupId: string) => void
  onOpenReports?: (groupId: string) => void
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
  onOpenHistory,
  onOpenReports,
}: AttendanceScreenProps) {
  const today = new Date().toISOString().slice(0, 10)
  const [quickAction, setQuickAction] = useState<AttendanceQuickAction>(selectedGroupId ? 'take' : 'home')
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
  const registeredTodayCount = records.filter((record) => record.date === date).length

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

  function handleQuickGroupAction(groupId: string) {
    if (quickAction === 'history') {
      onOpenHistory?.(groupId)
      return
    }

    if (quickAction === 'reports') {
      onOpenReports?.(groupId)
      return
    }

    startAttendance(groupId)
  }

  if (!selectedCallGroupId && quickAction === 'home') {
    return (
      <div className="screen-stack">
        <AppHeader
          eyebrow="CONTROL DIARIO"
          title="Asistencia"
          subtitle="Acceso rápido para registrar, consultar y reportar llamados de asistencia."
          infoCards={[
            { label: 'Pendientes', value: Math.max(groups.length - registeredTodayCount, 0) },
            { label: 'Registradas', value: registeredTodayCount },
            { label: 'Fichas del día', value: todaySessionsCount || groups.length },
          ]}
        />

        <section className="attendance-quick-panel">
          <div className="list-header">
            <h2>¿Qué deseas hacer?</h2>
            <span>Operación diaria</span>
          </div>
          <div className="attendance-quick-actions">
            <button
              type="button"
              className="attendance-quick-action primary-action"
              onClick={() => setQuickAction('take')}
              data-guide="guide-attendance-take"
            >
              <span aria-hidden="true">A</span>
              <strong>Tomar asistencia</strong>
              <small>Selecciona una ficha y registra el llamado del día.</small>
            </button>
            <button
              type="button"
              className="attendance-quick-action"
              onClick={() => setQuickAction('history')}
              data-guide="guide-attendance-history"
            >
              <span aria-hidden="true">H</span>
              <strong>Consultar asistencia</strong>
              <small>Busca llamados anteriores por fecha, mes o aprendiz.</small>
            </button>
            <button
              type="button"
              className="attendance-quick-action"
              onClick={() => setQuickAction('reports')}
              data-guide="guide-attendance-report"
            >
              <span aria-hidden="true">R</span>
              <strong>Generar reporte</strong>
              <small>Crea consolidados de asistencia para coordinación.</small>
            </button>
          </div>
        </section>
      </div>
    )
  }

  if (!selectedCallGroupId) {
    const selectorTitle = quickAction === 'take' ? 'Selecciona una ficha para el llamado' : 'Selecciona una ficha'
    const selectorDescription =
      quickAction === 'history'
        ? 'Elige la ficha que deseas consultar.'
        : quickAction === 'reports'
          ? 'Elige la ficha para generar el reporte.'
          : 'Selecciona una para iniciar el llamado.'
    const actionLabel =
      quickAction === 'history'
        ? 'Consultar historial'
        : quickAction === 'reports'
          ? 'Generar reporte'
          : 'Tomar asistencia'

    return (
      <div className="screen-stack">
        <AppHeader
          eyebrow="CONTROL DIARIO"
          title="Asistencia"
          subtitle="Acceso rápido para registrar, consultar y reportar llamados de asistencia."
          infoCards={[
            { label: 'Pendientes', value: Math.max(groups.length - registeredTodayCount, 0) },
            { label: 'Registradas', value: registeredTodayCount },
            { label: 'Fichas del día', value: todaySessionsCount || groups.length },
          ]}
        />

        <section className="attendance-summary-card">
          <strong>{selectorTitle}</strong>
          <span>{selectorDescription}</span>
          <button type="button" className="attendance-options-link" onClick={() => setQuickAction('home')}>
            ‹ Opciones de asistencia
          </button>
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
                    handleQuickGroupAction(group.id)
                  }}
                >
                  {actionLabel}
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
      <AppHeader
        eyebrow="LLAMADO DE ASISTENCIA"
        title="Tomar asistencia"
        subtitle="Marca el estado de cada aprendiz para la fecha seleccionada."
        statusBadge={`Ficha ${activeGroup.number}`}
        infoCards={[
          { label: 'Ficha', value: activeGroup.number },
          { label: 'Fecha', value: date },
          { label: 'Aprendices', value: groupLearners.length },
        ]}
      />

      <section className="attendance-toolbar">
        <label>
          Fecha del llamado
          <small className="field-guide">Toca para cambiar el día del llamado.</small>
          <span className="date-picker-control" data-tutorial="attendance-date-field" data-guide="guide-attendance-date-field">
            <input type="date" value={date} onChange={(event) => handleDateChange(event.target.value)} />
            <span aria-hidden="true">Cambiar</span>
          </span>
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
      <ContextualActionBar
        secondary={
          openedFromGroupDetail
            ? { label: '‹ Volver a ficha', onClick: () => onBackToGroup?.(activeGroup.id) }
            : { label: '‹ Cambiar ficha', onClick: () => setSelectedCallGroupId(null) }
        }
        primary={{
          label: 'Guardar asistencia',
          onClick: handleSave,
          disabled: groupLearners.length === 0,
        }}
      />
    </div>
  )
}
