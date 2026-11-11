import { useState, type FormEvent } from 'react'
import { demoClasses, demoStudent, register } from '../attendance'
import { demo } from '../integration'
import { useAttendance } from '../hooks/useAttendance'
import StudentCheckIn from '../modules/attendance/components/StudentCheckIn'
import StudentSummary from '../modules/attendance/components/StudentSummary'
import TokenValidity from '../modules/attendance/components/TokenValidity'
import StudentHistory from '../modules/attendance/StudentHistory'
import ClassList from '../modules/classes/components/ClassList'
import NextClasses from '../modules/classes/components/NextClasses'
import QuickAccess from '../components/layout/QuickAccess'
export default function StudentDashboard({ search }: { search: string }) {
 const { calls, busy, notice, setNotice, changeCalls } = useAttendance()
 const [code, setCode] = useState('')
 const [lastCode, setLastCode] = useState('')
 const [historyClass, setHistoryClass] = useState('')
 const classes = demo ? demoClasses.filter(group => group.students?.some(student => student.id === demoStudent.id)) : []
 const ownCalls = calls.filter(call => classes.some(group => group.id === call.classId))
 const token = ownCalls.find(call => call.code === (code || lastCode))
 async function submit(event: FormEvent) {
  event.preventDefault()
  if (await changeCalls(list => register(list, code, demoStudent.id), 'Presença registrada com sucesso.')) { setLastCode(code); setCode('') }
 }
 function viewHistory(id: string) { setHistoryClass(id); document.getElementById('frequencia')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
 return <>
  <div className="student-layout">
   <div className="student-main">
    <StudentCheckIn code={code} onCode={value => { setCode(value); setLastCode(''); setNotice(undefined) }} onSubmit={submit} busy={busy} notice={notice} onPaste={() => setNotice({ kind: 'error', text: 'Digite o código manualmente.' })} />
    {demo && <StudentSummary calls={ownCalls} studentId={demoStudent.id} />}
    <ClassList classes={classes} search={search} calls={ownCalls} studentId={demoStudent.id} onViewHistory={viewHistory} />
   </div>
   <aside className="student-aside" aria-label="Informações da aula"><TokenValidity call={token} /><QuickAccess /><NextClasses classes={classes} /></aside>
  </div>
  {demo && <StudentHistory calls={calls} classes={classes} studentId={demoStudent.id} selected={historyClass} onSelect={setHistoryClass} />}
 </>
}
