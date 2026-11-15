import type { Class } from './domain/types'

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

