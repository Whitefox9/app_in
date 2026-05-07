import { GroupCard } from '../components/GroupCard'
import { SectionHeader } from '../components/SectionHeader'
import type { TrainingGroup } from '../types'

interface GroupsScreenProps {
  groups: TrainingGroup[]
  onOpenGroup: (groupId: string) => void
}

export function GroupsScreen({ groups, onOpenGroup }: GroupsScreenProps) {
  const activeGroups = groups.filter((group) => group.status === 'Activa').length
  const totalLearners = groups.reduce((total, group) => total + group.learnerIds.length, 0)
  const nextClassTime = '6:00 a.m.'

  return (
    <div className="screen-stack">
      <SectionHeader
        eyebrow="Instructor"
        title="Mis fichas"
        description="Consulta tus grupos activos, ambientes y cantidad de aprendices asignados."
      />
      <section className="groups-summary-panel">
        <div className="list-header">
          <h2>Resumen de fichas</h2>
          <span>Operativo</span>
        </div>
        <div className="groups-summary-grid">
          <article>
            <strong>{activeGroups}</strong>
            <span>Fichas activas</span>
          </article>
          <article>
            <strong>{totalLearners}</strong>
            <span>Aprendices</span>
          </article>
          <article>
            <strong>{nextClassTime}</strong>
            <span>Próxima clase</span>
          </article>
        </div>
      </section>
      <div className="group-list">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} onOpen={onOpenGroup} />
        ))}
      </div>
    </div>
  )
}
