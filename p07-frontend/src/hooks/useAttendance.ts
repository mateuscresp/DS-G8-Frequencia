import { useEffect, useRef, useState } from 'react'
import { demoStudent, openCall, readCalls, register, storageKey, updateCalls, type Call, type Status } from '../attendance'
import { demo, loadCalls, createCall, submitPresence, closeCall, correctPresence } from '../integration'
import { useSession } from '../app/session'
import type { Notice } from '../components/ui/Feedback'
export function useAttendance() {
  const { session } = useSession()
  const [calls, setCalls] = useState<Call[]>(() => demo ? readCalls() : [])
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<Notice>()
  const running = useRef(false)
  const revision = useRef(0)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    if (demo) {
      const sync = (event: StorageEvent) => { if (event.key === storageKey || event.key === null) setCalls(readCalls()) }
      window.addEventListener('storage', sync)
      return () => { mounted.current = false; window.removeEventListener('storage', sync) }
    }
    const controller = new AbortController()
    let fetching = false
    setCalls([])
    async function refresh() {
      if (running.current || fetching) return
      fetching = true
      const version = revision.current
      try {
        const list = await loadCalls(controller.signal)
        if (!controller.signal.aborted && version === revision.current) setCalls(list)
      } catch (error) {
        if (!controller.signal.aborted && version === revision.current) setNotice({ kind: 'error', text: error instanceof Error ? error.message : 'Não foi possível atualizar as chamadas.' })
      } finally { fetching = false }
    }
    void refresh()
    const timer = window.setInterval(() => void refresh(), 5000)
    return () => { mounted.current = false; controller.abort(); window.clearInterval(timer) }
  }, [session.subject, session.role])

  async function mutate(change: (previous: Call[]) => Call[], pick: (list: Call[]) => Call | undefined, remote: () => Promise<Call>, message: string) {
    if (running.current) return
    running.current = true; revision.current++; setBusy(true); setNotice(undefined)
    try {
      let result: Call | undefined
      if (demo) {
        const list = await updateCalls(change)
        result = pick(list)
        if (mounted.current) setCalls(list)
      } else {
        result = await remote()
        const updated = result
        if (mounted.current) setCalls(list => [updated, ...list.filter(call => call.id !== updated.id)].sort((a,b) => b.openedAt - a.openedAt))
      }
      if (mounted.current) setNotice({ kind: 'success', text: message })
      return result
    } catch (error) {
      if (mounted.current) setNotice({ kind: 'error', text: error instanceof Error ? error.message : 'Não foi possível salvar.' })
    } finally { running.current = false; if (mounted.current) setBusy(false) }
  }
  const startCall = (classId: string, minutes: number) => mutate(list => openCall(list,classId,minutes), list => list[0], () => createCall(classId,minutes), 'Chamada aberta.')
  const registerPresence = (code: string) => mutate(list => register(list,code,demoStudent.id), list => list.find(call => call.code === code), () => submitPresence(code), 'Presença registrada com sucesso.')
  const finishCall = (id: string) => mutate(list => list.map(call => call.id === id && !call.closedAt ? { ...call, closedAt: Date.now() } : call), list => list.find(call => call.id === id), () => closeCall(id), 'Chamada encerrada. Os registros podem ser corrigidos na lista.')
  const correctAttendance = (id: string, studentId: string, status: Status) => mutate(list => list.map(call => call.id === id ? { ...call, records: { ...call.records, [studentId]: status } } : call), list => list.find(call => call.id === id), () => correctPresence(id,studentId,status), 'Presença atualizada.')
  return { calls, busy, notice, setNotice, startCall, registerPresence, finishCall, correctAttendance }
}
