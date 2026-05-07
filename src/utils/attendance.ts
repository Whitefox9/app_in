import type { AttendanceStatus, AttendanceSummary } from '../types'

export const attendanceLabels: Record<AttendanceStatus, string> = {
  A: 'Asistió',
  CE: 'Con excusa',
  SE: 'Sin excusa',
  T: 'Tarde',
}

export const statusOptions: AttendanceStatus[] = ['A', 'CE', 'SE', 'T']

export function summarizeAttendance(statuses: Record<string, AttendanceStatus>): AttendanceSummary {
  return Object.values(statuses).reduce<AttendanceSummary>(
    (summary, status) => {
      summary[status] += 1
      return summary
    },
    { A: 0, CE: 0, SE: 0, T: 0 },
  )
}

export function buildDefaultStatuses(
  learnerIds: string[],
  status: AttendanceStatus = 'A',
): Record<string, AttendanceStatus> {
  return learnerIds.reduce<Record<string, AttendanceStatus>>((statuses, learnerId) => {
    statuses[learnerId] = status
    return statuses
  }, {})
}
