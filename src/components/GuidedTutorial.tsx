import { useState } from 'react'

interface TutorialStep {
  title: string
  description: string
}

interface GuidedTutorialProps {
  onFinish: () => void
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Bienvenido a Fácil Instructores',
    description:
      'Esta app te ayuda a gestionar fichas o grupos, tomar asistencia, consultar aprendices y generar reportes desde el celular.',
  },
  {
    title: 'Inicio',
    description:
      'Aquí verás tus tareas del día, próximas clases y accesos rápidos para iniciar tu trabajo.',
  },
  {
    title: 'Fichas',
    description:
      'En esta sección encuentras tus fichas o grupos asignados. Entra a una ficha para gestionarla.',
  },
  {
    title: 'Gestión de ficha',
    description:
      'Desde una ficha puedes tomar asistencia, consultar historial, generar reportes, registrar novedades y revisar aprendices.',
  },
  {
    title: 'Aprendices',
    description:
      'Toca un aprendiz para ver su información básica y su historial reciente de asistencia.',
  },
  {
    title: 'Asistencia',
    description:
      'Este módulo funciona como acceso rápido para tomar asistencia, consultar llamados anteriores o generar reportes.',
  },
  {
    title: 'Reportes y acciones rápidas',
    description:
      'Los reportes permiten copiar consolidados o simular exportaciones. Usa la barra inferior y los botones contextuales para navegar, volver, guardar o copiar información.',
  },
]

export function GuidedTutorial({ onFinish }: GuidedTutorialProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const currentStep = tutorialSteps[stepIndex]
  const isLastStep = stepIndex === tutorialSteps.length - 1

  return (
    <div className="tutorial-overlay" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
      <section className="tutorial-card">
        <span className="tutorial-progress">
          {stepIndex + 1} de {tutorialSteps.length}
        </span>
        <div className="tutorial-step-mark" aria-hidden="true">
          {stepIndex + 1}
        </div>
        <h2 id="tutorial-title">{currentStep.title}</h2>
        <p>{currentStep.description}</p>
        <div className="tutorial-dots" aria-hidden="true">
          {tutorialSteps.map((step) => (
            <span key={step.title} className={step.title === currentStep.title ? 'active' : ''} />
          ))}
        </div>
        <div className="tutorial-actions">
          <button type="button" className="secondary-action" onClick={onFinish}>
            Omitir
          </button>
          <button
            type="button"
            className="primary"
            onClick={() => {
              if (isLastStep) {
                onFinish()
                return
              }

              setStepIndex((current) => current + 1)
            }}
          >
            {isLastStep ? 'Comenzar' : 'Siguiente'}
          </button>
        </div>
      </section>
    </div>
  )
}
