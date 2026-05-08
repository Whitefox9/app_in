import { AppHeader } from '../components/AppHeader'
import { MetricCard } from '../components/MetricCard'
import { SectionHeader } from '../components/SectionHeader'
import type { ClassSession, Instructor, TabKey, TrainingGroup } from '../types'

interface DashboardScreenProps {
  instructor: Instructor
  groups: TrainingGroup[]
  sessions: ClassSession[]
  pendingAttendance: number
  onNavigate: (tab: TabKey) => void
  onReports: () => void
}

export function DashboardScreen({
  instructor,
  groups,
  sessions,
  pendingAttendance,
  onNavigate,
  onReports,
}: DashboardScreenProps) {
  const today = new Date().toISOString().slice(0, 10)
  const todaySessions = sessions.filter((session) => session.date === today)
  const nextSession = todaySessions[0] ?? sessions[0]
  const totalLearners = groups.reduce((total, group) => total + group.learnerIds.length, 0)

  return (
    <div className="screen-stack">
      <AppHeader
        eyebrow="INSTRUCTOR"
        title="Panel operativo"
        subtitle="Consulta tus actividades, fichas y novedades del día."
        statusBadge={instructor.name.split(' ')[0]}
        infoCards={[
          { label: 'Fichas hoy', value: todaySessions.length || 2 },
          { label: 'Pendientes', value: pendingAttendance },
          { label: 'Próxima clase', value: nextSession.time.split(' - ')[0] },
        ]}
      />

      <section>
        <SectionHeader title="Resumen de la jornada" />
        <div className="metric-grid">
          <MetricCard label="Fichas hoy" value={todaySessions.length || 2} />
          <MetricCard label="Aprendices" value={totalLearners} tone="green" />
          <MetricCard label="Pendientes" value={pendingAttendance} tone="amber" />
          <MetricCard label="Próxima clase" value={nextSession.time.split(' - ')[0]} tone="red" />
        </div>
      </section>

      <section className="next-class">
        <div>
          <span>Próxima sesión</span>
          <h2>Ficha {groups.find((group) => group.id === nextSession.groupId)?.number}</h2>
          <p>{nextSession.program}</p>
        </div>
        <strong>{nextSession.location}</strong>
      </section>

      <section>
        <SectionHeader title="Accesos rápidos" />
        <div className="quick-actions">
          <button type="button" onClick={() => onNavigate('fichas')}>
            <span>▦</span>
            Mis fichas
          </button>
          <button type="button" onClick={() => onNavigate('attendance')}>
            <span>✓</span>
            Registrar asistencia
          </button>
          <button type="button" onClick={() => onNavigate('agenda')}>
            <span>◷</span>
            Agenda
          </button>
          <button type="button" onClick={onReports}>
            <span>◎</span>
            Reportes
          </button>
          <button type="button" onClick={() => onNavigate('home')}>
            <span>!</span>
            Novedades
          </button>
        </div>
      </section>

      <section className="notice-card">
        <strong>Novedad operativa</strong>
        <p>Validar asistencia de la ficha 2847512 antes de finalizar la jornada.</p>
      </section>
    </div>
  )
}
