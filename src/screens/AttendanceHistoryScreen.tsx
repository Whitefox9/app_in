import { MetricCard } from '../components/MetricCard'
import { SectionHeader } from '../components/SectionHeader'
import { AttendanceStatusBadge } from '../components/AttendanceStatusBadge'
import type { AttendanceRecord, AttendanceStatus, Learner, TrainingGroup } from '../types'
import { attendanceLabels, summarizeAttendance } from '../utils/attendance'
import { shortDate } from '../utils/format'

interface AttendanceHistoryScreenProps {
  group: TrainingGroup
  learners: Learner[]
  records: AttendanceRecord[]
  onBack: () => void
}

export function AttendanceHistoryScreen({
  group,
  learners,
  records,
  onBack,
}: AttendanceHistoryScreenProps) {
  const groupRecords = records
    .filter((record) => record.groupId === group.id)
    .sort((left, right) => right.date.localeCompare(left.date))

  const totals = groupRecords.reduce(
    (accumulator, record) => {
      const summary = summarizeAttendance(record.statuses)
      accumulator.A += summary.A
      accumulator.CE += summary.CE
      accumulator.SE += summary.SE
      accumulator.T += summary.T
      return accumulator
    },
    { A: 0, CE: 0, SE: 0, T: 0 },
  )

  return (
    <div className="screen-stack">
      <button type="button" className="back-button" onClick={onBack}>
        ‹ Volver a ficha
      </button>
      <SectionHeader
        eyebrow={`Ficha ${group.number}`}
        title="Historial de asistencia"
        description={`${group.program} · ${group.shift}`}
      />

      <section className="metric-grid compact">
        <MetricCard label="Asistieron" value={totals.A} tone="green" />
        <MetricCard label="Con excusa" value={totals.CE} tone="blue" />
        <MetricCard label="Sin excusa" value={totals.SE} tone="red" />
        <MetricCard label="Tarde" value={totals.T} tone="amber" />
      </section>

      <section className="report-panel">
        <div className="list-header">
          <h2>Registros de la ficha</h2>
          <span>{groupRecords.length} sesiones</span>
        </div>
        {groupRecords.length > 0 ? (
          groupRecords.map((record) => {
            const summary = summarizeAttendance(record.statuses)

            return (
              <article key={record.id} className="history-detail-row">
                <div>
                  <strong>{shortDate(record.date)}</strong>
                  <span>{learners.length} aprendices asociados</span>
                </div>
                <div className="status-summary-line">
                  {Object.entries(summary).map(([status, count]) => (
                    <span key={status}>
                      <AttendanceStatusBadge status={status as AttendanceStatus} size="mini" />
                      <strong>{count}</strong>
                    </span>
                  ))}
                </div>
              </article>
            )
          })
        ) : (
          <div className="empty-state">
            <strong>Sin registros para esta ficha</strong>
            <span>Cuando guardes asistencias apareceran aqui filtradas automaticamente.</span>
          </div>
        )}
      </section>

      <section className="legend-card">
        {Object.entries(attendanceLabels).map(([status, label]) => (
          <span key={status}>
            <AttendanceStatusBadge status={status as AttendanceStatus} size="mini" /> {label}
          </span>
        ))}
      </section>
    </div>
  )
}
