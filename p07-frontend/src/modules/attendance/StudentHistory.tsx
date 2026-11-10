import { useState } from 'react'
import { CalendarCheck } from 'lucide-react'
import type { Call, Class } from '../../attendance'

const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Recife' })

export default function StudentHistory({ calls, classes, studentId }: { calls: Call[]; classes: Class[]; studentId: string }) {
  const [selected, setSelected] = useState('')
  const visible = calls.filter(call => classes.some(group => group.id === call.classId) && (!selected || call.classId === selected))
  const finished = visible.filter(call => call.closedAt)
  const present = finished.filter(call => call.records[studentId] === 'presente').length
  const percentage = finished.length ? Math.round(present / finished.length * 100) + '%' : '—'

  return <section id="frequencia" className="card attendance-history">
    <h2 className="card-title"><span className="icon-box"><CalendarCheck size={21} /></span>Minha frequência</h2>
    <p className="muted">A frequência considera as chamadas encerradas.</p>
    <label className="history">Filtrar por turma<select value={selected} onChange={event => setSelected(event.target.value)}>
      <option value="">Todas as minhas turmas</option>
      {classes.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
    </select></label>
    <dl className="metrics">
      <div><dt>Frequência</dt><dd>{percentage}</dd></div>
      <div><dt>Presenças</dt><dd>{present}</dd></div>
      <div><dt>Faltas</dt><dd>{finished.length - present}</dd></div>
    </dl>
    {visible.length ? <div className="table-wrap"><table>
      <thead><tr><th scope="col">Turma / aula</th><th scope="col">Situação</th></tr></thead>
      <tbody>{visible.map(call => {
        const status = call.records[studentId] ?? (call.closedAt ? 'ausente' : 'pendente')
        return <tr key={call.id}><th scope="row">{classes.find(group => group.id === call.classId)?.name}<small>{dateTime.format(call.openedAt)} · {call.closedAt ? 'Encerrada' : 'Em andamento'}</small></th>
          <td><span className={'badge ' + status}>{status === 'presente' ? 'Presente' : status === 'ausente' ? 'Ausente' : 'Pendente'}</span></td></tr>
      })}</tbody>
    </table></div> : <p className="empty">As chamadas das suas turmas aparecerão aqui.</p>}
  </section>
}
