import { useState, type FormEvent } from 'react'
import type { FichaNovelty, TrainingGroup } from '../types'

interface FichaNoveltyFormProps {
  group: TrainingGroup
  onCancel: () => void
  onSave: (novelty: FichaNovelty) => void
}

const noveltyTypes = [
  'Inasistencia masiva',
  'Cambio de ambiente',
  'Incidencia academica',
  'Observacion disciplinaria',
  'Otro',
]

export function FichaNoveltyForm({ group, onCancel, onSave }: FichaNoveltyFormProps) {
  const today = new Date().toISOString().slice(0, 10)
  const [type, setType] = useState(noveltyTypes[0])
  const [observation, setObservation] = useState('')
  const [date, setDate] = useState(today)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave({
      id: `nov-${group.id}-${Date.now()}`,
      groupId: group.id,
      type,
      observation: observation.trim(),
      date,
      savedAt: new Date().toISOString(),
    })
    setObservation('')
  }

  return (
    <section className="novelty-panel" aria-label="Registrar novedad">
      <div className="list-header">
        <h2>Registrar novedad</h2>
        <span>Ficha {group.number}</span>
      </div>
      <form className="novelty-form" onSubmit={handleSubmit}>
        <label>
          Tipo de novedad
          <select value={type} onChange={(event) => setType(event.target.value)}>
            {noveltyTypes.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Observacion
          <input
            value={observation}
            onChange={(event) => setObservation(event.target.value)}
            placeholder="Describe la novedad"
            required
          />
        </label>
        <label>
          Fecha
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <div className="form-actions">
          <button type="button" className="secondary-action" onClick={onCancel}>
            Cancelar
          </button>
          <button type="submit" className="primary">
            Guardar novedad
          </button>
        </div>
      </form>
    </section>
  )
}
