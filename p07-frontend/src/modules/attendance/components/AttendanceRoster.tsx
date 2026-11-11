import { Users } from 'lucide-react'
import type { Call, Class, Status, Student } from '../../../attendance'
import { demo } from '../../../integration'
import { dateTime } from '../../../utils/format'
type Props = { group?: Class; students: Student[]; displayed?: Call; classCalls: Call[]; busy: boolean; rosterError: string; loadingRoster: boolean; onHistory: (id: string) => void; correct: (id: string, status: Status) => void }
export default function AttendanceRoster({ group, students, displayed, classCalls, busy, rosterError, loadingRoster, onHistory, correct }: Props) {
 const present = students.filter(student => displayed?.records[student.id] === 'presente').length
 return <section className="card" aria-labelledby="roster">
              <h2 className="card-title" id="roster"><span className="icon-box"><Users size={21} /></span>Alunos da turma</h2>
              {group && <p className="muted">{group.name}{displayed ? ' · ' + present + ' de ' + students.length + ' presentes' : ''}</p>}
              {classCalls.length > 0 && <label className="history">Chamada<select aria-label="Chamada" value={displayed?.id ?? ''} onChange={event => onHistory(event.target.value)}>
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
}
