import { useEffect, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, ChevronRight, Clock3, GraduationCap, House, Keyboard, LogOut, Maximize2, Presentation, Users, X } from 'lucide-react'
import { demoClasses, demoStudent, openCall, readCalls, register, storageKey, timeLeft, updateCalls } from '../attendance'
import type { Call, Class, Status, Student } from '../attendance'
import { demo, loadStudents, loadTeacherClasses } from '../integration'
import { useSession, roles, roleLabels, type Role } from '../app/session'
import StudentHistory from '../modules/attendance/StudentHistory'
import AdminOverview from './AdminOverview'

type Notice = { kind: 'error' | 'success'; text: string }
const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Recife' })

function CardTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return <h2 className="card-title"><span className="icon-box">{icon}</span>{children}</h2>
}

export default function Dashboard() {
  const { session: currentSession, switchRole: changeProfile, logout } = useSession()
  const session = demo ? undefined : currentSession
  const role = currentSession.role
  const navigate = useNavigate()
  const [calls, setCalls] = useState(() => demo ? readCalls() : [])
  const [remoteClasses, setRemoteClasses] = useState<Class[]>([])
  const [remoteRoster, setRemoteRoster] = useState<{ classId: string; students: Student[] }>()
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [loadingRoster, setLoadingRoster] = useState(false)
  const [reload, setReload] = useState(0)
  const [selected, setSelected] = useState(demoClasses[0].id)
  const [history, setHistory] = useState('')
  const [minutes, setMinutes] = useState('5')
  const [code, setCode] = useState('')
  const [now, setNow] = useState(Date.now)
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<Notice>()
  const [classError, setClassError] = useState('')
  const [rosterError, setRosterError] = useState('')
  const teacher = role !== 'aluno'
  const admin = role === 'admin'
  const classes = demo ? (teacher ? demoClasses : demoClasses.filter(group => group.students?.some(student => student.id === demoStudent.id))) : remoteClasses
  const group = classes.find(item => item.id === selected) ?? classes[0]
  const classId = group?.id
  const classCalls = calls.filter(call => call.classId === classId)
  const active = classCalls.find(call => !call.closedAt)
  const displayed = classCalls.find(call => call.id === history) ?? active ?? classCalls[0]
  const students = group?.students ?? (remoteRoster?.classId === classId ? remoteRoster?.students : undefined) ?? []
  const present = students.filter(student => displayed?.records[student.id] === 'presente').length
  const next = classes.find(item => item.next)
  const [projection, setProjection] = useState(false)

  useEffect(() => {
    if (!demo) return
    const sync = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) setCalls(readCalls())
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  useEffect(() => {
    if (!active || !teacher) return
    const timer = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(timer)
  }, [active, teacher])

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

  useEffect(() => {
    if (!projection || !active) return
    const dialog = document.querySelector<HTMLDialogElement>('#projection')
    dialog?.showModal()
    return () => { if (dialog?.open) dialog.close() }
  }, [projection, active?.id])

  async function changeCalls(change: (previous: Call[]) => Call[], message: string) {
    setBusy(true)
    setNotice(undefined)
    try {
      setCalls(await updateCalls(change))
      setNow(Date.now())
      setNotice({ kind: 'success', text: message })
      return true
    } catch (error) {
      setNotice({ kind: 'error', text: error instanceof Error ? error.message : 'Não foi possível salvar.' })
      return false
    } finally {
      setBusy(false)
    }
  }

  function switchRole(value: Role) {
    changeProfile?.(value)
    navigate('/' + value)
  }

  function chooseClass(id: string) {
    setSelected(id)
    setHistory('')
    setNotice(undefined)
  }

  async function start(event: FormEvent) {
    event.preventDefault()
    if (classId && await changeCalls(list => openCall(list, classId, Number(minutes)), 'Chamada aberta.')) setHistory('')
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (await changeCalls(list => register(list, code, demoStudent.id), 'Presença registrada com sucesso.')) setCode('')
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

  const name = currentSession.name
  const codeActive = !!active && active.expiresAt > now

  return <div className="shell">
    <aside className="sidebar">
      <a className="brand" href="#inicio"><span className="brand-mark"><GraduationCap /></span><span>Frequência UFPE<small>CONTROLE DE PRESENÇA</small></span></a>
      <nav aria-label="Navegação principal">
        <a href="#inicio"><House size={18} /> Início</a>
        <a href="#chamada">{teacher ? <Presentation size={18} /> : <Keyboard size={18} />}{teacher ? 'Chamada' : 'Registrar presença'}</a>
        <a href="#turmas"><BookOpen size={18} /> {admin ? 'Todas as turmas' : 'Minhas turmas'}</a>
        {!teacher && <a href="#frequencia"><CalendarDays size={18} /> Minha frequência</a>}
      </nav>
      <div className="profile"><span className="avatar">{name.slice(0, 1).toUpperCase()}</span><span>{name}<small>{admin ? 'ADMINISTRAÇÃO' : teacher ? 'CONTA DOCENTE' : 'CONTA DISCENTE'}</small></span></div>
    </aside>

    <div className="workspace">
      <header className="top"><span>Portal acadêmico <ChevronRight size={15} /> {roleLabels[role]}</span>
        {demo ? <div className="role-switch" role="group" aria-label="Perfil da demonstração">
          {roles.map(value => <button key={value} type="button" aria-pressed={role === value} onClick={() => switchRole(value)}>{roleLabels[value]}</button>)}
        </div> : <button className="secondary" onClick={() => void logout?.().catch(() => setNotice({ kind: 'error', text: 'Não foi possível sair. Tente novamente.' }))}><LogOut size={16} /> Sair</button>}
      </header>
      <main id="inicio">
        <div className="intro"><span className="eyebrow">{demo ? 'AMBIENTE DE DEMONSTRAÇÃO' : 'FREQUÊNCIA ACADÊMICA'}</span>
          <h1>Olá, {name}!</h1>
          <p>{admin ? 'Acompanhe as turmas, alunos e chamadas do sistema.' : teacher ? 'Gerencie as chamadas e acompanhe os alunos das suas turmas.' : 'Digite o código da aula para registrar sua presença.'}</p>
        </div>

        {admin && demo && <AdminOverview classes={classes} calls={calls} />}
        {teacher ? <>
          <section className="card call" id="chamada">
            <CardTitle icon={<Presentation size={21} />}>Chamada por código</CardTitle>
            <p className="muted">Abra a chamada e mostre o código à turma durante a aula.</p>
            {demo ? <>
              <form className="form-row" onSubmit={start}>
                <label>Turma<select value={classId ?? ''} onChange={event => chooseClass(event.target.value)}>
                  {classes.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                </select></label>
                <label className="duration">Validade (min)<input type="number" min="1" max="120" required value={minutes} onChange={event => setMinutes(event.target.value)} disabled={!!active} /></label>
                <button className="primary" disabled={!!active || busy || !group}>Gerar código <ArrowRight size={17} /></button>
              </form>
              {active && <div className="token">
                <div><small>{codeActive ? 'CÓDIGO DA TURMA' : 'CÓDIGO EXPIRADO'}</small><strong>{active.code}</strong></div>
                <div className="countdown"><Clock3 size={18} /> {timeLeft(active.expiresAt, now)}</div>
                <button type="button" className="secondary" onClick={() => setProjection(true)} disabled={!codeActive}><Maximize2 size={16} /> Projetar</button>
                <button type="button" className="danger" disabled={busy} onClick={() => void close()}>Encerrar chamada</button>
              </div>}
            </> : <p className="info">A abertura de chamadas e o registro de presença dependem das rotas em desenvolvimento na API.</p>}
            {notice && <p className={'notice ' + notice.kind} role={notice.kind === 'error' ? 'alert' : 'status'}>{notice.text}</p>}
          </section>

          <div className="columns">
            <section className="card" aria-labelledby="roster">
              <h2 className="card-title" id="roster"><span className="icon-box"><Users size={21} /></span>Alunos da turma</h2>
              {group && <p className="muted">{group.name}{displayed ? ' · ' + present + ' de ' + students.length + ' presentes' : ''}</p>}
              {classCalls.length > 0 && <label className="history">Chamada<select aria-label="Chamada" value={displayed?.id ?? ''} onChange={event => { setHistory(event.target.value); setNotice(undefined) }}>
                {classCalls.map(call => <option key={call.id} value={call.id}>{dateTime.format(call.openedAt)} · {call.closedAt ? 'Encerrada' : 'Aberta'} · {call.code}</option>)}
              </select></label>}
              {rosterError && <p role="alert" className="notice error">{rosterError}</p>}
              {loadingRoster ? <p role="status">Carregando alunos…</p> : students.length ? <div className="table-wrap"><table>
                <thead><tr><th scope="col">Aluno</th>{demo && <th scope="col">Presença</th>}</tr></thead>
                <tbody>{students.map(student => {
                  const status = displayed?.records[student.id]
                  return <tr key={student.id}><th scope="row">{student.name}{student.number && <small>{student.number}</small>}</th>
                    {demo && <td>{displayed ? <select className={'status ' + (status ?? '')} aria-label={'Presença de ' + student.name} value={status ?? (displayed.closedAt ? 'ausente' : '')} disabled={busy}
                      onChange={event => correct(student.id, event.target.value as Status)}>
                      <option value="" disabled>{displayed.closedAt ? 'Ausente' : 'Pendente'}</option><option value="presente">Presente</option><option value="ausente">Ausente</option>
                    </select> : '—'}</td>}
                  </tr>
                })}</tbody>
              </table></div> : !rosterError && <p className="muted">{group ? 'Nenhum aluno nesta turma.' : 'Selecione uma turma para consultar os alunos.'}</p>}
            </section>
            <section className="card" id="turmas">
              <CardTitle icon={<BookOpen size={21} />}>{admin ? 'Todas as turmas' : 'Minhas turmas'}</CardTitle>
              {classError || rosterError ? <button className="secondary" onClick={() => setReload(value => value + 1)}>Tentar novamente</button> : null}
              {classError && <p className="notice error" role="alert">{classError}</p>}
              {loadingClasses ? <p role="status">Carregando turmas…</p> : classes.length ? <ul className="groups">
                {classes.map(item => <li key={item.id}><button type="button" aria-pressed={classId === item.id} onClick={() => chooseClass(item.id)}>
                  <span><b>{item.name}</b><small>{item.code}{item.semester ? ' · ' + item.semester : ''}</small></span><ChevronRight size={17} />
                </button></li>)}
              </ul> : !classError && <p className="muted">Nenhuma turma vinculada à sua conta.</p>}
            </section>
          </div>
        </> : <>
          <section className="card call" id="chamada">
            <CardTitle icon={<Keyboard size={21} />}>Registrar presença</CardTitle>
            <p className="muted">Digite os seis caracteres exibidos pelo professor.</p>
            {demo ? <form className="form-row" onSubmit={submit}>
              <label>Código de presença<input className="code" value={code} autoComplete="off" spellCheck={false} autoCapitalize="characters" maxLength={6} required pattern="[A-Z0-9]{6}" placeholder="Ex. 8F3A2C"
                onPaste={event => { event.preventDefault(); setNotice({ kind: 'error', text: 'Digite o código manualmente.' }) }}
                onDrop={event => event.preventDefault()}
                onChange={event => { setNotice(undefined); setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')) }} /></label>
              <button className="primary" disabled={busy || code.length !== 6}>Registrar presença <ArrowRight size={17} /></button>
            </form> : <p className="info">O registro será habilitado quando a API de presença estiver disponível.</p>}
            {notice && <p className={'notice ' + notice.kind} role={notice.kind === 'error' ? 'alert' : 'status'}>{notice.kind === 'success' && <CheckCircle2 size={18} />}{notice.text}</p>}
          </section>
          <div className="columns">
            <section className="card" id="turmas">
              <CardTitle icon={<BookOpen size={21} />}>{admin ? 'Todas as turmas' : 'Minhas turmas'}</CardTitle>
              {classes.length ? <ul className="groups">{classes.map(item => <li key={item.id}><div><b>{item.name}</b><small>{item.code} · {item.teacher}</small></div></li>)}</ul>
                : <p className="muted">A consulta às matrículas do aluno depende da API.</p>}
            </section>
            <section className="card">
              <CardTitle icon={<CalendarDays size={21} />}>Próxima aula</CardTitle>
              {next?.next ? <div className="next"><b>{next.name}</b><p>{next.next.day} · {next.next.time}</p><span>{next.next.room}</span></div>
                : <p className="muted">Nenhuma aula disponível.</p>}
            </section>
          </div>
          {demo && <StudentHistory calls={calls} classes={classes} studentId={demoStudent.id} />}
        </>}
      </main>
    </div>
    {teacher && projection && active && <dialog id="projection" aria-labelledby="projection-title" onCancel={() => setProjection(false)}>
      <button className="close" aria-label="Fechar projeção" onClick={() => setProjection(false)}><X /></button>
      <div className="projection-content"><span className="eyebrow">FREQUÊNCIA UFPE</span><h2 id="projection-title">{group?.name}</h2>
        <p>{codeActive ? 'Digite o código para registrar sua presença' : 'O código de presença expirou'}</p>
        {codeActive && <strong>{active.code}</strong>}
        <div className="countdown"><Clock3 size={24} /> {timeLeft(active.expiresAt, now)}</div>
      </div>
    </dialog>}
  </div>
}
