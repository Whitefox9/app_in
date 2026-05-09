import type { TrainingGroup } from '../types'

interface GroupCardProps {
  group: TrainingGroup
  operationalStatus: {
    label: string
    detail: string
    tone: 'pending' | 'registered' | 'neutral'
  }
  onOpen: (groupId: string) => void
}

export function GroupCard({ group, operationalStatus, onOpen }: GroupCardProps) {
  return (
    <article className="group-card">
      <div className="group-card-header">
        <div>
          <span>Ficha</span>
          <strong>{group.number}</strong>
        </div>
        <span className="group-status-badge">{group.status}</span>
      </div>
      <div className="group-card-body">
        <div className="group-program-row">
          <div className="group-program-mark" aria-hidden="true">
            {group.program[0]}
          </div>
          <h2>{group.program}</h2>
        </div>
        <div className="group-chip-row">
          <span>{group.trainingType}</span>
          <span>{group.shift}</span>
          <span>{group.locationType}</span>
        </div>
        <div className={`group-operational-status ${operationalStatus.tone}`}>
          <span>Asistencia de hoy</span>
          <strong>{operationalStatus.label}</strong>
          <small>{operationalStatus.detail}</small>
        </div>
        <div className="group-metric-row">
          <article>
            <strong>{group.learnerIds.length}</strong>
            <span>Aprendices</span>
          </article>
          <article>
            <strong>{group.shift}</strong>
            <span>Jornada</span>
          </article>
          <article>
            <strong>{group.environment}</strong>
            <span>{group.locationType}</span>
          </article>
        </div>
      </div>
      <button type="button" className="primary group-action" onClick={() => onOpen(group.id)}>
        Entrar a la ficha →
      </button>
    </article>
  )
}
