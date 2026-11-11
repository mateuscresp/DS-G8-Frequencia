import type { Call } from '../../../attendance'
import DesignIcon from '../../../components/ui/DesignIcon'
import { attendanceSummary } from '../summary'
export default function StudentSummary({ calls, studentId }: { calls: Call[]; studentId: string }) {
 const { total, absent, percentage } = attendanceSummary(calls, studentId)
 return <div className="student-summary">
  <section className="card summary-card"><div className="frequency-ring"><DesignIcon name="ring" /><strong>{percentage === null ? '—' : percentage + '%'}</strong></div><div><h2>Frequência Geral</h2><p>{absent} {absent === 1 ? 'falta' : 'faltas'} de {total} {total === 1 ? 'aula' : 'aulas'}</p><span className="summary-tag">{total ? 'Atualizada' : 'Sem registros'}</span></div></section>
  <section className="card summary-card summary-details"><DesignIcon name="info" /><div><h2>Aulas Encerradas</h2><p>Chamadas consideradas:</p><strong>{total} {total === 1 ? 'aula' : 'aulas'}</strong><small>Inclui ajustes do professor</small></div></section>
 </div>
}
