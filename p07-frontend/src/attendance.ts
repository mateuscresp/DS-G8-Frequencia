// Fachada pública: preserva os imports existentes durante a modularização.
export type { Status, Student, Class, Call } from './modules/attendance/domain/types'
export { demoStudent, demoClasses } from './modules/attendance/demoData'
export { openCall, register, timeLeft } from './modules/attendance/domain/rules'
export { storageKey, readCalls, updateCalls } from './modules/attendance/storage'
