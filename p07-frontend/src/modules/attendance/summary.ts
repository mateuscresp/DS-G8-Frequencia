import type { Call } from '../../attendance'
export function attendanceSummary(calls: Call[], studentId: string) {
 const finished = calls.filter(call => call.closedAt)
 const present = finished.filter(call => call.records[studentId] === 'presente').length
 return { total: finished.length, present, absent: finished.length - present, percentage: finished.length ? Math.round(present / finished.length * 100) : null }
}
