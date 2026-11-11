import { useEffect, useState } from 'react'
import { readCalls, storageKey, updateCalls, type Call } from '../attendance'
import { demo } from '../integration'
import type { Notice } from '../components/ui/Feedback'
export function useAttendance() {
 const [calls, setCalls] = useState<Call[]>(() => demo ? readCalls() : [])
 const [busy, setBusy] = useState(false)
 const [notice, setNotice] = useState<Notice>()
 useEffect(() => {
  if (!demo) return
  const sync = (event: StorageEvent) => { if (event.key === storageKey || event.key === null) setCalls(readCalls()) }
  window.addEventListener('storage', sync)
  return () => window.removeEventListener('storage', sync)
 }, [])
 async function changeCalls(change: (previous: Call[]) => Call[], message: string) {
  setBusy(true); setNotice(undefined)
  try { setCalls(await updateCalls(change)); setNotice({ kind: 'success', text: message }); return true }
  catch (error) { setNotice({ kind: 'error', text: error instanceof Error ? error.message : 'Não foi possível salvar.' }); return false }
  finally { setBusy(false) }
 }
 return { calls, busy, notice, setNotice, changeCalls }
}
