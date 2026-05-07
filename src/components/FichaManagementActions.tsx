interface FichaManagementActionsProps {
  onRegisterAttendance: () => void
  onAttendanceHistory: () => void
  onReports: () => void
  onNovelty: () => void
}

const actions = [
  {
    key: 'register',
    title: 'Registrar asistencia',
    description: 'Abrir llamado de esta ficha',
    icon: 'A',
  },
  {
    key: 'history',
    title: 'Consultar asistencia',
    description: 'Historial filtrado',
    icon: 'H',
  },
  {
    key: 'reports',
    title: 'Ver reportes',
    description: 'Indicadores operativos',
    icon: 'R',
  },
  {
    key: 'novelty',
    title: 'Registrar novedad',
    description: 'Guardar observación',
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
        <h2>Gestiones de la ficha</h2>
        <span>Centro operativo</span>
      </div>
      <div className="management-actions">
        {actions.map((action) => (
          <button key={action.key} type="button" onClick={handlers[action.key]}>
            <span aria-hidden="true">{action.icon}</span>
            <strong>{action.title}</strong>
            <small>{action.description}</small>
          </button>
        ))}
      </div>
    </section>
  )
}
