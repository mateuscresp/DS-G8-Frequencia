import { afterEach, expect, it, vi } from 'vitest'
import { openCall, readCalls, updateCalls, storageKey, type Call } from '../../src/attendance'

const NOW = Date.UTC(2026, 10, 11, 12)
const saved: Call = { id: 'old', classId: 'bd', code: 'ABC123', openedAt: NOW, expiresAt: NOW + 60000, records: {} }
afterEach(() => vi.unstubAllGlobals())

// CT07 / US01-CA3: partição colisão. Oráculo: nunca reutilizar código do histórico.
it('CT07 sorteia outro código quando o primeiro já existe', () => {
  const getRandomValues = vi.fn()
    .mockImplementationOnce((bytes: Uint8Array) => { bytes.set([0xab, 0xc1, 0x23]); return bytes })
    .mockImplementationOnce((bytes: Uint8Array) => { bytes.set([0x00, 0x01, 0x02]); return bytes })
  vi.stubGlobal('crypto', { getRandomValues, randomUUID: () => 'new-id' })
  const result = openCall([saved], 'ds', 5)
  expect(result[0].code).toBe('000102')
  expect(result[1]).toEqual(saved)
  expect(getRandomValues).toHaveBeenCalledTimes(2)
})

// CT29 / US05-CA2: branch sem navigator.locks; preservar transformação e chave.
it('CT29 persiste também sem Web Locks', async () => {
  const setItem = vi.fn()
  vi.stubGlobal('navigator', {})
  vi.stubGlobal('localStorage', { getItem: () => JSON.stringify([saved]), setItem })
  const result = await updateCalls(previous => previous.map(call => ({ ...call, closedAt: NOW + 1 })))
  expect(result).toEqual([{ ...saved, closedAt: NOW + 1 }])
  expect(setItem).toHaveBeenCalledWith(storageKey, JSON.stringify(result))
})

// CT30 / US05-CA3: partição JSON corrompido. Caracterização da propagação atual.
it('CT30 propaga erro de JSON inválido', () => {
  vi.stubGlobal('localStorage', { getItem: () => '{invalid' })
  expect(() => readCalls()).toThrow(SyntaxError)
})

// CT31 / US05-CA3: erro de domínio não pode apagar registros; caminhos lock e fallback.
it.each([false, true])('CT31 não grava quando a transformação falha (lock=%s)', withLock => {
  const setItem = vi.fn()
  vi.stubGlobal('localStorage', { getItem: () => JSON.stringify([saved]), setItem })
  vi.stubGlobal('navigator', withLock ? { locks: { request: async (_: string, action: () => Call[]) => action() } } : {})
  const error = new Error('Falha de domínio')
  return expect(updateCalls(() => { throw error })).rejects.toBe(error).then(() => {
    expect(setItem).not.toHaveBeenCalled()
    expect(readCalls()).toEqual([saved])
  })
})

// CT32 / US05-CA3: falha de cota, sem mensagem falsa de sucesso.
it('CT32 propaga falha de gravação', async () => {
  const error = new Error('QuotaExceededError')
  vi.stubGlobal('navigator', {})
  vi.stubGlobal('localStorage', { getItem: () => '[]', setItem: () => { throw error } })
  await expect(updateCalls(() => [saved])).rejects.toBe(error)
})
