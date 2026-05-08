import { AppHeader } from '../components/AppHeader'
import { useMemo, useState } from 'react'
import { MetricCard } from '../components/MetricCard'
import type { AttendanceRecord, TrainingGroup } from '../types'
import { summarizeAttendance } from '../utils/attendance'
import { shortDate } from '../utils/format'

interface ReportsScreenProps {
  groups: TrainingGroup[]
  records: AttendanceRecord[]
  onBack: () => void
}

export function ReportsScreen({ groups, records, onBack }: ReportsScreenProps) {
  const [message, setMessage] = useState('')
  const totals = useMemo(() => {
    return records.reduce(
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
  }, [records])

  return (
    <div className="screen-stack">
      <AppHeader
        eyebrow="REPORTES"
        title="Reportes de asistencia"
        subtitle="Consulta y genera consolidados de asistencia."
        backButton={{ onClick: onBack }}
        infoCards={[
          { label: 'Fichas', value: groups.length },
          { label: 'Periodo', value: records.at(0)?.date ?? 'Demo' },
          { label: 'Registros', value: records.length },
        ]}
      />

      <section className="metric-grid compact">
        <MetricCard label="Asistencias" value={totals.A} tone="green" />
        <MetricCard label="Excusas" value={totals.CE} tone="blue" />
        <MetricCard label="Inasistencias" value={totals.SE} tone="red" />
        <MetricCard label="Tardanzas" value={totals.T} tone="amber" />
      </section>

      <section className="report-panel">
        <div className="list-header">
          <h2>Resumen por ficha</h2>
          <span>{groups.length} activas</span>
        </div>
        {groups.map((group) => {
          const groupRecords = records.filter((record) => record.groupId === group.id)
          const calls = groupRecords.length
          const latest = groupRecords.at(-1)
          const summary = latest ? summarizeAttendance(latest.statuses) : { A: 0, CE: 0, SE: 0, T: 0 }

          return (
            <article key={group.id} className="report-row">
              <div>
                <strong>Ficha {group.number}</strong>
                <span>{group.program}</span>
              </div>
              <div className="mini-bars" aria-label="Indicador de asistencia">
                <span style={{ width: `${Math.max(12, summary.A * 4)}%` }} />
                <span style={{ width: `${Math.max(8, summary.SE * 8)}%` }} />
              </div>
              <small>{calls} llamados</small>
            </article>
          )
        })}
      </section>

      <section className="report-panel">
        <div className="list-header">
          <h2>Historial</h2>
          <span>{records.length} registros</span>
        </div>
        {records.map((record) => {
          const group = groups.find((item) => item.id === record.groupId)

          return (
            <article key={record.id} className="history-row">
              <strong>Ficha {group?.number}</strong>
              <span>{shortDate(record.date)} · {Object.keys(record.statuses).length} aprendices</span>
            </article>
          )
        })}
      </section>

      {message ? <div className="success-message">{message}</div> : null}
      <button
        type="button"
        className="primary"
        onClick={() => setMessage('Reporte generado para demostración.')}
      >
        Exportar Excel
      </button>
    </div>
  )
}
