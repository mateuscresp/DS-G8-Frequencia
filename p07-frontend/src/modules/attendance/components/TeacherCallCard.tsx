import type { FormEvent } from 'react'
import { ArrowRight, Clock3, Maximize2, Presentation } from 'lucide-react'
import type { Call, Class } from '../../../attendance'
import { timeLeft } from '../../../attendance'
import CardTitle from '../../../components/ui/CardTitle'
import Feedback, { type Notice } from '../../../components/ui/Feedback'
type Props = { classes: Class[]; classId?: string; group?: Class; minutes: string; setMinutes: (value: string) => void; active?: Call; now: number; busy: boolean; notice?: Notice; start: (event: FormEvent) => void; chooseClass: (id: string) => void; close: () => Promise<void>; setProjection: (open: boolean) => void }
export default function TeacherCallCard({ classes, classId, group, minutes, setMinutes, active, now, busy, notice, start, chooseClass, close, setProjection }: Props) {
 const codeActive = !!active && active.expiresAt > now
 return <section className="card call" id="chamada">
            <CardTitle icon={<Presentation size={21} />}>Chamada por código</CardTitle>
            <p className="muted">Abra a chamada e mostre o código à turma durante a aula.</p>
            <>
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
            </>
            <Feedback notice={notice} />
          </section>
}
