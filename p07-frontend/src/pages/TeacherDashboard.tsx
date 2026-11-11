import { useEffect, useState, type FormEvent } from 'react'
import { demoClasses, openCall } from '../attendance'
import type { Class, Status, Student } from '../attendance'
import { demo, loadStudents, loadTeacherClasses } from '../integration'
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
  const { calls, busy, notice, setNotice, changeCalls } = useAttendance()
  const [remoteClasses, setRemoteClasses] = useState<Class[]>([])
  const [remoteRoster, setRemoteRoster] = useState<{ classId: string; students: Student[] }>()
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [loadingRoster, setLoadingRoster] = useState(false)
  const [reload, setReload] = useState(0)
  const [selected, setSelected] = useState(demoClasses[0].id)
  const [history, setHistory] = useState('')
  const [minutes, setMinutes] = useState('5')
  const [now, setNow] = useState(Date.now)
  const [classError, setClassError] = useState('')
  const [rosterError, setRosterError] = useState('')
  const admin = role === 'admin'
  const classes = demo ? demoClasses : remoteClasses
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
    if (session?.role !== 'professor') return
    const controller = new AbortController()
    setLoadingClasses(true)
    setClassError('')
    loadTeacherClasses(session.subject, controller.signal)
      .then(groups => { if (!controller.signal.aborted) setRemoteClasses(groups) })
      .catch((error: Error) => { if (!controller.signal.aborted) setClassError(error.message) })
      .finally(() => { if (!controller.signal.aborted) setLoadingClasses(false) })
    return () => controller.abort()
  }, [session, reload])

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
    if (classId && await changeCalls(list => openCall(list, classId, Number(minutes)), 'Chamada aberta.')) setHistory('')
  }

  function correct(id: string, status: Status) {
    if (!displayed) return
    void changeCalls(list => list.map(call => call.id === displayed.id
      ? { ...call, records: { ...call.records, [id]: status } } : call), 'Presença atualizada.')
  }

  async function close() {
    if (!active) return
    await changeCalls(list => list.map(call => call.id === active.id && !call.closedAt
      ? { ...call, closedAt: Date.now() } : call), 'Chamada encerrada. Os registros podem ser corrigidos na lista.')
    setProjection(false)
  }


 return <>
  {admin && demo && <AdminOverview classes={classes} calls={calls} />}
  <TeacherCallCard {...{ classes, classId, group, minutes, setMinutes, active, now, busy, notice, start, chooseClass, close, setProjection }} />
  <div className="columns">
   <AttendanceRoster {...{ group, students, displayed, classCalls, busy, rosterError, loadingRoster, correct }} onHistory={id => { setHistory(id); setNotice(undefined) }} />
   <ClassList classes={classes} search={search} title={admin ? 'Todas as turmas' : 'Minhas turmas'} selected={classId} onSelect={chooseClass} loading={loadingClasses} error={classError || rosterError} onRetry={() => setReload(value => value + 1)} />
  </div>
  {projection && active && <TokenProjection call={active} name={group?.name} now={now} onClose={() => setProjection(false)} />}
 </>
}
