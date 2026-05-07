import type { AttendanceStatus } from '../types'

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus
  size?: 'mini' | 'regular'
}

export function AttendanceStatusBadge({ status, size = 'regular' }: AttendanceStatusBadgeProps) {
  return <span className={`attendance-status-badge ${size} status-${status}`}>{status}</span>
}
