import { AppHeader } from '../components/AppHeader'
import { GroupCard } from '../components/GroupCard'
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
      <AppHeader
        eyebrow="INSTRUCTOR"
        title="Mis fichas"
        subtitle="Consulta y gestiona tus grupos asignados."
        infoCards={[
          { label: 'Fichas activas', value: activeGroups },
          { label: 'Aprendices', value: totalLearners },
          { label: 'Próxima clase', value: nextClassTime },
        ]}
      />
      <div className="group-list">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} onOpen={onOpenGroup} />
        ))}
      </div>
    </div>
  )
}
