import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

interface TutorialStep {
  title: string
  description: string
  target: string
}

interface SpotlightRect {
  top: number
  left: number
  width: number
  height: number
}

interface ConnectorPath {
  path: string
  endX: number
  endY: number
  sparkPath: string
}

interface GuidedTutorialProps {
  onFinish: () => void
}

const tutorialSteps: TutorialStep[] = [
  {
    target: 'bottom-nav-home',
    title: 'Inicio',
    description: 'Aquí verás tus tareas del día, próximas clases y accesos rápidos.',
  },
  {
    target: 'bottom-nav-fichas',
    title: 'Fichas',
    description:
      'Aquí encuentras tus grupos asignados. Entra a una ficha para gestionar aprendices, asistencia, reportes y novedades.',
  },
  {
    target: 'bottom-nav-attendance',
    title: 'Asistencia',
    description:
      'Acceso rápido para tomar asistencia, consultar llamados anteriores o generar reportes.',
  },
  {
    target: 'bottom-nav-agenda',
    title: 'Agenda',
    description:
      'Consulta tus clases programadas, horarios, jornadas y espacios asignados.',
  },
  {
    target: 'bottom-nav-profile',
    title: 'Perfil',
    description: 'Revisa tus datos, asignaciones y opciones generales de la app.',
  },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function GuidedTutorial({ onFinish }: GuidedTutorialProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null)
  const currentStep = tutorialSteps[stepIndex]
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === tutorialSteps.length - 1

  function goToStep(nextStepIndex: number) {
    setSpotlight(null)
    setStepIndex(clamp(nextStepIndex, 0, tutorialSteps.length - 1))
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>(`[data-tutorial="${currentStep.target}"]`)
      const frame = document.querySelector<HTMLElement>('.phone-frame')

      if (!target || !frame) return

      const targetRect = target.getBoundingClientRect()
      const frameRect = frame.getBoundingClientRect()
      const padding = 8

      setSpotlight({
        top: targetRect.top - frameRect.top - padding,
        left: targetRect.left - frameRect.left - padding,
        width: targetRect.width + padding * 2,
        height: targetRect.height + padding * 2,
      })
    }, 80)

    return () => window.clearTimeout(timeout)
  }, [currentStep.target, stepIndex])

  const cardStyle = useMemo(() => {
    if (!spotlight) return undefined

    const frame = document.querySelector<HTMLElement>('.phone-frame')
    const frameHeight = frame?.clientHeight ?? 760
    const cardHeight = 250
    const bottom = clamp(frameHeight - spotlight.top + 58, 140, frameHeight - cardHeight)

    return {
      bottom,
      left: 16,
      right: 16,
    }
  }, [spotlight])

  const connector = useMemo<ConnectorPath | null>(() => {
    if (!spotlight || !cardStyle) return null

    const frame = document.querySelector<HTMLElement>('.phone-frame')
    const frameHeight = frame?.clientHeight ?? 760
    const frameWidth = frame?.clientWidth ?? 390
    const cardBottom = frameHeight - Number(cardStyle.bottom)
    const targetCenterX = spotlight.left + spotlight.width / 2
    const targetTopY = spotlight.top + spotlight.height * 0.18
    const centerX = frameWidth / 2
    const startX = clamp(centerX + (targetCenterX - centerX) * 0.18, 70, frameWidth - 70)
    const startY = cardBottom + 6
    const endX = targetCenterX
    const endY = targetTopY
    const fall = Math.max(54, endY - startY)
    const drift = endX - startX
    const controlOneX = startX - drift * 0.08
    const controlOneY = startY + fall * 0.34
    const controlTwoX = endX - drift * 0.42
    const controlTwoY = endY - fall * 0.22

    return {
      path: `M ${startX} ${startY} C ${controlOneX} ${controlOneY}, ${controlTwoX} ${controlTwoY}, ${endX} ${endY}`,
      endX,
      endY,
      sparkPath: `M ${endX} ${endY - 7} L ${endX + 3} ${endY - 2} L ${endX + 9} ${endY} L ${endX + 3} ${endY + 2} L ${endX} ${endY + 8} L ${endX - 3} ${endY + 2} L ${endX - 9} ${endY} L ${endX - 3} ${endY - 2} Z`,
    }
  }, [cardStyle, spotlight])

  const overlay = (
    <div className="tutorial-overlay contextual menu-only" role="dialog" aria-modal="true" aria-labelledby="tutorial-title">
      {spotlight ? (
        <div
          className="tutorial-highlight bottom-nav-target"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
          }}
        />
      ) : null}
      {connector ? (
        <svg className="tutorial-connector" aria-hidden="true">
          <defs>
            <linearGradient id="tutorial-trail-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="42%" stopColor="#dff7ff" stopOpacity="0.38" />
              <stop offset="78%" stopColor="#9ee8ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path className="trail-aura" d={connector.path} />
          <path className="trail-core" d={connector.path} />
          <path className="trail-spark" d={connector.sparkPath} />
          <circle className="trail-point" cx={connector.endX} cy={connector.endY} r="3.5" />
        </svg>
      ) : null}
      <section className="tutorial-card" style={cardStyle}>
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
          <button
            type="button"
            className="secondary-action"
            onClick={() => goToStep(stepIndex - 1)}
            disabled={isFirstStep}
          >
            Anterior
          </button>
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

              goToStep(stepIndex + 1)
            }}
          >
            {isLastStep ? 'Comenzar' : 'Siguiente'}
          </button>
        </div>
      </section>
    </div>
  )

  const frame = document.querySelector('.phone-frame')

  return frame ? createPortal(overlay, frame) : overlay
}
