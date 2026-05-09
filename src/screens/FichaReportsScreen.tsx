import { useMemo, useState } from 'react'
import { AppHeader } from '../components/AppHeader'
import { AttendanceStatusBadge } from '../components/AttendanceStatusBadge'
import { ContextualActionBar } from '../components/ContextualActionBar'
import { MetricCard } from '../components/MetricCard'
import type {
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSummary,
  Instructor,
  Learner,
  TrainingGroup,
} from '../types'
import { attendanceLabels, summarizeAttendance } from '../utils/attendance'
import { shortDate } from '../utils/format'

type ReportMode = 'day' | 'accumulated' | 'learner'
type PeriodMode = 'all' | 'month'
type LearnerReportState = 'Normal' | 'Seguimiento' | 'Alerta' | 'Crítico'

interface AttendanceHistoryEntry {
  fichaId: string
  aprendizId: string
  fecha: string
  jornada: string
  estado: AttendanceStatus
  observacion?: string
}

interface FichaReportsScreenProps {
  group: TrainingGroup
  instructor: Instructor
  learners: Learner[]
  records: AttendanceRecord[]
  onBack: () => void
}

const reportModes: Array<{ key: ReportMode; title: string; description: string }> = [
  { key: 'day', title: 'Reporte del día', description: 'Resumen por fecha' },
  { key: 'accumulated', title: 'Desde inicio de formación', description: 'Seguimiento acumulado' },
  { key: 'learner', title: 'Por aprendiz', description: 'Historial individual' },
]

function emptySummary(): AttendanceSummary {
  return { A: 0, CE: 0, SE: 0, T: 0 }
}

function percentage(summary: AttendanceSummary): number {
  const total = summary.A + summary.CE + summary.SE + summary.T
  return total ? Math.round(((summary.A + summary.CE + summary.T) / total) * 100) : 0
}

function learnerState(summary: AttendanceSummary): LearnerReportState {
  const percent = percentage(summary)
  if (summary.SE >= 3) return 'Crítico'
  if (summary.SE >= 2 || percent < 60) return 'Alerta'
  if (percent < 80) return 'Seguimiento'
  return 'Normal'
}

function learnerStateClass(state: LearnerReportState): string {
  if (state === 'Crítico') return 'critico'
  return state.toLowerCase()
}

function buildReportText(params: {
  group: TrainingGroup
  instructor: Instructor
  date: string
  summary: AttendanceSummary
  learners: Learner[]
  entries: AttendanceHistoryEntry[]
}) {
  const noveltyEntries = params.entries.filter((entry) => entry.estado !== 'A')
  const noveltyLines = noveltyEntries.length
    ? noveltyEntries
        .map((entry, index) => {
          const learner = params.learners.find((item) => item.id === entry.aprendizId)
          return `${index + 1}. ${learner?.name ?? 'Aprendiz'} - ${entry.estado}`
        })
        .join('\n')
    : 'Sin aprendices con inasistencia o novedad.'

  return `REPORTE DE ASISTENCIA

Ficha: ${params.group.number}
Programa: ${params.group.program}
Instructor: ${params.instructor.name}
Fecha: ${params.date}
Jornada: ${params.group.shift}
Ambiente/Colegio: ${params.group.environment}

Total aprendices: ${params.learners.length}

A - Asistieron: ${params.summary.A}
CE - Con excusa: ${params.summary.CE}
SE - Sin excusa: ${params.summary.SE}
T - Llegada tarde: ${params.summary.T}

Aprendices con inasistencia o novedad:
${noveltyLines}

Observaciones:
Sin novedades adicionales.

Reporte generado desde Fácil Instructores.`
}

function buildIndividualReportText(params: {
  group: TrainingGroup
  learner: Learner
  summary: AttendanceSummary
  percent: number
  entries: AttendanceHistoryEntry[]
}) {
  const history = params.entries
    .map((entry, index) => `${index + 1}. ${entry.fecha} - ${entry.estado} - ${attendanceLabels[entry.estado]}`)
    .join('\n')

  return `REPORTE INDIVIDUAL DE ASISTENCIA

Aprendiz: ${params.learner.name}
Documento: ${params.learner.documentType} ${params.learner.documentNumber}
Ficha: ${params.group.number}
Programa: ${params.group.program}

A - Asistio: ${params.summary.A}
CE - Con excusa: ${params.summary.CE}
SE - Sin excusa: ${params.summary.SE}
T - Llegada tarde: ${params.summary.T}
Porcentaje de asistencia: ${params.percent}%

Historial:
${history || 'Sin registros de asistencia.'}

Reporte generado desde Fácil Instructores.`
}

function buildConsolidatedReportText(params: {
  group: TrainingGroup
  instructor: Instructor
  learners: Learner[]
  sessionsCount: number
  expectedRecords: number
  summary: AttendanceSummary
  percent: number
  periodLabel: string
  monthly: boolean
  learnerReports: Array<{
    learner: Learner
    summary: AttendanceSummary
    percent: number
    state: LearnerReportState
  }>
}) {
  const trackedLearners = params.learnerReports.filter(
    (item) => item.state === 'Seguimiento' || item.state === 'Alerta' || item.state === 'Crítico',
  )
  const trackedLines = trackedLearners.length
    ? trackedLearners
        .map(
          (item, index) =>
            `${index + 1}. ${item.learner.name} - ${item.percent}% - SE: ${item.summary.SE} - T: ${item.summary.T}`,
        )
        .join('\n')
    : 'Sin aprendices en seguimiento.'

  const title = params.monthly ? 'CONSOLIDADO MENSUAL DE ASISTENCIA' : 'CONSOLIDADO DE ASISTENCIA'
  const sessionsLabel = params.monthly ? 'Sesiones registradas en el mes' : 'Sesiones registradas'
  const summaryLabel = params.monthly ? 'Resumen mensual' : 'Resumen general'
  const percentLabel = params.monthly ? 'Porcentaje mensual de asistencia' : 'Porcentaje general de asistencia'

  return `${title}

Ficha: ${params.group.number}
Programa: ${params.group.program}
Instructor: ${params.instructor.name}
Periodo: ${params.periodLabel}
Jornada: ${params.group.shift}
Ambiente/Colegio: ${params.group.environment}

Total aprendices: ${params.learners.length}
${sessionsLabel}: ${params.sessionsCount}
Registros esperados: ${params.expectedRecords}

${summaryLabel}:
A - Asistieron: ${params.summary.A}
CE - Con excusa: ${params.summary.CE}
SE - Sin excusa: ${params.summary.SE}
T - Llegada tarde: ${params.summary.T}

${percentLabel}: ${params.percent}%

Aprendices en seguimiento:
${trackedLines}

Reporte generado desde Fácil Instructores.`
}

function monthLabel(value: string) {
  const [year, month] = value.split('-')
  const date = new Date(Number(year), Number(month) - 1, 1)

  return new Intl.DateTimeFormat('es-CO', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

async function copyText(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

export function FichaReportsScreen({
  group,
  instructor,
  learners,
  records,
  onBack,
}: FichaReportsScreenProps) {
  const groupRecords = useMemo(
    () => records.filter((record) => record.groupId === group.id).sort((left, right) => right.date.localeCompare(left.date)),
    [group.id, records],
  )
  const reportDates = groupRecords.map((record) => record.date)
  const today = new Date().toISOString().slice(0, 10)
  const [mode, setMode] = useState<ReportMode>('day')
  const [selectedDate, setSelectedDate] = useState(reportDates[0] ?? new Date().toISOString().slice(0, 10))
  const [selectedLearnerId, setSelectedLearnerId] = useState(learners[0]?.id ?? '')
  const [periodMode, setPeriodMode] = useState<PeriodMode>('all')
  const [selectedMonth, setSelectedMonth] = useState((reportDates[0] ?? today).slice(0, 7))
  const [message, setMessage] = useState('')

  const historyEntries = useMemo<AttendanceHistoryEntry[]>(() => {
    return groupRecords.flatMap((record) =>
      Object.entries(record.statuses).map(([learnerId, status]) => ({
        fichaId: group.id,
        aprendizId: learnerId,
        fecha: record.date,
        jornada: group.shift,
        estado: status,
        observacion: status === 'A' ? undefined : attendanceLabels[status],
      })),
    )
  }, [group.id, group.shift, groupRecords])

  const dayRecord = groupRecords.find((record) => record.date === selectedDate)
  const daySummary = dayRecord ? summarizeAttendance(dayRecord.statuses) : emptySummary()
  const dayEntries = historyEntries.filter((entry) => entry.fecha === selectedDate)
  const dayNoveltyEntries = dayEntries.filter((entry) => entry.estado !== 'A')

  const periodEntries = historyEntries.filter((entry) => {
    if (periodMode === 'month') return entry.fecha.startsWith(selectedMonth)
    return entry.fecha >= group.startDate && entry.fecha <= today
  })
  const periodSessionDates = Array.from(new Set(periodEntries.map((entry) => entry.fecha)))
  const periodLabel =
    periodMode === 'month'
      ? monthLabel(selectedMonth)
      : `Desde inicio de formación hasta ${shortDate(today)}`

  const accumulatedSummary = periodEntries.reduce((summary, entry) => {
    summary[entry.estado] += 1
    return summary
  }, emptySummary())

  function buildLearnerReports(entriesSource: AttendanceHistoryEntry[]) {
    return learners.map((learner) => {
      const entries = entriesSource
        .filter((entry) => entry.aprendizId === learner.id)
        .sort((left, right) => right.fecha.localeCompare(left.fecha))
      const summary = summarizeAttendance(
        entries.reduce<Record<string, AttendanceStatus>>((statuses, entry) => {
          statuses[entry.fecha] = entry.estado
          return statuses
        }, {}),
      )
      const percent = percentage(summary)

      return {
        learner,
        entries,
        summary,
        percent,
        state: learnerState(summary),
      }
    })
  }

  const learnerReports = buildLearnerReports(historyEntries)
  const periodLearnerReports = buildLearnerReports(periodEntries)

  const selectedLearnerReport = learnerReports.find((item) => item.learner.id === selectedLearnerId) ?? learnerReports[0]
  const totalExpected = learners.length * periodSessionDates.length
  const alertCount = periodLearnerReports.filter((item) => item.state === 'Alerta' || item.state === 'Crítico').length
  const headerPeriod =
    mode === 'day'
      ? shortDate(selectedDate)
      : mode === 'learner'
        ? 'Individual'
        : periodMode === 'month'
          ? monthLabel(selectedMonth)
          : 'Acumulado'

  async function handleCopyDayReport() {
    await copyText(
      buildReportText({
        group,
        instructor,
        date: selectedDate,
        summary: daySummary,
        learners,
        entries: dayEntries,
      }),
    )
    setMessage('Reporte del día copiado al portapapeles.')
  }

  async function handleCopyIndividualReport() {
    if (!selectedLearnerReport) return
    await copyText(
      buildIndividualReportText({
        group,
        learner: selectedLearnerReport.learner,
        summary: selectedLearnerReport.summary,
        percent: selectedLearnerReport.percent,
        entries: selectedLearnerReport.entries,
      }),
    )
    setMessage('Reporte individual copiado al portapapeles.')
  }

  async function handleCopyConsolidatedReport() {
    await copyText(
      buildConsolidatedReportText({
        group,
        instructor,
        learners,
        sessionsCount: periodSessionDates.length,
        expectedRecords: totalExpected,
        summary: accumulatedSummary,
        percent: percentage(accumulatedSummary),
        periodLabel,
        monthly: periodMode === 'month',
        learnerReports: periodLearnerReports,
      }),
    )
    setMessage('Consolidado copiado al portapapeles.')
  }

  return (
    <div className="screen-stack">
      <AppHeader
        eyebrow="REPORTES"
        title="Reportes de asistencia"
        subtitle="Consulta y genera consolidados de asistencia."
        statusBadge={`Ficha ${group.number}`}
        infoCards={[
          { label: 'Ficha', value: group.number },
          { label: 'Periodo', value: headerPeriod },
          { label: 'Aprendices', value: learners.length },
        ]}
      />

      <section className="report-mode-panel" aria-label="Tipos de reporte">
        <div>
          <h2>Selecciona el tipo de reporte</h2>
          <p>Elige si deseas consultar un reporte diario, acumulado o individual.</p>
        </div>
        <div className="report-mode-grid">
          {reportModes.map((item) => (
            <button
              key={item.key}
              type="button"
              className={mode === item.key ? 'report-mode-card active' : 'report-mode-card'}
              onClick={() => {
                setMode(item.key)
                setMessage('')
              }}
            >
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </button>
          ))}
        </div>
      </section>

      {mode === 'day' ? (
        <section className="report-panel">
          <div className="list-header">
            <h2>Resumen diario</h2>
            <span>{dayRecord ? 'Datos disponibles' : 'Sin llamado'}</span>
          </div>
          <label>
            Fecha seleccionada
            <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
          </label>

          <div className="report-info-card">
            <span>Ficha {group.number}</span>
            <strong>{group.program}</strong>
            <small>{instructor.name} · {group.shift} · {group.environment}</small>
          </div>

          <div className="metric-grid compact">
            <MetricCard label="Aprendices" value={learners.length} />
            <MetricCard label="A" value={daySummary.A} tone="green" />
            <MetricCard label="CE" value={daySummary.CE} tone="blue" />
            <MetricCard label="SE" value={daySummary.SE} tone="red" />
            <MetricCard label="T" value={daySummary.T} tone="amber" />
          </div>

          <div className="report-section-card">
            <div className="list-header">
              <h2>Inasistencias o novedades</h2>
              <span>{dayNoveltyEntries.length}</span>
            </div>
            {dayNoveltyEntries.length > 0 ? (
              dayNoveltyEntries.map((entry) => {
                const learner = learners.find((item) => item.id === entry.aprendizId)
                return (
                  <article key={`${entry.aprendizId}-${entry.fecha}`} className="report-learner-row">
                    <div>
                      <strong>{learner?.name ?? 'Aprendiz'}</strong>
                      <span>{learner?.documentType} {learner?.documentNumber}</span>
                    </div>
                    <AttendanceStatusBadge status={entry.estado} />
                  </article>
                )
              })
            ) : (
              <div className="empty-state">
                <strong>Sin novedades</strong>
                <span>Todos los aprendices estan registrados como asistentes.</span>
              </div>
            )}
          </div>

          {message ? <div className="success-message">{message}</div> : null}
          <div className="report-actions">
            <button
              type="button"
              className="primary"
              onClick={() => setMessage('Exportacion Excel simulada para el reporte del dia.')}
            >
              Exportar Excel
            </button>
          </div>
        </section>
      ) : null}

      {mode === 'accumulated' ? (
        <>
          <section className="report-panel">
            <div className="list-header">
              <h2>Desde inicio de formación</h2>
              <span>{periodSessionDates.length} sesiones</span>
            </div>
            <div className="report-section-card">
              <div className="list-header">
                <h2>Periodo del reporte</h2>
                <span>{periodMode === 'month' ? 'Mes especifico' : 'Acumulado'}</span>
              </div>
              <div className="period-controls">
                <label className={periodMode === 'all' ? 'period-option active' : 'period-option'}>
                  <input
                    type="radio"
                    name="period-mode"
                    checked={periodMode === 'all'}
                    onChange={() => {
                      setPeriodMode('all')
                      setMessage('')
                    }}
                  />
                  Desde inicio de formación
                </label>
                <label className={periodMode === 'month' ? 'period-option active' : 'period-option'}>
                  <input
                    type="radio"
                    name="period-mode"
                    checked={periodMode === 'month'}
                    onChange={() => {
                      setPeriodMode('month')
                      setMessage('')
                    }}
                  />
                  Mes específico
                </label>
              </div>
              {periodMode === 'month' ? (
                <label>
                  Mes y año
                  <input type="month" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} />
                </label>
              ) : (
                <p className="period-caption">Desde inicio de formación hasta {shortDate(today)}</p>
              )}
            </div>
            <div className="report-info-card">
              <span>Ficha {group.number}</span>
              <strong>{group.program}</strong>
              <small>{instructor.name} · {periodLabel}</small>
            </div>
            <dl className="report-facts-grid">
              <div>
                <dt>Fecha inicio</dt>
                <dd>{shortDate(group.startDate)}</dd>
              </div>
              <div>
                <dt>Fecha corte</dt>
                <dd>{periodMode === 'month' ? monthLabel(selectedMonth) : shortDate(today)}</dd>
              </div>
              <div>
                <dt>Total esperados</dt>
                <dd>{totalExpected}</dd>
              </div>
              <div>
                <dt>Alertas</dt>
                <dd>{alertCount}</dd>
              </div>
            </dl>
            <div className="metric-grid compact">
              <MetricCard label="Asistencia general" value={`${percentage(accumulatedSummary)}%`} tone="green" />
              <MetricCard label="A" value={accumulatedSummary.A} tone="green" />
              <MetricCard label="CE" value={accumulatedSummary.CE} tone="blue" />
              <MetricCard label="SE" value={accumulatedSummary.SE} tone="red" />
              <MetricCard label="T" value={accumulatedSummary.T} tone="amber" />
              <MetricCard label="Aprendices" value={learners.length} />
            </div>
          </section>

          <section className="report-panel">
            <div className="list-header">
              <h2>Aprendices en seguimiento</h2>
              <span>{periodLearnerReports.length}</span>
            </div>
            {periodLearnerReports.map((item) => (
              <article key={item.learner.id} className="learner-report-card">
                <div className="card-topline">
                  <span>{item.learner.documentType} {item.learner.documentNumber}</span>
                  <strong className={`learner-state ${learnerStateClass(item.state)}`}>{item.state}</strong>
                </div>
                <h2>{item.learner.name}</h2>
                <div className="learner-report-summary">
                  {(['A', 'CE', 'SE', 'T'] as const).map((status) => (
                    <span key={status}>
                      <AttendanceStatusBadge status={status} size="mini" />
                      <strong>{item.summary[status]}</strong>
                    </span>
                  ))}
                </div>
                <div className="learner-report-percent">
                  <strong>{item.percent}% asistencia</strong>
                </div>
              </article>
            ))}
          </section>

          {message ? <div className="success-message">{message}</div> : null}
          <div className="report-actions">
            <button
              type="button"
              className="primary"
              onClick={() => setMessage('Consolidado generado para demostración.')}
            >
              Exportar Excel
            </button>
          </div>
        </>
      ) : null}

      {mode === 'learner' && selectedLearnerReport ? (
        <section className="report-panel">
          <div className="list-header">
            <h2>Reporte por aprendiz</h2>
            <span>{selectedLearnerReport.percent}%</span>
          </div>
          <label>
            Seleccionar aprendiz
            <select value={selectedLearnerReport.learner.id} onChange={(event) => setSelectedLearnerId(event.target.value)}>
              {learners.map((learner) => (
                <option key={learner.id} value={learner.id}>
                  {learner.name}
                </option>
              ))}
            </select>
          </label>

          <div className="report-info-card">
            <span>{selectedLearnerReport.learner.documentType} {selectedLearnerReport.learner.documentNumber}</span>
            <strong>{selectedLearnerReport.learner.name}</strong>
            <small>{selectedLearnerReport.learner.phone} · {selectedLearnerReport.learner.email}</small>
          </div>

          <div className="metric-grid compact">
            <MetricCard label="Asistencia" value={`${selectedLearnerReport.percent}%`} tone="green" />
            <MetricCard label="A" value={selectedLearnerReport.summary.A} tone="green" />
            <MetricCard label="CE" value={selectedLearnerReport.summary.CE} tone="blue" />
            <MetricCard label="SE" value={selectedLearnerReport.summary.SE} tone="red" />
            <MetricCard label="T" value={selectedLearnerReport.summary.T} tone="amber" />
          </div>

          <div className="report-section-card">
            <div className="list-header">
              <h2>Ultimas 5 clases</h2>
              <span>{selectedLearnerReport.entries.slice(0, 5).length}</span>
            </div>
            <div className="learner-last-statuses expanded">
              {selectedLearnerReport.entries.slice(0, 5).map((entry) => (
                <span key={entry.fecha}>
                  <AttendanceStatusBadge status={entry.estado} size="mini" />
                  {shortDate(entry.fecha)}
                </span>
              ))}
            </div>
          </div>

          <div className="report-section-card">
            <div className="list-header">
              <h2>Historial</h2>
              <span>{selectedLearnerReport.entries.length}</span>
            </div>
            {selectedLearnerReport.entries.map((entry) => (
              <article key={entry.fecha} className="recent-attendance-row">
                <div>
                  <strong>{shortDate(entry.fecha)}</strong>
                  <span>{entry.observacion ?? attendanceLabels[entry.estado]}</span>
                </div>
                <AttendanceStatusBadge status={entry.estado} />
              </article>
            ))}
          </div>

          {message ? <div className="success-message">{message}</div> : null}
        </section>
      ) : null}

      <ContextualActionBar
        secondary={{ label: '‹ Volver', onClick: onBack }}
        primary={{
          label:
            mode === 'day'
              ? 'Copiar reporte'
              : mode === 'accumulated'
                ? 'Copiar consolidado'
                : 'Copiar individual',
          onClick:
            mode === 'day'
              ? handleCopyDayReport
              : mode === 'accumulated'
                ? handleCopyConsolidatedReport
                : handleCopyIndividualReport,
        }}
      />
    </div>
  )
}
