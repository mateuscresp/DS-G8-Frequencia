import type { Call } from './domain/types'

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

