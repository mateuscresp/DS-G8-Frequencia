import { useEffect, useState, type FormEvent } from 'react'
import { demoClasses } from '../attendance'
import type { Status, Student } from '../attendance'
import { demo, loadStudents } from '../integration'
import { useClasses } from '../hooks/useClasses'
import { useSession } from '../app/session'
import { useAttendance } from '../hooks/useAttendance'
import AdminOverview from './AdminOverview'
import TeacherCallCard from '../modules/attendance/components/TeacherCallCard'
import AttendanceRoster from '../modules/attendance/components/AttendanceRoster'
import TokenProjection from '../modules/attendance/components/TokenProjection'
import ClassList from '../modules/classes/components/ClassList'
export default function TeacherDashboard({ search }: { search: string }) {
  const { session: currentSession } = useSession()
  const session = demo ? undefined : currentSession
  const role = currentSession.role
  const { calls, busy, notice, setNotice, startCall, finishCall, correctAttendance } = useAttendance()
  const { classes, loading: loadingClasses, error: classError, reload: reloadClasses } = useClasses()
  const [remoteRoster, setRemoteRoster] = useState<{ classId: string; students: Student[] }>()
  const [loadingRoster, setLoadingRoster] = useState(false)
  const [reload, setReload] = useState(0)
  const [selected, setSelected] = useState(demoClasses[0].id)
  const [history, setHistory] = useState('')
  const [minutes, setMinutes] = useState('5')
  const [now, setNow] = useState(Date.now)
  const [rosterError, setRosterError] = useState('')
  const admin = role === 'admin'
  const group = classes.find(item => item.id === selected) ?? classes[0]
  const classId = group?.id
  const classCalls = calls.filter(call => call.classId === classId)
  const active = classCalls.find(call => !call.closedAt)
  const displayed = classCalls.find(call => call.id === history) ?? active ?? classCalls[0]
  const students = group?.students ?? (remoteRoster?.classId === classId ? remoteRoster?.students : undefined) ?? []
  const [projection, setProjection] = useState(false)

  useEffect(() => {
    if (!active) return
    const timer = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(timer)
  }, [active])

  useEffect(() => {
    if (!session || !classId) return
    const controller = new AbortController()
    setLoadingRoster(true)
    setRosterError('')
    loadStudents(classId, controller.signal)
      .then(list => { if (!controller.signal.aborted) setRemoteRoster({ classId, students: list }) })
      .catch((error: Error) => { if (!controller.signal.aborted) setRosterError(error.message) })
      .finally(() => { if (!controller.signal.aborted) setLoadingRoster(false) })
    return () => controller.abort()
  }, [session, classId, reload])

  function chooseClass(id: string) {
    setSelected(id)
    setHistory('')
    setNotice(undefined)
  }

  async function start(event: FormEvent) {
    event.preventDefault()
    if (classId && await startCall(classId, Number(minutes))) setHistory('')
  }

  function correct(id: string, status: Status) {
    if (!displayed) return
    void correctAttendance(displayed.id, id, status)
  }

  async function close() {
    if (!active) return
    if (await finishCall(active.id)) setProjection(false)
  }


 return <>
  {admin && demo && <AdminOverview classes={classes} calls={calls} />}
  <TeacherCallCard {...{ classes, classId, group, minutes, setMinutes, active, now, busy, notice, start, chooseClass, close, setProjection }} />
  <div className="columns">
   <AttendanceRoster {...{ group, students, displayed, classCalls, busy, rosterError, loadingRoster, correct }} onHistory={id => { setHistory(id); setNotice(undefined) }} />
   <ClassList classes={classes} search={search} title={admin ? 'Todas as turmas' : 'Minhas turmas'} selected={classId} onSelect={chooseClass} loading={loadingClasses} error={classError || rosterError} onRetry={() => { reloadClasses(); setReload(value => value + 1) }} />
  </div>
  {projection && active && <TokenProjection call={active} name={group?.name} now={now} onClose={() => setProjection(false)} />}
 </>
}
