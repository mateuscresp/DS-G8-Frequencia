// Fachada pública: preserva os imports existentes durante a modularização.
export type { Status, Student, Class, Call } from './modules/attendance/domain/types'
export { demoStudent, demoClasses } from './modules/attendance/demoData'
export { openCall, register, timeLeft } from './modules/attendance/domain/rules'
import type { Call } from './modules/attendance/domain/types'

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

