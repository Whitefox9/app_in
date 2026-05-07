import { SectionHeader } from '../components/SectionHeader'
import type { Instructor, TrainingGroup } from '../types'

interface ProfileScreenProps {
  instructor: Instructor
  groups: TrainingGroup[]
  onReports: () => void
}

export function ProfileScreen({ instructor, groups, onReports }: ProfileScreenProps) {
  return (
    <div className="screen-stack">
      <SectionHeader
        eyebrow="Cuenta"
        title="Perfil del instructor"
        description="Información laboral y asignación académica disponible en la demo."
      />

      <section className="profile-card">
        <div className="avatar">{instructor.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
        <h2>{instructor.name}</h2>
        <span>CC {instructor.document}</span>
        <p>{instructor.email}</p>
      </section>

      <section className="detail-panel">
        <dl>
          <div>
            <dt>Área de conocimiento</dt>
            <dd>{instructor.knowledgeArea}</dd>
          </div>
          <div>
            <dt>Tipo de vinculación</dt>
            <dd>{instructor.contractType}</dd>
          </div>
          <div>
            <dt>Fichas asignadas</dt>
            <dd>{groups.length}</dd>
          </div>
          <div>
            <dt>Horas semanales</dt>
            <dd>{instructor.weeklyHours}</dd>
          </div>
          <div>
            <dt>Sede principal</dt>
            <dd>{instructor.mainCampus}</dd>
          </div>
        </dl>
      </section>

      <section className="assigned-groups">
        <div className="list-header">
          <h2>Asignación actual</h2>
          <span>{groups.length} fichas</span>
        </div>
        {groups.map((group) => (
          <article key={group.id}>
            <strong>Ficha {group.number}</strong>
            <span>{group.program}</span>
          </article>
        ))}
      </section>

      <button type="button" className="primary ghost" onClick={onReports}>
        Ver reportes
      </button>
    </div>
  )
}
