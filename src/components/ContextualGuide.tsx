import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ContextualGuideDefinition } from './contextualGuideData'

interface SpotlightRect {
  top: number
  left: number
  width: number
  height: number
  bottom: number
}

interface ContextualGuideProps {
  guide: ContextualGuideDefinition
  onFinish: () => void
}

interface ModuleGuidePromptProps {
  moduleName: string
  onAccept: () => void
  onSkip: () => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function ModuleGuidePrompt({ moduleName, onAccept, onSkip }: ModuleGuidePromptProps) {
  const prompt = (
    <div className="tutorial-overlay modal module-guide-prompt" role="dialog" aria-modal="true" aria-labelledby="guide-prompt-title">
      <section className="tutorial-card module-guide-card">
        <span className="tutorial-progress">Guía opcional</span>
        <div className="tutorial-step-mark" aria-hidden="true">?</div>
        <h2 id="guide-prompt-title">¿Quieres ver una guía rápida de este módulo?</h2>
        <p>Te mostraremos las acciones principales de {moduleName} en pocos pasos.</p>
        <div className="module-guide-prompt-actions">
          <button type="button" className="secondary-action" onClick={onSkip}>
            Omitir
          </button>
          <button type="button" className="primary" onClick={onAccept}>
            Ver guía
          </button>
        </div>
      </section>
    </div>
  )

  const frame = document.querySelector('.phone-frame')

  return frame ? createPortal(prompt, frame) : prompt
}

export function ContextualGuide({ guide, onFinish }: ContextualGuideProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null)
  const currentStep = guide.steps[stepIndex]
  const isFirstStep = stepIndex === 0
  const isLastStep = stepIndex === guide.steps.length - 1

  function goToStep(nextStepIndex: number) {
    setSpotlight(null)
    setStepIndex(clamp(nextStepIndex, 0, guide.steps.length - 1))
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>(`[data-guide="${currentStep.target}"]`)
      const frame = document.querySelector<HTMLElement>('.phone-frame')

      if (!target || !frame) return

      target.scrollIntoView({ block: 'center', inline: 'nearest' })

      window.setTimeout(() => {
        const targetRect = target.getBoundingClientRect()
        const frameRect = frame.getBoundingClientRect()
        const padding = 7

        setSpotlight({
          top: targetRect.top - frameRect.top - padding,
          left: targetRect.left - frameRect.left - padding,
          width: targetRect.width + padding * 2,
          height: targetRect.height + padding * 2,
          bottom: targetRect.bottom - frameRect.top + padding,
        })
      }, 120)
    }, 120)

    return () => window.clearTimeout(timeout)
  }, [currentStep.target, stepIndex])

  const cardStyle = useMemo(() => {
    if (!spotlight) return undefined

    const frame = document.querySelector<HTMLElement>('.phone-frame')
    const frameHeight = frame?.clientHeight ?? 760
    const estimatedCardHeight = 245
    const top =
      spotlight.top < frameHeight / 2
        ? clamp(spotlight.bottom + 14, 16, frameHeight - estimatedCardHeight)
        : clamp(spotlight.top - estimatedCardHeight - 14, 16, frameHeight - estimatedCardHeight)

    return {
      top,
      left: 16,
      right: 16,
    }
  }, [spotlight])

  const overlay = (
    <div className={spotlight ? 'tutorial-overlay contextual module-guide' : 'tutorial-overlay modal module-guide'} role="dialog" aria-modal="true" aria-labelledby="context-guide-title">
      {spotlight ? (
        <div
          className="tutorial-highlight module-guide-highlight"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
          }}
        />
      ) : null}
      <section className="tutorial-card" style={cardStyle}>
        <span className="tutorial-progress">
          {stepIndex + 1} de {guide.steps.length}
        </span>
        <div className="tutorial-step-mark" aria-hidden="true">
          {stepIndex + 1}
        </div>
        <h2 id="context-guide-title">{currentStep.title}</h2>
        <p>{currentStep.description}</p>
        <div className="tutorial-dots" aria-hidden="true">
          {guide.steps.map((step) => (
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
            {isLastStep ? 'Finalizar' : 'Siguiente'}
          </button>
        </div>
      </section>
    </div>
  )

  const frame = document.querySelector('.phone-frame')

  return frame ? createPortal(overlay, frame) : overlay
}
