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

export const demoStudent = { id: 'kauan', name: 'Kauan Gabriel', number: '20260101' }
export const demoClasses: Class[] = [
  { id: 'ds', name: 'Desenvolvimento de Software', code: 'IF1001', semester: '2026.2', teacher: 'Prof. Rafael Costa',
    students: [demoStudent, { id: 'ana', name: 'Ana Silva', number: '20260102' }, { id: 'bruno', name: 'Bruno Lima', number: '20260103' }, { id: 'carla', name: 'Carla Souza', number: '20260104' }],
    next: { day: 'Segunda-feira', time: '10h às 12h', room: 'Sala D002' } },
  { id: 'bd', name: 'Banco de Dados', code: 'IF1002', semester: '2026.2', teacher: 'Prof. Rafael Costa',
    students: [demoStudent, { id: 'carla', name: 'Carla Souza', number: '20260104' }],
    next: { day: 'Quarta-feira', time: '14h às 16h', room: 'Sala E103' } },
  { id: 'es', name: 'Engenharia de Software', code: 'IF1003', semester: '2026.2', teacher: 'Prof. Rafael Costa',
    students: [{ id: 'ana', name: 'Ana Silva', number: '20260102' }] },
]

export const storageKey = 'frequencia-ufpe:demo:v1'

export function readCalls(): Call[] {
  const stored = localStorage.getItem(storageKey)
  return stored ? JSON.parse(stored) : []
}

export function updateCalls(change: (calls: Call[]) => Call[]) {
  const save = () => {
    const calls = change(readCalls())
    localStorage.setItem(storageKey, JSON.stringify(calls))
    return calls
  }
  return navigator.locks ? navigator.locks.request(storageKey, save) : Promise.resolve().then(save)
}

export function openCall(calls: Call[], classId: string, minutes: number): Call[] {
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 120) throw new Error('Informe uma duração de 1 a 120 minutos.')
  if (calls.some(call => call.classId === classId && !call.closedAt)) throw new Error('Encerre a chamada anterior antes de abrir outra para esta turma.')
  const now = Date.now()
  let code: string
  do {
    code = Array.from(crypto.getRandomValues(new Uint8Array(3)), byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase()
  } while (calls.some(call => call.code === code))
  return [{ id: crypto.randomUUID(), classId, code, openedAt: now, expiresAt: now + minutes * 60_000, records: {} }, ...calls]
}

export function register(calls: Call[], code: string, studentId: string): Call[] {
  const call = calls.find(item => item.code === code)
  if (!call) throw new Error('Código inválido. Confira o código exibido pelo professor.')
  if (call.closedAt) throw new Error('Esta chamada já foi encerrada.')
  if (call.expiresAt <= Date.now()) throw new Error('O código expirou. Solicite um novo código ao professor.')
  if (!demoClasses.find(group => group.id === call.classId)?.students?.some(student => student.id === studentId)) {
    throw new Error('Você não está matriculado na turma deste código.')
  }
  if (call.records[studentId] === 'presente') throw new Error('Sua presença já foi registrada nesta chamada.')
  if (call.records[studentId] === 'ausente') throw new Error('Sua situação foi ajustada pelo professor. Fale com ele para corrigir o registro.')
  return calls.map(item => item.id === call.id ? { ...item, records: { ...item.records, [studentId]: 'presente' } } : item)
}

export function timeLeft(expiresAt: number, now: number) {
  const seconds = Math.max(0, Math.ceil((expiresAt - now) / 1000))
  return [Math.floor(seconds / 60), seconds % 60].map(part => String(part).padStart(2, '0')).join(':')
}
