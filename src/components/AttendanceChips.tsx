import type { AttendanceStatus } from '../types'
import { attendanceLabels, statusOptions } from '../utils/attendance'

interface AttendanceChipsProps {
  value: AttendanceStatus
  onChange: (status: AttendanceStatus) => void
}

export function AttendanceChips({ value, onChange }: AttendanceChipsProps) {
  return (
    <div className="attendance-chips" role="group" aria-label="Estado de asistencia">
      {statusOptions.map((status) => (
        <button
          key={status}
          type="button"
          className={value === status ? `chip status-${status} selected` : `chip status-${status}`}
          onClick={() => onChange(status)}
          title={attendanceLabels[status]}
        >
          {status}
        </button>
      ))}
    </div>
  )
}
