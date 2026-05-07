import { AttendanceChips } from './AttendanceChips'
import type { AttendanceStatus, Learner } from '../types'

interface LearnerRowProps {
  learner: Learner
  status: AttendanceStatus
  onChange: (status: AttendanceStatus) => void
}

export function LearnerRow({ learner, status, onChange }: LearnerRowProps) {
  return (
    <article className="learner-row">
      <div>
        <strong>{learner.name}</strong>
        <span>{learner.documentType} {learner.documentNumber}</span>
      </div>
      <AttendanceChips value={status} onChange={onChange} />
    </article>
  )
}
