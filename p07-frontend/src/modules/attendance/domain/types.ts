export type Status = 'presente' | 'ausente'
export type Student = { id: string; name: string; number?: string }
export type Class = {
  id: string
  name: string
  code: string
  semester?: string
  teacher?: string
  students?: Student[]
  next?: { day: string; time: string; room: string }
}
export type Call = {
  id: string
  classId: string
  code: string
  openedAt: number
  expiresAt: number
  closedAt?: number
  records: Record<string, Status>
}

