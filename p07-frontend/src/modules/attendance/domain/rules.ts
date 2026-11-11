import { MIN_CALL_MINUTES, MAX_CALL_MINUTES, CODE_BYTE_LENGTH, MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE, MILLISECONDS_PER_MINUTE } from './constants'

import type { Call } from './types'
import { demoClasses } from '../demoData'

export function openCall(calls: Call[], classId: string, minutes: number): Call[] {
  if (!Number.isInteger(minutes) || minutes < MIN_CALL_MINUTES || minutes > MAX_CALL_MINUTES) throw new Error('Informe uma duração de 1 a 120 minutos.')
  if (calls.some(call => call.classId === classId && !call.closedAt)) throw new Error('Encerre a chamada anterior antes de abrir outra para esta turma.')
  const now = Date.now()
  let code: string
  do {
    code = Array.from(crypto.getRandomValues(new Uint8Array(CODE_BYTE_LENGTH)), byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase()
  } while (calls.some(call => call.code === code))
  return [{ id: crypto.randomUUID(), classId, code, openedAt: now, expiresAt: now + minutes * MILLISECONDS_PER_MINUTE, records: {} }, ...calls]
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
  const seconds = Math.max(0, Math.ceil((expiresAt - now) / MILLISECONDS_PER_SECOND))
  return [Math.floor(seconds / SECONDS_PER_MINUTE), seconds % SECONDS_PER_MINUTE].map(part => String(part).padStart(2, '0')).join(':')
}
