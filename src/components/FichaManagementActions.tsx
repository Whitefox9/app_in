interface FichaManagementActionsProps {
  onRegisterAttendance: () => void
  onAttendanceHistory: () => void
  onReports: () => void
  onNovelty: () => void
}

const actions = [
  {
    key: 'register',
    title: 'Tomar asistencia',
    description: 'Registra el llamado de hoy o de otra fecha.',
    icon: 'A',
  },
  {
    key: 'history',
    title: 'Consultar historial',
    description: 'Revisa asistencias anteriores de esta ficha.',
    icon: 'H',
  },
  {
    key: 'reports',
    title: 'Generar reporte',
    description: 'Crea consolidados para coordinación.',
    icon: 'R',
  },
  {
    key: 'novelty',
    title: 'Registrar novedad',
    description: 'Guarda una observación relevante.',
    icon: 'N',
  },
] as const

export function FichaManagementActions({
  onRegisterAttendance,
  onAttendanceHistory,
  onReports,
  onNovelty,
}: FichaManagementActionsProps) {
  const handlers = {
    register: onRegisterAttendance,
    history: onAttendanceHistory,
    reports: onReports,
    novelty: onNovelty,
  }

  return (
    <section className="management-panel">
      <div className="list-header">
        <h2>¿Qué deseas hacer?</h2>
        <span>Centro operativo</span>
      </div>
      <p className="section-guide">Selecciona una operación para esta ficha.</p>
      <div className="management-actions">
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            className={`management-action-${action.key}`}
            onClick={handlers[action.key]}
          >
            <span aria-hidden="true">{action.icon}</span>
            <strong>{action.title}</strong>
            <small>{action.description}</small>
          </button>
        ))}
      </div>
    </section>
  )
}
