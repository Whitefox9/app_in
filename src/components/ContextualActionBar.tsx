import { createPortal } from 'react-dom'

interface ContextualAction {
  label: string
  onClick: () => void
  disabled?: boolean
}

interface ContextualActionBarProps {
  secondary: ContextualAction
  primary?: ContextualAction
}

export function ContextualActionBar({ secondary, primary }: ContextualActionBarProps) {
  const root = document.getElementById('contextual-action-root')
  const bar = (
    <div className="contextual-action-bar" role="navigation" aria-label="Acciones contextuales">
      <button type="button" className="secondary-action contextual-action-secondary" onClick={secondary.onClick}>
        {secondary.label}
      </button>
      {primary ? (
        <button
          type="button"
          className="primary contextual-action-primary"
          onClick={primary.onClick}
          disabled={primary.disabled}
          data-tutorial={primary.label.toLowerCase().includes('copiar') ? 'copy-report-action' : undefined}
          data-guide={
            primary.label.toLowerCase().includes('copiar')
              ? 'guide-copy-report-action'
              : primary.label.toLowerCase().includes('guardar asistencia')
                ? 'guide-save-attendance-action'
                : undefined
          }
        >
          {primary.label}
        </button>
      ) : (
        <span aria-hidden="true" />
      )}
    </div>
  )

  return root ? createPortal(bar, root) : null
}
