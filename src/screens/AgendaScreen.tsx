import { AppHeader } from '../components/AppHeader'
import type { ClassSession, TrainingGroup } from '../types'
import { shortDate } from '../utils/format'

interface AgendaScreenProps {
  sessions: ClassSession[]
  groups: TrainingGroup[]
}

export function AgendaScreen({ sessions, groups }: AgendaScreenProps) {
  const today = new Date().toISOString().slice(0, 10)
  const todaySessions = sessions.filter((session) => session.date === today)
  const nextSession = todaySessions[0] ?? sessions[0]
  const nextGroup = groups.find((group) => group.id === nextSession?.groupId)

  return (
    <div className="screen-stack">
      <AppHeader
        eyebrow="PROGRAMACIÓN"
        title="Agenda"
        subtitle="Consulta tus clases, horarios y ambientes asignados."
        infoCards={[
          { label: 'Clases hoy', value: todaySessions.length || sessions.length },
          { label: 'Próxima clase', value: nextSession?.time.split(' - ')[0] ?? 'Sin clases' },
          { label: 'Jornada', value: nextGroup?.shift ?? 'Asignada' },
        ]}
      />

      <div className="timeline">
        {sessions.map((session) => {
          const group = groups.find((item) => item.id === session.groupId)

          return (
            <article key={session.id} className="timeline-item">
              <div className="timeline-date">
                <strong>{shortDate(session.date)}</strong>
                <span>{session.time.split(' - ')[0]}</span>
              </div>
              <div className="timeline-content">
                <div className="card-topline">
                  <span>Ficha {group?.number}</span>
                  <strong>{session.status}</strong>
                </div>
                <h2>{session.program}</h2>
                <p>{session.time}</p>
                <span>{session.location}</span>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
