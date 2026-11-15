import { useState, type FormEvent } from 'react'
import { demoStudent, type Call } from '../attendance'
import { demo } from '../integration'
import { useClasses } from '../hooks/useClasses'
import { useSession } from '../app/session'
import { useAttendance } from '../hooks/useAttendance'
import StudentCheckIn from '../modules/attendance/components/StudentCheckIn'
import StudentSummary from '../modules/attendance/components/StudentSummary'
import TokenValidity from '../modules/attendance/components/TokenValidity'
import StudentHistory from '../modules/attendance/StudentHistory'
import ClassList from '../modules/classes/components/ClassList'
import NextClasses from '../modules/classes/components/NextClasses'
import QuickAccess from '../components/layout/QuickAccess'
export default function StudentDashboard({ search }: { search: string }) {
 const { calls, busy, notice, setNotice, registerPresence } = useAttendance()
 const { classes, loading, error, reload } = useClasses()
 const { session } = useSession()
 const studentId = demo ? demoStudent.id : session.subject
 const [registeredCall, setRegisteredCall] = useState<Call>()
 const [code, setCode] = useState('')
 const [lastCode, setLastCode] = useState('')
 const [historyClass, setHistoryClass] = useState('')
 const ownCalls = calls.filter(call => classes.some(group => group.id === call.classId))
 const token = demo ? ownCalls.find(call => call.code === (code || lastCode)) : registeredCall && (ownCalls.find(call => call.id === registeredCall.id) ?? registeredCall)
 async function submit(event: FormEvent) {
  event.preventDefault()
  const result = await registerPresence(code)
  if (result) { setRegisteredCall(result); setLastCode(code); setCode('') }
 }
 function viewHistory(id: string) { setHistoryClass(id); document.getElementById('frequencia')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
 return <>
  <div className="student-layout">
   <div className="student-main">
    <StudentCheckIn code={code} onCode={value => { setCode(value); setLastCode(''); setRegisteredCall(undefined); setNotice(undefined) }} onSubmit={submit} busy={busy} notice={notice} onPaste={() => setNotice({ kind: 'error', text: 'Digite o código manualmente.' })} />
    <StudentSummary calls={ownCalls} studentId={studentId} />
    <ClassList loading={loading} error={error} onRetry={reload} classes={classes} search={search} calls={ownCalls} studentId={studentId} onViewHistory={viewHistory} />
   </div>
   <aside className="student-aside" aria-label="Informações da aula"><TokenValidity call={token} /><QuickAccess /><NextClasses classes={classes} /></aside>
  </div>
  <StudentHistory calls={calls} classes={classes} studentId={studentId} selected={historyClass} onSelect={setHistoryClass} />
 </>
}
