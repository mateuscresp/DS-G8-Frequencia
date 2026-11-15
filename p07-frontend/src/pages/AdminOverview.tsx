import { Users } from 'lucide-react'
import type { Call, Class } from '../attendance'

export default function AdminOverview({ classes, calls }: { classes: Class[]; calls: Call[] }) {
  const students = new Set(classes.flatMap(group => group.students?.map(student => student.id) ?? []))
  const teachers = new Set(classes.map(group => group.teacher).filter(Boolean))
  return <section className="card attendance-history" id="visao-geral">
    <h2 className="card-title"><span className="icon-box"><Users size={21} /></span>Visão geral</h2>
    <dl className="metrics">
      <div><dt>Turmas</dt><dd>{classes.length}</dd></div>
      <div><dt>Alunos</dt><dd>{students.size}</dd></div>
      <div><dt>Professores</dt><dd>{teachers.size}</dd></div>
      <div><dt>Chamadas abertas</dt><dd>{calls.filter(call => !call.closedAt).length}</dd></div>
    </dl>
    <div className="table-wrap"><table>
      <thead><tr><th scope="col">Turma</th><th scope="col">Professor</th><th scope="col">Alunos</th></tr></thead>
      <tbody>{classes.map(group => <tr key={group.id}><th scope="row">{group.name}<small>{group.code} · {group.semester}</small></th><td>{group.teacher ?? 'A definir'}</td><td>{group.students?.length ?? 0}</td></tr>)}</tbody>
    </table></div>
  </section>
}
