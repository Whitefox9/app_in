export type ContextualGuideKey = 'fichas' | 'groupDetail' | 'attendance' | 'attendanceRegister' | 'reports'

export interface ContextualGuideStep {
  title: string
  description: string
  target: string
}

export interface ContextualGuideDefinition {
  title: string
  steps: ContextualGuideStep[]
}

export const contextualGuides: Record<ContextualGuideKey, ContextualGuideDefinition> = {
  fichas: {
    title: 'Guía rápida de Fichas',
    steps: [
      {
        title: 'Estado operativo',
        description: 'Este estado te indica si la ficha requiere una acción hoy.',
        target: 'guide-group-operational-status',
      },
      {
        title: 'Entrar a la ficha',
        description: 'Usa este botón para abrir la gestión completa de la ficha.',
        target: 'guide-enter-group',
      },
      {
        title: 'Datos principales',
        description: 'Aquí ves aprendices, jornada y espacio asignado.',
        target: 'guide-group-main-data',
      },
    ],
  },
  groupDetail: {
    title: 'Guía rápida de Gestión de ficha',
    steps: [
      {
        title: 'Operaciones de la ficha',
        description: 'Desde aquí eliges la operación que quieres realizar con esta ficha.',
        target: 'guide-group-management-actions',
      },
      {
        title: 'Tomar asistencia',
        description: 'Registra el llamado de asistencia de esta ficha.',
        target: 'guide-register-attendance-action',
      },
      {
        title: 'Ver perfil',
        description: 'Toca un aprendiz para ver su información e historial.',
        target: 'guide-learner-profile-card',
      },
    ],
  },
  attendance: {
    title: 'Guía rápida de Asistencia',
    steps: [
      {
        title: 'Ficha disponible',
        description: 'Selecciona la ficha a la que vas a tomar asistencia.',
        target: 'guide-attendance-ficha-card',
      },
      {
        title: 'Estado operativo',
        description: 'Este estado te indica si la asistencia está pendiente, registrada o si no hay clase hoy.',
        target: 'guide-attendance-operational-status',
      },
      {
        title: 'Tomar asistencia',
        description: 'Usa este botón para abrir el llamado de la ficha seleccionada.',
        target: 'guide-attendance-take',
      },
    ],
  },
  attendanceRegister: {
    title: 'Guía rápida de Tomar asistencia',
    steps: [
      {
        title: 'Fecha del llamado',
        description: 'Toca aquí para cambiar el día del llamado.',
        target: 'guide-attendance-date-field',
      },
      {
        title: 'Estados de asistencia',
        description: 'Marca el estado de cada aprendiz.',
        target: 'guide-attendance-status-buttons',
      },
      {
        title: 'Guardar asistencia',
        description: 'Guarda el llamado para alimentar históricos y reportes.',
        target: 'guide-save-attendance-action',
      },
    ],
  },
  reports: {
    title: 'Guía rápida de Reportes',
    steps: [
      {
        title: 'Tipo de reporte',
        description: 'Elige el tipo de reporte que necesitas.',
        target: 'guide-report-type-selector',
      },
      {
        title: 'Fecha o periodo',
        description: 'Selecciona la fecha o periodo a consultar.',
        target: 'guide-report-period-control',
      },
      {
        title: 'Copiar reporte',
        description: 'Copia el consolidado para compartirlo.',
        target: 'guide-copy-report-action',
      },
    ],
  },
}
