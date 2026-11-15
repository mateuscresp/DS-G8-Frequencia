import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { openCall, register, timeLeft, readCalls, updateCalls, storageKey, type Call } from '../../src/attendance'
import { attendanceSummary } from '../../src/modules/attendance/summary'

const NOW = Date.UTC(2026, 10, 11, 12)
const call = (overrides: Partial<Call> = {}): Call => ({
  id: 'call-1', classId: 'ds', code: 'ABC123', openedAt: NOW - 1000,
  expiresAt: NOW + 60000, records: {}, ...overrides,
})

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals() })

describe('US01 — abrir chamada', () => {
  // CT01 / US01-CA1: valores-limite e partição válida.
  it.each([1, 2, 5, 119, 120])('CT01 aceita %i minutos e calcula expiração', minutes => {
    const [created] = openCall([], 'ds', minutes)
    expect(created.expiresAt).toBe(NOW + minutes * 60000)
    expect(created.openedAt).toBe(NOW)
    expect(created.classId).toBe('ds')
    expect(created.records).toEqual({})
  })
  // CT02–03 / US01-CA1: partições inválidas e fronteiras 0/121.
  it.each([0, -1, 121, 1.5, NaN, Infinity])('CT02 CT03 recusa duração %s', minutes => {
    expect(() => openCall([], 'ds', minutes)).toThrow('Informe uma duração de 1 a 120 minutos.')
  })
  // CT04 / US01-CA2: chamada aberta, mesmo após expiração.
  it.each([NOW + 60000, NOW - 1])('CT04 bloqueia segunda chamada aberta', expiresAt => {
    expect(() => openCall([call({ expiresAt })], 'ds', 5)).toThrow('Encerre a chamada anterior')
  })
  // CT05 / US01-CA2: partições encerrada e outra turma; preservação da entrada.
  it('CT05 permite reabrir e mantém chamadas anteriores', () => {
    const previous = [call({ closedAt: NOW }), call({ id: 'other', classId: 'bd', code: 'DEF456' })]
    const snapshot = structuredClone(previous)
    const result = openCall(previous, 'ds', 5)
    expect(result).toHaveLength(3)
    expect(result.slice(1)).toEqual(snapshot)
    expect(previous).toEqual(snapshot)
  })
  // CT06 / US01-CA3: contrato público do código e identidade.
  it('CT06 gera código hexadecimal de seis caracteres e ID único', () => {
    const first = openCall([], 'ds', 5)[0]
    const second = openCall([first], 'bd', 5)[0]
    expect(first.code).toMatch(/^[A-F0-9]{6}$/)
    expect(second.code).not.toBe(first.code)
    expect(first.id).toMatch(/^[0-9a-f-]{36}$/i)
    expect(second.id).not.toBe(first.id)
  })
})

describe('US02 — registrar presença', () => {
  // CT08–09 / US02-CA1: código desconhecido e chamada encerrada.
  it('CT08 rejeita código inexistente', () => {
    expect(() => register([call()], 'ZZZZZZ', 'kauan')).toThrow('Código inválido')
  })
  it('CT09 rejeita chamada encerrada', () => {
    expect(() => register([call({ closedAt: NOW })], 'ABC123', 'kauan')).toThrow('já foi encerrada')
  })
  // CT10 / US02-CA1: fronteira um milissegundo antes da expiração.
  it('CT10 aceita imediatamente antes de expirar', () => {
    expect(register([call({ expiresAt: NOW + 1 })], 'ABC123', 'kauan')[0].records.kauan).toBe('presente')
  })
  // CT11 / US02-CA1: fronteiras na expiração e um milissegundo depois.
  it.each([NOW, NOW - 1])('CT11 recusa no instante de expiração ou depois', expiresAt => {
    expect(() => register([call({ expiresAt })], 'ABC123', 'kauan')).toThrow('O código expirou')
  })
  // CT12–13 / US02-CA2: partições de matrícula.
  it('CT12 rejeita aluno não matriculado', () => {
    expect(() => register([call()], 'ABC123', 'desconhecido')).toThrow('não está matriculado')
  })
  it('CT13 aceita aluno matriculado', () => {
    expect(register([call()], 'ABC123', 'kauan')[0].records).toEqual({ kauan: 'presente' })
  })
  // CT14–15 / US02-CA3: estados já presente e ausência corrigida pelo professor.
  it('CT14 rejeita presença duplicada', () => {
    expect(() => register([call({ records: { kauan: 'presente' } })], 'ABC123', 'kauan')).toThrow('já foi registrada')
  })
  it('CT15 preserva ausência manual', () => {
    const original = call({ records: { kauan: 'ausente' } })
    expect(() => register([original], 'ABC123', 'kauan')).toThrow('ajustada pelo professor')
    expect(original.records.kauan).toBe('ausente')
  })
  // CT16 / US02-CA4: isolamento e imutabilidade.
  it('CT16 altera só o aluno da chamada selecionada', () => {
    const original = [call({ records: { ana: 'presente' } }), call({ id: 'second', code: 'DEF456', classId: 'bd' })]
    const snapshot = structuredClone(original)
    const result = register(original, 'ABC123', 'kauan')
    expect(result[0].records).toEqual({ ana: 'presente', kauan: 'presente' })
    expect(result[1]).toEqual(snapshot[1])
    expect(original).toEqual(snapshot)
  })
})

describe('US03 — frequência', () => {
  // CT17–18 / US03-CA1: abertas não participam da frequência.
  it('CT17 ignora chamadas abertas', () => {
    expect(attendanceSummary([call({ records: { kauan: 'presente' } })], 'kauan')).toEqual({ total: 0, present: 0, absent: 0, percentage: null })
  })
  it('CT18 considera somente chamadas encerradas', () => {
    expect(attendanceSummary([call(), call({ id: 'closed', closedAt: NOW, records: { kauan: 'presente' } })], 'kauan')).toEqual({ total: 1, present: 1, absent: 0, percentage: 100 })
  })
  // CT19–22 / US03-CA2: partições presente, ausente, sem registro e arredondamento.
  it('CT19 calcula 100% para todas as presenças', () => {
    expect(attendanceSummary([call({ closedAt: NOW, records: { kauan: 'presente' } })], 'kauan')).toEqual({ total: 1, present: 1, absent: 0, percentage: 100 })
  })
  it('CT20 conta ausência explícita', () => {
    expect(attendanceSummary([call({ closedAt: NOW, records: { kauan: 'ausente' } })], 'kauan')).toEqual({ total: 1, present: 0, absent: 1, percentage: 0 })
  })
  it('CT21 conta falta em chamada encerrada sem registro', () => {
    expect(attendanceSummary([call({ closedAt: NOW })], 'kauan')).toEqual({ total: 1, present: 0, absent: 1, percentage: 0 })
  })
  it('CT22 arredonda uma presença em três aulas para 33%', () => {
    const calls = [call({ closedAt: NOW, records: { kauan: 'presente' } }), call({ id: '2', closedAt: NOW }), call({ id: '3', closedAt: NOW })]
    expect(attendanceSummary(calls, 'kauan')).toEqual({ total: 3, present: 1, absent: 2, percentage: 33 })
  })
  // CT23 / US03-CA3: conjunto vazio, sem divisão por zero.
  it('CT23 informa percentual nulo sem aulas', () => {
    expect(attendanceSummary([], 'kauan')).toEqual({ total: 0, present: 0, absent: 0, percentage: null })
  })
})

describe('US04 — tempo restante', () => {
  // CT24–25 / US04-CA1: valores dos dois lados de segundo/minuto e fim da validade.
  it.each([
    [-1, '00:00'], [0, '00:00'], [1, '00:01'], [999, '00:01'],
    [1000, '00:01'], [1001, '00:02'], [59999, '01:00'], [60000, '01:00'], [60001, '01:01'],
  ])('CT24 CT25 formata %i ms como %s', (remaining, expected) => {
    expect(timeLeft(NOW + remaining, NOW)).toBe(expected)
  })
})

describe('US05 — persistência da demonstração', () => {
  // CT26–27 / US05-CA1: chave vazia e JSON com chamada.
  it('CT26 lê lista vazia quando não há armazenamento', () => {
    vi.stubGlobal('localStorage', { getItem: vi.fn().mockReturnValue(null) })
    expect(readCalls()).toEqual([])
  })
  it('CT27 restaura chamadas persistidas', () => {
    const saved = [call()]
    const getItem = vi.fn().mockReturnValue(JSON.stringify(saved))
    vi.stubGlobal('localStorage', { getItem })
    expect(readCalls()).toEqual(saved)
    expect(getItem).toHaveBeenCalledWith(storageKey)
  })
  // CT28 / US05-CA2: atualização serializada por lock.
  it('CT28 salva atualização dentro do lock', async () => {
    let stored = JSON.stringify([call()])
    let locked = false
    vi.stubGlobal('localStorage', {
      getItem: () => { expect(locked).toBe(true); return stored },
      setItem: (_: string, value: string) => { expect(locked).toBe(true); stored = value },
    })
    const request = vi.fn(async (_: string, action: () => Call[]) => { locked = true; try { return action() } finally { locked = false } })
    vi.stubGlobal('navigator', { locks: { request } })
    const result = await updateCalls(calls => calls.map(item => ({ ...item, closedAt: NOW })))
    expect(result[0].closedAt).toBe(NOW)
    expect(JSON.parse(stored)).toEqual(result)
    expect(request).toHaveBeenCalledWith(storageKey, expect.any(Function))
  })
})
