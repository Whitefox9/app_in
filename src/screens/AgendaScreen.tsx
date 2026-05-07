import { SectionHeader } from '../components/SectionHeader'
import type { ClassSession, TrainingGroup } from '../types'
import { shortDate } from '../utils/format'

interface AgendaScreenProps {
  sessions: ClassSession[]
  groups: TrainingGroup[]
}

export function AgendaScreen({ sessions, groups }: AgendaScreenProps) {
  return (
    <div className="screen-stack">
      <SectionHeader
        eyebrow="Planeación"
        title="Agenda académica"
        description="Sesiones programadas por fecha, ficha, ambiente y estado operativo."
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
