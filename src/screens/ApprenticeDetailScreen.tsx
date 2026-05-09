import { AppHeader } from '../components/AppHeader'
import { ContextualActionBar } from '../components/ContextualActionBar'
import { RecentAttendanceList } from '../components/RecentAttendanceList'
import type { AttendanceRecord, Learner, TrainingGroup } from '../types'

interface ApprenticeDetailScreenProps {
  learner: Learner
  group: TrainingGroup
  records: AttendanceRecord[]
  onBack: () => void
}

export function ApprenticeDetailScreen({
  learner,
  group,
  records,
  onBack,
}: ApprenticeDetailScreenProps) {
  return (
    <div className="screen-stack">
      <AppHeader
        eyebrow="APRENDIZ"
        title={learner.name}
        subtitle={`${learner.documentType} ${learner.documentNumber} · Ficha ${group.number}`}
        infoCards={[
          { label: 'Programa', value: group.program },
          { label: 'Teléfono', value: learner.phone },
          { label: 'Ficha', value: group.number },
        ]}
      />

      <section className="student-profile-card">
        <div className="student-avatar" aria-hidden="true">
          {learner.name
            .split(' ')
            .slice(0, 2)
            .map((part) => part[0])
            .join('')}
        </div>
        <dl>
          <div>
            <dt>Nombre completo</dt>
            <dd>{learner.name}</dd>
          </div>
          <div>
            <dt>Documento</dt>
            <dd>{learner.documentType} {learner.documentNumber}</dd>
          </div>
          <div>
            <dt>Programa</dt>
            <dd>{group.program}</dd>
          </div>
          <div>
            <dt>Ficha</dt>
            <dd>{group.number}</dd>
          </div>
          <div>
            <dt>Telefono</dt>
            <dd>{learner.phone}</dd>
          </div>
          <div>
            <dt>Correo</dt>
            <dd>{learner.email}</dd>
          </div>
        </dl>
      </section>

      <section className="student-attendance-card">
        <div className="list-header">
          <h2>Asistencias recientes</h2>
          <span>Ultimas 5</span>
        </div>
        <RecentAttendanceList learner={learner} group={group} records={records} />
      </section>

      <ContextualActionBar secondary={{ label: '‹ Volver a ficha', onClick: onBack }} />
    </div>
  )
}
