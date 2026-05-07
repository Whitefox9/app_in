import { AttendanceStatusBadge } from './AttendanceStatusBadge'
import type { AttendanceRecord, Learner, TrainingGroup } from '../types'
import { attendanceLabels } from '../utils/attendance'
import { shortDate } from '../utils/format'

interface RecentAttendanceListProps {
  learner: Learner
  group: TrainingGroup
  records: AttendanceRecord[]
}

export function RecentAttendanceList({ learner, group, records }: RecentAttendanceListProps) {
  const recentRecords = records
    .filter((record) => record.groupId === group.id && record.statuses[learner.id])
    .sort((left, right) => right.date.localeCompare(left.date))
    .slice(0, 5)

  if (recentRecords.length === 0) {
    return (
      <div className="empty-state">
        <strong>Sin registros</strong>
        <span>Aun no hay registros de asistencia para este aprendiz.</span>
      </div>
    )
  }

  return (
    <div className="recent-attendance-list">
      {recentRecords.map((record) => {
        const status = record.statuses[learner.id]

        return (
          <article key={record.id} className="recent-attendance-row">
            <div>
              <strong>{shortDate(record.date)}</strong>
              <span>{attendanceLabels[status]}</span>
            </div>
            <AttendanceStatusBadge status={status} />
          </article>
        )
      })}
    </div>
  )
}
